import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Site configuration
const SITE_DOMAIN = 'solsite.fun';

/**
 * Purge Cloudflare edge cache for a subdomain
 */
async function purgeCloudflareCache(subdomain: string): Promise<boolean> {
  try {
    const siteUrl = `https://${subdomain}.${SITE_DOMAIN}/_purge`;
    console.log(`[Prerender] Purging Cloudflare cache: ${siteUrl}`);
    
    const response = await fetch(siteUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      console.warn(`[Prerender] Cache purge failed with status: ${response.status}`);
      return false;
    }
    
    const result = await response.json();
    console.log(`[Prerender] Cache purge result:`, result);
    return result.success === true;
  } catch (error) {
    console.error(`[Prerender] Cache purge error:`, error);
    return false;
  }
}

/**
 * Pre-render site edge function
 * 
 * This function is called when a site is published to:
 * 1. Generate the static HTML
 * 2. Store it in the pre-rendered-sites storage bucket
 * 3. Purge the Cloudflare edge cache
 * 4. This allows for faster serving and ensures fresh content
 * 
 * It can also be called to invalidate/clear cached content when a site is updated.
 */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, action = 'prerender' } = await req.json();
    
    if (!projectId) {
      return new Response(
        JSON.stringify({ error: 'Missing projectId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      console.error('[Prerender] Project not found:', projectId);
      return new Response(
        JSON.stringify({ error: 'Project not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Prerender] Processing ${action} for project: ${project.subdomain || projectId}`);

    if (action === 'invalidate') {
      let cachePurged = false;
      
      // Delete the pre-rendered file if it exists
      if (project.subdomain) {
        const { error: deleteError } = await supabase
          .storage
          .from('pre-rendered-sites')
          .remove([`${project.subdomain}.html`]);
        
        if (deleteError) {
          console.log('[Prerender] No cached file to delete or error:', deleteError.message);
        } else {
          console.log(`[Prerender] Invalidated storage cache for ${project.subdomain}`);
        }
        
        // Also purge Cloudflare edge cache
        cachePurged = await purgeCloudflareCache(project.subdomain);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Cache invalidated',
          subdomain: project.subdomain,
          cloudflarePurged: cachePurged,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Pre-render the site by calling render-site edge function internally
    const renderUrl = `${supabaseUrl}/functions/v1/render-site?projectId=${projectId}`;
    console.log('[Prerender] Pre-rendering site:', renderUrl);
    
    const renderResponse = await fetch(renderUrl, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!renderResponse.ok) {
      console.error('[Prerender] Failed to render site:', renderResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to render site' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await renderResponse.text();
    console.log(`[Prerender] Generated HTML for ${project.subdomain}, size: ${html.length} bytes`);

    let storedSuccessfully = false;
    let cachePurged = false;

    // Store in Supabase Storage
    if (project.subdomain) {
      const { error: uploadError } = await supabase
        .storage
        .from('pre-rendered-sites')
        .upload(
          `${project.subdomain}.html`,
          html,
          {
            contentType: 'text/html; charset=utf-8',
            upsert: true,
            cacheControl: '3600', // 1 hour cache
          }
        );

      if (uploadError) {
        console.error('[Prerender] Failed to upload pre-rendered HTML:', uploadError);
        // Don't fail the request - the site can still be served dynamically
      } else {
        console.log(`[Prerender] Pre-rendered HTML stored for ${project.subdomain}`);
        storedSuccessfully = true;
      }
      
      // Always purge Cloudflare cache after pre-rendering
      cachePurged = await purgeCloudflareCache(project.subdomain);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Site pre-rendered successfully',
        subdomain: project.subdomain,
        htmlSize: html.length,
        storedInBucket: storedSuccessfully,
        cloudflarePurged: cachePurged,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Prerender] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

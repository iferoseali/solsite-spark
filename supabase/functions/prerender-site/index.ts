import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Pre-render site edge function
 * 
 * This function is called when a site is published to:
 * 1. Generate the static HTML
 * 2. Store it in the pre-rendered-sites storage bucket
 * 3. This allows for faster serving and CDN caching
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
      console.error('Project not found:', projectId);
      return new Response(
        JSON.stringify({ error: 'Project not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'invalidate') {
      // Delete the pre-rendered file if it exists
      if (project.subdomain) {
        const { error: deleteError } = await supabase
          .storage
          .from('pre-rendered-sites')
          .remove([`${project.subdomain}.html`]);
        
        if (deleteError) {
          console.log('No cached file to delete or error:', deleteError.message);
        } else {
          console.log(`Invalidated cache for ${project.subdomain}`);
        }
      }
      
      return new Response(
        JSON.stringify({ success: true, message: 'Cache invalidated' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Pre-render the site by calling render-site edge function internally
    const renderUrl = `${supabaseUrl}/functions/v1/render-site?projectId=${projectId}`;
    console.log('Pre-rendering site:', renderUrl);
    
    const renderResponse = await fetch(renderUrl, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!renderResponse.ok) {
      console.error('Failed to render site:', renderResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to render site' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await renderResponse.text();
    console.log(`Generated HTML for ${project.subdomain}, size: ${html.length} bytes`);

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
        console.error('Failed to upload pre-rendered HTML:', uploadError);
        // Don't fail the request - the site can still be served dynamically
      } else {
        console.log(`Pre-rendered HTML stored for ${project.subdomain}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Site pre-rendered successfully',
        subdomain: project.subdomain,
        htmlSize: html.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in prerender-site:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

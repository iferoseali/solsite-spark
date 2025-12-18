import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateProjectRequest {
  action: 'create';
  user_id: string;
  wallet_address: string;
  template_id?: string;
  coin_name: string;
  ticker: string;
  tagline?: string;
  description?: string;
  twitter_url?: string;
  discord_url?: string;
  telegram_url?: string;
  dex_link?: string;
  show_roadmap?: boolean;
  show_faq?: boolean;
  subdomain: string;
  config?: Record<string, unknown>;
}

interface UpdateProjectRequest {
  action: 'update';
  project_id: string;
  user_id: string;
  wallet_address: string;
  updates: {
    coin_name?: string;
    ticker?: string;
    tagline?: string;
    description?: string;
    logo_url?: string;
    twitter_url?: string;
    discord_url?: string;
    telegram_url?: string;
    dex_link?: string;
    show_roadmap?: boolean;
    show_faq?: boolean;
    config?: Record<string, unknown>;
    status?: string;
  };
}

type ProjectRequest = CreateProjectRequest | UpdateProjectRequest;

// Validate and sanitize string inputs
function sanitizeString(str: string | undefined | null, maxLength: number = 500): string | null {
  if (!str) return null;
  // Remove any control characters and limit length
  return str.replace(/[\x00-\x1F\x7F]/g, '').slice(0, maxLength).trim() || null;
}

// Validate URL format
function validateUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed.slice(0, 500);
    }
  } catch {
    // Invalid URL
  }
  return null;
}

// Validate subdomain format
function validateSubdomain(subdomain: string): boolean {
  const pattern = /^[a-z0-9][a-z0-9-]{0,28}[a-z0-9]$/;
  return pattern.test(subdomain) || (subdomain.length >= 1 && subdomain.length <= 30 && /^[a-z0-9]+$/.test(subdomain));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ProjectRequest = await req.json();
    
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user exists with matching wallet
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, wallet_address')
      .eq('id', body.user_id)
      .eq('wallet_address', body.wallet_address)
      .single();

    if (userError || !user) {
      console.error('User verification failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - user not found or wallet mismatch' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (body.action === 'create') {
      // Validate required fields
      if (!body.coin_name || !body.ticker || !body.subdomain) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: coin_name, ticker, subdomain' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate subdomain
      if (!validateSubdomain(body.subdomain)) {
        return new Response(
          JSON.stringify({ error: 'Invalid subdomain format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if subdomain is taken
      const { data: existing } = await supabaseAdmin
        .from('projects')
        .select('id')
        .eq('subdomain', body.subdomain)
        .maybeSingle();

      let finalSubdomain = body.subdomain;
      if (existing) {
        // Add random suffix
        finalSubdomain = `${body.subdomain}-${Math.random().toString(36).substring(2, 6)}`;
      }

      // Create project
      const { data: project, error: createError } = await supabaseAdmin
        .from('projects')
        .insert({
          user_id: user.id,
          template_id: body.template_id || null,
          coin_name: sanitizeString(body.coin_name, 100) || 'Untitled',
          ticker: sanitizeString(body.ticker, 20) || '$COIN',
          tagline: sanitizeString(body.tagline, 200),
          description: sanitizeString(body.description, 2000),
          twitter_url: validateUrl(body.twitter_url),
          discord_url: validateUrl(body.discord_url),
          telegram_url: validateUrl(body.telegram_url),
          dex_link: validateUrl(body.dex_link),
          show_roadmap: body.show_roadmap !== false,
          show_faq: body.show_faq !== false,
          subdomain: finalSubdomain,
          status: 'published',
          generated_url: `https://${finalSubdomain}.solsite.xyz`,
          config: body.config || {}
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating project:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create project' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create domain record
      await supabaseAdmin
        .from('domains')
        .insert({
          project_id: project.id,
          subdomain: finalSubdomain,
          status: 'active'
        });

      console.log('Project created:', project.id);
      return new Response(
        JSON.stringify({ success: true, project }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (body.action === 'update') {
      if (!body.project_id) {
        return new Response(
          JSON.stringify({ error: 'Missing project_id' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify project belongs to user
      const { data: existingProject, error: projectError } = await supabaseAdmin
        .from('projects')
        .select('id, user_id')
        .eq('id', body.project_id)
        .single();

      if (projectError || !existingProject) {
        return new Response(
          JSON.stringify({ error: 'Project not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (existingProject.user_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized - not project owner' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Build sanitized update object
      const updates: Record<string, unknown> = {};
      
      if (body.updates.coin_name !== undefined) {
        updates.coin_name = sanitizeString(body.updates.coin_name, 100) || existingProject;
      }
      if (body.updates.ticker !== undefined) {
        updates.ticker = sanitizeString(body.updates.ticker, 20);
      }
      if (body.updates.tagline !== undefined) {
        updates.tagline = sanitizeString(body.updates.tagline, 200);
      }
      if (body.updates.description !== undefined) {
        updates.description = sanitizeString(body.updates.description, 2000);
      }
      if (body.updates.logo_url !== undefined) {
        updates.logo_url = validateUrl(body.updates.logo_url);
      }
      if (body.updates.twitter_url !== undefined) {
        updates.twitter_url = validateUrl(body.updates.twitter_url);
      }
      if (body.updates.discord_url !== undefined) {
        updates.discord_url = validateUrl(body.updates.discord_url);
      }
      if (body.updates.telegram_url !== undefined) {
        updates.telegram_url = validateUrl(body.updates.telegram_url);
      }
      if (body.updates.dex_link !== undefined) {
        updates.dex_link = validateUrl(body.updates.dex_link);
      }
      if (body.updates.show_roadmap !== undefined) {
        updates.show_roadmap = Boolean(body.updates.show_roadmap);
      }
      if (body.updates.show_faq !== undefined) {
        updates.show_faq = Boolean(body.updates.show_faq);
      }
      if (body.updates.config !== undefined) {
        updates.config = body.updates.config;
      }
      if (body.updates.status !== undefined) {
        const validStatuses = ['draft', 'published'];
        if (validStatuses.includes(body.updates.status)) {
          updates.status = body.updates.status;
        }
      }

      // Update project
      const { data: updatedProject, error: updateError } = await supabaseAdmin
        .from('projects')
        .update(updates)
        .eq('id', body.project_id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating project:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update project' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Project updated:', body.project_id);
      return new Response(
        JSON.stringify({ success: true, project: updatedProject }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Project management error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

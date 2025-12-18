import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TemplateRequest {
  action: 'create' | 'update' | 'delete';
  wallet_address: string;
  template?: {
    name: string;
    reference_url?: string | null;
    sections: unknown[];
    styles: Record<string, unknown>;
    animations: Record<string, unknown>;
    layout_category: string;
    personality: string;
    is_active?: boolean;
  };
  id?: string;
}

function sanitizeString(str: string | undefined | null, maxLength: number = 500): string | null {
  if (!str) return null;
  return str.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, maxLength);
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: TemplateRequest = await req.json();
    const { action, wallet_address, template, id } = body;

    console.log(`[manage-template] Action: ${action}, Wallet: ${wallet_address}, ID: ${id || 'new'}`);

    if (!wallet_address) {
      return new Response(
        JSON.stringify({ error: 'Wallet address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Check if user exists and get their user_id
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('wallet_address', wallet_address)
      .single();

    if (userError || !userData) {
      console.error('[manage-template] User not found:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role using the has_role function
    const { data: hasAdminRole, error: roleError } = await supabaseAdmin
      .rpc('has_role', { _user_id: userData.id, _role: 'admin' });

    if (roleError) {
      console.error('[manage-template] Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!hasAdminRole) {
      console.log(`[manage-template] User ${userData.id} is not an admin`);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[manage-template] Admin verified for user: ${userData.id}`);

    if (action === 'create') {
      if (!template || !template.name) {
        return new Response(
          JSON.stringify({ error: 'Template name is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const insertData = {
        name: sanitizeString(template.name, 100),
        reference_url: sanitizeString(template.reference_url, 500),
        sections: template.sections || [],
        styles: template.styles || {},
        animations: template.animations || {},
        layout_category: sanitizeString(template.layout_category, 50),
        personality: sanitizeString(template.personality, 50),
        is_active: template.is_active ?? true,
      };

      const { data, error } = await supabaseAdmin
        .from('template_blueprints')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('[manage-template] Insert error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create template', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[manage-template] Created template: ${data.id}`);
      return new Response(
        JSON.stringify({ success: true, data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'update') {
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Template ID is required for update' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const updateData: Record<string, unknown> = {};
      if (template?.name) updateData.name = sanitizeString(template.name, 100);
      if (template?.reference_url !== undefined) updateData.reference_url = sanitizeString(template.reference_url, 500);
      if (template?.sections) updateData.sections = template.sections;
      if (template?.styles) updateData.styles = template.styles;
      if (template?.animations) updateData.animations = template.animations;
      if (template?.layout_category) updateData.layout_category = sanitizeString(template.layout_category, 50);
      if (template?.personality) updateData.personality = sanitizeString(template.personality, 50);
      if (template?.is_active !== undefined) updateData.is_active = template.is_active;

      const { data, error } = await supabaseAdmin
        .from('template_blueprints')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[manage-template] Update error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to update template', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[manage-template] Updated template: ${id}`);
      return new Response(
        JSON.stringify({ success: true, data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'delete') {
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Template ID is required for delete' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error } = await supabaseAdmin
        .from('template_blueprints')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[manage-template] Delete error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to delete template', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[manage-template] Deleted template: ${id}`);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[manage-template] Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

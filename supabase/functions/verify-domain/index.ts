import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Domain verification edge function
 * 
 * Verifies domain ownership by checking DNS TXT records
 * and updates the domain status accordingly.
 */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing projectId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the domain entry for this project
    const { data: domain, error: domainError } = await supabase
      .from('domains')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (domainError || !domain) {
      console.error('Domain not found:', projectId);
      return new Response(
        JSON.stringify({ success: false, message: 'Domain not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!domain.custom_domain) {
      return new Response(
        JSON.stringify({ success: false, message: 'No custom domain configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update status to verifying
    await supabase
      .from('domains')
      .update({ status: 'verifying', updated_at: new Date().toISOString() })
      .eq('id', domain.id);

    const customDomain = domain.custom_domain;
    const expectedTxtValue = `solsite_verify_${projectId.slice(0, 12)}`;

    console.log(`Verifying domain: ${customDomain}`);
    console.log(`Expected TXT value: ${expectedTxtValue}`);

    // Check DNS TXT record using Google DNS-over-HTTPS
    let txtVerified = false;
    let aRecordVerified = false;

    try {
      // Check TXT record for _solsite subdomain
      const txtResponse = await fetch(
        `https://dns.google/resolve?name=_solsite.${customDomain}&type=TXT`,
        { headers: { 'Accept': 'application/dns-json' } }
      );
      const txtData = await txtResponse.json();
      console.log('TXT DNS response:', JSON.stringify(txtData));

      if (txtData.Answer) {
        for (const answer of txtData.Answer) {
          // TXT records come with quotes, so we need to handle that
          const txtValue = answer.data?.replace(/"/g, '') || '';
          console.log(`Found TXT value: ${txtValue}`);
          if (txtValue === expectedTxtValue) {
            txtVerified = true;
            break;
          }
        }
      }
    } catch (dnsError) {
      console.error('TXT DNS lookup error:', dnsError);
    }

    try {
      // Check A record
      const aResponse = await fetch(
        `https://dns.google/resolve?name=${customDomain}&type=A`,
        { headers: { 'Accept': 'application/dns-json' } }
      );
      const aData = await aResponse.json();
      console.log('A record DNS response:', JSON.stringify(aData));

      if (aData.Answer) {
        for (const answer of aData.Answer) {
          console.log(`Found A record: ${answer.data}`);
          if (answer.data === '185.158.133.1') {
            aRecordVerified = true;
            break;
          }
        }
      }
    } catch (dnsError) {
      console.error('A record DNS lookup error:', dnsError);
    }

    // Determine final status
    let newStatus = 'pending';
    let message = '';

    if (txtVerified && aRecordVerified) {
      newStatus = 'active';
      message = 'Domain verified and active! SSL certificate will be provisioned automatically.';
    } else if (txtVerified && !aRecordVerified) {
      newStatus = 'pending';
      message = 'TXT record verified, but A record not pointing to 185.158.133.1. Please update your A record.';
    } else if (!txtVerified && aRecordVerified) {
      newStatus = 'pending';
      message = 'A record verified, but TXT verification record not found. Please add the TXT record.';
    } else {
      newStatus = 'pending';
      message = 'DNS records not found. Please add both the A record and TXT verification record.';
    }

    // Update domain status
    const { error: updateError } = await supabase
      .from('domains')
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', domain.id);

    if (updateError) {
      console.error('Failed to update domain status:', updateError);
    }

    console.log(`Domain verification result: ${newStatus} - ${message}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        verified: newStatus === 'active',
        status: newStatus,
        message,
        checks: {
          txtVerified,
          aRecordVerified,
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-domain:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

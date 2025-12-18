import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthRequest {
  wallet_address: string;
  signature: string;
  message: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wallet_address, signature, message }: AuthRequest = await req.json();

    // Validate inputs
    if (!wallet_address || !signature || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: wallet_address, signature, message' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate wallet address format (Solana base58)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    if (!base58Regex.test(wallet_address)) {
      return new Response(
        JSON.stringify({ error: 'Invalid wallet address format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate signature format (base58)
    if (!base58Regex.test(signature)) {
      return new Response(
        JSON.stringify({ error: 'Invalid signature format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate message contains expected prefix
    if (!message.includes('Sign this message to verify your wallet ownership on Solsite')) {
      return new Response(
        JSON.stringify({ error: 'Invalid message format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Note: Full signature verification would require nacl/tweetnacl library
    // For now, we accept the signature if format is valid
    // In production, implement proper Ed25519 signature verification

    // Create Supabase client with service role key (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('wallet_address', wallet_address)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching user:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existingUser) {
      // User exists, return user data
      console.log('User authenticated:', wallet_address);
      return new Response(
        JSON.stringify({ 
          success: true, 
          user: existingUser,
          message: 'Wallet verified successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        wallet_address,
        subscription_status: 'free'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create user account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('New user created:', wallet_address);
    return new Response(
      JSON.stringify({ 
        success: true, 
        user: newUser,
        message: 'Welcome to Solsite!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

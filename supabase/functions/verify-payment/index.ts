import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const TREASURY_WALLET = Deno.env.get('TREASURY_WALLET') || '';

// Fixed SOL prices
const WEBSITE_PRICE_SOL = 0.05;
const DOMAIN_PRICE_SOL = 0.1;

interface VerifyPaymentRequest {
  paymentId: string;
  transactionSignature: string;
  currency: string;
  paymentType: 'website' | 'domain';
  expectedAmount: number;
}

async function getTransaction(signature: string) {
  const response = await fetch(SOLANA_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTransaction',
      params: [signature, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }]
    })
  });
  const data = await response.json();
  return data.result;
}

function verifySOLTransfer(transaction: any, expectedAmount: number, tolerance: number = 0.01): boolean {
  if (!transaction?.meta || !TREASURY_WALLET) return false;

  const accountKeys = transaction.transaction.message.accountKeys;
  const preBalances = transaction.meta.preBalances;
  const postBalances = transaction.meta.postBalances;

  // Find treasury wallet index
  let treasuryIndex = -1;
  for (let i = 0; i < accountKeys.length; i++) {
    const key = typeof accountKeys[i] === 'string' ? accountKeys[i] : accountKeys[i].pubkey;
    if (key === TREASURY_WALLET) {
      treasuryIndex = i;
      break;
    }
  }

  if (treasuryIndex === -1) {
    console.error('Treasury wallet not found in transaction');
    return false;
  }

  // Calculate SOL received
  const preBal = preBalances[treasuryIndex];
  const postBal = postBalances[treasuryIndex];
  const receivedLamports = postBal - preBal;
  const receivedSOL = receivedLamports / 1_000_000_000;

  console.log(`Expected: ${expectedAmount} SOL, Received: ${receivedSOL} SOL`);

  // Check with tolerance
  const minExpected = expectedAmount * (1 - tolerance);
  return receivedSOL >= minExpected;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: VerifyPaymentRequest = await req.json();
    const { paymentId, transactionSignature, paymentType, expectedAmount } = body;

    console.log('Verifying payment:', { paymentId, transactionSignature, paymentType, expectedAmount });

    // Check for duplicate transaction
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('transaction_signature', transactionSignature)
      .eq('status', 'confirmed')
      .single();

    if (existingPayment) {
      console.error('Duplicate transaction detected');
      return new Response(
        JSON.stringify({ success: false, error: 'Transaction already used' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Fetch transaction from Solana
    const transaction = await getTransaction(transactionSignature);

    if (!transaction) {
      console.error('Transaction not found');
      return new Response(
        JSON.stringify({ success: false, error: 'Transaction not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check transaction was successful
    if (transaction.meta?.err) {
      console.error('Transaction failed:', transaction.meta.err);
      return new Response(
        JSON.stringify({ success: false, error: 'Transaction failed on-chain' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check transaction is recent (within 10 minutes)
    const txTime = transaction.blockTime * 1000;
    const now = Date.now();
    if (now - txTime > 10 * 60 * 1000) {
      console.error('Transaction too old');
      return new Response(
        JSON.stringify({ success: false, error: 'Transaction too old' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verify the correct amount was sent
    const requiredAmount = paymentType === 'website' ? WEBSITE_PRICE_SOL : DOMAIN_PRICE_SOL;
    const isValid = verifySOLTransfer(transaction, requiredAmount);

    if (!isValid) {
      console.error('Invalid payment amount');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid payment amount' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'confirmed',
        transaction_signature: transactionSignature,
        verified_at: new Date().toISOString()
      })
      .eq('id', paymentId);

    if (updateError) {
      console.error('Error updating payment:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to update payment' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Payment verified successfully');

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Verification failed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

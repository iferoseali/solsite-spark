import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TREASURY_WALLET = Deno.env.get('TREASURY_WALLET_ADDRESS')!;
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Mainnet USDC
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

// Price tolerance (5% to account for price fluctuations)
const PRICE_TOLERANCE = 0.05;

// Payment amounts in USD
const WEBSITE_PRICE_USD = 60;
const DOMAIN_PRICE_USD = 10;

interface VerifyPaymentRequest {
  paymentId: string;
  transactionSignature: string;
  currency: 'SOL' | 'USDC';
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
      params: [
        signature,
        { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }
      ]
    })
  });
  
  const data = await response.json();
  return data.result;
}

async function getSolPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112');
    const data = await response.json();
    return parseFloat(data.data['So11111111111111111111111111111111111111112'].price);
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    throw new Error('Failed to fetch SOL price');
  }
}

function verifySOLTransfer(transaction: any, expectedAmount: number, tolerance: number): { valid: boolean; actualAmount: number } {
  try {
    const preBalances = transaction.meta.preBalances;
    const postBalances = transaction.meta.postBalances;
    const accountKeys = transaction.transaction.message.accountKeys;
    
    // Find treasury wallet in account keys
    const treasuryIndex = accountKeys.findIndex((key: any) => 
      (typeof key === 'string' ? key : key.pubkey) === TREASURY_WALLET
    );
    
    if (treasuryIndex === -1) {
      console.log('Treasury wallet not found in transaction');
      return { valid: false, actualAmount: 0 };
    }
    
    // Calculate amount received by treasury (in lamports)
    const amountReceived = (postBalances[treasuryIndex] - preBalances[treasuryIndex]) / 1e9;
    
    const minExpected = expectedAmount * (1 - tolerance);
    const maxExpected = expectedAmount * (1 + tolerance);
    
    console.log(`SOL transfer check: received ${amountReceived}, expected ${expectedAmount} (range: ${minExpected}-${maxExpected})`);
    
    return {
      valid: amountReceived >= minExpected && amountReceived <= maxExpected,
      actualAmount: amountReceived
    };
  } catch (error) {
    console.error('Error verifying SOL transfer:', error);
    return { valid: false, actualAmount: 0 };
  }
}

function verifyUSDCTransfer(transaction: any, expectedAmount: number, tolerance: number): { valid: boolean; actualAmount: number } {
  try {
    const instructions = transaction.transaction.message.instructions;
    
    // Look for SPL token transfer instruction
    for (const ix of instructions) {
      if (ix.program === 'spl-token' && ix.parsed?.type === 'transferChecked') {
        const info = ix.parsed.info;
        
        // Verify it's USDC
        if (info.mint !== USDC_MINT) continue;
        
        // Check destination (should be treasury's USDC ATA)
        const amount = parseFloat(info.tokenAmount.uiAmount);
        
        const minExpected = expectedAmount * (1 - tolerance);
        const maxExpected = expectedAmount * (1 + tolerance);
        
        console.log(`USDC transfer check: received ${amount}, expected ${expectedAmount} (range: ${minExpected}-${maxExpected})`);
        
        return {
          valid: amount >= minExpected && amount <= maxExpected,
          actualAmount: amount
        };
      }
    }
    
    // Also check inner instructions for USDC transfers
    const innerInstructions = transaction.meta?.innerInstructions || [];
    for (const inner of innerInstructions) {
      for (const ix of inner.instructions) {
        if (ix.program === 'spl-token' && ix.parsed?.type === 'transferChecked') {
          const info = ix.parsed.info;
          if (info.mint !== USDC_MINT) continue;
          
          const amount = parseFloat(info.tokenAmount.uiAmount);
          const minExpected = expectedAmount * (1 - tolerance);
          const maxExpected = expectedAmount * (1 + tolerance);
          
          return {
            valid: amount >= minExpected && amount <= maxExpected,
            actualAmount: amount
          };
        }
      }
    }
    
    console.log('No USDC transfer found in transaction');
    return { valid: false, actualAmount: 0 };
  } catch (error) {
    console.error('Error verifying USDC transfer:', error);
    return { valid: false, actualAmount: 0 };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: VerifyPaymentRequest = await req.json();
    const { paymentId, transactionSignature, currency, paymentType, expectedAmount } = body;

    console.log(`Verifying payment: ${paymentId}, signature: ${transactionSignature}, currency: ${currency}`);

    // 1. Check if transaction signature has been used before (prevent replay attacks)
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('transaction_signature', transactionSignature)
      .eq('status', 'confirmed')
      .single();

    if (existingPayment) {
      console.log('Transaction signature already used');
      return new Response(
        JSON.stringify({ success: false, error: 'Transaction already used' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // 2. Fetch transaction from Solana
    const transaction = await getTransaction(transactionSignature);
    
    if (!transaction) {
      console.log('Transaction not found on chain');
      return new Response(
        JSON.stringify({ success: false, error: 'Transaction not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // 3. Verify transaction was successful
    if (transaction.meta?.err) {
      console.log('Transaction failed:', transaction.meta.err);
      return new Response(
        JSON.stringify({ success: false, error: 'Transaction failed on chain' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // 4. Check transaction age (must be within last 10 minutes)
    const blockTime = transaction.blockTime;
    const now = Math.floor(Date.now() / 1000);
    if (now - blockTime > 600) { // 10 minutes
      console.log('Transaction too old:', now - blockTime, 'seconds');
      return new Response(
        JSON.stringify({ success: false, error: 'Transaction too old' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // 5. Verify payment amount based on currency
    let verificationResult: { valid: boolean; actualAmount: number };
    
    if (currency === 'SOL') {
      verificationResult = verifySOLTransfer(transaction, expectedAmount, PRICE_TOLERANCE);
    } else {
      const usdAmount = paymentType === 'website' ? WEBSITE_PRICE_USD : DOMAIN_PRICE_USD;
      verificationResult = verifyUSDCTransfer(transaction, usdAmount, PRICE_TOLERANCE);
    }

    if (!verificationResult.valid) {
      console.log('Payment amount verification failed');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid payment amount' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // 6. Update payment status to confirmed
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'confirmed',
        transaction_signature: transactionSignature,
        sol_amount: verificationResult.actualAmount,
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

    console.log(`Payment ${paymentId} verified successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        paymentId,
        actualAmount: verificationResult.actualAmount 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
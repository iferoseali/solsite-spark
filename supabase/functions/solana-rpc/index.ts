import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Reliable Solana RPC endpoints to try in order
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { method, params } = await req.json();
    
    console.log(`Solana RPC request: ${method}`, params);

    let lastError: Error | null = null;

    // Try each endpoint until one works
    for (const endpoint of RPC_ENDPOINTS) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method,
            params: params || [],
          }),
        });

        if (!response.ok) {
          console.log(`RPC endpoint ${endpoint} returned ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        if (data.error) {
          console.log(`RPC endpoint ${endpoint} returned error:`, data.error);
          lastError = new Error(data.error.message);
          continue;
        }

        console.log(`RPC success from ${endpoint}`);
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.log(`RPC endpoint ${endpoint} failed:`, err);
        lastError = err instanceof Error ? err : new Error(String(err));
        continue;
      }
    }

    throw lastError || new Error('All RPC endpoints failed');
  } catch (error) {
    console.error('Solana RPC proxy error:', error);
    const errorMessage = error instanceof Error ? error.message : 'RPC request failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

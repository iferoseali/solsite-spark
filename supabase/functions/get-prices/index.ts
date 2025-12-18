import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SOL_MINT = 'So11111111111111111111111111111111111111112';
const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch SOL price from Jupiter API
    const response = await fetch(`${JUPITER_PRICE_API}?ids=${SOL_MINT}`);
    const data = await response.json();
    
    const solPrice = parseFloat(data.data[SOL_MINT]?.price || '0');
    
    if (!solPrice || solPrice <= 0) {
      console.error('Invalid SOL price from Jupiter:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch SOL price' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    // Calculate prices
    const WEBSITE_PRICE_USD = 60;
    const DOMAIN_PRICE_USD = 10;

    const prices = {
      solPrice,
      websitePriceSOL: WEBSITE_PRICE_USD / solPrice,
      domainPriceSOL: DOMAIN_PRICE_USD / solPrice,
      websitePriceUSDC: WEBSITE_PRICE_USD,
      domainPriceUSDC: DOMAIN_PRICE_USD,
    };

    console.log('Prices fetched:', prices);

    return new Response(
      JSON.stringify(prices),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Price fetch error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch prices' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
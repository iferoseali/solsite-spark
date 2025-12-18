import { supabase } from '@/integrations/supabase/client';

export interface PriceData {
  solPrice: number;
  websitePriceSOL: number;
  domainPriceSOL: number;
  websitePriceUSDC: number;
  domainPriceUSDC: number;
}

export const WEBSITE_PRICE_USD = 60;
export const DOMAIN_PRICE_USD = 10;

export async function getPrices(): Promise<PriceData> {
  const { data, error } = await supabase.functions.invoke('get-prices');
  
  if (error) {
    console.error('Error fetching prices:', error);
    throw new Error('Failed to fetch prices');
  }
  
  if (data?.error) {
    console.error('Price API error:', data.error);
    throw new Error(data.error);
  }
  
  return data as PriceData;
}

export function formatSOL(amount: number): string {
  return amount.toFixed(4);
}

export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
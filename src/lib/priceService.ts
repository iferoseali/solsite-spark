// Jupiter Price API for real-time SOL price
const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

export interface PriceData {
  solPrice: number;
  websitePriceSOL: number;
  domainPriceSOL: number;
  websitePriceUSDC: number;
  domainPriceUSDC: number;
}

export const WEBSITE_PRICE_USD = 60;
export const DOMAIN_PRICE_USD = 10;

export async function fetchSOLPrice(): Promise<number> {
  try {
    const response = await fetch(`${JUPITER_PRICE_API}?ids=${SOL_MINT}`);
    const data = await response.json();
    return parseFloat(data.data[SOL_MINT].price);
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    throw new Error('Failed to fetch SOL price');
  }
}

export async function getPrices(): Promise<PriceData> {
  const solPrice = await fetchSOLPrice();
  
  return {
    solPrice,
    websitePriceSOL: WEBSITE_PRICE_USD / solPrice,
    domainPriceSOL: DOMAIN_PRICE_USD / solPrice,
    websitePriceUSDC: WEBSITE_PRICE_USD,
    domainPriceUSDC: DOMAIN_PRICE_USD,
  };
}

export function formatSOL(amount: number): string {
  return amount.toFixed(4);
}

export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
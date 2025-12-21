// Fixed SOL prices
export const WEBSITE_PRICE_SOL = 0.05;
export const DOMAIN_PRICE_SOL = 0.1;

export interface PriceData {
  websitePriceSOL: number;
  domainPriceSOL: number;
}

export function getPrices(): PriceData {
  return {
    websitePriceSOL: WEBSITE_PRICE_SOL,
    domainPriceSOL: DOMAIN_PRICE_SOL,
  };
}

export function formatSOL(amount: number): string {
  return amount.toFixed(2);
}

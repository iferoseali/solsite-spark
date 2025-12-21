// Centralized site configuration
export const SITE_CONFIG = {
  domain: 'solsite.fun',
  appUrl: 'https://app.solsite.fun',
  getSiteUrl: (subdomain: string) => `https://${subdomain}.solsite.fun`,
  getSubdomainDisplay: (subdomain: string) => `${subdomain}.solsite.fun`,
  builtWithUrl: 'https://www.solsite.fun',
} as const;

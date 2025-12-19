# Cloudflare Worker for Solsite

This directory contains the Cloudflare Worker that handles:
- Wildcard subdomain routing for `*.solsite.xyz`
- Custom domain proxying
- Edge caching for faster global performance
- DDoS protection via Cloudflare

## Setup Instructions

### 1. Prerequisites
- Cloudflare account with `solsite.xyz` domain added
- Node.js installed locally
- Wrangler CLI: `npm install -g wrangler`

### 2. Authenticate with Cloudflare
```bash
wrangler login
```

### 3. Configure Environment Variables
Create a `.dev.vars` file (do not commit this):
```
SUPABASE_URL=https://bzbxdiaqpbroxhcibtpm.supabase.co
```

Add production secrets:
```bash
wrangler secret put SUPABASE_URL
```

### 4. Deploy the Worker
```bash
cd cloudflare
wrangler deploy
```

### 5. Configure DNS Routes

In Cloudflare Dashboard → DNS:

1. **Wildcard A Record** (for subdomains):
   - Type: `A`
   - Name: `*`
   - Content: `185.158.133.1` (or use proxied)
   - Proxy status: Proxied (orange cloud)

2. **Root A Record**:
   - Type: `A`
   - Name: `@`
   - Content: `185.158.133.1`
   - Proxy status: Proxied

### 6. Configure Worker Routes

In Cloudflare Dashboard → Workers Routes:

1. Add route: `*.solsite.xyz/*` → `solsite-worker`
2. Add route: `solsite.xyz/*` → `solsite-worker` (for root domain)

### 7. Custom Domains

For users with custom domains pointing to `185.158.133.1`:
- They need to add their domain to Cloudflare (free plan works)
- Configure A record pointing to the Worker
- Or use CNAME flattening to `proxy.solsite.xyz`

## Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  User Request    │────▶│ Cloudflare Edge  │────▶│ Supabase Edge    │
│ coin.solsite.xyz │     │ (Worker + Cache) │     │ (render-site)    │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Edge Cache      │
                         │  (1 hour TTL)    │
                         └──────────────────┘
```

## Cache Behavior

- Published sites: Cached for 1 hour at edge
- Preview/Draft: No caching, always fresh
- Cache is automatically purged when sites are updated (via API)

## Monitoring

View logs in Cloudflare Dashboard → Workers → solsite-worker → Logs

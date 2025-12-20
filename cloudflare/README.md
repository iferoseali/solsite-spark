# Solsite Cloudflare Worker

Handles wildcard subdomain routing (`*.solsite.fun`) and custom domain proxying with edge caching.

## Quick Deploy

```bash
# 1. Navigate to cloudflare directory
cd cloudflare

# 2. Install dependencies
npm install

# 3. Login to Cloudflare
npx wrangler login

# 4. Set the Supabase URL secret
npx wrangler secret put SUPABASE_URL --env production
# Enter: https://bzbxdiaqpbroxhcibtpm.supabase.co

# 5. Deploy to production
npm run deploy
```

## Expected Output

After successful deployment, you should see:
```
Uploaded solsite-worker (X.XX sec)
Published solsite-worker (X.XX sec)
  *.solsite.fun/*
  solsite.fun/*
```

## DNS Configuration

Add these records in Cloudflare Dashboard → DNS:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | @ | 185.158.133.1 | ✅ Proxied |
| A | * | 185.158.133.1 | ✅ Proxied |
| A | www | 185.158.133.1 | ✅ Proxied |

## Architecture

```
User Request → Cloudflare Edge (Worker + Cache) → Supabase Edge Function (render-site)
     ↓
coin.solsite.fun → Check cache → If MISS, fetch from Supabase → Cache response (1hr TTL)
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development |
| `npm run deploy` | Deploy to production |
| `npm run deploy:staging` | Deploy to staging |
| `npm run tail` | View live logs |

## Troubleshooting

**"You need to register a workers.dev subdomain"**
- This warning can be ignored if routes are configured
- Check that `solsite.fun` is added to your Cloudflare account

**Routes not showing after deploy**
- Verify `zone_name = "solsite.fun"` in wrangler.toml
- Ensure the domain is active in Cloudflare

**Cache not working**
- Check `X-Cache-Status` header in response
- Use `wrangler tail` to see cache HIT/MISS logs

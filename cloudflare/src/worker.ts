/**
 * Solsite Cloudflare Worker
 * 
 * Handles:
 * - Wildcard subdomain routing (*.solsite.fun)
 * - Custom domain proxying
 * - Edge caching for performance
 * - Request logging and analytics
 */

export interface Env {
  SUPABASE_URL: string;
  CACHE_TTL: string;
}

// List of reserved subdomains that should not be proxied
const RESERVED_SUBDOMAINS = new Set([
  'www',
  'api',
  'app',
  'admin',
  'dashboard',
  'staging',
  'dev',
  'mail',
  'smtp',
  'ftp',
]);

// Main domain that serves the app
const APP_DOMAIN = 'solsite.fun';

// Lovable app origin for proxying (never shown to users)
const LOVABLE_ORIGIN = 'https://solsite.lovable.app';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();
    
    // Log request for debugging
    console.log(`[Solsite Worker] Request: ${request.method} ${url.toString()}`);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCors();
    }

    // Handle cache purge endpoint
    if (url.pathname === '/_purge') {
      return handleCachePurge(url, hostname);
    }

    try {
      // Determine if this is a subdomain request or custom domain
      const { subdomain, isCustomDomain } = parseHostname(hostname);

      // If it's the main app domain without subdomain, proxy to Lovable app
      if (!subdomain && !isCustomDomain) {
        // Root domain - proxy to Lovable app (URL stays as solsite.fun)
        const originResponse = await fetch(`${LOVABLE_ORIGIN}${url.pathname}${url.search}`, {
          method: request.method,
          headers: request.headers,
          body: request.body,
        });
        return new Response(originResponse.body, {
          status: originResponse.status,
          headers: originResponse.headers,
        });
      }

      // Check if subdomain is reserved - redirect to root domain
      if (subdomain && RESERVED_SUBDOMAINS.has(subdomain)) {
        // Redirect app-related subdomains to root domain
        if (subdomain === 'app' || subdomain === 'dashboard' || subdomain === 'admin' || subdomain === 'www') {
          return Response.redirect('https://solsite.fun', 302);
        }
        // For technical subdomains (mail, smtp, ftp, etc.), return 404
        return createErrorResponse(404);
      }

      // Try to serve from cache first
      const cacheKey = new Request(url.toString(), request);
      const cache = caches.default;
      
      let response = await cache.match(cacheKey);
      
      if (response) {
        console.log(`[Solsite Worker] Cache HIT for ${hostname}`);
        // Add cache status header
        response = new Response(response.body, response);
        response.headers.set('X-Cache-Status', 'HIT');
        response.headers.set('X-Served-By', 'cloudflare-edge');
        return response;
      }

      console.log(`[Solsite Worker] Cache MISS for ${hostname}, fetching from origin`);

      // Build the render-site URL
      const renderUrl = buildRenderUrl(env.SUPABASE_URL, subdomain, isCustomDomain ? hostname : null);
      
      // Fetch from Supabase edge function
      const originResponse = await fetch(renderUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Solsite-Cloudflare-Worker/1.0',
          'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '',
          'X-Original-Host': hostname,
        },
      });

      // Check if we got a valid response
      if (!originResponse.ok && originResponse.status !== 404) {
        console.error(`[Solsite Worker] Origin error: ${originResponse.status}`);
        return createErrorResponse(originResponse.status);
      }

      // Clone response for caching - FORCE text/html since render-site only returns HTML
      const cacheTtl = parseInt(env.CACHE_TTL || '3600');

      // Read the HTML content to ensure proper handling
      const htmlContent = await originResponse.text();

      response = new Response(htmlContent, {
        status: originResponse.status,
        headers: new Headers({
          'Content-Type': 'text/html; charset=utf-8',  // Always force text/html
          'Cache-Control': `public, max-age=${cacheTtl}, s-maxage=${cacheTtl}`,
          'X-Cache-Status': 'MISS',
          'X-Served-By': 'cloudflare-edge',
        }),
      });

      // Only cache successful responses
      if (originResponse.status === 200) {
        // Store in cache (don't await, let it happen in background)
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      }

      return response;

    } catch (error) {
      console.error(`[Solsite Worker] Error:`, error);
      return createErrorResponse(500);
    }
  },
};

/**
 * Parse hostname to extract subdomain or detect custom domain
 */
function parseHostname(hostname: string): { subdomain: string | null; isCustomDomain: boolean } {
  // Check if it's a solsite.fun subdomain
  if (hostname.endsWith(`.${APP_DOMAIN}`)) {
    const subdomain = hostname.slice(0, hostname.length - APP_DOMAIN.length - 1);
    return { subdomain: subdomain || null, isCustomDomain: false };
  }
  
  // Check if it's the root domain
  if (hostname === APP_DOMAIN || hostname === `www.${APP_DOMAIN}`) {
    return { subdomain: null, isCustomDomain: false };
  }
  
  // It's a custom domain
  return { subdomain: null, isCustomDomain: true };
}

/**
 * Build the Supabase render-site URL
 */
function buildRenderUrl(supabaseUrl: string, subdomain: string | null, customDomain: string | null): string {
  const baseUrl = `${supabaseUrl}/functions/v1/render-site`;
  const params = new URLSearchParams();
  
  if (subdomain) {
    params.set('subdomain', subdomain);
  } else if (customDomain) {
    params.set('customDomain', customDomain);
  }
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Handle CORS preflight requests
 */
function handleCors(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

/**
 * Handle cache purge requests
 * Usage: GET /_purge - purges cache for the current domain
 */
async function handleCachePurge(url: URL, hostname: string): Promise<Response> {
  try {
    const cache = caches.default;
    
    // Create cache key for the root of this site
    const siteUrl = new URL('/', `https://${hostname}`);
    const cacheKey = new Request(siteUrl.toString());
    
    const deleted = await cache.delete(cacheKey);
    
    console.log(`[Solsite Worker] Cache purge for ${hostname}: ${deleted ? 'SUCCESS' : 'NOT_FOUND'}`);
    
    return new Response(JSON.stringify({
      success: true,
      hostname,
      purged: deleted,
      message: deleted ? 'Cache cleared successfully' : 'No cached entry found',
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error(`[Solsite Worker] Cache purge error:`, error);
    return new Response(JSON.stringify({
      success: false,
      hostname,
      error: 'Failed to purge cache',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

/**
 * Create error response page
 */
function createErrorResponse(status: number): Response {
  const messages: Record<number, { title: string; message: string }> = {
    404: {
      title: 'Site Not Found',
      message: 'This meme coin website doesn\'t exist yet.',
    },
    500: {
      title: 'Server Error',
      message: 'Something went wrong. Please try again later.',
    },
    502: {
      title: 'Bad Gateway',
      message: 'Unable to reach the origin server.',
    },
    503: {
      title: 'Service Unavailable',
      message: 'The service is temporarily unavailable.',
    },
  };

  const { title, message } = messages[status] || messages[500];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${status} - ${title} | Solsite</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #0a0f1a 0%, #0d1520 100%);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
    }
    .container { max-width: 500px; }
    .status { 
      font-size: clamp(60px, 15vw, 120px); 
      font-weight: 800;
      background: linear-gradient(135deg, #00d4ff, #22c55e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin-bottom: 16px;
    }
    h1 { 
      font-size: clamp(20px, 5vw, 32px); 
      margin-bottom: 12px; 
      font-weight: 600;
    }
    p { 
      color: rgba(255,255,255,0.6); 
      margin-bottom: 32px;
      font-size: 16px;
    }
    a {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #00d4ff, #22c55e);
      color: #000;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    a:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 40px rgba(0, 212, 255, 0.3);
    }
    .powered {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.3);
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="status">${status}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://solsite.fun">Create Your Site</a>
  </div>
  <div class="powered">Powered by Solsite</div>
</body>
</html>`;

  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}

/**
 * Purges the Cloudflare edge cache for a given subdomain
 * This ensures users see updated content immediately after saving
 */
export async function purgeCache(subdomain: string): Promise<boolean> {
  try {
    const purgeUrl = `https://${subdomain}.solsite.fun/_purge`;
    const response = await fetch(purgeUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      console.warn(`[CachePurge] Failed to purge cache for ${subdomain}: ${response.status}`);
      return false;
    }
    
    const result = await response.json();
    console.log(`[CachePurge] Cache purged for ${subdomain}:`, result);
    return result.success === true;
  } catch (error) {
    console.error(`[CachePurge] Error purging cache for ${subdomain}:`, error);
    return false;
  }
}

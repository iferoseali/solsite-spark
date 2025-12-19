// HTML sanitization utilities to prevent XSS attacks

/**
 * Encode HTML special characters to prevent XSS
 */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validate and sanitize URLs - only allow http/https protocols
 */
export function sanitizeUrl(url: string | null | undefined, allowDataUrl = false): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Allow data URLs for images (safe for preview)
  if (allowDataUrl && trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  const tryParse = (value: string) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? value : '';
    } catch {
      return '';
    }
  };

  // Accept absolute http(s)
  const direct = tryParse(trimmed);
  if (direct) return direct;

  // If user entered a domain/path without protocol, assume https
  if (!trimmed.includes('://') && !trimmed.startsWith('/') && /\./.test(trimmed)) {
    const withHttps = tryParse(`https://${trimmed}`);
    if (withHttps) return withHttps;
  }

  // Allow relative URLs starting with /
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // Block javascript:, vbscript:, etc.
  return '';
}

/**
 * Escape for use in HTML attributes (more strict)
 */
export function escapeAttr(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#x60;')
    .replace(/=/g, '&#x3D;');
}

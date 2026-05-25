/**
 * HTML escaping and URL validation utilities.
 *
 * Single hardening surface for any string that ends up in HTML output. Used by
 * PortableText serializers, the LiveRaceBanner, share URL builders, and any
 * other place where editor- or query-string-controlled text crosses into the
 * DOM. Keep these strict — they are the last line of defence against XSS when
 * a downstream component forgets to escape.
 */

/**
 * Escape HTML special characters in text/attribute values.
 * Prevents XSS by encoding &, <, >, ", and '. Always pass user-controlled
 * strings through this before interpolating into raw HTML.
 */
export function escapeHtml(str: string | null | undefined): string {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strip C0 control chars (U+0000–U+001F) and DEL (U+007F).
 *
 * Some browsers historically tolerated control chars inside URL protocols
 * (e.g. `java\tscript:`), so we drop them before scheme comparison rather
 * than letting them slip through a regex match. Done via charCode walk so
 * the source file contains no literal control bytes.
 */
function stripControlChars(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 0x20 && c !== 0x7f) out += s[i];
  }
  return out;
}

/**
 * Validate and normalise a URL to allow only safe protocols.
 *
 * Allow-list (deny by default):
 *   - relative URLs (start with `/`, `?`, `#`, `.`)
 *   - `http://`, `https://`
 *   - `mailto:`, `tel:`
 *
 * Anything else — including `javascript:`, `data:`, `vbscript:`, `file:`, and
 * protocol-relative `//example.com` (which inherits the page protocol and can
 * be used in a downgrade attack) — falls back to `#`.
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (url == null) return '#';

  const stripped = stripControlChars(String(url)).trim();
  if (!stripped) return '#';

  // Protocol-relative URLs inherit the page protocol and can slip past naive
  // checks — reject them. Editors should write a full http(s):// URL.
  if (stripped.startsWith('//')) return '#';

  // Relative URLs (same-origin) are always safe.
  if (
    stripped.startsWith('/') ||
    stripped.startsWith('#') ||
    stripped.startsWith('?') ||
    stripped.startsWith('.')
  ) {
    return stripped;
  }

  // Compare only the scheme portion (before the first ':'), lowercased.
  const colonIdx = stripped.indexOf(':');
  if (colonIdx === -1) {
    // No protocol — treat as a relative path the editor forgot to lead with /
    return stripped;
  }
  const scheme = stripped.slice(0, colonIdx).toLowerCase();

  if (scheme === 'http' || scheme === 'https' || scheme === 'mailto' || scheme === 'tel') {
    return stripped;
  }

  // Anything else: javascript:, data:, vbscript:, file:, blob:, etc. — drop.
  return '#';
}

/**
 * Extract a YouTube video ID from a URL, returning null when the URL is not a
 * recognised YouTube URL. Used by PortableText embed serializer; the strict
 * pattern means a hostile URL like `https://evil.com/?youtube.com/watch?v=ID`
 * can never reach the `<iframe src>` slot.
 */
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const v = u.searchParams.get('v');
      if (v && /^[\w-]{6,15}$/.test(v)) return v;
      const embedMatch = u.pathname.match(/^\/(?:embed|shorts)\/([\w-]{6,15})/);
      if (embedMatch) return embedMatch[1];
    }
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '');
      if (/^[\w-]{6,15}$/.test(id)) return id;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Extract a Vimeo video ID. Same strict-URL-parse strategy as `youtubeId`.
 */
export function vimeoId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null;
    const match = u.pathname.match(/\/(\d{6,12})/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

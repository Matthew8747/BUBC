/**
 * HTML escaping and URL validation utilities.
 */

/**
 * Escape HTML special characters in text/attribute values.
 * Prevents XSS by encoding &, <, >, ", and '.
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validate and normalize a URL to allow only safe protocols.
 * Allows: http://, https://, mailto:, tel:, or relative URLs.
 * Falls back to '#' if protocol is unsafe (e.g. javascript:).
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '#';

  const trimmed = String(url).trim();

  // Allow relative URLs
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return trimmed;
  }

  // Allow safe absolute URLs
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }

  // Default to empty hash for any other protocol (including javascript:)
  return '#';
}

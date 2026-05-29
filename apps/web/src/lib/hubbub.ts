/**
 * Hubbub live totals — build-time read of a Hubbub project page.
 *
 * Hubbub has no public API for campaign totals (their only documented API is an
 * enterprise Blackbaud / Raiser's Edge integration). However, the figure is
 * server-rendered into every project page in a stable, parseable form:
 *
 *   <strong><var>£5,442</var></strong> has been raised from <strong><var>51</var></strong> donors.
 *
 * So at build time we fetch the page and read the two numbers. Anything
 * unexpected — network error, timeout, markup change, non-Hubbub URL — returns
 * null, and callers fall back to the manually-entered Sanity figures. The
 * thermometer must never render a blank or obviously-wrong total because of a
 * scrape failure.
 *
 * Because this only runs at build, totals refresh when the site rebuilds. Pair
 * with a scheduled rebuild (see .github/workflows/refresh-totals.yml) to keep
 * them current without a manual deploy.
 */

export interface HubbubTotals {
  raised: number;
  donors: number;
}

// "<var>£5,442</var></strong> has been raised from <strong><var>51</var>"
// We anchor on the distinctive "has been raised from" copy and grab the two
// numbers either side of it. The £ sign / entity is ignored — we only need digits.
const TOTALS_RE =
  /([\d,]+)\s*<\/var>\s*<\/strong>\s*has been raised from\s*<strong>\s*<var>\s*([\d,]+)/i;

const FETCH_TIMEOUT_MS = 8000;

// Memoise per URL for the lifetime of the build so each Hubbub page is hit once
// even though several pages render the same campaign.
const cache = new Map<string, Promise<HubbubTotals | null>>();

function isHubbubUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    return new URL(url).hostname.endsWith('hubbub.net');
  } catch {
    return false;
  }
}

/**
 * Pure parser — pull { raised, donors } out of a Hubbub project page's HTML.
 * Exported so it can be unit-tested without a network round-trip. Returns null
 * if the expected markup isn't present.
 */
export function parseHubbubTotals(html: string): HubbubTotals | null {
  const m = html.match(TOTALS_RE);
  if (!m) return null;
  const raised = Number(m[1].replace(/,/g, ''));
  const donors = Number(m[2].replace(/,/g, ''));
  if (!Number.isFinite(raised) || !Number.isFinite(donors)) return null;
  return { raised, donors };
}

async function scrape(url: string): Promise<HubbubTotals | null> {
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'bubc.co.uk site build (campaign totals)' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return parseHubbubTotals(await res.text());
  } catch {
    return null;
  }
}

/** Live { raised, donors } for a Hubbub project page, or null on any failure. */
export function fetchHubbubTotals(url: string | undefined): Promise<HubbubTotals | null> {
  if (!isHubbubUrl(url)) return Promise.resolve(null);
  let pending = cache.get(url);
  if (!pending) {
    pending = scrape(url);
    cache.set(url, pending);
  }
  return pending;
}

/**
 * Return a copy of a campaign with raised/donor figures replaced by the live
 * Hubbub total when `hubbubUrl` is set and reachable; otherwise the campaign is
 * returned unchanged (manual Sanity figures stand).
 */
export async function withLiveTotals<
  T extends { hubbubUrl?: string; raisedAmount: number; donorCount?: number },
>(campaign: T): Promise<T> {
  const live = await fetchHubbubTotals(campaign?.hubbubUrl);
  if (!live) return campaign;
  return { ...campaign, raisedAmount: live.raised, donorCount: live.donors };
}

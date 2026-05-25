/**
 * OG image URL helper — wraps the build-time generator at `/og/<slug>.png`.
 *
 * Pages pass the result into the SEO `image` prop. Falls back to the static
 * default when the slug isn't in the catalog (rare — every page in the
 * catalog is enumerated in `pages/og/[slug].png.ts`).
 */

/** Static page-slug aliases — keep in sync with STATIC_CARDS in pages/og/[slug].png.ts. */
const KNOWN = new Set([
  'default',
  'home',
  'squads',
  'trial',
  'coaching',
  'boathouse',
  'fleet',
  'news',
  'alumni',
  'meles',
  'alumni-events',
  'about',
  'history',
  'henley-honours',
  'olympians',
  'committee',
  'welfare',
  'contact',
  'support',
  'donate',
  'buy-a-boat',
  'sponsor',
  'campaigns',
]);

export type OgKind =
  | { kind: 'page'; slug: string }
  | { kind: 'news'; slug: string }
  | { kind: 'squad'; slug: string }
  | { kind: 'olympian'; slug: string }
  | { kind: 'alumni'; slug: string }
  | { kind: 'boat'; slug: string }
  | { kind: 'campaign'; slug: string };

export function ogImage(kind: OgKind): string {
  switch (kind.kind) {
    case 'page':
      return KNOWN.has(kind.slug) ? `/og/${kind.slug}.png` : '/og/default.png';
    case 'news':
      return `/og/news-${kind.slug}.png`;
    case 'squad':
      return `/og/squad-${kind.slug}.png`;
    case 'olympian':
      return `/og/olympian-${kind.slug}.png`;
    case 'alumni':
      return `/og/alumni-${kind.slug}.png`;
    case 'boat':
      return `/og/boat-${kind.slug}.png`;
    case 'campaign':
      return `/og/campaign-${kind.slug}.png`;
  }
}

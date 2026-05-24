/**
 * OG image endpoint — `/og/<slug>.png` at build time only.
 *
 * Pre-renders one branded PNG per page that uses a custom OG card. Pages
 * reference these via the SEO `image` prop (handled by `getOgImageUrl()` in
 * `lib/og/url.ts`). Pages that opt out, or render content where a hero photo
 * is the better social card (eg. news posts, boats with photography), keep
 * using their existing image instead.
 *
 * The endpoint is build-time only — `output: 'static'` means Astro evaluates
 * `getStaticPaths` once and writes each PNG to `dist/og/`.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOgPng, type OgCard } from '../../lib/og/render';
import { safeFetch } from '../../lib/sanity';
import {
  allNewsSlugsQuery,
  allSquadSlugsQuery,
  allOlympianSlugsQuery,
  alumniProfilesQuery,
  allBoatSlugsQuery,
  allCampaignSlugsQuery,
} from '../../lib/queries';
import type { AlumniProfileCard } from '../../lib/types';

// We drop the explicit OgPath interface and rely on `satisfies GetStaticPaths`
// to validate the shape — Astro's GetStaticPaths expects props to allow an
// index signature, and OgCard's strict shape doesn't conform to that. The
// runtime values are still OgCard; we cast in the GET handler.
type OgPath = { params: { slug: string }; props: Record<string, unknown> };

/** Static OG cards keyed by slug — every fixed page that benefits from a card. */
const STATIC_CARDS: Record<string, OgCard> = {
  default: {
    eyebrow: 'University of Bath Boat Club',
    title: 'BUBC.',
    subtitle: 'Performance student rowing from the River Avon. Founded 1965.',
  },
  home: {
    eyebrow: 'University of Bath Boat Club',
    title: 'Bath rows fast.',
    subtitle: 'Senior squads, novice programme, alumni network. Trial with us this term.',
  },
  squads: {
    eyebrow: 'Squads',
    title: 'Find your level.',
    subtitle: 'Senior men, senior women, novice, trial. Where every BUBC rower starts.',
  },
  trial: {
    eyebrow: 'Squads',
    title: 'Trial with BUBC.',
    subtitle: 'No rowing experience required. Term-time trials open to all Bath students.',
  },
  coaching: {
    eyebrow: 'Coaching',
    title: 'The coaching team.',
    subtitle: 'Senior coaches, novice leadership, and visiting expertise across the season.',
  },
  boathouse: {
    eyebrow: 'Boathouse',
    title: 'On the water at Saltford.',
    subtitle: 'Facilities, fleet, and how to find us on the River Avon.',
  },
  fleet: {
    eyebrow: 'Boathouse',
    title: 'The fleet.',
    subtitle: 'Every BUBC racing shell — name, class, donor, and the crews who race them.',
  },
  news: {
    eyebrow: 'News',
    title: 'Race reports, alumni news, club updates.',
    subtitle: 'Every announcement from BUBC, with RSS for the diehards.',
  },
  alumni: {
    eyebrow: 'Alumni',
    title: 'Where they are now.',
    subtitle: 'Olympians, internationals, Boat Race blues. The wider BUBC family.',
  },
  meles: {
    eyebrow: 'Alumni',
    title: 'Meles Boat Club.',
    subtitle: 'BUBC alumni rowing — Henley Masters, head racing, social rowing.',
  },
  'alumni-events': {
    eyebrow: 'Alumni',
    title: 'Come back to the river.',
    subtitle: 'Annual dinner, Henley hospitality, reunions, boathouse open days.',
  },
  about: {
    eyebrow: 'About',
    title: 'The story of BUBC.',
    subtitle: 'A boat club founded in 1965 — and the people who built it.',
  },
  history: {
    eyebrow: 'About',
    title: 'A potted history.',
    subtitle: 'Sixty years of rowing at Bath, from the foundation to Henley.',
  },
  'henley-honours': {
    eyebrow: 'About',
    title: 'Henley honours.',
    subtitle: 'Every BUBC crew that has raced at Henley Royal and Henley Women’s.',
  },
  olympians: {
    eyebrow: 'About',
    title: 'BUBC Olympians.',
    subtitle: 'Alumni who carried Bath into Olympic boats.',
  },
  committee: {
    eyebrow: 'Club',
    title: 'The committee.',
    subtitle: 'Student officers running BUBC for this academic year.',
  },
  welfare: {
    eyebrow: 'Club',
    title: 'Welfare & safeguarding.',
    subtitle: 'Named officer, policies, and reporting routes.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Get in touch.',
    subtitle: 'Captains, treasurer, welfare, alumni — one inbox each.',
  },
  support: {
    eyebrow: 'Support',
    title: 'Back a club that races.',
    subtitle: 'Donate, buy a boat, sponsor a season, or fund a campaign.',
  },
  donate: {
    eyebrow: 'Support',
    title: 'Keep Bath rowing fast.',
    subtitle: 'One-off donations via Hubbub, with Gift Aid where eligible.',
  },
  'buy-a-boat': {
    eyebrow: 'Support',
    title: 'Put your name on the fleet.',
    subtitle: 'Fund a new shell — single, pair, four, or eight.',
  },
  sponsor: {
    eyebrow: 'Support',
    title: 'Sponsor a club that races.',
    subtitle: 'Headline, gold, silver and supporter tiers. Built around what we can offer.',
  },
  campaigns: {
    eyebrow: 'Support',
    title: 'What we’re raising for.',
    subtitle: 'Live progress, transparent goals. Boats, training camps, alumni initiatives.',
  },
};

export const getStaticPaths = (async () => {
  // Helper — coerces the strict OgCard shape into the index-signature shape
  // that GetStaticPaths' Props requires.
  const toOgPath = (slug: string, card: OgCard): OgPath => ({
    params: { slug },
    props: card as unknown as Record<string, unknown>,
  });

  const paths: OgPath[] = Object.entries(STATIC_CARDS).map(([slug, card]) => toOgPath(slug, card));

  // Dynamic per-content cards — one PNG per news post, squad, olympian,
  // alumni profile, boat, and campaign. Falls back silently if Sanity is
  // unreachable; the static catalog above still gets built.
  const [news, squads, olympians, alumni, boats, campaigns] = await Promise.all([
    safeFetch<{ slug: string }[]>(allNewsSlugsQuery),
    safeFetch<{ slug: string }[]>(allSquadSlugsQuery),
    safeFetch<{ slug: string }[]>(allOlympianSlugsQuery),
    safeFetch<AlumniProfileCard[]>(alumniProfilesQuery),
    safeFetch<{ slug: string }[]>(allBoatSlugsQuery),
    safeFetch<{ slug: string }[]>(allCampaignSlugsQuery),
  ]);

  const titleCase = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  news
    ?.filter((p) => p.slug)
    .forEach((p) =>
      paths.push(toOgPath(`news-${p.slug}`, { eyebrow: 'News', title: titleCase(p.slug) })),
    );
  squads
    ?.filter((s) => s.slug)
    .forEach((s) =>
      paths.push(toOgPath(`squad-${s.slug}`, { eyebrow: 'Squad', title: titleCase(s.slug) })),
    );
  olympians
    ?.filter((o) => o.slug)
    .forEach((o) =>
      paths.push(toOgPath(`olympian-${o.slug}`, { eyebrow: 'Olympian', title: titleCase(o.slug) })),
    );
  alumni
    ?.filter((p) => p.slug && p.category && p.category !== 'olympian')
    .forEach((p) =>
      paths.push(
        toOgPath(`alumni-${p.slug}`, {
          eyebrow:
            p.category === 'international'
              ? 'GB / International'
              : p.category === 'boatRace'
                ? 'Boat Race'
                : 'Alumni',
          title: p.name,
          subtitle: p.currentRole ?? p.careerHighlight,
        }),
      ),
    );
  boats
    ?.filter((b) => b.slug)
    .forEach((b) =>
      paths.push(toOgPath(`boat-${b.slug}`, { eyebrow: 'Fleet', title: titleCase(b.slug) })),
    );
  campaigns
    ?.filter((c) => c.slug)
    .forEach((c) =>
      paths.push(toOgPath(`campaign-${c.slug}`, { eyebrow: 'Campaign', title: titleCase(c.slug) })),
    );

  return paths;
}) satisfies GetStaticPaths;

// Node's Response constructor accepts Uint8Array at runtime, but the DOM
// lib's `BodyInit` type union doesn't list it. We wrap as a Blob which is in
// the union and is a thin runtime wrapper over the bytes.
function pngResponse(bytes: Uint8Array, cacheable: boolean): Response {
  const blob = new Blob([bytes as unknown as ArrayBuffer], { type: 'image/png' });
  return new Response(blob, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      ...(cacheable ? { 'Cache-Control': 'public, max-age=31536000, immutable' } : {}),
    },
  });
}

export const GET: APIRoute = async ({ props }) => {
  const card = props as OgCard;
  try {
    const png = await renderOgPng(card);
    return pngResponse(png, true);
  } catch (err) {
    // If satori fails for any reason, emit a transparent 1×1 so the build
    // still completes; the page's <meta og:image> will 200 but the image
    // will be invisible. Better than failing the whole deploy.
    console.warn('[og] render failed for', card.title, '-', err);
    const transparent = Uint8Array.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44,
      0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f,
      0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00,
      0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);
    return pngResponse(transparent, false);
  }
};

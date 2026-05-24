/**
 * OG image renderer — satori + resvg-js, build-time only.
 *
 * Generates 1200×630 branded PNGs for social-share cards. Used by the
 * `/og/[slug].png.ts` endpoint which calls `renderOgPng()` per page at
 * build time and writes the result into the static output directory.
 *
 * Fonts: Inter (regular + bold) and Fraunces (semibold) are bundled into
 * the repo at `src/lib/og/fonts/` so the build is fully self-contained —
 * no network call required during deploy.
 *
 * If something goes wrong inside satori (eg. text overflow), we throw and
 * the endpoint falls back to the static `/og/default.png`.
 */
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import satori, { type SatoriOptions } from 'satori';
import { Resvg } from '@resvg/resvg-js';

// Satori's first arg is typed as React's `ReactNode` for editor ergonomics,
// but its runtime API accepts any object with `type` + `props` (a JSX vnode-
// like). We build the tree by hand to avoid pulling React in for this one
// build-time helper, then cast at the call site.
type SatoriElement = Parameters<typeof satori>[0];

// Resolve the font directory off the package root rather than off
// `import.meta.url` — Astro bundles this file into `dist/.prerender/chunks/`
// which is nowhere near the source `fonts/` folder. process.cwd() during
// Astro build is the package directory (apps/web/), so the source path is
// stable and the TTFs travel with the source repo rather than the bundle.
const fontDir = resolve(process.cwd(), 'src', 'lib', 'og', 'fonts');

let fontCache: Awaited<ReturnType<typeof loadFonts>> | null = null;
async function loadFonts() {
  const [interRegular, interBold, frauncesSemibold] = await Promise.all([
    readFile(join(fontDir, 'inter-regular.ttf')),
    readFile(join(fontDir, 'inter-bold.ttf')),
    readFile(join(fontDir, 'fraunces-semibold.ttf')),
  ]);
  return [
    { name: 'Inter', data: interRegular, weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', data: interBold, weight: 700 as const, style: 'normal' as const },
    { name: 'Fraunces', data: frauncesSemibold, weight: 600 as const, style: 'normal' as const },
  ];
}

export interface OgCard {
  /** Top kicker line — eg. "News", "Squad", "Alumni". */
  eyebrow?: string;
  /** Primary headline. Truncated visually if it overflows. */
  title: string;
  /** Optional secondary line beneath the title. */
  subtitle?: string;
  /** Optional footer-right meta — eg. "BUBC.co.uk". Defaults to "bubc.co.uk". */
  footer?: string;
}

// Brand tokens — kept in sync with global.css. Hex literals because satori
// doesn't read CSS custom properties.
const COLOURS = {
  ink: '#0A1B2E',
  navy: '#0E2A47',
  paper: '#F5F1EA',
  bone: '#ECE5D8',
  gold: '#B8924A',
} as const;

/**
 * Build the satori vnode tree for one OG card. Returns the satori-friendly
 * element object — same shape React vnodes use, but no React dep.
 */
function buildElement(card: OgCard) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: `linear-gradient(135deg, ${COLOURS.navy} 0%, ${COLOURS.ink} 100%)`,
        color: COLOURS.paper,
        padding: '72px 80px',
        fontFamily: 'Inter',
        position: 'relative',
      },
      children: [
        // Top: gold hairline + eyebrow text
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: '20px' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '60px',
                    height: '4px',
                    background: COLOURS.gold,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '22px',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    color: COLOURS.gold,
                    fontWeight: 600,
                  },
                  children: card.eyebrow ?? 'University of Bath Boat Club',
                },
              },
            ],
          },
        },
        // Middle: headline + optional subtitle
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '24px' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Fraunces',
                    fontWeight: 600,
                    fontSize: card.title.length > 60 ? '64px' : '84px',
                    lineHeight: 1.05,
                    letterSpacing: '-0.02em',
                    color: COLOURS.paper,
                    // satori needs an explicit max-width when text wraps.
                    maxWidth: '1040px',
                  },
                  children: card.title,
                },
              },
              card.subtitle
                ? {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '28px',
                        color: 'rgba(245, 241, 234, 0.78)',
                        maxWidth: '900px',
                        lineHeight: 1.35,
                      },
                      children: card.subtitle,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        // Footer: brand mark + url
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '32px',
              borderTop: `1px solid rgba(245, 241, 234, 0.18)`,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Fraunces',
                    fontWeight: 600,
                    fontSize: '32px',
                    color: COLOURS.paper,
                    letterSpacing: '-0.01em',
                  },
                  children: 'BUBC',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '22px',
                    color: 'rgba(245, 241, 234, 0.7)',
                    letterSpacing: '0.5px',
                  },
                  children: card.footer ?? 'bubc.co.uk',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

/**
 * Render a card to PNG (Uint8Array). Throws if satori/resvg fail; the caller
 * is expected to fall back to the static default.
 */
export async function renderOgPng(card: OgCard): Promise<Uint8Array> {
  if (!fontCache) fontCache = await loadFonts();

  const svg = await satori(buildElement(card) as unknown as SatoriElement, {
    width: 1200,
    height: 630,
    fonts: fontCache,
  } satisfies SatoriOptions);

  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    background: COLOURS.navy,
  }).render();

  return png.asPng();
}

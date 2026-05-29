/**
 * SEO helpers — keep meta-tag logic out of layout components.
 */

export interface SeoInput {
  title?: string;
  description?: string;
  image?: string;
  /** Override og:type. Defaults to 'website'. News posts pass 'article'. */
  type?: 'website' | 'article';
  /** Optional alt text for the OG image. */
  imageAlt?: string;
  noIndex?: boolean;
  canonical?: string;
}

export const SITE = {
  name: 'University of Bath Boat Club',
  shortName: 'BUBC',
  url: 'https://bubc.co.uk',
  defaultDescription:
    'University of Bath Boat Club. Performance student rowing from the River Avon. Founded 1966.',
  twitter: '@bubc',
  /** Default OG image — generated at build time by `pages/og/[slug].png.ts`. */
  ogImage: '/og/default.png',
} as const;

export interface ResolvedSeo {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  type: 'website' | 'article';
  canonical: string;
  noIndex: boolean;
}

export function resolveSeo(input: SeoInput, currentUrl: URL): ResolvedSeo {
  const pageTitle = input.title?.trim();
  const title = pageTitle ? `${pageTitle} — ${SITE.shortName}` : SITE.name;
  const description = input.description?.trim() || SITE.defaultDescription;
  const image = input.image || SITE.ogImage;
  const imageAlt = input.imageAlt?.trim() || title;
  const type = input.type ?? 'website';
  const canonical = input.canonical || new URL(currentUrl.pathname, SITE.url).toString();
  return { title, description, image, imageAlt, type, canonical, noIndex: !!input.noIndex };
}

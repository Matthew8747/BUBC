/**
 * Hand-maintained types for GROQ query results.
 *
 * Why not `sanity typegen`? It works but it's awkward across a monorepo and
 * its output regenerates noisily. The shapes here are simple enough to keep
 * by hand; when we add more complex queries we'll switch to typegen.
 */
import type { SanityImageSource } from '@sanity/image-url';

export interface SanityImage {
  _type?: string;
  alt?: string;
  caption?: string;
  credit?: string;
  decorative?: boolean;
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number; aspectRatio: number };
    };
  };
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { left: number; top: number; right: number; bottom: number };
}

// Allow Sanity image types where the URL builder accepts a source.
export type ImageSource = SanityImage & SanityImageSource;

export interface Link {
  label: string;
  url: string;
  external?: boolean;
}

export interface Cta {
  label: string;
  variant: 'solid' | 'ghost' | 'gold';
  link: Link;
}

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

export interface Seo {
  title?: string;
  description?: string;
  noIndex?: boolean;
  image?: SanityImage;
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export interface Settings {
  siteTitle?: string;
  siteDescription?: string;
  charityNumber?: string;
  contactEmail?: string;
  address?: string;
  boathouseLocation?: { lat: number; lng: number };
  primaryNav?: Link[];
  utilityNav?: Link[];
  primaryCta?: Cta;
  footerColumns?: { heading: string; links: Link[] }[];
  footerNote?: string;
  social?: { platform: string; url: string }[];
  logo?: SanityImage;
}

export interface NewsCardData {
  _id: string;
  title: string;
  slug: string;
  publishDate: string;
  excerpt: string;
  category?: { title: string; slug: string };
  heroImage?: SanityImage;
}

export interface SquadCardData {
  _id: string;
  name: string;
  slug: string;
  tier: 'senior' | 'development' | 'novice' | 'trial';
  gender?: 'men' | 'women' | 'mixed';
  shortDescription: string;
  heroImage?: SanityImage;
}

export interface SponsorData {
  _id: string;
  name: string;
  slug: string;
  website?: string;
  tier?: 'headline' | 'gold' | 'silver' | 'supporter';
  logo?: SanityImage;
}

export interface HomePage {
  heroHeadline?: string;
  heroSubhead?: string;
  heroImage?: SanityImage;
  heroCtas?: Cta[];
  stats?: Stat[];
  featuredNews?: NewsCardData[];
  pathwayIntro?: string;
  pathwaySquads?: SquadCardData[];
  sponsorStripHeading?: string;
  sponsorStrip?: SponsorData[];
  closingCtas?: Cta[];
  seo?: Seo;
}

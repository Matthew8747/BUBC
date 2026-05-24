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
  boathouseLocation?: { lat: number; lng: number; what3words?: string };
  primaryNav?: Link[];
  utilityNav?: Link[];
  primaryCta?: Cta;
  footerColumns?: { heading: string; links: Link[] }[];
  footerNote?: string;
  social?: { platform: string; url: string }[];
  logo?: SanityImage;
  liveRaceBanner?: LiveRaceBanner;
}

export interface LiveRaceBanner {
  active?: boolean;
  eventName?: string;
  message?: string;
  liveResultsUrl?: string;
  ctaLabel?: string;
  /** 'gold' for fundraising, 'blade' for race day live indicator, 'navy' for general. */
  tone?: 'navy' | 'gold' | 'blade';
}

export interface NewsCardData {
  _id: string;
  title: string;
  slug: string;
  publishDate: string;
  excerpt: string;
  author?: string;
  category?: { title: string; slug: string };
  heroImage?: SanityImage;
}

export interface NewsCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export interface NewsPostDetail {
  _id: string;
  title: string;
  publishDate: string;
  excerpt: string;
  author?: string;
  category?: { title: string; slug: string };
  heroImage?: SanityImage;
  body?: unknown;
  relatedAthletes?: { name: string; slug: string; photo?: SanityImage }[];
  relatedSquads?: { name: string; slug: string }[];
  seo?: Seo;
}

export interface PostRef {
  title: string;
  slug: string;
}

// ---------------------------------------------------------------------------
// Henley Honours
// ---------------------------------------------------------------------------

export interface HenleyHonourSeat {
  seat?: string;
  name?: string;
  athlete?: { name: string; slug: string };
}

export interface HenleyHonour {
  _id: string;
  year: number;
  regatta: 'hrr' | 'hwr';
  event: string;
  crewName?: string;
  cox?: string;
  coach?: string;
  finish: string;
  opposition?: string;
  notes?: string;
  athletes?: HenleyHonourSeat[];
}

// ---------------------------------------------------------------------------
// Olympians
// ---------------------------------------------------------------------------

export interface OlympicAppearance {
  year: number;
  host?: string;
  event?: string;
  medal?: 'gold' | 'silver' | 'bronze' | 'none';
  finalPlace?: number;
}

export interface OlympianCard {
  _id: string;
  name: string;
  slug: string;
  bubcYears?: string;
  currentRole?: string;
  photo?: SanityImage;
  olympicYears?: OlympicAppearance[];
}

export interface OlympianDetail extends OlympianCard {
  story?: unknown;
  seo?: Seo;
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

// ---------------------------------------------------------------------------
// Squad detail
// ---------------------------------------------------------------------------

export interface PersonRef {
  name: string;
  role?: string;
  photo?: SanityImage;
}

export interface CoachRef {
  name: string;
  role: string;
  photo?: SanityImage;
}

export interface TrainingSession {
  day?: string;
  startTime?: string;
  endTime?: string;
  type?: string;
  location?: string;
}

export interface Achievement {
  year: number;
  title: string;
  detail?: string;
}

export interface SquadDetail {
  _id: string;
  name: string;
  tier: 'senior' | 'development' | 'novice' | 'trial';
  gender?: 'men' | 'women' | 'mixed';
  shortDescription: string;
  heroImage?: SanityImage;
  captain?: PersonRef;
  captainBio?: string;
  coaches?: CoachRef[];
  trainingSchedule?: TrainingSession[];
  expectedStandards?: unknown;
  achievements?: Achievement[];
  photos?: SanityImage[];
  contactEmail?: string;
  seo?: Seo;
}

// ---------------------------------------------------------------------------
// Coaches
// ---------------------------------------------------------------------------

export interface CoachData {
  _id: string;
  name: string;
  slug: string;
  role: string;
  qualifications?: string[];
  email?: string;
  photo?: SanityImage;
  bio?: unknown;
}

// ---------------------------------------------------------------------------
// Committee
// ---------------------------------------------------------------------------

export interface CommitteeMemberData {
  _id: string;
  name: string;
  slug: string;
  role: string;
  course?: string;
  email?: string;
  photo?: SanityImage;
  bio?: string;
}

// ---------------------------------------------------------------------------
// Fleet
// ---------------------------------------------------------------------------

export interface BoatCardData {
  _id: string;
  name: string;
  slug: string;
  make: string;
  class: string;
  weight?: 'heavy' | 'light';
  yearBought?: number;
  donor?: string;
  status: 'active' | 'reserve' | 'retired' | 'forSale';
  photo?: SanityImage;
}

// ---------------------------------------------------------------------------
// Fundraising
// ---------------------------------------------------------------------------

export interface CampaignData {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount?: number;
  donateUrl: string;
  heroImage?: SanityImage;
}

export interface BoatForSaleData {
  _id: string;
  boatType: string;
  priceRange: string;
  status: 'needed' | 'funded' | 'delivered';
  notes?: string;
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export interface PageDoc {
  title: string;
  slug: string;
  intro?: string;
  heroImage?: SanityImage;
  body?: unknown;
  ctas?: Cta[];
  seo?: Seo;
}

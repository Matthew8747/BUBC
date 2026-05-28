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
// Regatta results
// ---------------------------------------------------------------------------

export interface RegattaResult {
  _id: string;
  regatta: string;
  year: number;
  event: string;
  crewName?: string;
  finish?: string;
  time?: string;
  video?: string;
  athletes?: { name: string; slug?: string }[];
  cox?: { name: string; slug?: string };
  coach?: { name: string; slug?: string };
}

// ---------------------------------------------------------------------------
// Past chairs
// ---------------------------------------------------------------------------

export interface ChairRecord {
  _id: string;
  name: string;
  slug?: string;
  yearFrom: number;
  yearTo?: number;
  photo?: SanityImage;
  bio?: unknown;
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
// Alumni / Olympians (one schema, category-driven views)
// ---------------------------------------------------------------------------

export type AlumniCategory = 'olympian' | 'international' | 'boatRace' | 'notableCareer';
export type Medal = 'gold' | 'silver' | 'bronze' | 'none';

export interface OlympicAppearance {
  year: number;
  host?: string;
  event?: string;
  medal?: Medal;
  finalPlace?: number;
}

export interface InternationalAppearance {
  year: number;
  team?: string;
  event?: string;
  boat?: string;
  medal?: Medal;
  finalPlace?: number;
}

export interface BoatRaceAppearance {
  year: number;
  university: 'oxford' | 'cambridge';
  boat?: 'blue' | 'reserves';
  result?: 'won' | 'lost';
}

export interface AlumniProfileCard {
  _id: string;
  name: string;
  slug: string;
  category?: AlumniCategory;
  bubcYears?: string;
  currentRole?: string;
  location?: string;
  careerHighlight?: string;
  photo?: SanityImage;
  olympicYears?: OlympicAppearance[];
  internationalAppearances?: InternationalAppearance[];
  boatRaceAppearances?: BoatRaceAppearance[];
}

/** Backwards-compatible alias used by the existing olympians pages. */
export type OlympianCard = AlumniProfileCard;

export interface OlympianDetail extends AlumniProfileCard {
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
  /** When set, the card links here and no detail page is generated (e.g. the PDA). */
  externalUrl?: string;
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

export interface BoatDetail extends BoatCardData {
  namingCeremonyDate?: string;
  bayNumber?: number;
  story?: unknown;
  currentCrew?: { name: string; slug: string; photo?: SanityImage }[];
}

// ---------------------------------------------------------------------------
// Fundraising
// ---------------------------------------------------------------------------

export interface CampaignData {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  status?: 'active' | 'reached' | 'closed';
  goalAmount: number;
  raisedAmount: number;
  donorCount?: number;
  donateUrl: string;
  heroImage?: SanityImage;
}

export interface CampaignDetail extends CampaignData {
  story?: unknown;
  gallery?: SanityImage[];
  seo?: Seo;
}

export interface BoatForSaleData {
  _id: string;
  boatType: string;
  priceRange: string;
  status: 'needed' | 'funded' | 'delivered';
  notes?: string;
}

// ---------------------------------------------------------------------------
// Sponsors (full record including description and metadata)
// ---------------------------------------------------------------------------

export interface SponsorFullData {
  _id: string;
  name: string;
  slug: string;
  website?: string;
  tier: 'headline' | 'gold' | 'silver' | 'supporter';
  since?: string;
  description?: string;
  logo?: SanityImage;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export type EventType = 'regatta' | 'head' | 'camp' | 'social' | 'alumni' | 'fundraiser';

export interface EventCardData {
  _id: string;
  title: string;
  slug: string;
  type: EventType;
  date: string;
  endDate?: string;
  location?: string;
  description?: unknown;
  registerUrl?: string;
  heroImage?: SanityImage;
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

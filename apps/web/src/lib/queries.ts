/**
 * GROQ queries — all named exports so pages can import just what they need.
 *
 * Projections are explicit (don't `...,`) so the shape of the result is stable
 * and the TypeScript types in `types.ts` match the runtime shape.
 */

const imageBlockFields = /* groq */ `
  _type,
  alt,
  caption,
  credit,
  decorative,
  "asset": asset->{ _id, _ref, url, metadata { lqip, dimensions { width, height, aspectRatio } } },
  hotspot,
  crop
`;

const ctaBlockFields = /* groq */ `
  label,
  variant,
  link {
    label,
    url,
    external
  }
`;

const seoFields = /* groq */ `
  title,
  description,
  noIndex,
  image { ${imageBlockFields} }
`;

// ---------------------------------------------------------------------------
// Singletons
// ---------------------------------------------------------------------------

export const settingsQuery = /* groq */ `
  *[_type == "settings"][0] {
    siteTitle,
    siteDescription,
    charityNumber,
    contactEmail,
    address,
    boathouseLocation,
    primaryNav[] { label, url, external },
    utilityNav[] { label, url, external },
    primaryCta { ${ctaBlockFields} },
    footerColumns[] {
      heading,
      links[] { label, url, external }
    },
    footerNote,
    social[] { platform, url },
    logo { ${imageBlockFields} }
  }
`;

export const homePageQuery = /* groq */ `
  *[_type == "homePage"][0] {
    heroHeadline,
    heroSubhead,
    heroImage { ${imageBlockFields} },
    heroCtas[] { ${ctaBlockFields} },
    stats[] { value, label, suffix },
    "featuredNews": coalesce(
      featuredNews[]->{
        _id, title, "slug": slug.current, publishDate, excerpt,
        "category": category->{ title, "slug": slug.current },
        heroImage { ${imageBlockFields} }
      },
      *[_type == "newsPost"] | order(publishDate desc)[0..2] {
        _id, title, "slug": slug.current, publishDate, excerpt,
        "category": category->{ title, "slug": slug.current },
        heroImage { ${imageBlockFields} }
      }
    ),
    pathwayIntro,
    pathwaySquads[]->{
      _id, name, "slug": slug.current, tier, gender, shortDescription,
      heroImage { ${imageBlockFields} }
    },
    sponsorStripHeading,
    sponsorStrip[]->{
      _id, name, "slug": slug.current, website, tier,
      logo { ${imageBlockFields} }
    },
    closingCtas[] { ${ctaBlockFields} },
    seo { ${seoFields} }
  }
`;

// ---------------------------------------------------------------------------
// Squads
// ---------------------------------------------------------------------------

export const allSquadsQuery = /* groq */ `
  *[_type == "squad"] | order(tier asc, name asc) {
    _id, name, "slug": slug.current, tier, gender, shortDescription,
    heroImage { ${imageBlockFields} }
  }
`;

export const squadBySlugQuery = /* groq */ `
  *[_type == "squad" && slug.current == $slug][0] {
    _id, name, tier, gender, shortDescription,
    heroImage { ${imageBlockFields} },
    captain->{ name, role, photo { ${imageBlockFields} } },
    captainBio,
    coaches[]->{ name, role, photo { ${imageBlockFields} } },
    trainingSchedule[] { day, startTime, endTime, type, location },
    expectedStandards,
    achievements[] { year, title, detail },
    photos[] { ${imageBlockFields} },
    contactEmail,
    seo { ${seoFields} }
  }
`;

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export const newsIndexQuery = /* groq */ `
  *[_type == "newsPost"] | order(publishDate desc) {
    _id, title, "slug": slug.current, publishDate, excerpt, author,
    "category": category->{ title, "slug": slug.current },
    heroImage { ${imageBlockFields} }
  }
`;

export const newsPostBySlugQuery = /* groq */ `
  *[_type == "newsPost" && slug.current == $slug][0] {
    _id, title, publishDate, excerpt, author,
    "category": category->{ title, "slug": slug.current },
    heroImage { ${imageBlockFields} },
    body,
    relatedAthletes[]->{ name, "slug": slug.current, photo { ${imageBlockFields} } },
    relatedSquads[]->{ name, "slug": slug.current },
    seo { ${seoFields} }
  }
`;

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

export const coachesQuery = /* groq */ `
  *[_type == "coach"] | order(order asc, name asc) {
    _id, name, "slug": slug.current, role, qualifications, email,
    photo { ${imageBlockFields} },
    bio
  }
`;

export const committeeQuery = /* groq */ `
  *[_type == "committeeMember" && academicYear == $year] | order(order asc, name asc) {
    _id, name, "slug": slug.current, role, course, email,
    photo { ${imageBlockFields} },
    bio
  }
`;

// ---------------------------------------------------------------------------
// Fleet / boats
// ---------------------------------------------------------------------------

export const fleetQuery = /* groq */ `
  *[_type == "boat" && status != "retired"] | order(class asc, name asc) {
    _id, name, "slug": slug.current, make, class, weight, yearBought, donor, status,
    photo { ${imageBlockFields} }
  }
`;

// ---------------------------------------------------------------------------
// Fundraising
// ---------------------------------------------------------------------------

export const activeCampaignsQuery = /* groq */ `
  *[_type == "campaign" && status == "active"] | order(_createdAt desc) {
    _id, title, "slug": slug.current, shortDescription,
    goalAmount, raisedAmount, donorCount, donateUrl,
    heroImage { ${imageBlockFields} }
  }
`;

export const buyABoatQuery = /* groq */ `
  *[_type == "boatForSale"] | order(priority asc) {
    _id, boatType, priceRange, status, notes
  }
`;

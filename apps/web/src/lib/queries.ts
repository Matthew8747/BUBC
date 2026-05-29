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
    boathouseLocation { lat, lng, what3words },
    boathousePhotos[] { ${imageBlockFields} },
    stvPhotos[] { ${imageBlockFields} },
    primaryNav[] { label, url, external },
    utilityNav[] { label, url, external },
    primaryCta { ${ctaBlockFields} },
    footerColumns[] {
      heading,
      links[] { label, url, external }
    },
    footerNote,
    social[] { platform, url },
    logo { ${imageBlockFields} },
    liveRaceBanner {
      active,
      eventName,
      message,
      liveResultsUrl,
      ctaLabel,
      tone
    }
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
      _id, name, "slug": slug.current, tier, gender, shortDescription, externalUrl,
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
    _id, name, "slug": slug.current, tier, gender, shortDescription, externalUrl,
    heroImage { ${imageBlockFields} }
  }
`;

// Linked squads (those with an externalUrl, e.g. the PDA) don't get a generated
// detail page — their card links straight out — so they're excluded here.
export const allSquadSlugsQuery = /* groq */ `
  *[_type == "squad" && defined(slug.current) && !defined(externalUrl)] {
    "slug": slug.current
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
    galleryHeading,
    galleryIntro,
    photos[] { ${imageBlockFields} },
    contactEmail,
    seo { ${seoFields} }
  }
`;

/** Just the gallery fields — used by the static PDA page to pull editable photos. */
export const squadGalleryBySlugQuery = /* groq */ `
  *[_type == "squad" && slug.current == $slug][0] {
    galleryHeading,
    galleryIntro,
    photos[] { ${imageBlockFields} }
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

export const newsByCategoryQuery = /* groq */ `
  *[_type == "newsPost" && category->slug.current == $slug] | order(publishDate desc) {
    _id, title, "slug": slug.current, publishDate, excerpt, author,
    "category": category->{ title, "slug": slug.current },
    heroImage { ${imageBlockFields} }
  }
`;

export const newsCategoriesQuery = /* groq */ `
  *[_type == "category"] | order(title asc) {
    _id, title, "slug": slug.current, description,
    "postCount": count(*[_type == "newsPost" && references(^._id)])
  }
`;

export const categoryBySlugQuery = /* groq */ `
  *[_type == "category" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, description
  }
`;

export const allNewsSlugsQuery = /* groq */ `
  *[_type == "newsPost" && defined(slug.current)] | order(publishDate desc) {
    "slug": slug.current, publishDate
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

/** Adjacent posts for prev/next nav on a post template. Two single fetches keep GROQ simple. */
export const previousPostQuery = /* groq */ `
  *[_type == "newsPost" && publishDate < $publishDate] | order(publishDate desc)[0] {
    title, "slug": slug.current
  }
`;
export const nextPostQuery = /* groq */ `
  *[_type == "newsPost" && publishDate > $publishDate] | order(publishDate asc)[0] {
    title, "slug": slug.current
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

/** Most recent academic year that has at least one committee member published. */
export const latestCommitteeYearQuery = /* groq */ `
  *[_type == "committeeMember"] | order(academicYear desc) [0].academicYear
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

/** Full fleet including retired — drives /boathouse/fleet/. */
export const fullFleetQuery = /* groq */ `
  *[_type == "boat"] | order(status asc, class asc, name asc) {
    _id, name, "slug": slug.current, make, class, weight, yearBought, donor, status,
    photo { ${imageBlockFields} }
  }
`;

export const allBoatSlugsQuery = /* groq */ `
  *[_type == "boat" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const boatBySlugQuery = /* groq */ `
  *[_type == "boat" && slug.current == $slug][0] {
    _id, name, "slug": slug.current, make, class, weight, yearBought, donor, status,
    namingCeremonyDate, bayNumber,
    photo { ${imageBlockFields} },
    story,
    currentCrew[]->{ name, "slug": slug.current, photo { ${imageBlockFields} } }
  }
`;

// ---------------------------------------------------------------------------
// Fundraising
// ---------------------------------------------------------------------------

export const activeCampaignsQuery = /* groq */ `
  *[_type == "campaign" && status == "active"] | order(_createdAt desc) {
    _id, title, "slug": slug.current, shortDescription,
    goalAmount, raisedAmount, donorCount, donateUrl, hubbubUrl,
    heroImage { ${imageBlockFields} }
  }
`;

export const allCampaignsQuery = /* groq */ `
  *[_type == "campaign"] | order(
    select(status == "active" => 0, status == "reached" => 1, 2),
    _createdAt desc
  ) {
    _id, title, "slug": slug.current, shortDescription, status,
    goalAmount, raisedAmount, donorCount, donateUrl, hubbubUrl,
    heroImage { ${imageBlockFields} }
  }
`;

export const allCampaignSlugsQuery = /* groq */ `
  *[_type == "campaign" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const campaignBySlugQuery = /* groq */ `
  *[_type == "campaign" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, status,
    shortDescription, story, donateUrl, hubbubUrl,
    goalAmount, raisedAmount, donorCount,
    heroImage { ${imageBlockFields} },
    gallery[] { ${imageBlockFields} },
    seo { ${seoFields} }
  }
`;

export const allSponsorsQuery = /* groq */ `
  *[_type == "sponsor"] | order(
    select(tier == "headline" => 0, tier == "gold" => 1, tier == "silver" => 2, 3),
    name asc
  ) {
    _id, name, "slug": slug.current, website, tier, since, description,
    logo { ${imageBlockFields} }
  }
`;

export const buyABoatQuery = /* groq */ `
  *[_type == "boatForSale"] | order(priority asc) {
    _id, boatType, priceRange, status, notes
  }
`;

// ---------------------------------------------------------------------------
// Regatta results archive
// ---------------------------------------------------------------------------

export const regattaResultsQuery = /* groq */ `
  *[_type == "regattaResult"] | order(year desc, regatta asc, event asc) {
    _id, regatta, year, event, crewName, finish, time, video,
    "athletes": athletes[]->{ name, "slug": slug.current },
    "cox": cox->{ name, "slug": slug.current },
    "coach": coach->{ name, "slug": slug.current }
  }
`;

// ---------------------------------------------------------------------------
// Past chairs
// ---------------------------------------------------------------------------

export const chairsQuery = /* groq */ `
  *[_type == "chair"] | order(yearFrom desc) {
    _id, name, "slug": slug.current, yearFrom, yearTo,
    photo { ${imageBlockFields} },
    bio
  }
`;

// ---------------------------------------------------------------------------
// Henley Honours
// ---------------------------------------------------------------------------

export const henleyHonoursQuery = /* groq */ `
  *[_type == "henleyHonour"] | order(year desc, regatta asc) {
    _id, year, regatta, event, crewName, cox, coach, finish, opposition, notes,
    athletes[] {
      seat,
      name,
      "athlete": athlete->{ name, "slug": slug.current }
    }
  }
`;

// ---------------------------------------------------------------------------
// Alumni / Olympians (shared `olympian` doc, category-driven display)
// ---------------------------------------------------------------------------

const alumniProfileFields = /* groq */ `
  _id, name, "slug": slug.current,
  category, bubcYears, currentRole, location, careerHighlight,
  photo { ${imageBlockFields} },
  olympicYears[] { year, host, event, medal, finalPlace },
  internationalAppearances[] { year, team, event, boat, medal, finalPlace },
  boatRaceAppearances[] { year, university, boat, result }
`;

/** Olympians-only — keeps /about/olympians/ unchanged. */
export const olympiansQuery = /* groq */ `
  *[_type == "olympian" && (category == "olympian" || !defined(category))]
    | order(coalesce(olympicYears[0].year, 0) desc, name asc) {
    ${alumniProfileFields}
  }
`;

export const olympianBySlugQuery = /* groq */ `
  *[_type == "olympian" && slug.current == $slug][0] {
    ${alumniProfileFields},
    story,
    seo { ${seoFields} }
  }
`;

export const allOlympianSlugsQuery = /* groq */ `
  *[_type == "olympian" && (category == "olympian" || !defined(category)) && defined(slug.current)] {
    "slug": slug.current
  }
`;

/** All alumni profiles regardless of category — drives /alumni/. */
export const alumniProfilesQuery = /* groq */ `
  *[_type == "olympian"] | order(
    coalesce(olympicYears[0].year, internationalAppearances[0].year, boatRaceAppearances[0].year, 0) desc,
    name asc
  ) {
    ${alumniProfileFields}
  }
`;

export const upcomingAlumniEventsQuery = /* groq */ `
  *[_type == "event" && type == "alumni" && date >= now()] | order(date asc) {
    _id, title, "slug": slug.current, type, date, endDate, location,
    description, registerUrl,
    heroImage { ${imageBlockFields} }
  }
`;

export const pastAlumniEventsQuery = /* groq */ `
  *[_type == "event" && type == "alumni" && date < now()] | order(date desc)[0..11] {
    _id, title, "slug": slug.current, type, date, endDate, location,
    heroImage { ${imageBlockFields} }
  }
`;

/** All upcoming events (every type) — drives the general /events/ page. Pass $today as YYYY-MM-DD. */
export const upcomingEventsQuery = /* groq */ `
  *[_type == "event" && coalesce(endDate, date) >= $today] | order(date asc) {
    _id, title, "slug": slug.current, type, date, endDate, location,
    description, registerUrl,
    heroImage { ${imageBlockFields} }
  }
`;

export const pastEventsQuery = /* groq */ `
  *[_type == "event" && coalesce(endDate, date) < $today] | order(date desc)[0..15] {
    _id, title, "slug": slug.current, type, date, endDate, location,
    heroImage { ${imageBlockFields} }
  }
`;

// ---------------------------------------------------------------------------
// Generic pages (welfare, contact, history, etc.)
// ---------------------------------------------------------------------------

export const pageBySlugQuery = /* groq */ `
  *[_type == "page" && slug.current == $slug][0] {
    title, "slug": slug.current,
    intro,
    heroImage { ${imageBlockFields} },
    body,
    ctas[] { ${ctaBlockFields} },
    seo { ${seoFields} }
  }
`;

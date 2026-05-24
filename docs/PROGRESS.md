# BUBC Site — Build Progress & Handoff Notes

> Last updated: 2026-05-24 (session 4). Pick up from **"Where we left off"** below.
>
> Related docs: [plan.md](plan.md) (build phases, single source of truth) · [FEATURES.md](FEATURES.md) (idea backlog with status flags + open decisions) · [DEPLOYMENT.md](DEPLOYMENT.md) (deploy + Sanity webhook setup).

---

## Snapshot

| Layer                                          | State                                                                                                                                                                                               |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo (pnpm)                                | ✅                                                                                                                                                                                                  |
| Astro frontend (`apps/web`)                    | ✅ design system + chrome · Sanity wired · all P0 pages · **Phase 4: news index/post/category/RSS, Pagefind search, Henley Honours, Olympians index + detail, live race banner**                    |
| Sanity Studio (`apps/studio`)                  | ✅ v5, project `j7zcx618`, all schemas defined · `settings.liveRaceBanner` added                                                                                                                    |
| Tooling (ESLint, Prettier, Husky, lint-staged) | ✅                                                                                                                                                                                                  |
| CI workflow (GitHub Actions)                   | ✅ lint + typecheck + unit + build + e2e                                                                                                                                                            |
| Testing (Vitest + Playwright)                  | ✅ **19 smoke specs (38 runs across desktop + mobile)** + **14 unit tests** (seo, reading time, pagination)                                                                                         |
| SEO / discovery                                | ✅ `@astrojs/sitemap` (sitemap-index.xml), `robots.txt`, structured data (Organization + WebSite globally, NewsArticle / Person / BreadcrumbList per template), `/news/rss.xml` with XSL stylesheet |
| Static search                                  | ✅ Pagefind indexed at build time; `/` + Cmd/Ctrl-K + header buttons open the dialog; keyboard nav; graceful unavailable state                                                                      |
| Vercel                                         | ✅ live at <https://bubc-web.vercel.app/>                                                                                                                                                           |
| Cloudflare DNS / email                         | ⏸ deferred to launch (Phase 6)                                                                                                                                                                      |
| Cloudflare Web Analytics                       | ⏸ ready to wire (beacon code in BaseLayout, gated on env var)                                                                                                                                       |
| Formspree                                      | ⏸ account ready; form ID needs adding to Vercel env                                                                                                                                                 |
| Sanity Studio deploy                           | ❌ not deployed (manual `pnpm --filter @bubc/studio deploy`)                                                                                                                                        |
| Sanity → Vercel webhook                        | 📋 setup documented in [DEPLOYMENT.md](DEPLOYMENT.md); needs editor or developer to wire it (15 min, requires Vercel + Sanity dashboard access)                                                     |
| Custom domain on prod                          | ❌ Phase 6 cutover                                                                                                                                                                                  |
| Photos                                         | ⏸ being gathered; placeholder system covers the gap                                                                                                                                                 |
| Build / typecheck / lint / format / unit / e2e | ✅ all green                                                                                                                                                                                        |

---

## What has been built

### T01 — Astro + Tailwind + pnpm workspace ✅

pnpm monorepo, `apps/web` (Astro 6.3.6, strict TS, Tailwind v4), `apps/studio` (Sanity v5).

### T02 — Sanity Studio scaffold ✅

v5 + React 19, project ID `j7zcx618`, env-driven config, custom structure + singleton enforcement.

### T03 — Tooling ✅

ESLint 9 flat config, Prettier 3 with Astro plugin, Husky v9 + lint-staged.

- **pre-commit** (`.husky/pre-commit`): runs `lint-staged` — ESLint + Prettier on staged files only. Fast.
- **pre-push** (`.husky/pre-push`): runs `format:check && lint && typecheck` across the whole repo. Blocks the push if any check fails, so CI never sees a bad push.

### T04 — Vercel ✅ (manual, done)

Live at <https://bubc-web.vercel.app/>. Auto-deploys on push to main. Preview deploys on PRs.

### T05 — Brand tokens, fonts, layouts ✅

`global.css` with full token set via Tailwind v4 `@theme`. Self-hosted variable fonts via `@fontsource-variable`. BaseLayout (SEO + skip link + Cloudflare beacon) and PageLayout (chrome).

### T06 — UI primitives ✅

Button, Tag, Stat, Card, Container, Section, Eyebrow.

### T07 — Header ✅

Sticky scroll, active-page indicator, mobile overlay with ESC + focus management + scroll lock.

### T08 — Footer ✅

4-column nav + sponsor strip + charity line.

### T09 — Styleguide ✅

[/styleguide](https://bubc-web.vercel.app/styleguide) — colours, type scale, buttons, tags, stats, cards, prose, layout helpers.

### T10–T15 — Sanity schemas ✅

6 objects (incl. mandatory-alt `imageBlock`), 2 singletons (settings, homePage), 15 documents — full content model from the plan.

### T16 — Sanity client wired into apps/web ✅

- `apps/web/src/lib/sanity.ts` — client with `useCdn:true`, `perspective:'published'`, `safeFetch()` wrapper that returns null on error so pages still render with empty datasets
- `apps/web/src/lib/queries.ts` — GROQ queries for settings, homePage, squads, news, coaches, committee, fleet, campaigns, buy-a-boat — all with explicit projections so result shapes are stable
- `apps/web/src/lib/types.ts` — TS types matching the GROQ projections
- `apps/web/src/env.d.ts` — typed env vars (SANITY\_\*, PUBLIC_FORMSPREE_TRIAL_ID, PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN)
- `apps/web/.env.example` — template

### Image system ✅

- `Placeholder.astro` — styled diagonal-stripe rectangle with "Photo to come" label. Used anywhere a real photo doesn't exist yet.
- `Picture.astro` — Sanity-driven responsive image: srcset with widths 480/768/1024/1440/1920, `auto=format` so Sanity CDN serves AVIF/WebP/JPEG to whichever the browser prefers, LQIP background, optional priority/eager loading, falls back to Placeholder when no asset
- `PortableText.astro` — renders Sanity body content with custom serializers (lead decorator, link annotation, embedded imageBlock as `<figure>`, YouTube/Vimeo embeds)

### T17–T19 — Home page ✅

- `Hero.astro` — full-bleed image with navy gradient overlay, eyebrow + headline + sub + CTAs. Reads from Sanity homePage or uses sensible defaults.
- `StatStrip.astro` — dark band of 4 big-number stats (defaults to founded/Olympians/Henley wins/members).
- `NewsRail.astro` — 3 latest news cards with category tag + date. Auto-falls back to placeholder cards.
- `SquadPathway.astro` — "find your level" — 4 squad cards (defaults to senior men / senior women / novice / trial).
- `SponsorStrip.astro` — sponsor logo strip with text fallback when logos aren't uploaded.
- `ClosingCtas.astro` — three-column navy band with editorial defaults (trial / donate / sponsor).
- `index.astro` — composes all six sections from a single GROQ query (`homePageQuery`).

### T21 — Trial form (Formspree) ✅

- `/squads/trial/` page with full intro, "what to expect" callout, and form
- Form components: `Field`, `Textarea`, `RadioGroup`, `Checkbox` — all with visible labels, hint text, required indicators, focus rings
- Honeypot anti-spam field (`_gotcha`)
- AJAX submission via `fetch` → success state replaces the form, errors surface inline below submit
- **Graceful unconfigured mode** — when `PUBLIC_FORMSPREE_TRIAL_ID` is unset, the form renders a visible "not configured" notice instead of pretending to accept submissions
- All form fields are keyboard-accessible, properly labelled, and announce errors via aria-live status region

### CI workflow ✅

`.github/workflows/ci.yml`:

- Concurrent groups so superseded runs auto-cancel
- Jobs: install → (lint + format / typecheck / unit / build) in parallel → e2e (uses build artifact)
- Caches pnpm store
- Uploads Playwright report on failure
- Triggers: every PR + every push to main

### Testing infrastructure ✅

- **Vitest** for unit tests
  - `tests/unit/seo.test.ts` — 6 tests covering `resolveSeo()` (title fallback, suffix, description, canonical, override, noIndex)
- **Playwright** for E2E smoke
  - `tests/e2e/smoke.spec.ts` — 5 specs covering home page load, skip link, styleguide sections, mobile menu open/close with ESC, trial form render
  - Two device profiles: desktop Chrome + mobile Pixel 5
  - `webServer` config auto-builds and serves the static `dist/`
- Scripts: `pnpm test:unit`, `pnpm test:e2e`, `pnpm test` (both)

### Cloudflare Web Analytics ✅ (code) ⏸ (token)

- Beacon snippet in `BaseLayout.astro`, gated on `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`
- No-op when unset, so dev/local builds don't ship the script
- To activate: see "Cloudflare" section under manual interventions

### Plan expanded ✅

`docs/plan.md` gained six new sections:

- §9b — Testing & quality strategy (pyramid, what each layer catches)
- §9c — CI/CD pipeline (jobs, branch protection)
- §9d — Image strategy (sources, pipeline, performance budget)
- §9e — Content seeding + preview (two-dataset workflow, Sanity Presentation)
- §9f — Monitoring & error tracking (Cloudflare WA, Sentry, uptime, webhooks)
- §9g — Cloudflare scope (what to do now vs at launch)

---

## Session 4 — Phase 4 dynamic content ✅

Phase 4 landed in one session. News system, search, honours table, Olympians, live race banner, structured data, sitemap, robots.txt — 22 routes in the static build, all tests + lint + typecheck green.

### T28 — News index + post template + categories + RSS ✅

- `/news/` — paginated index (page size 9); editorial empty state with RSS pointer when the dataset is empty.
- `/news/page/[num]/` — pages 2..N pre-generated via `getStaticPaths`; deliberately split from the index to avoid colliding with `/news/[slug]/`.
- `/news/[slug]/` — full post template: hero, breadcrumb, category tag, reading-time helper, PortableText body, related squads + athletes, share buttons (Twitter / Facebook / copy link), prev/next nav, JSON-LD `NewsArticle`.
- `/news/category/[slug]/` — pre-built one per Sanity category; reuses the index grid + breadcrumbs.
- `/news/rss.xml` — `@astrojs/rss` endpoint with a custom XSL stylesheet so browsers render the feed nicely. Linked from `<head>` (BaseLayout) and footer.
- New components: `news/NewsCard`, `news/CategoryPills`, `news/Pagination`, `news/ShareButtons`, `seo/JsonLd`.
- New lib: `lib/readingTime.ts` (PortableText word count → minutes).

### T28f — Sanity webhook docs ✅

`docs/DEPLOYMENT.md` is the new technical handover doc. Includes:

- Architecture diagram (GitHub → Vercel ← Sanity webhook).
- Step-by-step Sanity webhook + Vercel deploy hook setup (so editors see published posts in ~60s).
- Vercel env vars, build settings, rollback procedure.
- Cloudflare scope (Web Analytics now; DNS + email at launch only).
- Local dev commands and CI overview.

### T29 — Pagefind static search ✅

- Build chain extended: `astro build && pnpm pagefind` (so `dist/pagefind/` is regenerated every deploy). New script `pnpm pagefind` runs the indexer standalone.
- `<main data-pagefind-body>` in `PageLayout` scopes what gets indexed; header/footer/banner are excluded.
- Custom `SearchDialog.astro` modal with:
  - `/` global keyboard shortcut (suppressed when typing in inputs) + `Cmd`/`Ctrl`+K + header buttons (desktop and mobile).
  - Arrow-key navigation + Enter follows; ESC closes; focus restored on close.
  - 120 ms debounce; aria-live status announcing result counts.
  - Loads `/pagefind/pagefind.js` lazily on first open; surfaces a graceful "search is unavailable" message when the index is missing.

### T30 — Henley Honours ✅

- `/about/henley-honours/` — chronological record grouped by year (newest first), with a totals strip (total appearances, HRR vs HWR count, first appearance).
- Client-side filter pills: All / HRR / Henley Women's — server-rendered tables remain accessible without JS.
- Athletes link through to their (future) alumni profile when a slug exists; otherwise plain name.
- Honest "Records are being catalogued" empty state with an `alumni@bubc.co.uk` mailto.
- New query: `henleyHonoursQuery`. New type: `HenleyHonour` + `HenleyHonourSeat`.
- JSON-LD `BreadcrumbList`.

### T31 — Olympians ✅

- `/about/olympians/` — card grid sorted by most recent Olympic year. Each card shows best-medal tag, BUBC years, Olympic years, current role, every Olympic appearance as a chip.
- `/about/olympians/[slug]/` — full profile: photo, BUBC years, Olympic appearances list (with medal tags), PortableText story, share buttons. JSON-LD `Person` + `BreadcrumbList`.
- Empty state with mailto for unknown alumni.
- Schema rename `olympian → alumniProfile` deliberately deferred to P1 alumni section per FEATURES.md decision; current pages query the existing `olympian` type, so no breaking change.

### R5 — Live race banner ✅

- New `settings.liveRaceBanner` object in Sanity: `{ active, eventName, message, liveResultsUrl, ctaLabel, tone }`.
- `LiveRaceBanner.astro` renders above the header when `active=true`. Three tones (navy / gold / blade red). External link with `noopener noreferrer`.
- Per-session dismiss via `sessionStorage` keyed on the event name — closes for this visit, re-appears next session, immediately re-appears if the editor changes the event.

### SEO + structured data hardening ✅

- `@astrojs/sitemap` integration generates `/sitemap-index.xml` with priorities boosted for home + main hubs.
- `public/robots.txt` allows everything, blocks AI training crawlers (GPTBot/ClaudeBot/CCBot/Google-Extended/Bytespider), points at the sitemap.
- Global JSON-LD in BaseLayout: `SportsOrganization` + `WebSite` graph.
- Per-template JSON-LD: `NewsArticle` (news posts), `Person` (olympians), `BreadcrumbList` (interior pages).
- `astro.config.mjs`: `trailingSlash: 'always'`, `prefetch.viewport`, `image.domains: ['cdn.sanity.io']`.

### Tests added

- 8 new Playwright specs: news index empty-state, RSS feed XML, search via `/`, search via header button, Henley Honours page, Olympians index, robots.txt, sitemap-index.
- 2 new Vitest files: `readingTime.test.ts` (5 cases), `pagination.test.ts` (3 cases).
- Total: 14 unit + 19 smoke × 2 device profiles = **38 e2e + 14 unit passing**.

### Files added this session

```
apps/web/
├── src/
│   ├── components/
│   │   ├── layout/LiveRaceBanner.astro
│   │   ├── news/{NewsCard,CategoryPills,Pagination,ShareButtons}.astro
│   │   ├── search/SearchDialog.astro
│   │   └── seo/JsonLd.astro
│   ├── lib/readingTime.ts
│   └── pages/
│       ├── about/henley-honours.astro
│       ├── about/olympians/{index,[slug]}.astro
│       └── news/{index,[slug],page/[num],category/[slug],rss.xml.ts}.astro
├── public/{robots.txt, rss/styles.xsl}
└── tests/unit/{readingTime,pagination}.test.ts

docs/DEPLOYMENT.md
```

Changes to existing files:

- `astro.config.mjs` — sitemap, trailingSlash, prefetch, image domains.
- `apps/web/package.json` — `build` now chains pagefind; new `build:no-search` + `pagefind` scripts.
- `apps/web/src/layouts/{BaseLayout,PageLayout}.astro` — head slot forwarding; `data-pagefind-body`; global JSON-LD; settings fetch for the live banner; SearchDialog mounted globally.
- `apps/web/src/components/layout/{Header,Footer}.astro` — search buttons (desktop + mobile).
- `apps/web/src/lib/{queries,types}.ts` — news (categories, by-category, slugs, prev/next), Henley honours, Olympians, alumni profile types, settings.liveRaceBanner type.
- `apps/studio/schemaTypes/singletons/settings.ts` — `liveRaceBanner` field with tones, validation, collapsed group.

---

## Session 3 — Phase 3 P0 pages ✅

Built every Phase 3 must-launch page. 19 routes total, build clean, all gates green.

### T20 — Squads index + dynamic detail pages ✅

- `/squads/` — sorted card grid, three default cards when Sanity is empty, trial CTA strip
- `/squads/[slug].astro` — `getStaticPaths` from Sanity `squad` docs, fallback to senior-men / senior-women / novice slugs pre-data
- New components: `PageHero` (reusable across all interior pages), `TrainingScheduleTable`, `CoachStrip`, `PhotoGallery`
- Full page composes: hero → captain callout → training week → expected standards (PortableText) → coaches → recent achievements → photo gallery → CTA strip

### T22 — Coaching ✅

- `/coaching/` — uses `coachesQuery`, renders CoachCard per coach (portrait, role, qualifications, bio via PortableText, email)
- Honest "team being confirmed" placeholder when Sanity is empty

### T23 — Boathouse ✅

- `/boathouse/` — facilities checklist + OpenStreetMap iframe (driven by `settings.boathouseLocation` lat/lng/what3words) + fleet teaser (6 boats from `fleetQuery`)
- Map links to OSM + Google Directions; what3words rendered if configured

### T24 — About + History ✅

- `/about/` — landing page linking to history, henley honours, olympians, chairs, blazers
- `/about/history/` — pulls Sanity `page` doc with slug `history`, renders PortableText body + new `Timeline` component
- `Timeline` component: year-anchored vertical list, sortable, accessible `<ol>`

### T25 — Committee ✅

- `/committee/` — uses `committeeQuery` keyed on current academic year (helper in `lib/academicYear.ts` handles Sept rollover); falls back to most recent year with data when nothing matches; honest "being elected" placeholder otherwise
- Card grid: portrait + role + name + course + bio + email

### T26 — Welfare & safeguarding ✅

- `/welfare/` — named officer callout (welfare@bubc.co.uk) + Sanity `page` doc body (optional) + 5 policy cards + 4 reporting routes (BUBC officer, Bath Wellbeing, British Rowing Safeguarding, NSPCC) + inclusion & accessibility section

### T27 — Support pages ✅

- `/support/` — landing page (donate / buy-a-boat / sponsor / campaigns)
- `/support/donate/` — hero + "why donate" + ways-to-give grid + active campaigns with `DonationThermometer` + closing CTA
- `/support/buy-a-boat/` — 4-step process narrative + semantic price-range table from `boatForSale` docs (replaces the broken WordPress JS form)
- New component: `DonationThermometer` — accessible progress bar, GBP-formatted, clamped 0–100%

### Plus ✅

- `/404.astro` — branded, links back to four main routes
- `/contact.astro` — direct-email list per role + safeguarding callout + Sanity-driven postal address
- `/privacy.astro` — UK GDPR-compliant privacy notice (what we collect, why, retention, rights, ICO link)
- Smoke specs expanded: home, styleguide, mobile menu, trial, squads index, senior-men detail, boathouse map, welfare officer, donate Hubbub link, 404 — **22 specs passing (11 across two device profiles)**

### Types & query additions

- `lib/types.ts` — added `SquadDetail`, `CoachData`, `CommitteeMemberData`, `BoatCardData`, `CampaignData`, `BoatForSaleData`, `PageDoc`, `PersonRef`, `CoachRef`, `TrainingSession`, `Achievement` (with `what3words` on `Settings.boathouseLocation`)
- `lib/queries.ts` — added `allSquadSlugsQuery`, `pageBySlugQuery`, `latestCommitteeYearQuery`
- `lib/academicYear.ts` — new helper, computes current UK academic year (Sept rollover)

### Backlog captured

- New `docs/FEATURES.md` — comprehensive idea pool with status flags (✅ built / 📋 planned / 🟡 under consideration / ❓ needs decision / 🚫 out of scope). Locked-in design decisions this session: structured-page `What's it like`, separate `crew` document for crew lists, `olympian` → `alumniProfile` schema extension for the broader alumni grid.

---

## Where we left off — Phase 5 next

Phase 4 dynamic content is complete (news + RSS, search, Henley Honours, Olympians, live race banner, structured data, sitemap). Phase 5 "wow" features are the natural next step.

### Immediate next steps (in order)

#### T32 — Fleet visualiser

- SVG layout of boathouse bays. Clickable boats → `/boathouse/fleet/[slug]/` detail page.
- Needs a `boat` schema extension for `bayNumber` / `x` / `y`, or a `fleetLocation` join doc per §5 of the plan.
- New `/boathouse/fleet/` index + `/boathouse/fleet/[slug]/` detail pages.
- Decision needed: SVG hand-authored from a real boathouse floor plan, or a stylised illustration? **Recommend stylised** — the editor doesn't have to update the SVG when a real bay moves.

#### T33 — Campaign pages + thermometer

- `DonationThermometer` already exists (`/support/donate/` uses it on active campaigns).
- Need: `/support/campaigns/` listing of all campaigns + `/support/campaigns/[slug]/` detail with story, gallery, donor count, share.
- `campaignBySlugQuery` + types still to add.

#### T34 — OG image generation (satori)

- One PNG per page, generated at build time via [@vercel/og](https://github.com/vercel/og) or [satori](https://github.com/vercel/satori). Branded background + page title + BUBC mark.
- Replaces the static `/og/default.jpg` fallback for most surfaces.

#### Sponsor index (P1 — bring forward)

- `/support/sponsor/` — sponsor index page with tiers from existing `sponsor` schema.
- Tier groupings (headline / gold / silver / supporter); logo grid; description per partner.
- Sponsorship pack PDF is decision F5 (still open).

#### Alumni section (P1)

- `/alumni/`, `/alumni/meles/`, `/alumni/events/`.
- This is when the `olympian` → `alumniProfile` schema rename happens — category enum (`olympian` / `international` / `boatRace` / `notableCareer`), single filterable feed, page split between `/about/olympians/` and `/alumni/`.

#### Race results archive (P1)

- `/results/` filterable by year + regatta. `regattaResult` schema already exists.

### Backlog decisions still open

See [FEATURES.md § Decision queue — Still open](FEATURES.md). Unblocked items waiting for user input:

- **C4** — Parent info page. Same structured-page approach as "What's it like"?
- **C7** — Inclusion & accessibility: section of `/welfare/` (currently is) or its own page?
- **A6** — Newsletter: Buttondown vs Beehiiv (recommendation: Buttondown).
- **W2** — Erg leaderboard: source + maintainer commitment.
- **F5** — Sponsorship pack PDF — needs draft content from the club.
- **F6** — Erg-athon / Crew Boat Race templates — only when a real event is scheduled.

### Locked in this session

- **R5** — Live race tracker: banner-only, driven by `settings.liveRaceBanner` in Sanity. **Built.**

---

## Manual interventions still required

| #       | Item                                                                                                                                                                                                                                | Why it's manual                                                                 | When                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **M1**  | Add Vercel env vars: `SANITY_PROJECT_ID=j7zcx618`, `SANITY_DATASET=production`                                                                                                                                                      | Per-project secrets                                                             | Now (otherwise Sanity queries return null and pages render with placeholders only) |
| **M2**  | Create a Formspree form, then set `PUBLIC_FORMSPREE_TRIAL_ID=<formId>` on Vercel                                                                                                                                                    | Per-project secret                                                              | Before /squads/trial/ accepts real submissions                                     |
| **M3**  | Cloudflare Web Analytics: <https://dash.cloudflare.com> → Web Analytics → Add site → Manual setup. Copy the token (the part inside `data-cf-beacon='{"token":"…"}'`). Set `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=<token>` on Vercel.    | Per-project secret                                                              | Whenever — works on `*.vercel.app`                                                 |
| **M4**  | Deploy Sanity Studio: `pnpm --filter @bubc/studio deploy`                                                                                                                                                                           | First run is interactive; prompts for studio hostname like `bubc.sanity.studio` | When editors need to log in to add content                                         |
| **M5**  | Add committee editors as Sanity members                                                                                                                                                                                             | sanity.io/manage → Members → invite by email                                    | After M4                                                                           |
| **M6**  | Cloudflare DNS for bubc.co.uk                                                                                                                                                                                                       | Domain registrar nameservers must point at Cloudflare first                     | Phase 6 (launch)                                                                   |
| **M7**  | Cloudflare Email Routing                                                                                                                                                                                                            | Requires #M6 done                                                               | Phase 6                                                                            |
| **M8**  | DNS cutover to Vercel                                                                                                                                                                                                               | Add CNAME in Cloudflare DNS                                                     | Phase 6 (launch day)                                                               |
| **M9**  | Real photography upload to Sanity                                                                                                                                                                                                   | User is gathering; placeholders handle the gap                                  | Whenever ready                                                                     |
| **M11** | Seed Sanity with at least one `page` doc per slug used by the site (`history`, `welfare`, future `parent-info` / `whats-it-like`). Each page falls back gracefully when missing, but real copy is the win.                          | Editorial decision + Sanity write                                               | When committee has content                                                         |
| **M12** | Add committee `committeeMember` docs for 2025/26 (and 2026/27 when elected). Without these the `/committee/` page shows a placeholder.                                                                                              | Editorial decision + Sanity write                                               | After committee handover                                                           |
| **M10** | ⚠ **If a Cloudflare Pages project was created by accident**, delete it. Hosting belongs to Vercel; Cloudflare's role is DNS + email + analytics only.                                                                               | Avoid running two hosts in parallel                                             | Now                                                                                |
| **M13** | Wire Sanity webhook → Vercel deploy hook so editor publishes auto-deploy in ~60s. **Step-by-step in [DEPLOYMENT.md § Sanity → Vercel webhook](DEPLOYMENT.md#sanity--vercel-deploy-webhook).**                                       | Crosses two dashboards (Sanity + Vercel); not scriptable here                   | Before editors start publishing news posts                                         |
| **M14** | Seed Sanity with the news `category` docs you actually plan to use (e.g. "Race report", "Squad update", "Fundraising", "Alumni", "Announcement"). The category pills + RSS categories all read from this list.                      | Editorial decision                                                              | Before publishing the first news post                                              |
| **M15** | Once you have Olympian profiles to publish, create `olympian` docs in Sanity. The page lives at `/about/olympians/` (filterable card grid). Each `olympian` becomes a `/about/olympians/<slug>/` detail page.                       | Editorial work + content gathering                                              | When alumni outreach has produced material                                         |
| **M16** | Add `henleyHonour` docs once the historic record is digitised — ideally one per crew-year combination. The table groups by year automatically.                                                                                      | Editorial — needs the club's archive in spreadsheet form                        | Ongoing                                                                            |
| **M17** | If you want a live race banner during BUCS / HRR / Henley Women's, open Sanity → Site settings → Live race banner, toggle `active`, fill `eventName` + `liveResultsUrl`, save. Banner disappears the moment you set `active=false`. | Editorial trigger                                                               | Race weekends                                                                      |

### What to do _right now_ on Cloudflare

You mentioned setting up Cloudflare and linking it to the repo. To clarify scope:

- **Probably what you want:** Cloudflare Web Analytics (free, no DNS prerequisite). Sign up → "Web Analytics" → "Add a site" → pick "Manual setup" → copy the JavaScript snippet's token → set `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` in Vercel → push (or hit "Redeploy"). The beacon code is already in `BaseLayout.astro`.
- **What you might've done instead:** Cloudflare Pages. If you see a "Pages" project in your Cloudflare dashboard with the BUBC repo connected, that's a competing host. Delete it — Vercel is the host.
- **Defer to launch:** DNS + email routing. Those need bubc.co.uk's nameservers to actually point at Cloudflare. We do that on launch day, not before.

---

## Tools / skills that would improve this workflow

Based on the session, things worth adding:

| Tool/skill                         | Why                                                                                                                                                                  | Effort                                                                                 |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **`gh` CLI on PATH**               | Installed last session via winget but not in current shell's PATH. After a PowerShell restart you can run `gh auth login` once, then I can open PRs directly.        | One terminal restart + `gh auth login`                                                 |
| **Playwright MCP**                 | Lets me drive a real browser against the live deploy or local build. Catches visual regressions and confirms keyboard navigation, focus traps, etc. work end-to-end. | Already available via `mcp__Claude_in_Chrome__*` tools — needs Chrome extension setup. |
| **Lighthouse CI**                  | Automated performance gating in CI. `@lhci/cli` package, one workflow file. Catches LCP/TBT regressions.                                                             | ~30 min to wire when we're closer to launch                                            |
| **Pa11y CI**                       | Programmatic a11y testing. Complements Playwright + axe-core.                                                                                                        | ~20 min                                                                                |
| **Sentry (`@sentry/astro`)**       | Real-user error tracking in production. Free tier 5k events/mo. Catches the bugs that don't show in dev.                                                             | ~15 min, Phase 5                                                                       |
| **Sanity Presentation**            | Live editor preview matched to production. Big quality-of-life win for non-developer committee.                                                                      | ~1h, T-late                                                                            |
| **`pnpm peers check`**             | Sanity v5 emits peer-dep warnings during install. Worth auditing once to confirm nothing is missing.                                                                 | 5 min                                                                                  |
| **`@astrojs/sitemap` integration** | ✅ Installed and wired (session 4). Sitemap at `/sitemap-index.xml`.                                                                                                 | done                                                                                   |
| **`@astrojs/rss`**                 | ✅ Installed and wired (session 4). Feed at `/news/rss.xml` with custom XSL stylesheet.                                                                              | done                                                                                   |
| **Pagefind**                       | ✅ Installed and wired (session 4). Static index built on every deploy. `/` shortcut + header buttons.                                                               | done                                                                                   |

Wire the remaining ones when the matching feature lands.

---

## Repo structure (current)

```
bubc-site/
├── .github/workflows/ci.yml      # lint, typecheck, unit, build, e2e
├── .husky/pre-commit             # lint-staged (staged files only)
├── .husky/pre-push               # format:check + lint + typecheck (full repo)
├── apps/
│   ├── web/                      # @bubc/web — Astro 6 frontend
│   │   ├── playwright.config.ts
│   │   ├── vitest.config.ts
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── coach/        # CoachCard
│   │   │   │   ├── content/      # Picture, Placeholder, PortableText, PhotoGallery, Timeline
│   │   │   │   ├── form/         # Field, Textarea, RadioGroup, Checkbox
│   │   │   │   ├── home/         # Hero, StatStrip, NewsRail, SquadPathway, SponsorStrip, ClosingCtas
│   │   │   │   ├── layout/       # Header, Footer, PageHero, LiveRaceBanner
│   │   │   │   ├── news/         # NewsCard, CategoryPills, Pagination, ShareButtons
│   │   │   │   ├── search/       # SearchDialog
│   │   │   │   ├── seo/          # JsonLd
│   │   │   │   ├── squad/        # TrainingScheduleTable, CoachStrip
│   │   │   │   ├── support/      # DonationThermometer
│   │   │   │   └── ui/           # Button, Card, Container, Eyebrow, Section, Stat, Tag
│   │   │   ├── layouts/          # BaseLayout, PageLayout
│   │   │   ├── lib/              # sanity, queries, types, seo, html, academicYear, readingTime
│   │   │   ├── pages/
│   │   │   │   ├── index.astro · styleguide.astro · 404.astro · contact.astro · privacy.astro · welfare.astro · coaching.astro · committee.astro
│   │   │   │   ├── about/        # index, history, henley-honours, olympians/{index,[slug]}
│   │   │   │   ├── boathouse/    # index
│   │   │   │   ├── news/         # index, [slug], page/[num], category/[slug], rss.xml.ts
│   │   │   │   ├── squads/       # index, trial, [slug]
│   │   │   │   └── support/      # index, donate, buy-a-boat
│   │   │   ├── styles/global.css
│   │   │   └── env.d.ts
│   │   ├── public/{favicon, robots.txt, rss/styles.xsl}
│   │   └── tests/
│   │       ├── e2e/smoke.spec.ts # 19 specs across desktop + mobile (38 runs)
│   │       └── unit/{seo,readingTime,pagination}.test.ts
│   └── studio/                   # @bubc/studio — Sanity Studio v5
│       ├── schemaTypes/{documents,objects,singletons}/
│       ├── structure.ts
│       └── sanity.config.ts
├── docs/{plan.md, PROGRESS.md, FEATURES.md, DEPLOYMENT.md}
├── eslint.config.mjs / .prettierrc / .prettierignore
└── package.json / pnpm-workspace.yaml
```

---

## Commands reference

```bash
# Dev
pnpm dev                              # Astro dev server → http://localhost:4321
pnpm studio                           # Sanity Studio dev → http://localhost:3333

# Build / preview
pnpm build                            # production build of apps/web (chains pagefind indexer)
pnpm preview                          # serve production build locally
pnpm --filter @bubc/web build:no-search  # skip pagefind (faster iterations)
pnpm --filter @bubc/web pagefind         # rebuild the search index against existing dist/

# Quality
pnpm lint / pnpm lint:fix             # ESLint across monorepo
pnpm format / pnpm format:check       # Prettier
pnpm typecheck                        # astro check + tsc

# Tests
pnpm test:unit                        # Vitest
pnpm test:e2e                         # Playwright (auto-starts preview server)
pnpm test                             # both

# Studio (from apps/studio)
pnpm deploy                           # deploy Studio to bubc.sanity.studio (first run sets hostname)
pnpm typegen                          # generate TS types from schemas
```

---

## Environment variables

| Var                                 | Where                   | Required when                                                         |
| ----------------------------------- | ----------------------- | --------------------------------------------------------------------- |
| `SANITY_STUDIO_PROJECT_ID`          | `apps/studio/.env`      | Always (Studio uses it). Default fallback `j7zcx618` in config.       |
| `SANITY_STUDIO_DATASET`             | `apps/studio/.env`      | Always. Default `production`.                                         |
| `SANITY_PROJECT_ID`                 | `apps/web/.env`, Vercel | When the home page should show real content (otherwise placeholders). |
| `SANITY_DATASET`                    | `apps/web/.env`, Vercel | Same.                                                                 |
| `PUBLIC_FORMSPREE_TRIAL_ID`         | `apps/web/.env`, Vercel | Before the trial form accepts submissions.                            |
| `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` | Vercel                  | When you want CF Web Analytics.                                       |

> Sanity auth gotcha: the CLI must be authenticated with your GitHub account, not Google. If you see "project ID not found", run `npx sanity logout && npx sanity login` and pick **Continue with GitHub**.

---

## Key files

| File                                                                                                                      | Purpose                                                 |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [docs/plan.md](plan.md)                                                                                                   | Full development plan — single source of truth          |
| [docs/FEATURES.md](FEATURES.md)                                                                                           | Feature backlog with status flags + open decision queue |
| [docs/DEPLOYMENT.md](DEPLOYMENT.md)                                                                                       | Deploy, env vars, Sanity webhook, Cloudflare scope      |
| [apps/web/src/lib/sanity.ts](../apps/web/src/lib/sanity.ts)                                                               | Sanity client + image URL builder + `safeFetch`         |
| [apps/web/src/lib/queries.ts](../apps/web/src/lib/queries.ts)                                                             | GROQ queries                                            |
| [apps/web/src/lib/types.ts](../apps/web/src/lib/types.ts)                                                                 | Hand-maintained types matching GROQ projections         |
| [apps/web/src/lib/academicYear.ts](../apps/web/src/lib/academicYear.ts)                                                   | UK academic-year helper (Sept rollover)                 |
| [apps/web/src/components/content/Picture.astro](../apps/web/src/components/content/Picture.astro)                         | Responsive Sanity image with placeholder fallback       |
| [apps/web/src/components/content/Placeholder.astro](../apps/web/src/components/content/Placeholder.astro)                 | Striped placeholder rectangle                           |
| [apps/web/src/components/content/Timeline.astro](../apps/web/src/components/content/Timeline.astro)                       | History-page year-anchored timeline                     |
| [apps/web/src/components/content/PhotoGallery.astro](../apps/web/src/components/content/PhotoGallery.astro)               | 4:5 photo grid for squad galleries                      |
| [apps/web/src/components/layout/PageHero.astro](../apps/web/src/components/layout/PageHero.astro)                         | Reusable interior-page hero                             |
| [apps/web/src/components/squad/TrainingScheduleTable.astro](../apps/web/src/components/squad/TrainingScheduleTable.astro) | Sortable weekly training schedule                       |
| [apps/web/src/components/squad/CoachStrip.astro](../apps/web/src/components/squad/CoachStrip.astro)                       | Compact coach row for squad pages                       |
| [apps/web/src/components/coach/CoachCard.astro](../apps/web/src/components/coach/CoachCard.astro)                         | Full coach profile card                                 |
| [apps/web/src/components/support/DonationThermometer.astro](../apps/web/src/components/support/DonationThermometer.astro) | Accessible campaign progress bar                        |
| [apps/web/src/components/home/](../apps/web/src/components/home/)                                                         | Home page sections                                      |
| [apps/web/src/pages/squads/trial.astro](../apps/web/src/pages/squads/trial.astro)                                         | Formspree trial form                                    |
| [apps/web/src/pages/squads/[slug].astro](../apps/web/src/pages/squads/%5Bslug%5D.astro)                                   | Dynamic squad detail page                               |
| [apps/web/src/pages/news/index.astro](../apps/web/src/pages/news/index.astro)                                             | News index (page 1) with category filter                |
| [apps/web/src/pages/news/[slug].astro](../apps/web/src/pages/news/%5Bslug%5D.astro)                                       | News post template with PortableText body + share       |
| [apps/web/src/pages/news/rss.xml.ts](../apps/web/src/pages/news/rss.xml.ts)                                               | RSS feed endpoint                                       |
| [apps/web/src/pages/about/henley-honours.astro](../apps/web/src/pages/about/henley-honours.astro)                         | Henley honours record with filter pills                 |
| [apps/web/src/pages/about/olympians/index.astro](../apps/web/src/pages/about/olympians/index.astro)                       | Olympians index                                         |
| [apps/web/src/pages/about/olympians/[slug].astro](../apps/web/src/pages/about/olympians/%5Bslug%5D.astro)                 | Olympian detail page                                    |
| [apps/web/src/components/search/SearchDialog.astro](../apps/web/src/components/search/SearchDialog.astro)                 | Pagefind-powered search dialog                          |
| [apps/web/src/components/layout/LiveRaceBanner.astro](../apps/web/src/components/layout/LiveRaceBanner.astro)             | Editor-driven live race banner                          |
| [apps/web/src/components/seo/JsonLd.astro](../apps/web/src/components/seo/JsonLd.astro)                                   | Generic JSON-LD injector                                |
| [apps/web/src/components/news/Pagination.astro](../apps/web/src/components/news/Pagination.astro)                         | Accessible pagination with windowed pages               |
| [apps/web/src/components/news/ShareButtons.astro](../apps/web/src/components/news/ShareButtons.astro)                     | Twitter / Facebook / copy-link share row                |
| [apps/web/src/lib/readingTime.ts](../apps/web/src/lib/readingTime.ts)                                                     | PortableText word-count → minutes label                 |
| [apps/web/public/robots.txt](../apps/web/public/robots.txt)                                                               | Crawler policy + sitemap pointer                        |
| [apps/web/playwright.config.ts](../apps/web/playwright.config.ts)                                                         | Playwright config                                       |
| [apps/web/vitest.config.ts](../apps/web/vitest.config.ts)                                                                 | Vitest config                                           |
| [.github/workflows/ci.yml](../.github/workflows/ci.yml)                                                                   | CI pipeline                                             |

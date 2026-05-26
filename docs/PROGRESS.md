# BUBC Site — Build Progress & Handoff Notes

> Last updated: 2026-05-26 (session 10 — full seed pipeline: settings, homepage, news categories, squads, campaigns, sponsors, fleet, alumni, news posts, plus a `seed:all` orchestrator).
>
> Related docs: [plan.md](plan.md) (build phases, single source of truth) · [FEATURES.md](FEATURES.md) (idea backlog with status flags + open decisions) · [DEPLOYMENT.md](DEPLOYMENT.md) (deploy + Sanity webhook setup) · [SECURITY.md](SECURITY.md) (threat model, headers, secrets handling) · [CONTENT-BOOK.md](CONTENT-BOOK.md) (production-ready editorial copy for every page, keyed to Sanity schemas) · [POPULATE.md](POPULATE.md) (how to seed Sanity in one command).

---

## Session 10 — Full Sanity seed pipeline ✅

Extended the seed scripts to cover every content type that has a Sanity schema, plus a one-command orchestrator. From a fresh Sanity dataset, three commands now populate the bulk of the site:

```powershell
$env:SANITY_API_WRITE_TOKEN = "sk..."
pnpm --filter @bubc/studio seed:all          # 12 steps, ~5 min
pnpm --filter @bubc/studio dev               # review at localhost:3333
```

### New files

- `apps/studio/scripts/lib/_helpers.mjs` — shared utilities (Sanity client, `slugify`, PortableText `para`/`bullets`, asset-library `findImage`/`requireImage`, idempotency `docExists`, header/summary printers). Used by every seed.
- `apps/studio/scripts/seed-settings.mjs` — Site settings singleton (siteTitle, contactEmail, address, boathouseLocation, primary + utility nav, primary CTA, 4 footer columns, footerNote, live-race-banner skeleton, social links).
- `apps/studio/scripts/seed-homepage.mjs` — Home page singleton (hero with `findImage`-resolved photo, hero CTAs, stat strip, pathway intro + squad refs, sponsor strip heading, closing CTAs).
- `apps/studio/scripts/seed-news-categories.mjs` — 6 categories (race-reports, athlete-spotlights, alumni-stories, club-news, recruitment, sponsor-announcements). Prereq for `seed:news`.
- `apps/studio/scripts/seed-squads.mjs` — 3 squads (senior men, senior women, novice). Resolves captain refs against `committee-<slug>-2025-26` docs, coach refs against `coach-<slug>` docs, hero images from the asset library. Full training schedules, expectedStandards PortableText, achievements arrays.
- `apps/studio/scripts/seed-campaigns.mjs` — New Boathouse Capital Campaign (£500k goal, provisional amounts).
- `apps/studio/scripts/seed-sponsors.mjs` — 4 sponsors (Embecosm gold, Mazars gold, SU Bath headline, Rival Kit silver). Logos resolved from `assets/images/sponsors/` via the asset library.
- `apps/studio/scripts/seed-fleet.mjs` — 3 boats (Sampson, Susan Green, Kenneth Green) with provisional metadata.
- `apps/studio/scripts/seed-alumni.mjs` — 4 alumni profiles (Becky Wilde, Cedol Dafyd, Ben Furley, Angus Pollock). Drafts — confirm with each before publishing.
- `apps/studio/scripts/seed-news.mjs` — 6 draft news posts (BUCS Regatta 2025 race report, Jeanne athlete spotlight, recruitment trial week, Becky alumni story, Christmas dinner 2025, May 2026 boathouse build update). Each references a category from `seed:news-categories` and a hero image from the asset library.
- `apps/studio/scripts/seed-all.mjs` — orchestrator. Spawns each script in dependency order, forwards `--dry-run` and `--replace`. Continues on failure with a summary at the end.

### Updates

- `apps/studio/package.json` — 9 new `seed:*` scripts and a `seed:all` aggregator.
- `docs/POPULATE.md` — rewritten TL;DR to highlight the one-command flow; new step-by-step table; per-step notes on what still needs human judgement after seeding.

### Idempotency + safety

- Every doc uses a stable deterministic `_id` (e.g. `news-recruitment-trial-week-opens-monday`, `sponsor-embecosm`, `campaign-new-boathouse`, `squad-senior-men`).
- Default behaviour skips existing docs. `--replace` flag overwrites.
- `--dry-run` works on every script without needing a token.
- `seed:all` does NOT short-circuit on a child failure — it continues to remaining steps and prints a failure summary at the end.

### Gates

- `pnpm --filter @bubc/studio seed:all -- --dry-run` — all 12 steps complete successfully.
- Each individual seed script verified with `--dry-run` (correct roster, correct IDs, correct dependency references).

### What still needs human judgement after running

Listed in POPULATE.md. Headlines: confirm bios with each named person; verify coach photo mappings; pick photo galleries for each squad; refresh campaign numbers from Hubbub; confirm sponsor descriptions with each partner; set image hotspots on headshots.

---

---

## Session 9 — Editorial content drop + seed scripts ✅

Production-ready editorial content for every major page, plus two new seed scripts that populate the committee and coaches in one command. Goal: a near-launch-ready site from a fresh `pnpm install`, with one Sanity write-token paste and three commands.

### Files added — content

- `docs/CONTENT-BOOK.md` — master content document. 18 sections covering Settings, Home, every Squad page, the new PDA programme, Coaching (all three coaches), Committee 2025/26 (every named officer from website TODO.txt + provisional bios), Boathouse expansions (new build + STV + the reach), Fleet (naming-story templates), About + History + Meles + Blazers + Chairs, Alumni (4 spotlight drafts + reusable template), Sponsors (tier copy + partner blurb templates + sponsorship-pack PDF outline), Donate + Buy a Boat + Campaigns (incl. draft New Boathouse campaign doc), Welfare, Press, Contact, News (editorial cadence + 6 draft posts), Newsletter direction, plus a glossary, micro-copy library, error states and per-page OG strings.
- `docs/POPULATE.md` — practical step-by-step for the developer: how Sanity fits, get a write token, bulk-upload images, run the committee + coaches seeds, fill in the rest from the Studio. Lists per-page "which fields to fill" pointers that map onto CONTENT-BOOK.md.
- `apps/web/src/pages/squads/pda.astro` — Performance Development Academy page. Static editorial — hero, why-PDA, programme detail, fit/not-fit, outcomes, CTA. Wired with `SportsTeam` + `BreadcrumbList` JSON-LD and dynamic OG image. Answers the recurring "what happens after my novice year?" question that the squad index had no good place to answer.

### Files added — seed scripts

- `apps/studio/scripts/seed-committee.mjs` — creates all 19 committee members for 2025/26 with photos attached. Roster from `website TODO.txt`; photos from `assets/images/committee/`; bios from CONTENT-BOOK.md § 6. Stable IDs (`committee-<slug>-2025-26`) so re-runs are idempotent. Flags: `--dry-run`, `--replace`.
- `apps/studio/scripts/seed-coaches.mjs` — creates three coach documents (Charlie Newbold, Marcus Munafò, Simon Brown). Charlie + Marcus get best-guess photo mappings from `assets/images/coaches/`; Simon has no portrait on file. Same flag set as committee.
- `apps/studio/package.json` — new scripts: `seed:committee`, `seed:coaches`.

### How to run

Three-step path to a near-populated site:

```powershell
$env:SANITY_API_WRITE_TOKEN = "sk..."      # one-time per shell
pnpm --filter @bubc/studio seed:images     # all photos → asset library + imageLibrary docs
pnpm --filter @bubc/studio seed:committee  # 19 committee docs with photos + bios
pnpm --filter @bubc/studio seed:coaches    # 3 coach docs
```

Full walkthrough in `docs/POPULATE.md`.

### Files updated

- `apps/web/src/pages/boathouse/index.astro` — added three editorial sections between the existing hero/facilities and fleet teaser:
  - **The reach** — narrow editorial section on the 8 km Bath-to-Saltford water.
  - **New boathouse** — full navy band with capital project copy, "why it matters" definition list (more fleet on site / coaching room / alumni & family area), CTAs to `/support/campaigns/` and `/news/`.
  - **Land training at the STV** — three-up grid covering the high-performance gym, indoor rowing room, and testing/recovery.
- `apps/web/src/pages/squads/index.astro` — appended a static "Performance Development pathway" section under the squad grid that always renders regardless of Sanity state. Two CTAs (PDA page, trial form) + side aside answering the recurring novice-to-senior question verbatim.

### Why a content book and not raw seed JSON

The content book is the source-of-truth document — designed to be lifted straight into Sanity Studio. Once an editor (most likely Matt Pearson with the comms officer) has signed off on names, bios and provisional facts, the same content drops into the studio without re-keying. A JSON seed would have shipped uncalibrated names into the production dataset before they were confirmed by their owners — the book lets us stage that.

### Gates

- `pnpm --filter @bubc/web typecheck` — clean (0 errors, 0 warnings, 1 unrelated hint).
- Lighthouse / Pa11y CI — unchanged (no breaking edits to existing routes; the new PDA page follows the same PageHero/Section/Container patterns as the rest of the site).

### Follow-ups for the next session

- Walk the content book with the relevant committee officers (chair, captains, welfare, alumni officer) and resolve every `[provisional]` mark before publishing live.
- Add the PDA page to the global sitemap priority list if/when it stabilises.
- Decide whether PDA becomes a Sanity `squad` doc (so it appears in the dynamic squads grid) or stays editorial-static. The static page can coexist with a future Sanity squad if the editorial copy stays distinctive.
- Image-library import: once `SANITY_API_WRITE_TOKEN` is set, run the seed:images script — the content book references specific files under `assets/images/` and the boathouse/STV/medals categories are ready to land.

---

---

## Snapshot

| Layer                                          | State                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo (pnpm)                                | ✅                                                                                                                                                                                                                                                                                    |
| Astro frontend (`apps/web`)                    | ✅ design system + chrome · Sanity wired · all P0 pages · Phase 4 (news/RSS/search/honours/Olympians/live banner) · **Phase 5: fleet, sponsor, campaigns, alumni section, newsletter, OG generation, 301 redirects**                                                                  |
| Sanity Studio (`apps/studio`)                  | ✅ v5, project `j7zcx618` · `olympian` extended with `category` enum + intl/Boat Race appearance arrays                                                                                                                                                                               |
| Tooling (ESLint, Prettier, Husky, lint-staged) | ✅                                                                                                                                                                                                                                                                                    |
| CI workflow (GitHub Actions)                   | ✅ lint + typecheck + unit + build + e2e + **Lighthouse CI** + **Pa11y CI** (advisory)                                                                                                                                                                                                |
| Testing (Vitest + Playwright)                  | ✅ **31 Playwright specs** + **17 unit tests** (seo, reading time, pagination, OG URL helper)                                                                                                                                                                                         |
| SEO / discovery                                | ✅ Sitemap, robots.txt, structured data (Org/WebSite global; NewsArticle/Person/SportsTeam/Event/BreadcrumbList per template), `/news/rss.xml`, **18 × 301 redirects from legacy WordPress URLs**                                                                                     |
| Static search                                  | ✅ Pagefind                                                                                                                                                                                                                                                                           |
| OG image generation                            | ✅ **satori + resvg, build-time, branded card per page + per content item, ~30 static cards + dynamic for news/squads/olympians/alumni/boats/campaigns**                                                                                                                              |
| Newsletter                                     | ✅ **Buttondown signup in footer + post pages, graceful "not configured" state**                                                                                                                                                                                                      |
| Error tracking                                 | ✅ **Sentry browser, dynamic import, no-op when DSN unset, bot UA filter, error-only**                                                                                                                                                                                                |
| Vercel                                         | ✅ live at <https://bubc-web.vercel.app/>                                                                                                                                                                                                                                             |
| Cloudflare DNS / email                         | ⏸ deferred to launch (Phase 6)                                                                                                                                                                                                                                                        |
| Cloudflare Web Analytics                       | ⏸ ready to wire (beacon code in BaseLayout, gated on env var)                                                                                                                                                                                                                         |
| Formspree                                      | ⏸ account ready; form ID needs adding to Vercel env                                                                                                                                                                                                                                   |
| Sanity Studio deploy                           | ❌ not deployed (manual `pnpm --filter @bubc/studio deploy`)                                                                                                                                                                                                                          |
| Sanity → Vercel webhook                        | 📋 setup documented in [DEPLOYMENT.md](DEPLOYMENT.md); needs editor or developer to wire it (15 min, requires Vercel + Sanity dashboard access)                                                                                                                                       |
| Custom domain on prod                          | ❌ Phase 6 cutover                                                                                                                                                                                                                                                                    |
| Photos                                         | 📥 **182 in `assets/images/<category>/`** ready to import. `imageLibrary` document type + `pnpm --filter @bubc/studio seed:images` script land them in Sanity. Needs `SANITY_API_WRITE_TOKEN` to run live.                                                                            |
| Build / typecheck / lint / format / unit / e2e | ✅ all green                                                                                                                                                                                                                                                                          |
| Security hardening (Phase 6)                   | ✅ **CSP + HSTS + COOP/CORP headers** (vercel.json) · **Zod validation** (forms + live banner) · **URL sanitiser** rewritten with control-char + protocol-relative defences · **Sport University of the Year** footer treatment                                                       |
| P1/P2 pages (Phase 6)                          | ✅ **/results/** (filterable archive) · **/press/** (media kit) · **/about/chairs/** (heritage list) · **/about/blazers/** (awards criteria)                                                                                                                                          |
| Header (session 8)                             | ✅ desktop nav from `md:` (768 px) so 13" laptops + scaled displays stay full · burger → X morph · opaque navy overlay (inline `background-color: var(--color-navy)` + opaque inner layer) with `data-open` slide-in + staggered nav item reveals · `prefers-reduced-motion` honoured |
| Image library (session 8)                      | ✅ `imageLibrary` document schema (image + category + sourceFilename + sha256 hash) · `apps/studio/scripts/import-images.mjs` recursive bulk-import (auto-generates alt text from category + filename date hints, idempotent via hash) · dry-run validated against all 182 files      |

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

## Session 5 — Phase 5 polish + tech stack ✅

Big batch — alumni / fleet / sponsor / campaigns pages, Buttondown newsletter, satori-driven OG images, full 301 redirect map, Sentry, Lighthouse CI, Pa11y CI. 38+ routes in the static build.

### Schema (Studio)

- **`olympian` extended into the unified alumni-profile schema** without renaming the document (avoids destructive migration). New fields:
  - `category` enum: `olympian` / `international` / `boatRace` / `notableCareer` (required, default `olympian`).
  - `internationalAppearances[]` — year, team, event, boat, medal, finalPlace. Hidden unless category=international.
  - `boatRaceAppearances[]` — year, university (oxford/cambridge), boat (blue/reserves), result. Hidden unless category=boatRace.
  - `careerHighlight` (string) for notableCareer category. Required validation in that case.
  - `location` (string) for the future alumni map.
  - Field groups: Core / Achievements / SEO.

### T32 — Fleet pages ✅ (skipped SVG visualiser per user choice)

- `/boathouse/fleet/` — full fleet grid with client-side class filter (1x / 2- / 4+ / 8+ pills), status badge per boat (active / reserve / for sale / retired), graceful empty state.
- `/boathouse/fleet/[slug]/` — boat profile: photo, class description, donor callout, dl of make/class/weight/year, naming-ceremony date, PortableText story, current-crew grid.
- New queries: `fullFleetQuery`, `allBoatSlugsQuery`, `boatBySlugQuery`. New type: `BoatDetail`.
- Boathouse index updated: links to `/boathouse/fleet/` and each teaser card links to the boat profile.

### T33 — Campaigns ✅

- `/support/campaigns/` — three-tier listing: active (cards with thermometer), reached (rows with badge), closed (compact rows). Graceful empty state with Hubbub fallback.
- `/support/campaigns/[slug]/` — full page: hero with status badge, sticky donation aside (thermometer + donate button + share buttons), PortableText story, gallery.
- New queries: `allCampaignsQuery`, `allCampaignSlugsQuery`, `campaignBySlugQuery`. New type: `CampaignDetail`.

### Sponsor index ✅

- `/support/sponsor/` — tier descriptions (headline / gold / silver / supporter), partner grid grouped by tier (rich cards for headline+gold, compact logo grid for silver+supporter), empty state with mailto, closing CTA strip.
- New query: `allSponsorsQuery`. New type: `SponsorFullData`.

### Alumni section ✅

- `/alumni/` — unified profile grid with category filter pills (counts displayed), medal indicators, summarise() helper renders category-appropriate one-liners, quick-link aside, graceful empty state. Olympians link to `/about/olympians/[slug]/`; everything else links to `/alumni/profile/[slug]/`.
- `/alumni/meles/` — page-doc-driven body with editorial fallback, three-step "how to join" + sticky contact card, `#join` anchor.
- `/alumni/events/` — upcoming event cards (with `Event` JSON-LD per item), past events compact list.
- `/alumni/profile/[slug]/` — generic detail page for non-Olympian categories: hero photo + dl of metadata, category-specific tables (intl/Boat Race), PortableText story, share buttons, `Person` JSON-LD + breadcrumbs.

### Newsletter (Buttondown) ✅

- `NewsletterSignup.astro` — light + dark tones, honeypot anti-spam, AJAX submission via `fetch`, graceful "not configured" notice when `PUBLIC_BUTTONDOWN_USERNAME` is unset.
- Mounted in the footer (4-col + signup column layout) and at the bottom of news posts.

### T34 — OG image generation ✅ (satori + resvg)

- `src/lib/og/render.ts` — satori vnode builder + resvg PNG conversion. Brand-on-brand: navy gradient bg, gold hairline + uppercase eyebrow, Fraunces 60–84pt headline, optional subtitle, BUBC mark + URL footer. Falls back to a 1×1 transparent PNG if satori throws (build never breaks).
- `src/pages/og/[slug].png.ts` — Astro endpoint with `getStaticPaths` enumerating ~30 static cards (default, home, every hub page) plus dynamic cards per news post, squad, olympian, alumni profile, boat, and campaign.
- `src/lib/og/url.ts` — small helper used by pages: `ogImage({ kind: 'page'|'news'|... , slug })`. Falls back to `/og/default.png` for unknown slugs.
- Fonts bundled at `src/lib/og/fonts/` — Inter regular + bold, Fraunces semibold (TTFs, fetched once from Google Fonts API). Self-contained build, no network dependency at deploy time.
- Wired into 13 page templates so far (home, squads index, trial, news index, fleet index/detail, sponsor, campaigns index/detail, alumni index/meles/events/profile detail, henley honours, olympians index/detail, donate, squad detail). Other pages fall back to the branded default card via `SITE.ogImage`.

### T38 — 301 redirects ✅

- All 18 legacy WordPress URLs from plan.md §1 wired into `astro.config.mjs` `redirects:`. Includes `/donate/`, `/coaching-team/`, `/buy-a-boat/`, `/henley-honours/`, `/meles-boat-club/`, `/join-meles-bc/` (hash to `#join`), etc.

### Structured data ✅ (extends Phase 4)

- **SportsTeam** + **BreadcrumbList** on every squad detail page (gender mapped to schema.org enum).
- **Event** JSON-LD on `/alumni/events/` — one entry per upcoming event, `OfflineEventAttendanceMode`, organiser back to the SportsOrganization graph.
- **Person** JSON-LD on alumni profile detail pages (alumniOf → University of Bath, memberOf → BUBC).
- Sitemap now excludes `/og/` (build-time only).

### Error tracking — Sentry ✅

- `src/lib/sentry.ts` — dynamic import of `@sentry/browser`, only loads when `PUBLIC_SENTRY_DSN` is set, no-op otherwise. Bot UA filter (bot/crawler/spider/headless/lighthouse), `tracesSampleRate: 0` to stay well under the 5k/mo free tier, env tag (production vs preview), `beforeSend` filters known browser-extension noise.
- Mounted in `BaseLayout.astro` as an Astro `<script>` block — Vite tree-shakes the whole Sentry chunk away on deploys without a DSN.

### Lighthouse CI ✅ (advisory)

- `apps/web/.lighthouserc.json` — runs against 10 key pages (home + every hub + a few detail pages) at desktop preset, asserts Performance ≥ 0.90 / A11y ≥ 0.95 / BP ≥ 0.95 / SEO ≥ 0.95 — all `warn` for the first two weeks per plan.md §9b.
- Added `lighthouse` job to `ci.yml` with `continue-on-error: true` (advisory) — uses the build artefact from the build job.

### Pa11y CI ✅ (advisory)

- `apps/web/.pa11yci.json` — WCAG 2.2 AA, axe + htmlcs runners, covers every public page (24 URLs).
- Added `a11y` job to `ci.yml` — spins up an `http-server` against the dist artefact, then runs `pa11y-ci`. Advisory for the first two weeks (per plan.md §9b), tightens to required after baselines settle.

### Tests added

- **11 new Playwright specs**: fleet index, sponsor index, campaigns index, alumni landing, Meles page, alumni events, footer newsletter signup, OG (home + default), three 301-redirect checks.
- **1 new Vitest file**: `og-url.test.ts` (3 cases covering known/unknown/dynamic slug forms).
- Total: **17 unit + 31 Playwright × 2 device profiles**.

### Files added this session

```
apps/web/
├── .lighthouserc.json
├── .pa11yci.json
├── src/
│   ├── components/layout/NewsletterSignup.astro
│   ├── lib/
│   │   ├── og/
│   │   │   ├── render.ts
│   │   │   ├── url.ts
│   │   │   └── fonts/{inter-regular,inter-bold,fraunces-semibold}.ttf
│   │   └── sentry.ts
│   └── pages/
│       ├── alumni/{index,meles,events}.astro
│       ├── alumni/profile/[slug].astro
│       ├── boathouse/fleet/{index,[slug]}.astro
│       ├── og/[slug].png.ts
│       └── support/{sponsor,campaigns/index,campaigns/[slug]}.astro
└── tests/unit/og-url.test.ts
```

Changes to existing files:

- `astro.config.mjs` — `redirects:` block with the 18 legacy URLs; sitemap excludes `/og/`.
- `apps/web/package.json` — new scripts `test:lhci` + `test:a11y` + `test:a11y:serve`; new deps `@sentry/browser`, `satori`, `@resvg/resvg-js`; new devDeps `@lhci/cli`, `pa11y-ci`, `http-server`, `@fontsource/{fraunces,geist}`.
- `apps/web/src/env.d.ts` + `.env.example` — `PUBLIC_BUTTONDOWN_USERNAME`, `PUBLIC_SENTRY_DSN`.
- `apps/web/src/lib/{queries,types,seo}.ts` — alumni-profile fields, fleet detail, campaign detail, sponsor full data, event card type, upcoming/past alumni event queries, `SITE.ogImage` switched to PNG.
- `apps/web/src/layouts/BaseLayout.astro` — Sentry init script gated on DSN.
- `apps/web/src/components/layout/Footer.astro` — alumni links column, newsletter signup beside the link grid.
- `apps/web/src/pages/boathouse/index.astro` — fleet teaser cards link to detail pages; "view the fleet" buttons.
- `apps/web/src/pages/news/[slug].astro` — newsletter block after share buttons.
- `apps/web/src/pages/squads/[slug].astro` — SportsTeam + BreadcrumbList JSON-LD.
- `apps/studio/schemaTypes/documents/olympian.ts` — category enum + intl/Boat Race appearances + careerHighlight + location + groups.
- `.github/workflows/ci.yml` — `lighthouse` + `a11y` jobs (advisory).

---

## Session 6 — Phase 6 security hardening + remaining P1/P2 pages ✅

Big lift: a security audit pass with concrete fixes; full launch-completeness page set (Results, Press, Chairs, Blazers); the "Sport University of the Year" footer treatment; documentation refresh including a new top-level SECURITY.md.

### Security hardening

- **`apps/web/src/lib/html.ts` rewritten**. `sanitizeUrl` now:
  - allow-lists `http:` / `https:` / `mailto:` / `tel:` + relative URLs only
  - rejects `javascript:`, `data:`, `vbscript:`, `file:`, `blob:`, intent:, and other unknown protocols → `#`
  - rejects protocol-relative `//evil.com` (would have inherited the page protocol)
  - strips C0 control chars + DEL before scheme comparison so `java\tscript:` etc. can't smuggle past the check
  - case-insensitive scheme match (`JAVASCRIPT:` is the same as `javascript:`).
- New `youtubeId` + `vimeoId` helpers. Parse with `new URL()` instead of substring matching, so a hostile URL like `https://evil.com/?fake=youtube.com/watch?v=ID` can no longer reach an iframe `src`.
- **`LiveRaceBanner.astro`** now routes `liveResultsUrl` through `sanitizeUrl` before rendering. A compromised editor account or pasted-in `javascript:` URL cannot reach the DOM.
- **`PortableText.astro`** embed serializer rewritten to use the new strict ID helpers.
- New `apps/web/src/lib/validation.ts` — Zod schemas for the trial form, newsletter signup, and the live race banner. `validateLiveRaceBanner()` runs at build time inside `PageLayout.astro`; if the shape or URL fails validation, the banner silently doesn't render.
- **Trial form** now layers: native `reportValidity()` → minimum-fill-time (2s) → Zod `parseTrialForm` → Formspree POST. Bots that fill instantly are dropped client-side.
- **Newsletter signup** same layering, 1.5s minimum + Zod email format + honeypot.
- New **`vercel.json`** with hardened security response headers:
  - `Content-Security-Policy` — strict allow-list (self + Sanity CDN + Cloudflare beacon + Sentry + Formspree + Buttondown + YouTube/Vimeo + OpenStreetMap)
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` denying camera/mic/geolocation/payment/USB
  - `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Resource-Policy: same-origin` (override to `cross-origin` for `/og/*.png` + fonts so embedding works)
  - Long-cache headers on `/og/*.png` and `/fonts/*`.

### New pages

- **`/results/`** — race results archive (P1). Filterable by year + regatta (client-side pills). Server-rendered tables for no-JS fallback. Stat strip (totals, regattas raced, most recent / earliest year). Empty state with mailto. Breadcrumb JSON-LD. OG card. New query `regattaResultsQuery`. New types `RegattaResult`. New helper `lib/results.ts` with `groupByYear` + `uniqueRegattas` + `regattaKey` (unit tested).
- **`/press/`** — media kit (P2). Boilerplate, quick facts dl, brand assets pointer, contact aside (press / captains / alumni). Static-mostly content. Breadcrumb JSON-LD. OG card.
- **`/about/chairs/`** — past chairs (P2). Pulls Sanity `chair` documents, groups by decade. Empty state matches Henley honours pattern. New query `chairsQuery`. New type `ChairRecord`. Photo via existing `Picture.astro`.
- **`/about/blazers/`** — heritage / awards criteria (P2). Static editorial content fallback when no `page` doc with slug `blazers` exists; uses Sanity body when present. Four blazer tiers with trim spec + criteria. Order-via-treasurer callout. Breadcrumb JSON-LD.

### Sport University of the Year treatment

- New `SportUniBadge.astro` — editorial heritage band at the top of the footer (above the sponsor strip). Eyebrow "Recognised by" + display headline "Sport University of the Year" + attribution to _The Times & Sunday Times Good University Guide_ + year. Gold hairline + vertical divider, matches the established design system. Configurable year via props for the next time the award lands.
- Wired into `Footer.astro` so it appears on every page.

### Tests

- **New unit suites**: `html.test.ts` (24 assertions covering escape + sanitiser edge cases — javascript: smuggling, protocol-relative, control chars, all schemes), `validation.test.ts` (Zod schemas — trial form, newsletter, live banner), `results.test.ts` (year grouping + regatta key/dedupe).
- **New Playwright specs** for the new pages and the Sport University treatment + a `Vercel-only` skipped security-headers check on every page response.
- All 4 new unit test files + 5 new smoke specs.

### Documentation

- New top-level **`docs/SECURITY.md`** — threat model + trust boundaries diagram + secrets handling + headers explanation + dependency cadence + responsible-disclosure email.
- `docs/PROGRESS.md` (this file) gains the session 6 entry.
- `docs/FEATURES.md` updated with the new IDs (Results = R1 ✅, Press = C8 ✅, Chairs = P6 ✅, Blazers = R4 ✅, Sport-Uni footer = new ID).
- `docs/DEPLOYMENT.md` gets a "Security headers" subsection pointing at `vercel.json` + `SECURITY.md`.

### Files added this session

```
docs/SECURITY.md
vercel.json
apps/web/
├── src/
│   ├── components/layout/SportUniBadge.astro
│   ├── lib/{results.ts, validation.ts}
│   └── pages/
│       ├── about/{chairs.astro, blazers.astro}
│       ├── press.astro
│       └── results/index.astro
└── tests/unit/{html.test.ts, validation.test.ts, results.test.ts}
```

Changes to existing files:

- `apps/web/src/lib/html.ts` — full rewrite (escape + URL allow-list + strict YouTube/Vimeo ID extraction).
- `apps/web/src/components/content/PortableText.astro` — embed serializer uses the new strict helpers.
- `apps/web/src/components/layout/LiveRaceBanner.astro` — sanitises `liveResultsUrl` before render.
- `apps/web/src/components/layout/Footer.astro` — Sport University badge mounted at the top; Results + Chairs + Blazers links added; Press in the legal strip.
- `apps/web/src/components/layout/NewsletterSignup.astro` — min-fill-time + Zod parse.
- `apps/web/src/pages/squads/trial.astro` — min-fill-time + Zod parse before Formspree POST.
- `apps/web/src/layouts/PageLayout.astro` — validates the live race banner with Zod before rendering.
- `apps/web/src/lib/queries.ts` + `lib/types.ts` — new `regattaResultsQuery` + `chairsQuery`; new `RegattaResult` + `ChairRecord` types.
- `apps/web/src/pages/og/[slug].png.ts` + `apps/web/src/lib/og/url.ts` — new static OG cards for results / press / chairs / blazers.
- `apps/web/.pa11yci.json` + `.lighthouserc.json` — new URLs in the CI sweep.
- `apps/web/package.json` — `zod` added as a runtime dep.

---

## Session 7 — Committee handover documentation ✅

Documentation-only session. Two new docs land alongside the existing technical handover doc set, completing the launch-path docs work flagged at the bottom of session 6.

### `docs/HANDOVER.md`

The orientation doc the incoming committee should read first. Audience-agnostic: tells a new President, Treasurer, or Comms Officer what the site is, which longer doc to open for their role, where credentials live, who owns what (with a templated table for the committee to fill in), the annual turnover checklist, emergency procedures, the lost-access recovery routes, and a rolling list of past maintainers.

Deliberately one page-ish — committee members aren't going to read a 20-page brief. Cross-links to [DEPLOYMENT.md](DEPLOYMENT.md), [SECURITY.md](SECURITY.md), [PROGRESS.md](PROGRESS.md), [FEATURES.md](FEATURES.md), and [CONTENT-EDITING.md](CONTENT-EDITING.md) so readers can drill down without re-reading everything.

### `docs/CONTENT-EDITING.md`

The non-developer editorial walkthrough. Audience = Comms Officer / Captains using Sanity Studio.

Sections cover: how the publish → rebuild flow works, logging in, the Studio anatomy (draft / published / edited status), publishing a news post (step-by-step), photo upload + alt text + hotspot, the live race banner (regatta-day workflow), site settings, committee members (with academic-year rollover behaviour explained), coaches, campaigns, sponsors, regatta results, the home page, what editors should not touch, common gotchas, and how to get help. Loom screencast placeholders are explicit where they belong — record during the first editor-training session per [plan.md §9 / Phase 6](plan.md).

Field names, validation rules, group tabs, and singleton behaviour were cross-checked against the actual schema files in `apps/studio/schemaTypes/` so the instructions match what editors will see.

### Cross-doc tweaks

- `docs/DEPLOYMENT.md` — opening blurb updated to point at the new docs instead of saying "CONTENT-EDITING.md not yet written".
- `docs/PROGRESS.md` (this file) — Phase 6 launch checklist updated to reflect the handover docs landing; session 7 entry added.

### Files added this session

```
docs/HANDOVER.md
docs/CONTENT-EDITING.md
```

Changes to existing files:

- `docs/DEPLOYMENT.md` — opening paragraph.
- `docs/PROGRESS.md` — top header date + "Where we left off" launch bullet + this session entry.

No code changes; no tests affected; no build implications.

---

## Where we left off — Phase 6 launch path

Phase 5 + Phase 6 security/content are complete. Remaining work is purely launch logistics + the final two open backlog decisions.

### Immediate next steps

#### Manual interventions (no code) — see "Manual interventions" table below

- **M1–M3**: Vercel env vars (Sanity, Formspree, Cloudflare Analytics)
- **M4–M5**: Deploy Sanity Studio, invite editors
- **M13**: Wire Sanity → Vercel webhook (15 min)
- **M14**: Seed Sanity news categories

#### Race results archive (P1)

- `/results/` filterable by year + regatta. `regattaResult` schema already exists.

#### Press kit + Chairs + Blazers (P2)

- `/press/`, `/about/chairs/`, `/about/blazers/`. Static-mostly content.

#### Strava embed (W1) — needs club Strava account

#### Phase 6 launch

- DNS cutover to Vercel (M6–M8)
- Cloudflare Web Analytics token (M3)
- Tighten Lighthouse CI + Pa11y CI from advisory → required
- Cancel old WordPress host
- Train two committee members on Sanity (record Loom)
- ✅ Committee handover documentation — `docs/HANDOVER.md` (orientation) + `docs/CONTENT-EDITING.md` (editor walkthrough) landed session 7. Loom screencasts still TODO (record during editor training).

### Backlog decisions still open

See [FEATURES.md § Decision queue — Still open](FEATURES.md). Unblocked items waiting for user input:

- **C4** — Parent info page. Same structured-page approach as "What's it like"?
- **C7** — Inclusion & accessibility: section of `/welfare/` (currently is) or its own page?
- **W2** — Erg leaderboard: source + maintainer commitment.
- **F5** — Sponsorship pack PDF — needs draft content from the club.
- **F6** — Erg-athon / Crew Boat Race templates — only when a real event is scheduled.
- **A5** — Alumni world map — needs `location` data populated on alumni profiles (schema field now exists).

### Locked in this session

- **A4** — Alumni grid: extended `olympian` schema in place with category enum (FEATURES.md A4 → ✅).
- **A6** — Newsletter: **Buttondown** wired.
- **B4** — Fleet visualiser: skipped per user choice; standard grid pages built instead.

---

## Manual interventions still required

| #       | Item                                                                                                                                                                                                                                                              | Why it's manual                                                                 | When                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **M1**  | Add Vercel env vars: `SANITY_PROJECT_ID=j7zcx618`, `SANITY_DATASET=production`                                                                                                                                                                                    | Per-project secrets                                                             | Now (otherwise Sanity queries return null and pages render with placeholders only) |
| **M2**  | Create a Formspree form, then set `PUBLIC_FORMSPREE_TRIAL_ID=<formId>` on Vercel                                                                                                                                                                                  | Per-project secret                                                              | Before /squads/trial/ accepts real submissions                                     |
| **M3**  | Cloudflare Web Analytics: <https://dash.cloudflare.com> → Web Analytics → Add site → Manual setup. Copy the token (the part inside `data-cf-beacon='{"token":"…"}'`). Set `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=<token>` on Vercel.                                  | Per-project secret                                                              | Whenever — works on `*.vercel.app`                                                 |
| **M4**  | Deploy Sanity Studio: `pnpm --filter @bubc/studio deploy`                                                                                                                                                                                                         | First run is interactive; prompts for studio hostname like `bubc.sanity.studio` | When editors need to log in to add content                                         |
| **M5**  | Add committee editors as Sanity members                                                                                                                                                                                                                           | sanity.io/manage → Members → invite by email                                    | After M4                                                                           |
| **M6**  | Cloudflare DNS for bubc.co.uk                                                                                                                                                                                                                                     | Domain registrar nameservers must point at Cloudflare first                     | Phase 6 (launch)                                                                   |
| **M7**  | Cloudflare Email Routing                                                                                                                                                                                                                                          | Requires #M6 done                                                               | Phase 6                                                                            |
| **M8**  | DNS cutover to Vercel                                                                                                                                                                                                                                             | Add CNAME in Cloudflare DNS                                                     | Phase 6 (launch day)                                                               |
| **M9**  | Real photography upload to Sanity                                                                                                                                                                                                                                 | User is gathering; placeholders handle the gap                                  | Whenever ready                                                                     |
| **M11** | Seed Sanity with at least one `page` doc per slug used by the site (`history`, `welfare`, future `parent-info` / `whats-it-like`). Each page falls back gracefully when missing, but real copy is the win.                                                        | Editorial decision + Sanity write                                               | When committee has content                                                         |
| **M12** | Add committee `committeeMember` docs for 2025/26 (and 2026/27 when elected). Without these the `/committee/` page shows a placeholder.                                                                                                                            | Editorial decision + Sanity write                                               | After committee handover                                                           |
| **M10** | ⚠ **If a Cloudflare Pages project was created by accident**, delete it. Hosting belongs to Vercel; Cloudflare's role is DNS + email + analytics only.                                                                                                             | Avoid running two hosts in parallel                                             | Now                                                                                |
| **M13** | Wire Sanity webhook → Vercel deploy hook so editor publishes auto-deploy in ~60s. **Step-by-step in [DEPLOYMENT.md § Sanity → Vercel webhook](DEPLOYMENT.md#sanity--vercel-deploy-webhook).**                                                                     | Crosses two dashboards (Sanity + Vercel); not scriptable here                   | Before editors start publishing news posts                                         |
| **M14** | Seed Sanity with the news `category` docs you actually plan to use (e.g. "Race report", "Squad update", "Fundraising", "Alumni", "Announcement"). The category pills + RSS categories all read from this list.                                                    | Editorial decision                                                              | Before publishing the first news post                                              |
| **M15** | Once you have Olympian profiles to publish, create `olympian` docs in Sanity. The page lives at `/about/olympians/` (filterable card grid). Each `olympian` becomes a `/about/olympians/<slug>/` detail page.                                                     | Editorial work + content gathering                                              | When alumni outreach has produced material                                         |
| **M16** | Add `henleyHonour` docs once the historic record is digitised — ideally one per crew-year combination. The table groups by year automatically.                                                                                                                    | Editorial — needs the club's archive in spreadsheet form                        | Ongoing                                                                            |
| **M17** | If you want a live race banner during BUCS / HRR / Henley Women's, open Sanity → Site settings → Live race banner, toggle `active`, fill `eventName` + `liveResultsUrl`, save. Banner disappears the moment you set `active=false`.                               | Editorial trigger                                                               | Race weekends                                                                      |
| **M18** | Buttondown: sign up at <https://buttondown.email>, pick a username, then set `PUBLIC_BUTTONDOWN_USERNAME=<user>` on Vercel. Free tier covers 100 subscribers. Without this the footer + post-page newsletter forms show "not configured" notices.                 | Per-project account + secret                                                    | Whenever you want signups to start working                                         |
| **M19** | Sentry: sign up at <https://sentry.io>, create a project (Astro / Browser), copy the DSN, set `PUBLIC_SENTRY_DSN=<dsn>` on Vercel. Free tier is 5k events/month. Without this Sentry is fully tree-shaken — no bundle cost.                                       | Per-project account + secret                                                    | When you want real-user error tracking                                             |
| **M20** | Lighthouse CI + Pa11y CI are wired into `ci.yml` as **advisory** jobs (`continue-on-error: true`). After two weeks of baselines, switch them to required by removing `continue-on-error` and tightening the thresholds in `.lighthouserc.json` / `.pa11yci.json`. | One-line edits when ready                                                       | Two weeks after Phase 5 ships                                                      |

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
├── .github/workflows/ci.yml      # lint, typecheck, unit, build, e2e, lighthouse (advisory), a11y (advisory)
├── .husky/pre-commit             # lint-staged (staged files only)
├── .husky/pre-push               # format:check + lint + typecheck (full repo)
├── apps/
│   ├── web/                      # @bubc/web — Astro 6 frontend
│   │   ├── .lighthouserc.json    # Lighthouse CI config
│   │   ├── .pa11yci.json         # Pa11y CI config
│   │   ├── playwright.config.ts
│   │   ├── vitest.config.ts
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── coach/        # CoachCard
│   │   │   │   ├── content/      # Picture, Placeholder, PortableText, PhotoGallery, Timeline
│   │   │   │   ├── form/         # Field, Textarea, RadioGroup, Checkbox
│   │   │   │   ├── home/         # Hero, StatStrip, NewsRail, SquadPathway, SponsorStrip, ClosingCtas
│   │   │   │   ├── layout/       # Header, Footer, PageHero, LiveRaceBanner, NewsletterSignup
│   │   │   │   ├── news/         # NewsCard, CategoryPills, Pagination, ShareButtons
│   │   │   │   ├── search/       # SearchDialog
│   │   │   │   ├── seo/          # JsonLd
│   │   │   │   ├── squad/        # TrainingScheduleTable, CoachStrip
│   │   │   │   ├── support/      # DonationThermometer
│   │   │   │   └── ui/           # Button, Card, Container, Eyebrow, Section, Stat, Tag
│   │   │   ├── layouts/          # BaseLayout, PageLayout
│   │   │   ├── lib/              # sanity, queries, types, seo, html, academicYear, readingTime, sentry, og/{render,url,fonts/}
│   │   │   ├── pages/
│   │   │   │   ├── index.astro · styleguide.astro · 404.astro · contact.astro · privacy.astro · welfare.astro · coaching.astro · committee.astro
│   │   │   │   ├── about/        # index, history, henley-honours, olympians/{index,[slug]}
│   │   │   │   ├── alumni/       # index, meles, events, profile/[slug]
│   │   │   │   ├── boathouse/    # index, fleet/{index,[slug]}
│   │   │   │   ├── news/         # index, [slug], page/[num], category/[slug], rss.xml.ts
│   │   │   │   ├── og/[slug].png.ts  # build-time OG image endpoint
│   │   │   │   ├── squads/       # index, trial, [slug]
│   │   │   │   └── support/      # index, donate, buy-a-boat, sponsor, campaigns/{index,[slug]}
│   │   │   ├── styles/global.css
│   │   │   └── env.d.ts
│   │   ├── public/{favicon, robots.txt, rss/styles.xsl}
│   │   └── tests/
│   │       ├── e2e/smoke.spec.ts # 31 specs across desktop + mobile
│   │       └── unit/{seo,readingTime,pagination,og-url}.test.ts
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
| `PUBLIC_BUTTONDOWN_USERNAME`        | Vercel                  | Before the newsletter form accepts subscribers.                       |
| `PUBLIC_SENTRY_DSN`                 | Vercel                  | When you want browser error tracking.                                 |

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

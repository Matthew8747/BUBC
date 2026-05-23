# BUBC Site — Build Progress & Handoff Notes

> Last updated: 2026-05-23 (session 3). Pick up from **"Where we left off"** below.
>
> Related docs: [plan.md](plan.md) (build phases, single source of truth) · [FEATURES.md](FEATURES.md) (idea backlog with status flags + open decisions).

---

## Snapshot

| Layer                                          | State                                                                                                                                                                                  |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo (pnpm)                                | ✅                                                                                                                                                                                     |
| Astro frontend (`apps/web`)                    | ✅ scaffolded · design system + chrome · Sanity wired · home, trial, **all P0 pages** (squads, coaching, boathouse, about+history, committee, welfare, support, 404, contact, privacy) |
| Sanity Studio (`apps/studio`)                  | ✅ v5, project `j7zcx618`, all schemas defined                                                                                                                                         |
| Tooling (ESLint, Prettier, Husky, lint-staged) | ✅                                                                                                                                                                                     |
| CI workflow (GitHub Actions)                   | ✅ lint + typecheck + unit + build + e2e                                                                                                                                               |
| Testing (Vitest + Playwright)                  | ✅ skeleton + **11 smoke specs (22 runs across desktop + mobile)** + 6 unit tests                                                                                                      |
| Vercel                                         | ✅ live at <https://bubc-web.vercel.app/>                                                                                                                                              |
| Cloudflare DNS / email                         | ⏸ deferred to launch (Phase 6)                                                                                                                                                         |
| Cloudflare Web Analytics                       | ⏸ ready to wire (beacon code in BaseLayout, gated on env var)                                                                                                                          |
| Formspree                                      | ⏸ account ready; form ID needs adding to Vercel env                                                                                                                                    |
| Sanity Studio deploy                           | ❌ not deployed (manual `pnpm --filter @bubc/studio deploy`)                                                                                                                           |
| Custom domain on prod                          | ❌ Phase 6 cutover                                                                                                                                                                     |
| Photos                                         | ⏸ being gathered; placeholder system covers the gap                                                                                                                                    |
| Build / typecheck / lint / format / unit / e2e | ✅ all green                                                                                                                                                                           |

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

## Where we left off — Phase 4 next

Phase 3 P0 is complete. Phase 4 dynamic content is the obvious next move:

### Immediate next steps (in order)

#### T28 — News index + post template + RSS

- `/news/` paginated index, category filtering
- `/news/[slug].astro` post template (heroImage, PortableText body, related athletes/squads, share)
- `/news/rss.xml` feed via `@astrojs/rss` (not yet installed — 10-min add)
- Sanity webhook → Vercel deploy hook so editors see posts within ~60s

#### T29 — Pagefind static search

- Global `/` keyboard shortcut to open search
- Index covers posts, athletes, boats, squads

#### T30 — Henley Honours

- `/about/henley-honours/` — sortable table by year, full crew lists, opposition, finish

#### T31 — Olympians & Internationals

- `/about/olympians/` index + `/about/olympians/[slug]/` detail
- Decision locked: schema extends to `alumniProfile` with category enum — implement when this lands

#### After Phase 4

- T32 Fleet visualiser SVG
- T33 Campaign thermometer (component already built — needs `/support/campaigns/` listing + detail pages)
- T34 OG image generation with satori
- T35 Structured data injection
- Sponsor index page (P1)
- Alumni section (P1) — `/alumni/`, `/alumni/meles/`, `/alumni/events/`

### Backlog decisions still open

See [FEATURES.md § Decision queue — Still open](FEATURES.md). The unblocked items waiting for user input:

- **C4** — Parent info page (Cambridge-style). Same structured-page approach as "What's it like"?
- **C7** — Inclusion & accessibility: section of `/welfare/` (currently is) or its own page?
- **R5** — Live race tracker: banner-only or hosted embed?
- **A6** — Newsletter: Buttondown vs Beehiiv (recommendation: Buttondown).
- **W2** — Erg leaderboard: source + maintainer commitment.
- **F5** — Sponsorship pack PDF — needs draft content from the club.
- **F6** — Erg-athon / Crew Boat Race templates — only when a real event is scheduled.

---

## Manual interventions still required

| #       | Item                                                                                                                                                                                                                             | Why it's manual                                                                 | When                                                                               |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **M1**  | Add Vercel env vars: `SANITY_PROJECT_ID=j7zcx618`, `SANITY_DATASET=production`                                                                                                                                                   | Per-project secrets                                                             | Now (otherwise Sanity queries return null and pages render with placeholders only) |
| **M2**  | Create a Formspree form, then set `PUBLIC_FORMSPREE_TRIAL_ID=<formId>` on Vercel                                                                                                                                                 | Per-project secret                                                              | Before /squads/trial/ accepts real submissions                                     |
| **M3**  | Cloudflare Web Analytics: <https://dash.cloudflare.com> → Web Analytics → Add site → Manual setup. Copy the token (the part inside `data-cf-beacon='{"token":"…"}'`). Set `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=<token>` on Vercel. | Per-project secret                                                              | Whenever — works on `*.vercel.app`                                                 |
| **M4**  | Deploy Sanity Studio: `pnpm --filter @bubc/studio deploy`                                                                                                                                                                        | First run is interactive; prompts for studio hostname like `bubc.sanity.studio` | When editors need to log in to add content                                         |
| **M5**  | Add committee editors as Sanity members                                                                                                                                                                                          | sanity.io/manage → Members → invite by email                                    | After M4                                                                           |
| **M6**  | Cloudflare DNS for bubc.co.uk                                                                                                                                                                                                    | Domain registrar nameservers must point at Cloudflare first                     | Phase 6 (launch)                                                                   |
| **M7**  | Cloudflare Email Routing                                                                                                                                                                                                         | Requires #M6 done                                                               | Phase 6                                                                            |
| **M8**  | DNS cutover to Vercel                                                                                                                                                                                                            | Add CNAME in Cloudflare DNS                                                     | Phase 6 (launch day)                                                               |
| **M9**  | Real photography upload to Sanity                                                                                                                                                                                                | User is gathering; placeholders handle the gap                                  | Whenever ready                                                                     |
| **M11** | Seed Sanity with at least one `page` doc per slug used by the site (`history`, `welfare`, future `parent-info` / `whats-it-like`). Each page falls back gracefully when missing, but real copy is the win.                       | Editorial decision + Sanity write                                               | When committee has content                                                         |
| **M12** | Add committee `committeeMember` docs for 2025/26 (and 2026/27 when elected). Without these the `/committee/` page shows a placeholder.                                                                                           | Editorial decision + Sanity write                                               | After committee handover                                                           |
| **M10** | ⚠ **If a Cloudflare Pages project was created by accident**, delete it. Hosting belongs to Vercel; Cloudflare's role is DNS + email + analytics only.                                                                            | Avoid running two hosts in parallel                                             | Now                                                                                |

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
| **`@astrojs/sitemap` integration** | Auto-generates `/sitemap-index.xml`. The plan mentions it but it's not yet installed.                                                                                | 5 min                                                                                  |
| **`@astrojs/rss`**                 | RSS for the news feed (T28).                                                                                                                                         | 10 min when news ships                                                                 |

I haven't added any of these this session because the testing skeleton + CI already cover the most important gaps. Wire them when the matching feature lands.

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
│   │   │   │   ├── layout/       # Header, Footer, PageHero
│   │   │   │   ├── squad/        # TrainingScheduleTable, CoachStrip
│   │   │   │   ├── support/      # DonationThermometer
│   │   │   │   └── ui/           # Button, Card, Container, Eyebrow, Section, Stat, Tag
│   │   │   ├── layouts/          # BaseLayout, PageLayout
│   │   │   ├── lib/              # sanity.ts, queries.ts, types.ts, seo.ts, academicYear.ts
│   │   │   ├── pages/
│   │   │   │   ├── index.astro
│   │   │   │   ├── styleguide.astro
│   │   │   │   ├── 404.astro · contact.astro · privacy.astro · welfare.astro · coaching.astro · committee.astro
│   │   │   │   ├── about/        # index, history
│   │   │   │   ├── boathouse/    # index
│   │   │   │   ├── squads/       # index, trial, [slug]
│   │   │   │   └── support/      # index, donate, buy-a-boat
│   │   │   ├── styles/global.css
│   │   │   └── env.d.ts
│   │   └── tests/
│   │       ├── e2e/smoke.spec.ts # 11 specs across desktop + mobile
│   │       └── unit/seo.test.ts
│   └── studio/                   # @bubc/studio — Sanity Studio v5
│       ├── schemaTypes/{documents,objects,singletons}/
│       ├── structure.ts
│       └── sanity.config.ts
├── docs/{plan.md, PROGRESS.md, FEATURES.md}
├── eslint.config.mjs / .prettierrc / .prettierignore
└── package.json / pnpm-workspace.yaml
```

---

## Commands reference

```bash
# Dev
pnpm dev                 # Astro dev server → http://localhost:4321
pnpm studio              # Sanity Studio dev → http://localhost:3333

# Build / preview
pnpm build               # production build of apps/web
pnpm preview             # serve production build locally

# Quality
pnpm lint                # ESLint across monorepo
pnpm lint:fix
pnpm format              # prettier --write
pnpm format:check
pnpm typecheck           # astro check + tsc

# Tests
pnpm test:unit           # Vitest
pnpm test:e2e            # Playwright (auto-starts preview server)
pnpm test                # both

# Studio (from apps/studio)
pnpm deploy              # deploy Studio to bubc.sanity.studio (first run sets hostname)
pnpm typegen             # generate TS types from schemas
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
| [apps/web/playwright.config.ts](../apps/web/playwright.config.ts)                                                         | Playwright config                                       |
| [apps/web/vitest.config.ts](../apps/web/vitest.config.ts)                                                                 | Vitest config                                           |
| [.github/workflows/ci.yml](../.github/workflows/ci.yml)                                                                   | CI pipeline                                             |

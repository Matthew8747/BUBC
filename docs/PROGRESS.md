# BUBC Site — Build Progress & Handoff Notes

> Last updated: 2026-05-22. Pick up from **"Where we left off"** below.

---

## Snapshot

| Layer                                          | State                                          |
| ---------------------------------------------- | ---------------------------------------------- |
| Monorepo (pnpm)                                | ✅                                             |
| Astro frontend (`apps/web`)                    | ✅ scaffolded · design system + chrome built   |
| Sanity Studio (`apps/studio`)                  | ✅ v5, project `j7zcx618`, all schemas defined |
| Tooling (ESLint, Prettier, Husky, lint-staged) | ✅                                             |
| Build / typecheck / lint                       | ✅ all green                                   |
| Vercel                                         | ❌ not connected (manual)                      |
| Sanity Studio deploy                           | ❌ not deployed (manual)                       |
| Cloudflare DNS / email                         | ❌ (manual)                                    |
| Domain on prod                                 | ❌ (Phase 6)                                   |

---

## What has been built

### T01 — Scaffold Astro + Tailwind + pnpm workspace ✅

- pnpm monorepo at root
- `apps/web` (Astro 6.3.6, strict TS, Tailwind v4 via `@tailwindcss/vite`)
- `apps/studio` (Sanity v5)
- Root scripts: `pnpm dev` / `build` / `preview` / `studio` / `lint` / `format` / `typecheck`

### T02 — Sanity Studio scaffold ✅

- `apps/studio` — Sanity v5.26 + React 19 + styled-components
- Project ID `j7zcx618`, dataset `production` (read from env with hard-coded fallback)
- `apps/studio/.env.example` documents required vars
- **Studio consolidation:** the original v3 placeholder folder was replaced with the v5 init that has the real project ID. There is now exactly one studio folder.

### T03 — Tooling ✅

- ESLint 9 flat config at repo root (`eslint.config.mjs`) — covers TS, Astro, and Prettier compatibility
- Prettier 3 with Astro plugin (`.prettierrc`); per-folder override so `apps/studio` keeps its v5-init formatting conventions (no semis, no bracket spacing)
- `.prettierignore` for build outputs and generated Sanity types
- Husky v9 wired at root `.husky/` (re-runs on `pnpm install` via `prepare`)
- `lint-staged` runs ESLint + Prettier on staged files

### T05 — Brand tokens, fonts, base layout ✅

- `apps/web/src/styles/global.css` — full design tokens (colour, typography, space, radius, shadow, layout) declared via Tailwind v4's `@theme`
- Self-hosted variable fonts via `@fontsource-variable/{fraunces,geist,geist-mono}` (subset by the bundler at build time; full self-hosting, no Google Fonts CDN)
- Base styles: focus-visible gold outline, skip-link, reduced-motion override, `.prose` editorial styles, tabular numerals utility
- `apps/web/src/layouts/BaseLayout.astro` — `<head>`, OG/Twitter meta, canonical, theme-color, skip-link, slot
- `apps/web/src/layouts/PageLayout.astro` — wraps BaseLayout + Header + `<main>` + Footer
- `apps/web/src/lib/seo.ts` — `resolveSeo()` helper + `SITE` constants

### T06 — UI primitives ✅

All in `apps/web/src/components/ui/`:

- `Button.astro` — solid · ghost · gold variants; sm/md/lg sizes; renders `<a>` if `href` is passed, otherwise `<button>`
- `Tag.astro` — small-caps category label; navy/gold/blade/paper tones
- `Stat.astro` — big-number stat with optional suffix; gold divider above; tabular numerals
- `Card.astro` — base hover-card with whole-card-link overlay pattern
- `Container.astro` — max-width wrapper (prose / narrow / wide)
- `Section.astro` — vertical-rhythm wrapper with paper/bone/navy/ink tones and sm/md/lg spacing
- `Eyebrow.astro` — short kicker line with hairline divider

### T07 — Header ✅

`apps/web/src/components/layout/Header.astro`:

- Sticky; adds `backdrop-blur` + paper translucent background once scrolled past 8px (toggled in inline `<script>`)
- Active-page indicator (gold underline) — uses `Astro.url.pathname` with prefix-match
- Desktop: 6-item primary nav + utility links + gold CTA
- Mobile: hamburger → full-screen navy overlay; ESC to close; focus management; scroll lock applied while open

### T08 — Footer ✅

`apps/web/src/components/layout/Footer.astro`:

- Dark navy bg, paper text
- Thin sponsor-partner strip above main columns
- 4-column grid: Club · Row · Support · Connect
- Copyright + charity-number line + secondary nav (Welfare/Privacy/RSS)

### T09 — Styleguide page ✅

`apps/web/src/pages/styleguide.astro`:

- All colour swatches (9 colours with hex + token name)
- Type scale (display 5xl → xl, body, mono)
- Button variants × sizes (including disabled)
- Tags and Eyebrows
- Stat strip on dark ink
- Card grid example with hover affordance
- Prose example with lead paragraph and blockquote
- Container width demos

The home page (`/`) is also a real-world test of the chrome — uses PageLayout, hero copy, stat strip.

### T10–T15 — Sanity schemas ✅

**Reusable objects** (`apps/studio/schemaTypes/objects/`)

- `imageBlock` — image with **required alt text** + decorative toggle + caption + credit (T15 alt-text enforcement lives here)
- `seo` — meta title, description, social image, noIndex
- `linkBlock` — label + URL + open-in-new-tab
- `ctaBlock` — label + link + solid/ghost variant
- `statBlock` — value + label + suffix
- `portableText` — editorial body content: h2/h3/h4/blockquote, lists, lead decorator, link annotation, embedded `imageBlock`, video embed

**Singletons** (`apps/studio/schemaTypes/singletons/`)

- `settings` — siteTitle, contact, address, boathouse coords, primary/utility nav, header CTA, footer columns, footer note, social links
- `homePage` — hero, stat strip, featured news, squad pathway, sponsor strip, closing CTAs, SEO

**Documents** (`apps/studio/schemaTypes/documents/`)

- `page` — generic landing page (welfare, press, blazers etc.)
- `squad` — name, tier, gender, captain, captain bio, coaches, training schedule (sessions array), expected standards, achievements, photos
- `coach` — name, role, order, photo, bio, qualifications, email
- `committeeMember` — name, role, order, academic year, photo, course, email, bio
- `athlete` — full profile (height, weight, hometown, prev club, 2k/5k PBs, achievements) + opt-in `showOnPublicSite` flag
- `chair` — past chairs with year range and bio
- `olympian` — bubcYears, olympic appearances (year/host/event/medal/place), story, current role
- `boat` — make, class, weight, year, donor, story, photo, current crew (athlete refs), status, naming date, boathouse bay number
- `boatForSale` — buy-a-boat targets with price range, status, priority
- `sponsor` — logo, website, tier (headline/gold/silver/supporter), since, showOnHome
- `campaign` — fundraising campaign with goal/raised/donor counts, story, gallery, donate URL
- `newsPost` — title, slug, publish date, author, category ref, hero image, excerpt (200 char limit), portable text body, related athletes/squads/result, SEO
- `category` — news category lookup
- `event` — regatta/head/camp/social/alumni/fundraiser, dates, location, description, register URL
- `regattaResult` — regatta, year, event, crew, athletes, cox, coach, finish, time, video, photos, notes
- `henleyHonour` — Henley-specific result (HRR or HWR) with seat-by-seat crew list

**Structure** (`apps/studio/structure.ts`)

- Custom left-nav: singletons at top, then News & events / Squads & people / Heritage / Boats / Fundraising / Pages
- Singleton enforcement in `sanity.config.ts` — `settings` and `homePage` can't be duplicated or deleted, and are hidden from the "New document" menu

### Other

- `apps/studio/README.md` rewritten with real BUBC documentation (auth gotcha included)
- Stray `test.py` removed from repo root
- All TS strict, all builds green: `pnpm build`, `pnpm typecheck`, `pnpm lint` — 0 errors

---

## Where we left off — Phase 3 next (Sanity-driven pages)

Design system + chrome + full schemas are done. **Phase 1 ✅ · Phase 2 ✅**. Next up: wire the web app to read from Sanity, then start building the P0 content pages.

### Immediate next steps (in order)

#### T04 — Vercel auto-deploy (⚠ manual)

1. Push the repo to a new private GitHub repo (e.g. `bubc/bubc-site`).
2. <https://vercel.com/new> → Import Git Repository.
3. **Root Directory:** `apps/web`. Framework auto-detects as Astro.
4. Add env vars (none needed yet for Phase 3.0, but add `SANITY_PROJECT_ID` and `SANITY_DATASET` when you reach T16).
5. Confirm preview deploys work on a feature branch.

#### T16 — Wire Sanity client into apps/web

Once Vercel is up:

- `pnpm --filter @bubc/web add @sanity/client @sanity/image-url`
- Create `apps/web/.env`:
  ```
  SANITY_PROJECT_ID=j7zcx618
  SANITY_DATASET=production
  ```
- Add `apps/web/src/lib/sanity.ts` — exports a client, an image URL builder, and helpers
- Add `apps/web/src/lib/queries.ts` — GROQ queries
- Run `pnpm --filter @bubc/studio typegen` once schemas have been validated by the editor → copies types into the studio. We'll mirror them into a shared location later if it becomes painful.

#### T17–T19 — Home page (Sanity-driven)

- Hero pulls from `homePage.hero*`
- Stat strip pulls from `homePage.stats`
- News rail from `*[_type == "newsPost"] | order(publishDate desc)[0..2]`
- Sponsor strip from sponsors with `showOnHome == true`
- Closing CTAs from `homePage.closingCtas`

#### T20–T22 — Squads + Trial + Coaching

- `/squads/` index, plus `/squads/[slug]/` detail
- `/squads/trial/` — Formspree form (sign up at <https://formspree.io>, get form ID, drop in)
- `/coaching/` from coach docs ordered by `order` field

#### T23–T27 — Remaining P0 pages

Boathouse · About + History · Committee · Welfare · Donate · Buy-a-Boat — all from existing schemas.

#### T28–T29 — News + search

News index, post template, RSS, Pagefind search.

---

## Manual interventions still required

| #      | Item                                                                               | Why it's manual                                                            |
| ------ | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **M1** | Push repo to GitHub                                                                | Needs the user's GitHub account/credentials                                |
| **M2** | Connect Vercel to the repo (T04)                                                   | Account-level setup                                                        |
| **M3** | Deploy Sanity Studio to `bubc.sanity.studio` (`pnpm --filter @bubc/studio deploy`) | First run prompts for studio hostname — interactive                        |
| **M4** | Add committee editors as Sanity members                                            | sanity.io/manage → Members                                                 |
| **M5** | Cloudflare DNS + email routing for `info@`, `captain.m@` etc.                      | Account-level setup                                                        |
| **M6** | Buy a Formspree free-tier form (T21)                                               | Account-level setup                                                        |
| **M7** | Final DNS cutover to Vercel (Phase 6)                                              | Affects live site                                                          |
| **M8** | Source real photography (Phase 3)                                                  | User mentioned the club owns the photos — needs hi-res originals copied in |
| **M9** | Decide charity number / welfare officer name (open questions §11)                  | Committee input                                                            |

---

## Repo structure (current)

```
bubc-site/
├── apps/
│   ├── web/                    # @bubc/web — Astro 6 frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── layout/     # Header, Footer
│   │   │   │   └── ui/         # Button, Tag, Stat, Card, Container, Section, Eyebrow
│   │   │   ├── layouts/        # BaseLayout, PageLayout
│   │   │   ├── lib/            # seo.ts (sanity.ts, queries.ts next)
│   │   │   ├── pages/          # index.astro, styleguide.astro
│   │   │   └── styles/         # global.css (tokens + base + prose)
│   │   ├── astro.config.mjs
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── studio/                 # @bubc/studio — Sanity Studio v5
│       ├── schemaTypes/
│       │   ├── documents/      # 15 document types
│       │   ├── objects/        # 6 reusable objects (imageBlock enforces alt)
│       │   ├── singletons/     # settings, homePage
│       │   └── index.ts        # registry + SINGLETON_TYPES export
│       ├── sanity.config.ts    # reads env, hides singletons from new-doc menu
│       ├── sanity.cli.ts
│       ├── structure.ts        # custom left-nav
│       ├── .env.example
│       └── README.md
│
├── docs/
│   ├── plan.md                 # full development plan (single source of truth)
│   └── PROGRESS.md             # this file
│
├── .husky/pre-commit           # runs lint-staged
├── .prettierrc / .prettierignore
├── eslint.config.mjs           # flat config; root for monorepo
├── package.json                # root workspace + lint-staged config
├── pnpm-workspace.yaml
└── .gitignore
```

---

## Commands reference

```bash
# From repo root
pnpm dev              # Astro dev server  → http://localhost:4321
pnpm build            # production build of apps/web
pnpm preview          # serve production build locally
pnpm studio           # Sanity Studio dev → http://localhost:3333

pnpm lint             # ESLint across monorepo
pnpm lint:fix         # auto-fix
pnpm format           # prettier --write .
pnpm format:check     # prettier --check .
pnpm typecheck        # astro check (web) + tsc --noEmit (studio)

# From apps/studio
pnpm deploy           # deploy Studio to bubc.sanity.studio (first run sets hostname)
pnpm typegen          # generate TS types from schemas
pnpm manage           # open sanity.io/manage for this project
```

---

## Environment variables

| Var                         | Where used             | How to get it                                        |
| --------------------------- | ---------------------- | ---------------------------------------------------- |
| `SANITY_STUDIO_PROJECT_ID`  | `apps/studio/.env`     | `j7zcx618` (already in sanity.config.ts as fallback) |
| `SANITY_STUDIO_DATASET`     | `apps/studio/.env`     | `production`                                         |
| `SANITY_PROJECT_ID`         | `apps/web/.env` (T16+) | `j7zcx618`                                           |
| `SANITY_DATASET`            | `apps/web/.env` (T16+) | `production`                                         |
| `PUBLIC_FORMSPREE_TRIAL_ID` | `apps/web/.env` (T21)  | Created at <https://formspree.io>                    |

> Sanity auth gotcha: the CLI must be authenticated with the user's **GitHub** account, not Google. If `pnpm --filter @bubc/studio deploy` fails with "project ID not found", run `npx sanity logout` then `npx sanity login` and pick **Continue with GitHub**.

---

## Key files to know

| File                                                                                              | Purpose                                                 |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [docs/plan.md](plan.md)                                                                           | Full development plan — single source of truth          |
| [apps/web/astro.config.mjs](../apps/web/astro.config.mjs)                                         | Astro config (site URL, integrations, redirects)        |
| [apps/web/src/styles/global.css](../apps/web/src/styles/global.css)                               | Tailwind v4 import + brand tokens + base styles + prose |
| [apps/web/src/layouts/BaseLayout.astro](../apps/web/src/layouts/BaseLayout.astro)                 | `<head>`, SEO, skip link                                |
| [apps/web/src/layouts/PageLayout.astro](../apps/web/src/layouts/PageLayout.astro)                 | BaseLayout + Header + Footer chrome                     |
| [apps/web/src/components/layout/Header.astro](../apps/web/src/components/layout/Header.astro)     | Sticky header + mobile menu                             |
| [apps/web/src/components/layout/Footer.astro](../apps/web/src/components/layout/Footer.astro)     | Site footer                                             |
| [apps/web/src/pages/styleguide.astro](../apps/web/src/pages/styleguide.astro)                     | Living component reference                              |
| [apps/studio/sanity.config.ts](../apps/studio/sanity.config.ts)                                   | Studio config (env-driven, singleton enforcement)       |
| [apps/studio/structure.ts](../apps/studio/structure.ts)                                           | Studio left-nav                                         |
| [apps/studio/schemaTypes/index.ts](../apps/studio/schemaTypes/index.ts)                           | Schema registry (`SINGLETON_TYPES` set used by config)  |
| [apps/studio/schemaTypes/objects/imageBlock.ts](../apps/studio/schemaTypes/objects/imageBlock.ts) | T15 alt-text enforcement lives here                     |
| [eslint.config.mjs](../eslint.config.mjs)                                                         | ESLint flat config                                      |
| [.prettierrc](../.prettierrc)                                                                     | Prettier with Astro plugin + per-folder override        |
| [.husky/pre-commit](../.husky/pre-commit)                                                         | Pre-commit hook                                         |

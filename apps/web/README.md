# @bubc/web — bubc.co.uk frontend

The public website for the University of Bath Boat Club. A static [Astro](https://astro.build) site styled with Tailwind v4, with all editorial content pulled from the Sanity CMS (`apps/studio`) at build time and deployed to Vercel.

There is no server or database — every page is pre-rendered to static HTML on each build, then served from Vercel's CDN.

## Quick start

```bash
# From the repo root
cp apps/web/.env.example apps/web/.env   # fill in SANITY_PROJECT_ID + SANITY_DATASET
pnpm --filter @bubc/web dev
```

Open <http://localhost:4321>. With no Sanity env vars set, pages render sensible placeholder content rather than failing.

## Project structure

```text
src/
├── components/   # UI, layout, content, news, squad, home, search, seo, support
├── layouts/      # BaseLayout, PageLayout
├── lib/          # sanity client, GROQ queries, types, SEO, OG image generation
├── pages/        # file-based routes (the URL structure)
└── styles/       # global.css (Tailwind v4 @theme tokens)
public/           # favicon, robots.txt, RSS stylesheet
tests/            # Vitest unit tests + Playwright e2e
```

Content is fetched via GROQ in `src/lib/queries.ts`; result shapes are mirrored in `src/lib/types.ts`. Most pages fall back to placeholder content when a query returns nothing, so the site is never blank.

> **Tailwind v4 note:** reference theme colours with the paren shorthand — `text-(--color-paper)`, `bg-(--color-navy)` — never the v3 bracket form `text-[--color-paper]`, which silently no-ops in v4. Colour tokens live in `src/styles/global.css` under `@theme`.

## Commands

```bash
pnpm dev          # dev server → http://localhost:4321
pnpm build        # production build to ./dist (chains the pagefind search index)
pnpm preview      # serve the production build locally
pnpm typecheck    # astro check + tsc
pnpm test         # unit (Vitest) + e2e (Playwright)
```

## Where to look next

- **Editing content:** [`docs/EDIT-CHECKLIST.md`](../../docs/EDIT-CHECKLIST.md) and [`docs/CONTENT-EDITING.md`](../../docs/CONTENT-EDITING.md).
- **Deploy / env / webhook:** [`docs/DEPLOYMENT.md`](../../docs/DEPLOYMENT.md).
- **Architecture & URL map:** [`docs/plan.md`](../../docs/plan.md) (or query `graphify-out/`).

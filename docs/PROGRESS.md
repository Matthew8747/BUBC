# BUBC Site — Current State & Launch Checklist

> The site is built and deployed to a Vercel preview. This doc tracks **current state** and the **remaining manual steps to go live**. (The per-session build history was removed once the build was complete — see git history if you need it.)
>
> Related: [HANDOVER.md](HANDOVER.md) (committee orientation) · [DEPLOYMENT.md](DEPLOYMENT.md) (deploy + webhook + env) · [SECURITY.md](SECURITY.md) · [EDIT-CHECKLIST.md](EDIT-CHECKLIST.md) (where to edit what) · [FEATURES.md](FEATURES.md) (open backlog).

## Current state

| Area              | State                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Astro frontend    | ✅ All pages built. Design system, chrome, news/RSS/search, OG images, 301 redirects, JSON-LD.                         |
| Sanity Studio     | ✅ Schemas complete (project `j7zcx618`, dataset `production`). Content populated and being edited directly in Studio. |
| Hosting           | ✅ Live on the Vercel preview at <https://bubc-web.vercel.app/>. Auto-deploys on push to `main`.                       |
| Build / typecheck | ✅ Green.                                                                                                              |
| Newsletter        | ⏸ Buttondown — code ready, needs `PUBLIC_BUTTONDOWN_USERNAME`.                                                         |
| Trial form        | ⏸ Formspree — code ready, needs `PUBLIC_FORMSPREE_TRIAL_ID`.                                                           |
| Sanity → Vercel   | ⏸ Deploy webhook documented in DEPLOYMENT.md, not yet wired.                                                           |
| Custom domain     | ❌ `bubc.co.uk` not yet pointed at Vercel (launch-day cutover).                                                        |

## Recent additions (2026-05-29)

- **Photo lightbox** — `PhotoGallery` thumbnails open a full-screen, keyboard-accessible viewer (Esc / backdrop to close, prev / next, arrow keys, caption + credit shown). Used on squad pages, the PDA page, and the boathouse galleries.
- **Editable squad gallery** — squad docs now have **Gallery heading** + **Gallery intro** fields (replaces the hard-coded "The season so far."). Add a caption to any gallery photo (e.g. "BUCS gold, 2024") and it shows when enlarged — use this for medal / past-season photos.
- **Boathouse & STV photos** — new **Site settings → Boathouse & STV** group: _Boathouse photos_ (facilities section) and _STV photos_ (land-training section).
- **PDA gallery** — the static `/squads/pda/` page now pulls editable photos from the **PDA squad doc** (slug `pda`).
- **Boathouse copy** — removed the on-site erg suite / weights room (they live at the STV, not the boathouse); honest facilities bullets + an STV cross-reference. New-boathouse capital project section confirmed accurate and kept.
- **`novice@bubc.co.uk`** added to the Contact page.
- **Events page** — new `/events/` lists every upcoming event (regattas, heads, camps, socials, fundraisers, alumni) + a recent archive, from the `event` schema. Linked in the header nav and footer; the legacy `/events/` → `/alumni/events/` redirect was removed so the page is reachable (map updated in [plan.md](plan.md) §1).
- **Footer sponsors** — the footer "partners" strip now reads `sponsor` docs from Sanity (ordered by tier, linked to each website), falling back to the core partners when none exist.
- **Thermometer on /support/** — the support landing now features the active campaign with the live `DonationThermometer` (already present on the campaign list + detail pages).
- **Live campaign totals (Hubbub)** — donation links standardised to `https://bath.hubbub.net/p/BUBC/`. Campaigns gained an optional **Hubbub project URL** field; when set, the thermometer's _raised_ amount + _donor count_ are read live from that Hubbub page at build time (the goal stays manual), falling back to the Sanity figures if the page can't be read. There's no official Hubbub API — the totals are parsed from the project-page HTML (`apps/web/src/lib/hubbub.ts`). A daily `refresh-totals` GitHub Action rebuilds the site so the figures stay current.
- **SEO foundations** — enriched the global `SportsOrganization` JSON-LD in `BaseLayout` with `foundingDate`, `address`, `parentOrganization` (University of Bath), `memberOf` (British Rowing), `contactPoint`, description, and corrected social `sameAs` URLs. Made `og:type` per-page (news posts serve `article`); added `og:image:width/height/alt`, `twitter:site`, `twitter:url`, `twitter:image:alt`. Added a `SportsActivityLocation` + `BreadcrumbList` JSON-LD to `/boathouse/` (with the real geo coordinates — useful for "Bath rowing" / local search) and `FAQPage` JSON-LD on `/squads/trial/` (5 Q&As, eligible for the FAQ rich result in Google). Added `site.webmanifest` for installable PWA hints. Sat on top of the existing baseline: auto sitemap with priorities, `robots.txt` with sitemap reference + AI-crawler blocks, `NewsArticle` JSON-LD on news posts, `BreadcrumbList` on most index pages, canonical URLs, OG + Twitter cards, `lang="en-GB"`, HSTS / strict CSP, schema-enforced alt text, and 301 redirects from legacy WordPress URLs to preserve link equity.

> **CV-ready summary:** _Shipped site-wide technical SEO for bubc.co.uk — schema.org structured data (Organization, SportsActivityLocation, FAQPage, NewsArticle, BreadcrumbList), Open Graph + Twitter card metadata, per-page `og:type`, web app manifest, sitemap with priorities, and `robots.txt` with AI-crawler controls. Preserved link equity via 301 redirects from the legacy WordPress site._

> **Action — redeploy Studio** (`pnpm --filter @bubc/studio deploy`) so editors see the new fields, then: add **Boathouse & STV** photos (Site settings), **squad gallery** photos/headings, **PDA photos** (PDA squad doc), **sponsor** docs (footer strip); and on the **New Boathouse** campaign set the **Donate URL** + **Hubbub project URL** to `https://bath.hubbub.net/p/BUBC/` (the seeded £150k/£500k figures are placeholders — set the real goal). To keep totals fresh, create a Vercel **deploy hook** and add it as the `VERCEL_DEPLOY_HOOK_URL` repo secret (used by `.github/workflows/refresh-totals.yml`). New schema fields are already live in local Studio (`pnpm studio`).

## Launch checklist (remaining manual steps)

Most of these cross dashboards (Vercel / Sanity / Cloudflare) and can't be scripted from the repo. Order is roughly priority.

| #   | Step                                                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Vercel env vars** — confirm `SANITY_PROJECT_ID=j7zcx618` + `SANITY_DATASET=production` are set (Production + Preview).                              |
| 2   | **Formspree** — create a form, set `PUBLIC_FORMSPREE_TRIAL_ID` on Vercel (and `apps/web/.env` to test locally).                                       |
| 3   | **Buttondown** — create an account, set `PUBLIC_BUTTONDOWN_USERNAME` on Vercel.                                                                       |
| 4   | **Deploy Studio** — `pnpm --filter @bubc/studio deploy` (first run sets the `bubc.sanity.studio` hostname), then invite committee editors as members. |
| 5   | **Sanity → Vercel webhook** — wire it so publishes auto-deploy (~60s). Step-by-step in [DEPLOYMENT.md](DEPLOYMENT.md#sanity--vercel-deploy-webhook).  |
| 6   | **PDA squad** — set its **External link** field to `/squads/pda/` in Studio (clears the build's route-conflict warning).                              |
| 7   | **Squad slugs** — fix the `senior-men` / `senior-women` slugs in Studio (remove the trailing `/`).                                                    |
| 8   | **Verified alumni / Henley** — enter the confirmed records (Becky Wilde, Cedol Dafydd + Jamie Gare, etc.) into Sanity by hand.                        |
| 9   | **Content confirmation** — walk committee bios, alumni stories, Henley crew lists, campaign £ figures past the named people before sharing widely.    |
| 10  | **Custom domain** — point `bubc.co.uk` DNS at Vercel, add the domain in Vercel, wait for SSL. Cancel the old WordPress host once verified.            |
| 11  | _(Optional)_ Cloudflare Web Analytics token, Sentry DSN. Tighten the advisory Lighthouse/Pa11y CI jobs to required once baselines settle.             |

> **Public preview without the domain:** the `*.vercel.app` URL is public unless **Deployment Protection** is on (Vercel → Settings → Deployment Protection). Disable it to share for review without a login.

## Commands

```bash
pnpm dev          # Astro dev → http://localhost:4321
pnpm studio       # Sanity Studio dev → http://localhost:3333
pnpm build        # production build (chains the pagefind search index)
pnpm preview      # serve the production build locally
pnpm typecheck    # astro check + tsc
pnpm test         # unit (Vitest) + e2e (Playwright)
pnpm --filter @bubc/studio deploy   # deploy Studio
```

## Environment variables

| Var                                    | Where                   | Required when                                   |
| -------------------------------------- | ----------------------- | ----------------------------------------------- |
| `SANITY_PROJECT_ID` / `SANITY_DATASET` | `apps/web/.env`, Vercel | Always (else pages render placeholder content). |
| `PUBLIC_FORMSPREE_TRIAL_ID`            | `apps/web/.env`, Vercel | Before the trial form accepts submissions.      |
| `PUBLIC_BUTTONDOWN_USERNAME`           | Vercel                  | Before the newsletter form accepts subscribers. |
| `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`    | Vercel                  | Optional — Cloudflare Web Analytics.            |
| `PUBLIC_SENTRY_DSN`                    | Vercel                  | Optional — browser error tracking.              |

> **Sanity auth gotcha:** the CLI must be authenticated with the **GitHub** account, not Google. If you see "project ID not found", run `npx sanity logout && npx sanity login` → Continue with GitHub.

# Deployment

> The technical handover for whoever is doing dev work on the site after the current maintainer. If you're a non-developer committee member looking to edit content, read [CONTENT-EDITING.md](CONTENT-EDITING.md) instead. For an audience-agnostic orientation across the whole stack, read [HANDOVER.md](HANDOVER.md) first. For publishing the Sanity Studio to a hosted URL editors can visit, see [STUDIO-HOSTING.md](STUDIO-HOSTING.md).

## TL;DR

- **Hosting**: Vercel (free tier). Connected to GitHub. Auto-deploys on push to `main`. Preview deploys on every PR.
- **Domain**: `bubc.co.uk`. DNS will move to Cloudflare on launch; until then the site is at <https://bubc-web.vercel.app/>.
- **CMS**: Sanity (free tier). Project ID `j7zcx618`. Studio at `bubc.sanity.studio` once deployed.
- **Cache busting**: Pushing to `main` triggers a redeploy. Editor-driven content updates trigger a redeploy via a webhook (set up below).
- **Secrets**: all environment variables live in Vercel project settings; never check them into the repo.

---

## Architecture

```
GitHub (main) ──push──▶ Vercel ──build──▶ static dist/ ──CDN──▶ visitors
                          ▲
                          │ deploy hook (POST)
                          │
Sanity ──webhook on publish──┘
```

There is no server. Astro builds the entire site at deploy time, pulls every page from Sanity's GROQ API during that build, and writes static HTML/CSS/JS to `dist/`. Vercel serves that directly from its CDN.

The implication: a content change in Sanity doesn't show up on the live site until a redeploy happens. We close that gap with the Sanity → Vercel webhook below — turning "publish" into a ~60-second deploy.

---

## Vercel

### Project setup

- Build command: `pnpm --filter @bubc/web build`
- Output directory: `apps/web/dist`
- Install command: `pnpm install --frozen-lockfile`
- Root directory: `apps/web` (Vercel auto-detected) — but the install step runs at the monorepo root so workspace deps resolve.
- Node version: 22+ (set in Vercel project → General → Node.js Version).

### Environment variables

Set these in Vercel → Project → Settings → Environment Variables. Apply to **Production**, **Preview**, and **Development** unless noted.

| Name                                | Value                                   | Notes                                                                                             |
| ----------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `SANITY_PROJECT_ID`                 | `j7zcx618`                              | Hard-coded fallback in client; setting it is preferred.                                           |
| `SANITY_DATASET`                    | `production`                            | `development` for preview branches once two-dataset.                                              |
| `PUBLIC_FORMSPREE_TRIAL_ID`         | `<formId from Formspree>`               | Trial form. Without this it renders a "not configured" notice.                                    |
| `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` | `<token from Cloudflare Web Analytics>` | Optional. No-op if unset.                                                                         |
| `PUBLIC_BUTTONDOWN_USERNAME`        | `<your-buttondown-username>`            | Newsletter signup. Without this the footer + post-page forms render a "not configured" notice.    |
| `PUBLIC_SENTRY_DSN`                 | `https://…@oNNN.ingest.sentry.io/PROJ`  | Optional browser error tracking. When unset the entire @sentry/browser chunk is tree-shaken away. |
| `SANITY_API_READ_TOKEN`             | (only if drafts/preview later)          | Not required for production builds.                                                               |

### Redeploys

- **Push to `main`** — always redeploys production.
- **Push to any branch / open a PR** — produces a preview URL.
- **Sanity publish** — fires a deploy hook (see next section).
- **Manual rollback** — Vercel → Deployments → previous deploy → "Promote to Production".

---

## Sanity → Vercel deploy webhook

This is the bit that closes the "editor publishes a post, when does it appear?" gap. Without it, editors wait until the next git push. With it, they wait ~60 seconds.

### 1. Create the Vercel deploy hook

1. Vercel → Project → Settings → Git → **Deploy Hooks**.
2. Click "Create Hook".
3. Name: `Sanity content publish`. Branch: `main`.
4. Copy the resulting URL — it looks like `https://api.vercel.com/v1/integrations/deploy/prj_xxx/yyy`. Treat it as a secret (anyone with this URL can trigger a deploy).

### 2. Add the webhook in Sanity

1. <https://www.sanity.io/manage> → select project `j7zcx618` → **API** → **Webhooks** → **Create webhook**.
2. Name: `Vercel deploy on publish`.
3. URL: paste the deploy hook URL.
4. Dataset: `production`.
5. Trigger on: `Create`, `Update`, `Delete`.
6. Filter (GROQ): leave empty to fire on any document change. Optionally narrow to publishable content only:
   ```groq
   _type in [
     "newsPost",
     "squad",
     "coach",
     "committeeMember",
     "boat",
     "campaign",
     "henleyHonour",
     "olympian",
     "page",
     "settings",
     "homePage",
     "category",
     "sponsor",
     "boatForSale"
   ]
   ```
7. HTTP method: `POST`. No headers, no body. Vercel accepts the empty POST and runs a deploy.
8. Save.

### 3. Verify

Publish a small change in the Studio (e.g. tweak the homePage hero subhead). Watch Vercel → Deployments — a new build should kick off within seconds, complete in under 2 minutes, and the change should be live at the production URL.

### Cost note

Vercel's free Hobby tier counts deploy invocations against a monthly limit (currently 100/day on Hobby). The webhook will burn through that fast if editors publish frequently. If/when this becomes an issue:

- Add a 60-second debounce: GitHub Action that batches webhooks. (For another day.)
- Upgrade to Pro (~$20/mo). Hopefully not necessary.

---

## Daily rebuild — Hubbub fundraising totals

The donate / campaign pages show live Hubbub figures (amount raised + donor count). Hubbub has **no public API**, so `apps/web/src/lib/hubbub.ts` reads those two numbers from the Hubbub project page's server-rendered markup **at build time**. That means the totals only move when the site rebuilds — a Sanity publish or a git push will refresh them, but if nothing is published for a week the numbers sit still.

`.github/workflows/refresh-totals.yml` closes that gap by triggering a rebuild once a day (06:17 UTC). **It no-ops until you give it a deploy hook to call**, which is why totals currently look stuck.

### One-time setup

1. **Deploy hook** — reuse the one from the Sanity webhook above, or create a fresh one: Vercel → Project → Settings → Git → **Deploy Hooks** → Create Hook, branch `main`. Copy the URL.
2. **GitHub secret** — GitHub → repo → Settings → Secrets and variables → **Actions** → New repository secret. Name `VERCEL_DEPLOY_HOOK_URL`, value = the hook URL. Treat it as secret (anyone with it can trigger a deploy).
3. **Verify** — GitHub → Actions → "Refresh campaign totals" → Run workflow. It should POST the hook and print `Triggered a Vercel rebuild.` (not the "skipping" message), and a build should appear in Vercel.

> No scraper-as-a-service (e.g. maxun) is needed — the totals reader already works; it just needs something to trigger the daily rebuild.

---

## Cloudflare

Cloudflare's role in the BUBC stack is **DNS + Email Routing + Web Analytics**. Not hosting. Don't create a Cloudflare Pages project — that would be a competing host.

### Web Analytics (do this now)

1. <https://dash.cloudflare.com> → Web Analytics → Add a site.
2. Choose "Manual installation" (works on any host, including `*.vercel.app`).
3. Copy the token from the snippet (the part inside `data-cf-beacon='{"token":"..."}'`).
4. Set `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` on Vercel.
5. Redeploy. The beacon code in `BaseLayout.astro` will start firing.

### DNS + Email (at launch)

Deferred until launch day. Process:

1. At the domain registrar (whoever holds `bubc.co.uk`), point nameservers at Cloudflare.
2. In Cloudflare, set up Email Routing for `info@`, `captain.m@`, `captain.w@`, `treasurer@`, `welfare@`, `alumni@`, `sponsorship@` — each forwards to a committee personal address.
3. In Cloudflare DNS, add a `CNAME @ cname.vercel-dns.com` (or A records — Vercel will tell you what to add when you attach the custom domain).
4. In Vercel → Domains, add `bubc.co.uk` and `www.bubc.co.uk`. Wait for SSL.

---

## Security headers

Configured in [`vercel.json`](../vercel.json) at the repo root. Vercel applies these headers to every response. Read [`docs/SECURITY.md`](SECURITY.md) for the full threat model + rationale.

Highlights:

- **Content-Security-Policy** — `default-src 'self'`, with a tight allow-list for Sanity CDN, Cloudflare Insights, Sentry ingest, Formspree, Buttondown, YouTube/Vimeo iframes, and OpenStreetMap.
- **Strict-Transport-Security** — 2-year max-age, `includeSubDomains`, `preload`.
- **X-Frame-Options** `DENY`, **X-Content-Type-Options** `nosniff`, **Referrer-Policy** `strict-origin-when-cross-origin`, **Permissions-Policy** denying camera/mic/geolocation/payment.
- **COOP/CORP** `same-origin` site-wide, with `cross-origin` overrides for `/og/*.png` and `/fonts/*` so OG cards remain embeddable.

If you add a new external dependency (a script, a CMS, an image host), **update the CSP first**, push to a preview deploy, verify no CSP-violation console errors, then merge to main. Otherwise resources will be silently blocked in production.

The `Playwright` security-headers smoke spec **skips when run locally** — `vercel.json` is honoured only by Vercel, not the local `http-server` preview.

## Rollback procedure

Every deploy is immutable on Vercel. Worst case (a regression goes live, the editor can't fix it themselves):

1. Vercel → Deployments.
2. Find the last known-good deploy.
3. Click `…` → "Promote to Production".
4. Within seconds the previous build is live.

If the regression is content-side (someone hit Publish on a half-finished post), the editor can also un-publish or revert in Sanity's history; the next build will pick that up. The webhook will redeploy automatically once they save.

---

## Local development

```bash
# Once
pnpm install

# Dev server (Astro)
pnpm dev               # → http://localhost:4321

# Sanity Studio
pnpm studio            # → http://localhost:3333

# Production build (matches what Vercel runs)
pnpm build && pnpm preview
```

`.env.local` for the web app lives at `apps/web/.env.local`. Copy from `apps/web/.env.example` and fill in. The same env vars Vercel uses, just locally scoped.

---

## CI

`.github/workflows/ci.yml` runs on every PR and push to main:

- `pnpm install` (cached)
- `pnpm lint` + `pnpm format:check`
- `pnpm typecheck` (astro check + studio tsc)
- `pnpm test:unit` (Vitest)
- `pnpm build` (chains pagefind indexer + OG image generation)
- `pnpm test:e2e` (Playwright against the build output)
- `pnpm test:lhci` (Lighthouse CI — **advisory**, doesn't block merges)
- `pnpm test:a11y` (Pa11y CI across 24 URLs — **advisory**, doesn't block merges)

PRs that fail lint, typecheck, unit, build, or e2e are blocked. Lighthouse + Pa11y run with `continue-on-error: true` for the first two weeks of running while baselines settle; after that, remove `continue-on-error` in `ci.yml` and tighten the thresholds in `apps/web/.lighthouserc.json` / `.pa11yci.json` to make them required.

Local pre-push hook runs the same lint + typecheck so CI rarely catches anything pre-push fails on.

## Build pipeline

`pnpm build` chains three steps:

1. **`astro build`** — renders every page, runs `getStaticPaths` everywhere (which fans out into Sanity for news/squads/olympians/boats/campaigns/alumni profiles), and writes static HTML + assets to `apps/web/dist/`. The `/og/[slug].png.ts` endpoint executes once per slug here — that's where the satori-driven OG cards get materialised into the build output.
2. **`pnpm pagefind`** — indexes the built HTML for the static search dialog, writing `dist/pagefind/` (loaded lazily by `SearchDialog.astro`).
3. (Implicit) Vercel uploads the `dist/` directory and serves it from its CDN.

The whole build is self-contained — no network calls during deploy except the GROQ fetches to Sanity. OG image fonts (Inter + Fraunces TTFs) are committed in `apps/web/src/lib/og/fonts/` so build is reproducible offline.

---

## Domain ownership

`bubc.co.uk` is owned by the club. Renewal is on the registrar's auto-renew. Whoever inherits this site should:

1. Confirm with the current treasurer who pays the renewal.
2. Make sure the renewal payment doesn't fail (one bounced payment = domain at risk).
3. Add the renewal as a recurring committee handover item.

---

_Last updated 2026-05-28._

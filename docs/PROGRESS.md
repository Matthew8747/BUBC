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

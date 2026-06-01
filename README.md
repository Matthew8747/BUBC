# bubc.co.uk

The public website for **the University of Bath Boat Club** — a static [Astro](https://astro.build) site, content edited in [Sanity Studio](https://www.sanity.io/), hosted on [Vercel](https://vercel.com). One repo, two apps, no server.

> Live: <https://bubc-web.vercel.app/> (cutover to <https://bubc.co.uk> on launch day).

## What this is

A fast, accessible, content-rich club site that recruits rowers, engages alumni, attracts sponsors, and is meant to outlive the committee that built it. Editors update content through a CMS; the site rebuilds itself.

**Goals**

- Lighthouse ≥ 95 across Performance / Accessibility / Best Practices / SEO; TTI < 2s on 4G.
- A non-developer can publish a race report in under 5 minutes.
- Mobile-first, WCAG 2.2 AA, touch targets ≥ 44px.
- Near-zero running cost (~£10/yr domain only).

**Non-goals:** e-commerce, member portal, live race scoring, self-hosted auth. We link out for those.

## Architecture

```
GitHub (main) ──push──▶ Vercel ──build──▶ static dist/ ──CDN──▶ visitors
                          ▲
                          │ deploy hook (POST)
                          │
Sanity ──webhook on publish──┘
```

Astro pulls every page from Sanity's GROQ API at build time and writes static HTML/CSS/JS. Vercel serves it from the edge. When an editor publishes, a Sanity webhook fires Vercel's deploy hook and the site rebuilds in ~60 seconds.

## Stack

| Layer     | Choice                                                                | Where                        |
| --------- | --------------------------------------------------------------------- | ---------------------------- |
| Frontend  | Astro 6 (static output) + Tailwind v4, strict TypeScript              | [`apps/web`](apps/web)       |
| CMS       | Sanity Studio v5 (React 19), dataset `production`, project `j7zcx618` | [`apps/studio`](apps/studio) |
| Hosting   | Vercel (free tier) — auto-deploys on push to `main`; preview per PR   | `vercel.json`                |
| Monorepo  | pnpm workspace, Node 22+                                              | `pnpm-workspace.yaml`        |
| Forms     | Formspree (trial form), Buttondown (newsletter)                       | env-gated                    |
| Analytics | Cloudflare Web Analytics; Sentry (browser errors, opt-in)             | env-gated                    |
| Donations | Hubbub project page; live totals scraped at build time                | `apps/web/src/lib/hubbub.ts` |

## Repo layout

```text
apps/
├── web/         # Astro frontend → bubc.co.uk
└── studio/      # Sanity Studio  → bubc.sanity.studio
docs/            # Handover, deployment, security, content workflows
graphify-out/    # Knowledge graph of the codebase (see CLAUDE.md)
vercel.json      # Headers, CSP, redirects
```

## Quick start

```bash
pnpm install
cp apps/web/.env.example apps/web/.env   # fill in SANITY_PROJECT_ID + SANITY_DATASET

pnpm dev        # Astro dev server  → http://localhost:4321
pnpm studio     # Sanity Studio     → http://localhost:3333
```

Requires **Node 22.12+** and **pnpm 9+**. The dev server renders sensible placeholder content when Sanity env vars are absent, so the site never goes blank.

## Common commands

```bash
pnpm dev          # web dev server
pnpm studio       # Sanity Studio
pnpm build        # production build of the web app
pnpm preview      # serve the production build locally
pnpm typecheck    # web + studio
pnpm test         # unit (Vitest) + e2e (Playwright)
pnpm lint         # eslint
pnpm format       # prettier write
```

## Documentation

The `docs/` directory is the source of truth for everything that lives outside the code.

| Doc                                           | Read it if you are…                                                         |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| [HANDOVER.md](docs/HANDOVER.md)               | A new committee member taking over the site. **Start here.**                |
| [plan.md](docs/plan.md)                       | A developer-successor — brief, IA, URL map, content model.                  |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md)           | Wiring Vercel env vars, the Sanity → Vercel webhook, rollbacks.             |
| [STUDIO-HOSTING.md](docs/STUDIO-HOSTING.md)   | Publishing the Studio to `bubc.sanity.studio` and inviting editors.         |
| [SECURITY.md](docs/SECURITY.md)               | Changing forms, headers, CMS schema, or anything that crosses into the DOM. |
| [CONTENT-EDITING.md](docs/CONTENT-EDITING.md) | A comms officer or captain publishing content.                              |
| [EDIT-CHECKLIST.md](docs/EDIT-CHECKLIST.md)   | Looking up "where do I edit X?" fast.                                       |
| [CONTENT-CADENCE.md](docs/CONTENT-CADENCE.md) | Planning the editorial rhythm across a season.                              |
| [REVIEW-WORKFLOW.md](docs/REVIEW-WORKFLOW.md) | Working with the admin-gated publish flow.                                  |
| [PROGRESS.md](docs/PROGRESS.md)               | Tracking current state and the launch checklist.                            |
| [FEATURES.md](docs/FEATURES.md)               | Looking at the open backlog (not what already exists).                      |

For the **live architecture**, the codebase is the source of truth. There's also a knowledge graph at `graphify-out/` — use `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` for scoped subgraphs (see [`CLAUDE.md`](CLAUDE.md)).

## Security posture

Static build + no server removes most of the OWASP Top 10 by construction. CSP, HSTS, X-Frame-Options, Referrer-Policy and Permissions-Policy are set in `vercel.json`. GROQ queries are parameterised; PortableText / embeds go through `sanitizeUrl` + `escapeHtml` in `apps/web/src/lib/html.ts`. Forms post directly to managed third parties (Formspree, Buttondown) with Zod validation, a honeypot, and a minimum-fill-time anti-bot check. Full model in [`docs/SECURITY.md`](docs/SECURITY.md).

To report a vulnerability, email **press@bubc.co.uk** with subject `Security: <short summary>`.

## Deploying

- **Push to `main`** → production redeploy.
- **Open a PR** → preview URL.
- **Editor publishes in Sanity** → webhook fires Vercel's deploy hook → live in ~60s.
- **Rollback** → Vercel → Deployments → previous green deploy → _Promote to Production_.

Full wiring (env vars, webhook setup, rollback walkthrough) is in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Contributing

Issues and PRs welcome from committee members and alumni. For non-trivial changes, open an issue first so we can sanity-check it against the IA and content model. CI runs lint, typecheck, unit + e2e tests, and accessibility checks on every PR.

## License

Code: MIT (or as set in `LICENSE` once added). Editorial content, photography, and the BUBC marks remain the property of the University of Bath Boat Club.

## Maintainers

See [`docs/HANDOVER.md § Past maintainers`](docs/HANDOVER.md#10-past-maintainers). Current maintainer: Matthew (2025–2026).

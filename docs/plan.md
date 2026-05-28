# bubc.co.uk — Architecture & IA Reference

> The original phase-by-phase build plan has been retired now the site is built. This is the evergreen reference: the brief, the information architecture, and where the moving parts live. For the live architecture, the codebase + `graphify-out/` (run `graphify query "<question>"`) are the source of truth.

## Brief

**Mission:** a fast, accessible, content-rich site that recruits rowers, engages alumni, attracts sponsors, and outlives the committee that built it.

**Audiences (ranked):** prospective rowers → parents → alumni & donors → sponsors → press.

**Success criteria:**

- Lighthouse ≥ 95 across Performance / Accessibility / Best Practices / SEO; TTI < 2s on 4G.
- A non-developer can publish a race report in under 5 minutes (via Sanity Studio).
- Mobile-first, touch targets ≥ 44px, WCAG 2.2 AA.
- Near-zero running cost (≈£10/yr domain).

**Non-goals:** e-commerce/merch, member portal/training log, live race scoring, self-hosted auth. (Link out instead — see [FEATURES.md](FEATURES.md).)

## Stack

- **Frontend:** Astro 6 (static output) + Tailwind v4, strict TypeScript. `apps/web`.
- **CMS:** Sanity Studio v5 (React 19), dataset `production`, project `j7zcx618`. `apps/studio`.
- **Hosting:** Vercel (static, CDN). Auto-deploys on push to `main`; preview deploy per PR.
- **Monorepo:** pnpm workspace.
- Build-time data fetch from Sanity's GROQ API → static HTML. No server, no database.

## Information architecture

**Primary nav:** Squads · Coaching · Boathouse · News · Alumni · Support Us
**Utility:** Contact · Trial with us (CTA)

**Footer columns:** Club · Row · Support · Alumni & connect (+ newsletter signup).

Key routes: `/squads/{senior-men,senior-women,novice,pda,trial}`, `/coaching/`, `/boathouse/` + `/boathouse/fleet/[slug]`, `/news/` + `/news/[slug]` + `/news/category/[slug]`, `/alumni/` + `/alumni/{meles,events,profile/[slug]}`, `/support/{donate,buy-a-boat,sponsor,campaigns/[slug]}`, `/about/{history,henley-honours,olympians/[slug],blazers,chairs}`, `/committee/`, `/welfare/`, `/contact/`, `/press/`, `/results/`.

### URL redirects (legacy WordPress → new)

Wired in `apps/web/astro.config.mjs` (`redirects:`).

| Old                    | New                     | Old                 | New                      |
| ---------------------- | ----------------------- | ------------------- | ------------------------ |
| `/coaching-team/`      | `/coaching/`            | `/bubc-alumni/`     | `/alumni/`               |
| `/facilities-fleet/`   | `/boathouse/`           | `/meles-boat-club/` | `/alumni/meles/`         |
| `/sponsors/`           | `/support/sponsor/`     | `/join-meles-bc/`   | `/alumni/meles#join`     |
| `/history-2/`          | `/about/history/`       | `/events/`          | `/alumni/events/`        |
| `/senior-squad/`       | `/squads/senior-men/`   | `/our-impact/`      | `/support/campaigns/`    |
| `/women-senior-squad/` | `/squads/senior-women/` | `/buy-a-boat/`      | `/support/buy-a-boat/`   |
| `/fundraising/`        | `/support/campaigns/`   | `/chairs-of-bubc/`  | `/about/chairs/`         |
| `/donate/`             | `/support/donate/`      | `/henley-honours/`  | `/about/henley-honours/` |
| `/single-donation/`    | `/support/donate/`      | `/blazers/`         | `/about/blazers/`        |

## Content model (Sanity)

Schemas live in `apps/studio/schemaTypes/`:

- **Singletons:** `settings` (nav, footer, contact, boathouse location, logo, live-race banner), `homePage`.
- **Documents:** `squad`, `coach`, `committeeMember`, `athlete`, `olympian` (doubles as the broader alumni profile via a `category` enum), `newsPost` + `category`, `boat`, `boatForSale`, `campaign`, `sponsor`, `event`, `regattaResult`, `henleyHonour`, `chair`, `page` (generic long-form), `imageLibrary`.
- **Objects:** `portableText`, `imageBlock`, `ctaBlock`, `linkBlock`, `seo`, `statBlock`.

The frontend reads these via GROQ in `apps/web/src/lib/queries.ts`; result shapes are mirrored in `apps/web/src/lib/types.ts`. Most pages fall back to sensible placeholder content when a query returns nothing, so the site is never blank.

## Where to look next

- **Edit content?** [EDIT-CHECKLIST.md](EDIT-CHECKLIST.md) + [CONTENT-EDITING.md](CONTENT-EDITING.md).
- **Deploy / env / webhook?** [DEPLOYMENT.md](DEPLOYMENT.md).
- **Security model?** [SECURITY.md](SECURITY.md).
- **Take over as a developer?** This file, then `graphify-out/` for the live architecture.

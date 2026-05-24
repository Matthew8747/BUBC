# BUBC Site — Feature Backlog

> Sister document to [`plan.md`](plan.md) and [`PROGRESS.md`](PROGRESS.md).
>
> The plan lays out the build phases. PROGRESS tracks what's done. This file is the **idea pool**: every feature anyone has suggested, deduped, with status. Cross-references plan tasks (T-numbers / phase numbers) so nothing falls through the cracks.
>
> Status legend:
>
> - **✅ Built** — shipped (see PROGRESS.md)
> - **📋 Planned** — in the plan, awaiting its phase
> - **🟡 Under consideration** — agreed in principle, design TBD
> - **❓ Needs decision** — user input required before scoping
> - **🚫 Out of scope** — explicitly not doing (with reason)
>
> Last updated: 2026-05-24 (session 5 — Phase 5 landed).

---

## 1. Content & editorial

| ID  | Feature                          | Status                 | Notes                                                                                                                                                                           |
| --- | -------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | News / blog                      | ✅ Built (T28)         | `/news/` paginated index + `/news/[slug]/` post template + `/news/page/[num]/`. PortableText, reading time, share buttons, prev/next, JSON-LD NewsArticle.                      |
| C2  | News categories + RSS            | ✅ Built (T28)         | `/news/category/[slug]/` pages, filter pills, `/news/rss.xml` feed with custom XSL stylesheet.                                                                                  |
| C3  | "What's it like" page            | 🟡 Under consideration | **Decision (2026-05-23):** structured `page` doc with predefined sections (hero, weekly schedule grid, photo gallery, 2 quotes, sticky CTA). Build after Phase 3 P0 pages land. |
| C4  | Parent information page          | ❓ Needs decision      | Safety, time commitment, cost, fitness, accommodation, kit, regatta logistics. Differentiator — few UK clubs have this.                                                         |
| C5  | Trial / Recruit form             | ✅ Built (T21)         | Live at `/squads/trial/`. Needs Formspree ID set (M2 in PROGRESS).                                                                                                              |
| C6  | Welfare & Safeguarding page      | 📋 Planned (T26)       | Named officer, contacts, reporting routes. Phase 3.                                                                                                                             |
| C7  | Inclusion & accessibility policy | ❓ Needs decision      | Para-rowing pathway, gender inclusion, financial support routes. Could be a section of welfare page or its own page.                                                            |
| C8  | Press / media kit                | 📋 Planned (P1)        | Hi-res logos, brand colours, photo library, boilerplate. Probably static assets + a single page.                                                                                |
| C9  | Annual review / yearbook PDF     | ❓ Needs decision      | 20–30pp PDF once a year. Alumni keep these, drives donations. Out of scope for build; needs editorial process.                                                                  |
| C10 | Cookie / privacy / GDPR notice   | 🟡 Under consideration | Legally required if we collect form data. Form submissions → Formspree. Need a privacy policy page (short) linked in footer.                                                    |

## 2. Squads, coaching, people

| ID  | Feature                    | Status                 | Notes                                                                                                                                                                                                                    |
| --- | -------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P1  | Squad index + detail       | 📋 Planned (T20)       | Next up. `squad` schema exists.                                                                                                                                                                                          |
| P2  | Coaching page              | 📋 Planned (T22)       | `coach` schema exists.                                                                                                                                                                                                   |
| P3  | Committee page             | 📋 Planned (T25)       | `committeeMember` schema exists with `academicYear` field.                                                                                                                                                               |
| P4  | Crew lists with photos     | 🟡 Under consideration | **Decision (2026-05-23):** separate `crew` document — `crew { squad, season, name, athletes[seat→athlete], cox, coach, photo, achievements }`. Supports archive/yearbook use. Schema to be added after Phase 3 P0 pages. |
| P5  | Olympians / Internationals | ✅ Built (T31)         | `/about/olympians/` index + `/about/olympians/[slug]/` detail page with JSON-LD `Person`. Schema rename to `alumniProfile` still deferred until P1 alumni section.                                                       |
| P6  | Chairs of BUBC             | 📋 Planned (P2)        | `chair` schema exists. Historical list.                                                                                                                                                                                  |
| P7  | Athlete profiles           | 📋 Planned (latent)    | `athlete` schema exists — referenced by news / results but no public index page yet. Decide if athletes get profiles.                                                                                                    |

## 3. Boats & boathouse

| ID  | Feature                         | Status                | Notes                                                                                                                                |
| --- | ------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| B1  | Boathouse page                  | ✅ Built (T23)        | Facilities + location + fleet teaser. Now also links to `/boathouse/fleet/`.                                                         |
| B2  | Fleet index + boat detail pages | ✅ Built (session 5)  | `/boathouse/fleet/` grid with class filter pills + status badges; `/boathouse/fleet/[slug]/` detail with story, current crew, donor. |
| B3  | Boat naming history             | ✅ Surfaced           | `boat.story` (PortableText) + `boat.donor` + naming-ceremony date all rendered on the boat detail page.                              |
| B4  | Interactive fleet visualiser    | 🚫 Skipped (decision) | User chose plain grid layout in session 5 — editors don't have to maintain SVG when bays move. Standard fleet pages built instead.   |

## 4. Results & history

| ID  | Feature                  | Status           | Notes                                                                                                                                                                                 |
| --- | ------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Race results archive     | 📋 Planned (P1)  | `regattaResult` schema exists. Filterable by year/regatta. Plan §7 P4.                                                                                                                |
| R2  | Henley Honours page      | ✅ Built (T30)   | `/about/henley-honours/` chronological table by year with client-side regatta filter and totals strip.                                                                                |
| R3  | History page + timeline  | 📋 Planned (T24) | Existing copy good; needs timeline component.                                                                                                                                         |
| R4  | Blazers page             | 📋 Planned (P2)  | Historical / decorative.                                                                                                                                                              |
| R5  | Live race tracker / feed | ✅ Built (R5)    | Banner driven by `settings.liveRaceBanner` in Sanity (active toggle + event name + URL + tone). Renders above the header, dismissable per session. Decision: banner-only, no iframes. |

## 5. Alumni & community

| ID  | Feature                   | Status                 | Notes                                                                                                                                                                                                                              |
| --- | ------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | Alumni landing page       | ✅ Built (session 5)   | `/alumni/` — unified profile grid with category filter pills, medal indicators, quick-links aside, graceful empty state.                                                                                                           |
| A2  | Meles Boat Club page      | ✅ Built (session 5)   | `/alumni/meles/` — `page` doc-driven body with fallback, three-step join flow + sticky contact card, `#join` anchor (legacy URL target).                                                                                           |
| A3  | Alumni events page        | ✅ Built (session 5)   | `/alumni/events/` — upcoming events with `Event` JSON-LD per item, past events compact list. Reads `event` schema filtered to `type == "alumni"`.                                                                                  |
| A4  | "Where they are now" grid | ✅ Built (session 5)   | `olympian` schema extended (no rename) with `category` enum + `internationalAppearances` + `boatRaceAppearances` + `careerHighlight` + `location` fields. `/alumni/` filters by category; `/about/olympians/` still olympian-only. |
| A5  | Alumni world map          | 🟡 Under consideration | `location` field now on schema. When enough alumni have populated it, build the map view (Mapbox or Leaflet).                                                                                                                      |
| A6  | Newsletter signup         | ✅ Built (session 5)   | **Buttondown** wired into footer + bottom of news posts. Graceful "not configured" state when `PUBLIC_BUTTONDOWN_USERNAME` unset. Honeypot anti-spam + AJAX submission + inline success/error states.                              |

## 6. Fundraising & sponsorship

| ID  | Feature                                  | Status               | Notes                                                                                                                                      |
| --- | ---------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| F1  | Donate page                              | ✅ Built (T27)       | Links to existing Hubbub. Active campaigns surface with thermometers inline.                                                               |
| F2  | Buy a Boat page                          | ✅ Built (T27)       | `boatForSale` schema; semantic price-range table.                                                                                          |
| F3  | Sponsor index / partners page            | ✅ Built (session 5) | `/support/sponsor/` — tier descriptions + partner grid (rich cards for headline/gold, compact logo grid for silver/supporter) + email CTA. |
| F4  | Campaign pages + thermometer             | ✅ Built (session 5) | `/support/campaigns/` listing (active/reached/closed); `/support/campaigns/[slug]/` detail with sticky thermometer + story + gallery.      |
| F5  | Sponsorship pack PDF                     | ❓ Needs decision    | Sponsor page links to mailto for the pack until draft content arrives. Hook up when ready.                                                 |
| F6  | Crew Boat Race / erg-athon page template | ❓ Needs decision    | Live total embed during fundraising events. Could reuse `campaign` schema with `eventDate` extension.                                      |

## 7. Interactive / "wow"

| ID  | Feature                            | Status                 | Notes                                                                                                                                                                                                                |
| --- | ---------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| W1  | Strava club embed                  | 🟡 Under consideration | Phase 5. Plan §7. Needs club Strava account + widget URL.                                                                                                                                                            |
| W2  | Erg leaderboard                    | ❓ Needs decision      | Top 10 2k / 5k by squad / gender, anonymised optional. Source: Airtable or Notion table? Anti-cheat policy needed.                                                                                                   |
| W3  | Race countdown banner (HRR / BUCS) | ✅ Covered by R5       | Live race banner does double duty as countdown — set `active=true` with the event name and result URL.                                                                                                               |
| W4  | Donate progress thermometer        | ✅ Built (T33)         | See F4. Used on `/support/donate/` and `/support/campaigns/[slug]/`.                                                                                                                                                 |
| W5  | Fleet visualiser SVG               | 🚫 Skipped (B4)        | User chose plain grid layout. See B4.                                                                                                                                                                                |
| W6  | OG image generation (satori)       | ✅ Built (session 5)   | satori + resvg, build-time. ~30 static-page cards + dynamic per news/squad/olympian/alumni/boat/campaign. Bundled fonts (Inter + Fraunces TTF). Transparent-PNG fallback on satori errors so the build never breaks. |
| W7  | Structured data (JSON-LD)          | ✅ Built (session 5)   | Global `SportsOrganization` + `WebSite`. Per-template: `NewsArticle` (news), `Person` (olympians + alumni), `SportsTeam` (squads), `Event` (alumni events), `BreadcrumbList` (interior pages).                       |

## 8. Performance, SEO, infra

| ID  | Feature                            | Status               | Notes                                                                                                                      |
| --- | ---------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| I1  | Sitemap                            | ✅ Built             | `@astrojs/sitemap` wired, `/sitemap-index.xml` generated, priorities boosted for home + hubs.                              |
| I2  | RSS feed                           | ✅ Built (T28)       | `/news/rss.xml` via `@astrojs/rss` with custom XSL stylesheet for browser preview.                                         |
| I3  | Pagefind search                    | ✅ Built (T29)       | Indexed at build, `/` keyboard shortcut + Cmd/Ctrl-K + header buttons, accessible dialog.                                  |
| I4  | Cloudflare Web Analytics           | ✅ code · ⏸ token    | Beacon in BaseLayout. Needs `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` in Vercel.                                                 |
| I5  | Sentry error tracking              | ✅ Built (session 5) | `@sentry/browser` dynamic-imported, no-op when DSN unset. Bot UA filter, error-only, env tag.                              |
| I6  | Lighthouse CI                      | ✅ Built (session 5) | `@lhci/cli` wired into `ci.yml`. Advisory for first two weeks; tighten to required once baselines settle.                  |
| I7  | Pa11y CI                           | ✅ Built (session 5) | `pa11y-ci` across 24 URLs in `ci.yml`. Advisory initially. Zero-error budget on home/news/trial/donate.                    |
| I8  | Sanity webhook → Vercel revalidate | ✅ Documented        | Step-by-step in [DEPLOYMENT.md](DEPLOYMENT.md). Needs a user with both dashboards (15 min).                                |
| I9  | Sanity Presentation (live preview) | 📋 Planned (T-late)  | Two-dataset workflow + draft cookie route.                                                                                 |
| I10 | URL redirects (18 old → new)       | ✅ Built (session 5) | All 18 from plan.md §1 wired into `astro.config.mjs` `redirects:`. Smoke tests verify three of them.                       |
| I11 | 404 page                           | 📋 Planned (Phase 3) | Branded.                                                                                                                   |
| I12 | Robots.txt                         | ✅ Built             | `public/robots.txt` with explicit `Sitemap:` line; blocks AI training crawlers (GPTBot, ClaudeBot, Google-Extended, etc.). |

## 9. Explicitly out of scope (non-goals)

| ID  | Feature                          | Reason                                                                                   |
| --- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| X1  | E-commerce / merch store         | Plan §0. Rival Kit handles kit; Perry handles blazers. **Link out**, don't sell on-site. |
| X2  | Member portal / training log app | Use Strava / Concept2 ErgData. Plan §0.                                                  |
| X3  | Live race scoring                | Link out to British Rowing / regatta sites. Plan §0.                                     |
| X4  | Self-hosted authentication       | Sanity handles editor auth. Plan §0.                                                     |
| X5  | Cloudflare Pages                 | Vercel is the host. Cloudflare's role is DNS + email + analytics only.                   |

---

## Decision queue

### ✅ Locked in

- **C3 — "What's it like" page** → structured `page` doc with predefined sections (hero, weekly schedule grid, photo gallery, 2 quotes, sticky CTA). Build after Phase 3 P0. _(2026-05-23)_
- **P4 — Crew lists** → separate `crew` document keyed on `squad` + `season`. Schema additions deferred until Phase 3 P0 ships. _(2026-05-23)_
- **A4 — Alumni grid** → ✅ built session 5. `olympian` extended in-place with `category` enum + intl/Boat Race appearance arrays. No document rename (avoids destructive migration).
- **R5 — Live race tracker** → banner-only via `settings.liveRaceBanner` in Sanity. Link out to external trackers; no iframes. _(2026-05-24, built same session.)_
- **A6 — Newsletter** → **Buttondown** (session 5). Wired in footer + post pages. _(2026-05-24)_
- **B4 — Fleet visualiser** → ✅ skipped per user choice in session 5. Standard fleet grid + boat detail pages built instead — editors don't have to maintain SVG when bays move.

### 🟡 Still open — answer before the relevant phase

1. **C4 — Parent information page.** Same structured `page`-doc approach as C3? Could share section types. (Phase 3 / 4 question — building this is straightforward once you confirm.)
2. **C7 — Inclusion & accessibility policy.** Standalone page or a section of `/welfare/`? Recommendation: section of `/welfare/` initially. (Affects T26.)
3. **W2 — Erg leaderboard.** Source of truth (Airtable, Notion, Sanity doc) + maintainer commitment. Recommend deferring unless captains commit to upkeep.
4. **F5 — Sponsorship pack PDF.** Needs draft content from the club. Sponsor page currently links to mailto until PDF arrives.
5. **F6 — Erg-athon / Crew Boat Race templates.** Build only when a real event is on the calendar.
6. **A5 — Alumni world map.** `location` field now lives on the schema. Worth building once enough profiles have it populated (Mapbox or Leaflet).

---

## What lands without asking

These are standard club-website features the plan already commits to. I'll build them straight ahead unless you stop me:

- ✅ T20 Squads index + 3 detail pages
- ✅ T22 Coaching page
- ✅ T23 Boathouse page + map
- ✅ T24 About + History timeline
- ✅ T25 Committee grid
- ✅ T26 Welfare page (basic content, named officer placeholder)
- ✅ T27 Donate + Buy-a-Boat pages
- ✅ T28 News index + post template + RSS
- ✅ T29 Pagefind search
- ✅ T30 Henley Honours table
- ✅ T31 Olympians index + detail
- ✅ 404 page
- ✅ Privacy policy page (form data handling — required for GDPR)
- 🚫 T32 Fleet visualiser SVG — skipped per decision (B4). Standard grid built instead.
- ✅ T33 Campaign listing + detail pages
- ✅ T34 OG image generation with satori
- ✅ Sponsor index page `/support/sponsor/`
- ✅ Alumni section — `/alumni/`, `/alumni/meles/`, `/alumni/events/`, `/alumni/profile/[slug]/`
- ✅ Newsletter signup (Buttondown) — A6
- ✅ Sentry error tracking — I5
- ✅ Lighthouse CI — I6 (advisory)
- ✅ Pa11y CI — I7 (advisory)
- ✅ 18 × 301 redirects — I10
- 📋 Race results archive (P1) — `/results/`
- 📋 Press kit (P2), Chairs (P2), Blazers (P2)
- 📋 Sanity Presentation live preview — I9

---

_Update this file when ideas land, decisions are made, or features ship. Keep cross-references to plan.md task numbers so the plan and this file never drift._

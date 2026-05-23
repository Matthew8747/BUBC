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
> Last updated: 2026-05-23.

---

## 1. Content & editorial

| ID  | Feature                          | Status                 | Notes                                                                                                                                                                           |
| --- | -------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | News / blog                      | 📋 Planned (T28)       | `newsPost` schema exists. Phase 4. Drives SEO + alumni engagement.                                                                                                              |
| C2  | News categories + RSS            | 📋 Planned (T28)       | `category` schema exists.                                                                                                                                                       |
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
| P5  | Olympians / Internationals | 📋 Planned (T31)       | `olympian` schema exists.                                                                                                                                                                                                |
| P6  | Chairs of BUBC             | 📋 Planned (P2)        | `chair` schema exists. Historical list.                                                                                                                                                                                  |
| P7  | Athlete profiles           | 📋 Planned (latent)    | `athlete` schema exists — referenced by news / results but no public index page yet. Decide if athletes get profiles.                                                                                                    |

## 3. Boats & boathouse

| ID  | Feature                         | Status                 | Notes                                                                                                                                 |
| --- | ------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | Boathouse page                  | 📋 Planned (T23)       | Facilities + location + fleet teaser.                                                                                                 |
| B2  | Fleet index + boat detail pages | 📋 Planned             | `boat` schema has `name, make, class, weight, yearBought, donor, story, photo, status`. Schema supports boat naming history (P4 ask). |
| B3  | Boat naming history             | 🟡 Under consideration | Already supported by `boat.story` + `boat.donor`. Just needs the page to surface it well. Trivial extension.                          |
| B4  | Interactive fleet visualiser    | 📋 Planned (T32)       | SVG of boathouse bays, clickable boats → detail. Phase 5 polish. Needs bay layout / `fleetLocation` schema (in plan §5).              |

## 4. Results & history

| ID  | Feature                  | Status            | Notes                                                                                                   |
| --- | ------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------- |
| R1  | Race results archive     | 📋 Planned (P1)   | `regattaResult` schema exists. Filterable by year/regatta. Plan §7 P4.                                  |
| R2  | Henley Honours page      | 📋 Planned (T30)  | `henleyHonour` schema exists.                                                                           |
| R3  | History page + timeline  | 📋 Planned (T24)  | Existing copy good; needs timeline component.                                                           |
| R4  | Blazers page             | 📋 Planned (P2)   | Historical / decorative.                                                                                |
| R5  | Live race tracker / feed | ❓ Needs decision | Pinned "Follow live results here" link during BUCS/Henley weekend. Could be a banner field on settings? |

## 5. Alumni & community

| ID  | Feature                   | Status                 | Notes                                                                                                                                                                                                                                                           |
| --- | ------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | Alumni landing page       | 📋 Planned (P1)        | `/alumni/`.                                                                                                                                                                                                                                                     |
| A2  | Meles Boat Club page      | 📋 Planned (P1)        | `/alumni/meles/`.                                                                                                                                                                                                                                               |
| A3  | Alumni events page        | 📋 Planned (P1)        | `/alumni/events/` — uses `event` schema.                                                                                                                                                                                                                        |
| A4  | "Where they are now" grid | 🟡 Under consideration | **Decision (2026-05-23):** extend `olympian` → `alumniProfile` with `category` enum (`olympian` / `international` / `boatRace` / `notableCareer`). One unified feed, filterable on the page. Schema rename + page split happens when alumni section lands (P1). |
| A5  | Alumni world map          | 🟡 Under consideration | Pins for where alumni live/work. Mapbox or Leaflet. Phase 5 polish. Needs location data on each alumnus.                                                                                                                                                        |
| A6  | Newsletter signup         | 🟡 Under consideration | Buttondown or Beehiiv free tier. Footer + post pages. Plan §7 Phase 5. Needs provider chosen.                                                                                                                                                                   |

## 6. Fundraising & sponsorship

| ID  | Feature                                  | Status            | Notes                                                                                                  |
| --- | ---------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------ |
| F1  | Donate page                              | 📋 Planned (T27)  | Links to existing Hubbub.                                                                              |
| F2  | Buy a Boat page                          | 📋 Planned (T27)  | `boatForSale` schema exists.                                                                           |
| F3  | Sponsor index / partners page            | 📋 Planned (P1)   | `sponsor` schema exists, tiers ready.                                                                  |
| F4  | Campaign pages + thermometer             | 📋 Planned (T33)  | `campaign` schema has `goalAmount`, `raisedAmount`, `donorCount`. Thermometer = pure UI on top.        |
| F5  | Sponsorship pack PDF                     | ❓ Needs decision | Tiered packages, audience numbers, benefits per tier. Linked from sponsor page. Needs draft from club. |
| F6  | Crew Boat Race / erg-athon page template | ❓ Needs decision | Live total embed during fundraising events. Could reuse `campaign` schema with `eventDate` extension.  |

## 7. Interactive / "wow"

| ID  | Feature                            | Status                 | Notes                                                                                                              |
| --- | ---------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| W1  | Strava club embed                  | 🟡 Under consideration | Phase 5. Plan §7. Needs club Strava account + widget URL.                                                          |
| W2  | Erg leaderboard                    | ❓ Needs decision      | Top 10 2k / 5k by squad / gender, anonymised optional. Source: Airtable or Notion table? Anti-cheat policy needed. |
| W3  | Race countdown banner (HRR / BUCS) | 📋 Planned (Phase 5)   | Driven by a `nextEvent` field on `settings`. Plan §7.                                                              |
| W4  | Donate progress thermometer        | 📋 Planned (T33)       | See F4. Phase 5.                                                                                                   |
| W5  | Fleet visualiser SVG               | 📋 Planned (T32)       | See B4.                                                                                                            |
| W6  | OG image generation (satori)       | 📋 Planned (T34)       | Per-page dynamic OG. Phase 5.                                                                                      |
| W7  | Structured data (JSON-LD)          | 📋 Planned (T35)       | Organization, SportsTeam, BreadcrumbList, NewsArticle, Event.                                                      |

## 8. Performance, SEO, infra

| ID  | Feature                            | Status                 | Notes                                                                                       |
| --- | ---------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| I1  | Sitemap                            | 🟡 Under consideration | `@astrojs/sitemap` integration not yet installed (PROGRESS notes 5-min task).               |
| I2  | RSS feed                           | 📋 Planned (T28)       | `@astrojs/rss`, when news ships.                                                            |
| I3  | Pagefind search                    | 📋 Planned (T29)       | Build-time static search. Phase 4.                                                          |
| I4  | Cloudflare Web Analytics           | ✅ code · ⏸ token      | Beacon in BaseLayout. Needs `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` in Vercel.                  |
| I5  | Sentry error tracking              | 📋 Planned (Phase 5)   | `@sentry/astro` free tier.                                                                  |
| I6  | Lighthouse CI                      | 📋 Planned (Phase 6)   | `@lhci/cli` gates PRs after baselines settle.                                               |
| I7  | Pa11y CI                           | 📋 Planned (Phase 6)   | Zero-error budget on home, news post, trial, donate.                                        |
| I8  | Sanity webhook → Vercel revalidate | 📋 Planned (T28)       | So editors see posts within ~60s.                                                           |
| I9  | Sanity Presentation (live preview) | 📋 Planned (T-late)    | Two-dataset workflow + draft cookie route.                                                  |
| I10 | URL redirects (18 old → new)       | 📋 Planned (T38)       | Plan §1 migration map. Phase 6.                                                             |
| I11 | 404 page                           | 📋 Planned (Phase 3)   | Branded.                                                                                    |
| I12 | Robots.txt                         | 🟡 Under consideration | Astro generates basic by default; we should set explicit `Sitemap:` line + sensible policy. |

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

### ✅ Locked in (2026-05-23)

- **C3 — "What's it like" page** → structured `page` doc with predefined sections (hero, weekly schedule grid, photo gallery, 2 quotes, sticky CTA). Build after Phase 3 P0.
- **P4 — Crew lists** → separate `crew` document keyed on `squad` + `season`. Schema additions deferred until Phase 3 P0 ships.
- **A4 — Alumni grid** → extend `olympian` to broader `alumniProfile` with category enum. Page split done when alumni section lands (P1).

### 🟡 Still open — answer before the relevant phase

1. **C4 — Parent information page.** Same structured `page`-doc approach as C3? Could share section types. (Phase 3 / 4 question.)
2. **C7 — Inclusion & accessibility policy.** Standalone page or a section of `/welfare/`? Recommendation: section of `/welfare/` initially. (Affects T26.)
3. **R5 — Live race tracker.** Just a banner CTA, or host an embed (British Rowing iframe)? Recommendation: banner field on `settings` with `liveResultsUrl` + `eventName` + `active`. (Phase 5 question.)
4. **A6 — Newsletter provider.** Buttondown (dev-friendly, free tier) or Beehiiv (free to 2.5k, more marketing-focused)? Recommendation: Buttondown. (Phase 5 question.)
5. **W2 — Erg leaderboard.** Source of truth (Airtable, Notion, Sanity doc) + maintainer commitment. Recommend deferring unless captains commit to upkeep.
6. **F5 — Sponsorship pack PDF.** Needs draft content from the club. Build page with placeholder PDF when ready.
7. **F6 — Erg-athon / Crew Boat Race templates.** Build only when a real event is on the calendar.

---

## What lands without asking

These are standard club-website features the plan already commits to. I'll build them straight ahead unless you stop me:

- T20 Squads index + 3 detail pages
- T22 Coaching page
- T23 Boathouse page + map
- T24 About + History timeline
- T25 Committee grid
- T26 Welfare page (basic content, named officer placeholder)
- T27 Donate + Buy-a-Boat pages
- T28 News index + post template + RSS
- T29 Pagefind search
- T30 Henley Honours table
- T31 Olympians index + detail
- 404 page
- Privacy policy page (form data handling — required for GDPR)

---

_Update this file when ideas land, decisions are made, or features ship. Keep cross-references to plan.md task numbers so the plan and this file never drift._

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
> Last updated: 2026-05-24 (session 4 — Phase 4 landed).

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

| ID  | Feature                         | Status                 | Notes                                                                                                                                 |
| --- | ------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | Boathouse page                  | 📋 Planned (T23)       | Facilities + location + fleet teaser.                                                                                                 |
| B2  | Fleet index + boat detail pages | 📋 Planned             | `boat` schema has `name, make, class, weight, yearBought, donor, story, photo, status`. Schema supports boat naming history (P4 ask). |
| B3  | Boat naming history             | 🟡 Under consideration | Already supported by `boat.story` + `boat.donor`. Just needs the page to surface it well. Trivial extension.                          |
| B4  | Interactive fleet visualiser    | 📋 Planned (T32)       | SVG of boathouse bays, clickable boats → detail. Phase 5 polish. Needs bay layout / `fleetLocation` schema (in plan §5).              |

## 4. Results & history

| ID  | Feature                  | Status           | Notes                                                                                                                                                                                 |
| --- | ------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Race results archive     | 📋 Planned (P1)  | `regattaResult` schema exists. Filterable by year/regatta. Plan §7 P4.                                                                                                                |
| R2  | Henley Honours page      | ✅ Built (T30)   | `/about/henley-honours/` chronological table by year with client-side regatta filter and totals strip.                                                                                |
| R3  | History page + timeline  | 📋 Planned (T24) | Existing copy good; needs timeline component.                                                                                                                                         |
| R4  | Blazers page             | 📋 Planned (P2)  | Historical / decorative.                                                                                                                                                              |
| R5  | Live race tracker / feed | ✅ Built (R5)    | Banner driven by `settings.liveRaceBanner` in Sanity (active toggle + event name + URL + tone). Renders above the header, dismissable per session. Decision: banner-only, no iframes. |

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

| ID  | Feature                            | Status                 | Notes                                                                                                                                                                                                                        |
| --- | ---------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| W1  | Strava club embed                  | 🟡 Under consideration | Phase 5. Plan §7. Needs club Strava account + widget URL.                                                                                                                                                                    |
| W2  | Erg leaderboard                    | ❓ Needs decision      | Top 10 2k / 5k by squad / gender, anonymised optional. Source: Airtable or Notion table? Anti-cheat policy needed.                                                                                                           |
| W3  | Race countdown banner (HRR / BUCS) | 📋 Planned (Phase 5)   | Driven by a `nextEvent` field on `settings`. Plan §7.                                                                                                                                                                        |
| W4  | Donate progress thermometer        | 📋 Planned (T33)       | See F4. Phase 5.                                                                                                                                                                                                             |
| W5  | Fleet visualiser SVG               | 📋 Planned (T32)       | See B4.                                                                                                                                                                                                                      |
| W6  | OG image generation (satori)       | 📋 Planned (T34)       | Per-page dynamic OG. Phase 5.                                                                                                                                                                                                |
| W7  | Structured data (JSON-LD)          | ✅ Partly built (T35)  | Global `SportsOrganization` + `WebSite` in BaseLayout. Per-template: `NewsArticle` (news posts), `Person` (olympians), `BreadcrumbList` (interior pages). Still to add: `Event` for race days, `SportsTeam` for squad pages. |

## 8. Performance, SEO, infra

| ID  | Feature                            | Status               | Notes                                                                                                                      |
| --- | ---------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| I1  | Sitemap                            | ✅ Built             | `@astrojs/sitemap` wired, `/sitemap-index.xml` generated, priorities boosted for home + hubs.                              |
| I2  | RSS feed                           | ✅ Built (T28)       | `/news/rss.xml` via `@astrojs/rss` with custom XSL stylesheet for browser preview.                                         |
| I3  | Pagefind search                    | ✅ Built (T29)       | Indexed at build, `/` keyboard shortcut + Cmd/Ctrl-K + header buttons, accessible dialog.                                  |
| I4  | Cloudflare Web Analytics           | ✅ code · ⏸ token    | Beacon in BaseLayout. Needs `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` in Vercel.                                                 |
| I5  | Sentry error tracking              | 📋 Planned (Phase 5) | `@sentry/astro` free tier.                                                                                                 |
| I6  | Lighthouse CI                      | 📋 Planned (Phase 6) | `@lhci/cli` gates PRs after baselines settle.                                                                              |
| I7  | Pa11y CI                           | 📋 Planned (Phase 6) | Zero-error budget on home, news post, trial, donate.                                                                       |
| I8  | Sanity webhook → Vercel revalidate | ✅ Documented        | Step-by-step in [DEPLOYMENT.md](DEPLOYMENT.md). Needs a user with both dashboards (15 min).                                |
| I9  | Sanity Presentation (live preview) | 📋 Planned (T-late)  | Two-dataset workflow + draft cookie route.                                                                                 |
| I10 | URL redirects (18 old → new)       | 📋 Planned (T38)     | Plan §1 migration map. Phase 6.                                                                                            |
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
- **A4 — Alumni grid** → extend `olympian` to broader `alumniProfile` with category enum. Page split done when alumni section lands (P1). _(2026-05-23)_
- **R5 — Live race tracker** → banner-only via `settings.liveRaceBanner` in Sanity. Link out to external trackers; no iframes. _(2026-05-24, built same session.)_

### 🟡 Still open — answer before the relevant phase

1. **C4 — Parent information page.** Same structured `page`-doc approach as C3? Could share section types. (Phase 3 / 4 question — building this is straightforward once you confirm.)
2. **C7 — Inclusion & accessibility policy.** Standalone page or a section of `/welfare/`? Recommendation: section of `/welfare/` initially. (Affects T26.)
3. **A6 — Newsletter provider.** Buttondown (dev-friendly, free tier) or Beehiiv (free to 2.5k, more marketing-focused)? Recommendation: Buttondown. (Phase 5 question.)
4. **W2 — Erg leaderboard.** Source of truth (Airtable, Notion, Sanity doc) + maintainer commitment. Recommend deferring unless captains commit to upkeep.
5. **F5 — Sponsorship pack PDF.** Needs draft content from the club. Build page with placeholder PDF when ready.
6. **F6 — Erg-athon / Crew Boat Race templates.** Build only when a real event is on the calendar.
7. **B4 — Fleet visualiser scope.** SVG hand-traced from a real boathouse floor plan, or stylised illustration? Recommend stylised (editor doesn't have to update when bays move). (Phase 5 question for T32.)

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
- 📋 T32 Fleet visualiser SVG (Phase 5)
- 📋 T33 Campaign listing + detail pages (`DonationThermometer` already built)
- 📋 T34 OG image generation with satori (Phase 5)
- 📋 Sponsor index page `/support/sponsor/` (P1)
- 📋 Alumni section (P1) — `/alumni/`, `/alumni/meles/`, `/alumni/events/`

---

_Update this file when ideas land, decisions are made, or features ship. Keep cross-references to plan.md task numbers so the plan and this file never drift._

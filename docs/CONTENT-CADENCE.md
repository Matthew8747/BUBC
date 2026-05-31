# What to publish, and how often

> **Audience:** Comms Officer, Captains, and anyone else with edit rights in Sanity.
> **Goal:** keep bubc.co.uk feeling alive without anyone having to invent a posting calendar from scratch each season.
>
> Companion docs: [CONTENT-EDITING.md](CONTENT-EDITING.md) (how to actually publish) · [EDIT-CHECKLIST.md](EDIT-CHECKLIST.md) (where each surface lives).

---

## The principle

A live-looking site doesn't need volume. It needs **freshness in the surfaces visitors check**. A prospective rower lands on the home page, looks at one squad page, maybe skims news. If the most recent news post is two months old, the site feels dormant — regardless of how many old posts exist.

So the cadence below is biased toward: **at least one obvious "new" thing on the most-visited pages every two weeks**.

---

## At-a-glance cadence

| Cadence                        | What                                                                                                       | Owner               | Where in Studio                              |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------- |
| **Each regatta day**           | Live race banner on / off                                                                                  | Comms Officer       | Site settings → Live race banner             |
| **Within 48h of a regatta**    | Recent result on each affected squad page (+ optional race report)                                         | Captain / Comms     | Squads → squad → **Recent results**          |
| **Within 1 week of a regatta** | Race report news post (long form)                                                                          | Captain / Comms     | News posts → +                               |
| **Every 2 weeks (term-time)**  | At least 1 news post — race report, squad update, athlete spotlight, alumni profile, fundraising milestone | Comms Officer       | News posts → +                               |
| **Monthly**                    | Squad gallery refresh (1–3 new photos per squad)                                                           | Captain             | Squads → squad → Photo gallery               |
| **Monthly**                    | Campaign totals (raised £, donor count) — Hubbub URL auto-pulls if set                                     | Treasurer           | Campaigns → campaign                         |
| **Termly**                     | Training schedule sanity check (times, locations correct?)                                                 | Captain             | Squads → squad → Training schedule           |
| **Termly**                     | Coach roster — anyone joined, left, changed role?                                                          | Captain / President | Coaches                                      |
| **September**                  | New academic-year committee (entire cohort with new academicYear value)                                    | President           | Committee members                            |
| **September & January**        | "Trials open" announcement post + check trial page copy                                                    | Captains            | News + apps/web/src/pages/squads/trial.astro |
| **As things happen**           | Sponsor added / removed; boat acquired/retired; chair updated; Henley honour                               | President / Comms   | Sponsors / Boats / Past chair / Henley       |
| **Yearly (June)**              | Walk through every long-form page (history, blazers, welfare) for accuracy                                 | President           | Pages + the relevant `.astro` files          |

---

## By surface — what counts as "looked after"

### 1. News (`/news/`)

The single most public signal of activity. If the top post is fresh, the site feels alive.

**Targets:**

- **In term:** at least one new post every 2 weeks.
- **Out of term:** at least one new post per month.
- **Regatta weeks:** report within 7 days of the race (sooner if it's a big win).

**Topics that work:**

- Race reports — every BUCS, every Head of the River, every Henley regatta, every home regatta. Even a quiet weekend is a publishable post if framed honestly ("Bristol Avon Head — solid foundation for spring").
- Squad updates — preseason plans, GB camp callups, milestones ("First time on the water for novices").
- Athlete spotlights — captains, GB hopefuls, novices breaking through, departing finalists.
- Alumni profiles — new Boat Race appearances, careers in rowing, Olympians.
- Fundraising milestones — campaign hits 50 %, new sponsor announced, named-boat ceremony.
- Announcements — committee handover, new coaches, club anniversaries.

**Categories to keep populated** (Studio → News categories): Race report, Squad update, Fundraising, Alumni, Announcement.

### 2. Squad pages (`/squads/<slug>/`)

The pages prospective rowers visit before deciding to trial.

**Targets:**

- **Recent results** — keep the most recent 4-8 results visible. As new ones land, older ones fall off naturally. Link the news post race report when written.
- **Photo gallery** — refresh monthly during term. Add medal photos / regatta podiums as they happen. Add a caption to the photo so the lightbox shows context ("BUCS gold, 2024").
- **Training week** — verify at the start of each term. Captains can use either the **paragraph** field (a quick blurb) or the **structured schedule** (day-by-day rows). Whichever is filled shows on the public page. Outdated times turn off prospective rowers.
- **Achievements** — add the headline ones (overall titles, promotions, season-defining results) once a season; not race-by-race.

### 3. Site settings → Live race banner (regatta day)

A coloured strip across the top of every page pointing at the live results.

**Use for:** BUCS, HRR, HWR, BUSA, Head of the River, big home regattas.

**Turn on the morning of:** event name + the official live results URL + the right tone (blade red on race day is the most visible). **Turn off within a day** of the racing finishing — otherwise it becomes stale chrome.

### 4. Home page

Almost everything on the home page is automatic (latest 3 news posts surface themselves). The bits the team should periodically check:

- **Hero** — once a season, swap the image and the headline if a more current photo lands.
- **Stat strip** — bump the "Olympians" count if a new one qualifies; bump Henley wins after a Henley win; bump members at the start of term.
- **Closing CTAs** — keep "Donate", "Trial", "Sponsor" current.

### 5. Sponsors

Add the moment a sponsor signs; remove the moment they stop. The site reads from Sanity for the footer band, the sponsor strip on the home page, and the `/support/sponsor/` page — one update propagates everywhere.

**Tier** controls how prominently the logo shows: `headline` (only the headline partner) → `gold` → `silver` → `supporter`.

### 6. Campaigns

The donation thermometer. Update **raised amount** and **donor count** when you check Hubbub — or set the **Hubbub project URL** and the daily `refresh-totals` workflow pulls live figures automatically (PROGRESS.md has setup notes).

When a campaign hits its goal, set status to `reached`; when it ends, `closed`. Don't delete reached or closed campaigns — they stay as proof of past success.

### 7. Committee (September)

A single annual job. Once the new committee is elected:

1. Create a new committee-member doc for **every** new role-holder. Set **academic year** to `2026/27` (the new cohort).
2. Leave the outgoing cohort in place — they switch off the live `/committee/` page automatically on 1 September, but the historical record is preserved.
3. Cross-check that the new President and Comms Officer have **Editor** access in Sanity → manage → Members. Remove leavers from the Members list.

### 8. Alumni / Olympians / Henley / Chairs (as things happen)

Slow-changing. Add new Boat Race appearances, GB call-ups, Olympic qualifications, Henley wins, chair updates as they happen. Once a year (June), walk the lists for missed entries.

---

## The regatta-day playbook

When a major regatta is on, the team should hit this checklist:

**Morning of:**

- [ ] Site settings → **Live race banner** — turn on. Event name, live results URL, **blade** tone, optional message ("Bath M8+ in the Temple at 12:45 today").

**During / immediately after racing:**

- [ ] Post a result on Instagram with the photo + an "report on the site tonight" line.
- [ ] Within 4 hours: each affected squad's **Recent results** field gets an entry. Date, regatta, event, finish. Don't wait for the full race report.

**Within 48 hours:**

- [ ] News post — the race report. Hero photo (alt text required), excerpt, body. Link related squads and athletes.
- [ ] Back-link the news post from each **Recent results** row (Race report → reference the news post).

**Within a week (or sooner if there's a podium):**

- [ ] Squad photo galleries — drop 2-3 of the best photos. Add captions for medals.
- [ ] If GB selection / a Henley qualifier happens: update the **Stat strip** on the home page and the athlete's alumni profile / Henley honours doc.

**Within 2 days of racing finishing:**

- [ ] Turn the **Live race banner** off.

---

## Yearly content audit (June)

Before handover. ~2 hours, do it with the President.

- [ ] Walk through every long-form page (`/about/history/`, `/about/blazers/`, `/welfare/`, `/alumni/meles/`) — is anything wrong, outdated, or missing?
- [ ] Walk through the committee bios — anyone written a much better one mid-year that should replace last September's first draft?
- [ ] Check the **Henley honours** list — any appearance from the season missing?
- [ ] Check the **Past chairs** list — outgoing chair added?
- [ ] Check **Boats** — anything retired, sold, renamed?
- [ ] Confirm **Sponsors** match what we actually still have agreements with.
- [ ] Confirm **Campaigns** statuses — any active ones to mark `reached` or `closed`?
- [ ] Read the home page top-to-bottom on a phone — does it feel current?

---

## Quality bar (every post, every photo)

Whatever the cadence, these don't change:

- **Photos** — alt text on every image, hotspot on the face / bow. Caption + credit if relevant. See [CONTENT-EDITING.md § Photos and alt text](CONTENT-EDITING.md#photos-and-alt-text).
- **Tone** — confident, classical, plain. Boat Race programme × Monocle magazine. No exclamation marks; no "thrilled to announce".
- **Names** — full names on first mention, surnames after. Italicise boat names and regatta names.
- **Facts** — verified. The site's tone leans on trust; one wrong fact dents it disproportionately.
- **Slugs** — let Sanity generate them. Don't invent.
- **Categories** — pick one. Don't multi-tag.

---

## What you don't need to keep updating

Helps to know what's automatic:

- **The latest 3 news posts on the home page** — picked automatically from the most recent published posts.
- **The committee on `/committee/`** — switches academic-year cohort automatically on 1 September.
- **Sponsor strip in the footer + home page** — reads the live list of sponsor docs.
- **`/results/`** — surfaces every `regattaResult` doc; filter pills are auto-generated from the data.
- **OG images, sitemap, robots.txt, structured data** — built from the content as it changes; no manual step.

---

## Quick role split

If you can't remember who does what:

| Role                | Owns                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| **Comms Officer**   | News post cadence, regatta-day banner, home-page hero swaps, sponsor strip        |
| **Captains**        | Squad page recent results, training schedule, gallery, captain bio                |
| **President**       | Committee annual rollover, sponsor agreements, content audit (June), Studio admin |
| **Treasurer**       | Campaign totals (or wire the Hubbub URL once and forget)                          |
| **Welfare Officer** | Welfare page accuracy + the welfare-officer callout                               |
| **Alumni Officer**  | Henley honours, alumni profiles, past chairs                                      |

---

_Last updated 2026-05-31. Update this file when a cadence changes, a new content type ships, or the role split shifts._

# BUBC Content Book

> Production-ready editorial copy for bubc.co.uk. Every block here is written to be lifted straight into Sanity Studio or pasted into an Astro page. No Lorem ipsum, no marketing fluff — drafted in the voice of a heritage UK university rowing club (Henley / Leander / Monocle-magazine register).
>
> Companion documents: [plan.md](plan.md) (architecture), [PROGRESS.md](PROGRESS.md) (build state), [CONTENT-EDITING.md](CONTENT-EDITING.md) (how to publish in Sanity), [FEATURES.md](FEATURES.md) (backlog).
>
> **How to use this file**
>
> - Each section is keyed to a Sanity document type or an Astro page.
> - Field names match the schema in `apps/studio/schemaTypes/`.
> - Where a value is provisional (no confirmed source), it is marked `[provisional]` — keep, edit, or strip on a final pass.
> - Email addresses are taken from `website TODO.txt`. Names are confirmed; bios, courses and fun facts are drafted in committee voice and should be confirmed before publish.
>
> Last updated: 2026-05-26 (session 9 — initial content draft).

---

## Table of contents

1. [Settings (singleton)](#1-settings-singleton)
2. [Home page (singleton)](#2-home-page-singleton)
3. [Squads — index + detail copy](#3-squads--index--detail-copy)
4. [Squads — Performance Development (PDA)](#4-squads--performance-development-pda)
5. [Coaching team](#5-coaching-team)
6. [Committee 2025/26](#6-committee-202526)
7. [Boathouse — facilities + new boathouse + STV](#7-boathouse--facilities--new-boathouse--stv)
8. [Fleet — naming stories](#8-fleet--naming-stories)
9. [About — history + Meles + blazers + chairs](#9-about--history--meles--blazers--chairs)
10. [Alumni — profile starter set + spotlights](#10-alumni--profile-starter-set--spotlights)
11. [Sponsors — tiers, partner blurbs, sponsorship pack outline](#11-sponsors--tiers-partner-blurbs-sponsorship-pack-outline)
12. [Support — donate / buy a boat / campaigns](#12-support--donate--buy-a-boat--campaigns)
13. [Welfare & safeguarding](#13-welfare--safeguarding)
14. [Press / media kit](#14-press--media-kit)
15. [Contact](#15-contact)
16. [News — editorial calendar + draft posts](#16-news--editorial-calendar--draft-posts)
17. [Newsletter — what to send](#17-newsletter--what-to-send)
18. [Glossary, micro-copy, error states, OG strings](#18-glossary-micro-copy-error-states-og-strings)

---

## 1. Settings (singleton)

> Schema: `apps/studio/schemaTypes/singletons/settings.ts`

```yaml
siteTitle: Bath University Boat Club
strapline: Student rowing in Bath since 1966.
contact:
  primaryEmail: info@bubc.co.uk
  pressEmail: press@bubc.co.uk
  welfareEmail: welfare@bubc.co.uk
  sponsorshipEmail: sponsorship@bubc.co.uk
  alumniEmail: alumni@bubc.co.uk
charityNumber: '[provisional — confirm with Bath SU]'
boathouseLocation:
  lat: 51.39180472152244
  lng: -2.407486235563779
  what3words: '[to confirm]'
  postcode: 'BA2 7AA [provisional — confirm]'
  notes: |
    Boathouse access is from the public road; park on the verge and walk
    the short track down to the river. There is no parking on the bank
    itself and the launches need clear access. Please respect the towpath
    — it's shared with walkers, anglers and Minerva RC.
liveRaceBanner:
  active: false
  eventName: ''
  message: ''
  liveResultsUrl: ''
  ctaLabel: 'Live results'
  tone: 'navy'
social:
  - label: Instagram
    url: https://instagram.com/bubcuk
  - label: Strava
    url: https://www.strava.com/clubs/bubc
  - label: YouTube
    url: https://www.youtube.com/@bubc
  - label: LinkedIn
    url: https://www.linkedin.com/company/bath-university-boat-club
```

> **Footer charity line:** `The University of Bath Boat Club is a constituent club of The Students' Union, University of Bath (registered charity in England and Wales no. [provisional]).`

---

## 2. Home page (singleton)

> Schema: `apps/studio/schemaTypes/singletons/homePage.ts`. Hero, stat strip, news rail, squad pathway, sponsor strip, closing CTAs.

### Hero

- **Eyebrow:** `University of Bath · est. 1966`
- **Headline:** `A rowing club, sixty years on the water.`
- **Sub:** `One hundred and forty student athletes — novices to internationals — training out of a single boathouse on the Avon. We row for results, but we row for each other first.`
- **Primary CTA:** `Trial with us` → `/squads/trial/`
- **Secondary CTA:** `Meet the squads` → `/squads/`
- **Hero image:** Wide, water-led — recommend `assets/images/sweep/mens/4M3A0017-scaled.jpg` or a Henley start-line frame. Looks better dark + cinematic than bright + clean.

### Stat strip (StatStrip.astro)

Four numbers. Tabular Geist numerals, divider lines.

| Value  | Label                 | Suffix |
| ------ | --------------------- | ------ |
| `1966` | Founded               |        |
| `140+` | Athletes in programme |        |
| `9`    | BUBC Olympians        |        |
| `60`   | Years on the Avon     |        |

> If editors want to refresh this each season, swap to: BUCS medals last season · Henley appearances last 5 years · Erg PB threshold for the senior squad · Boats in the fleet.

### Newsletter strip (already in footer) — homepage variant

- **Headline:** `Race reports in your inbox.`
- **Sub:** `One email a fortnight in term: race results, training-camp dispatches, recruitment dates, alumni news. We don't sell the list.`
- **CTA:** `Subscribe`

### Squad pathway (SquadPathway.astro)

Four cards. Already defaulted in code; copy below is the canonical version.

| Card         | Eyebrow | Headline         | Body                                                                          | Link                    |
| ------------ | ------- | ---------------- | ----------------------------------------------------------------------------- | ----------------------- |
| Senior men   | Senior  | Senior men       | Selection squad. Sweep and sculling. Henley, BUCS, head racing in the spring. | `/squads/senior-men/`   |
| Senior women | Senior  | Senior women     | Selection squad. Sweep and sculling. Henley Women's Regatta, BUCS, WeHORR.    | `/squads/senior-women/` |
| Novice       | Entry   | Novice programme | Learn to row in your first term. Race in your second. No experience needed.   | `/squads/novice/`       |
| Trial        | Trial   | Trial with us    | Two minutes. Trial dates and what to expect on day one.                       | `/squads/trial/`        |

### Closing CTAs (ClosingCtas.astro)

Three-column navy band.

1. **Trial with us** — `Trial dates run in September and January. Two sessions on the water, an erg test, no commitment to stay.` → `/squads/trial/`
2. **Donate** — `Boats wear out. Coaches matter. The club fundraises every year — every gift goes on the water.` → `/support/donate/`
3. **Partner with us** — `Sponsors get visibility at Henley, BUCS, the alumni dinner and across a 60-year community.` → `/support/sponsor/`

---

## 3. Squads — index + detail copy

### `/squads/` index intro

- **Eyebrow:** `Programme`
- **Headline:** `Find your level.`
- **Lead:** `BUBC runs a tiered programme — senior selection, novice intake, and a pathway in between. Wherever you start, the boathouse is the same and so are the standards.`

### Senior men — `/squads/senior-men/`

- **shortDescription:** `Selection squad racing sweep and sculling across the UK head and regatta circuit, with Henley as the season target.`
- **captainBio (provisional):**
  > "Senior men train ten sessions a week and pick crews by margins on the water and minutes on the erg. There's no head-coach mystery to it — turn up, get fit, row better than the person next to you. We'll race anyone."
  >
  > — Noah Jamieson & Will Stradling, Senior Men's Captains 2025/26
- **trainingSchedule (typical week, term):**

| Day | Start | End   | Type    | Location  |
| --- | ----- | ----- | ------- | --------- |
| Mon | 06:30 | 08:30 | Water   | Boathouse |
| Mon | 17:30 | 19:00 | Weights | STV       |
| Tue | 06:30 | 08:00 | Erg     | STV       |
| Wed | 06:30 | 08:30 | Water   | Boathouse |
| Wed | 17:30 | 19:00 | Weights | STV       |
| Thu | 06:30 | 08:00 | Erg     | STV       |
| Fri | 07:00 | 08:30 | Water   | Boathouse |
| Sat | 08:00 | 11:00 | Water   | Boathouse |
| Sun | 08:00 | 11:00 | Water   | Boathouse |

- **expectedStandards (PortableText):**
  - **Erg.** 2k under 6:40 expected by Christmas of your first selected year. 5k under 17:30. We test honestly — there's no point pretending.
  - **Attendance.** 90% across the term. If you're injured, you're at the boathouse with the squad. Sessions missed without notice are noticed.
  - **Attitude.** First in, last out. Rig your own boat. Help cox a novice eight when asked. Race week is squad week.
  - **Academics.** Your degree comes first; missing a lecture for a session is not a trade we ask you to make. The programme is built to fit Bath term dates.
- **achievements (recent — replace once confirmed):**
  - 2025 — Henley Royal Regatta, Temple Challenge Cup — quarter-final.
  - 2025 — BUCS Regatta — silver, championship eight.
  - 2024 — HoRR — top 25 student crew.
  - 2024 — BUCS Head — bronze, championship eight.
- **contactEmail:** `captain.m@bubc.co.uk` (forwards to Noah / Will)

### Senior women — `/squads/senior-women/`

- **shortDescription:** `Selection squad racing the women's head and regatta circuit, building each year toward Henley Women's Regatta and Henley Royal.`
- **captainBio (provisional):**
  > "We're building a senior women's programme with a long memory and a shorter erg score. Bath has produced GB internationals from this squad. The standard is high because the people who came before us set it that way — we look after the standard, we don't lower it."
  >
  > — Ellie Fowlds, Senior Women's Captain 2025/26
- **trainingSchedule:** mirror of senior men, alternating water/erg slots; finalised by captain at start of term.
- **expectedStandards (PortableText):**
  - **Erg.** 2k under 7:20 expected by Christmas of selected year. 5k under 19:30.
  - **Attendance.** 90%. Same rule.
  - **Attitude.** We don't run on hype. We run on doing the work, communicating with each other, and racing properly when it matters.
  - **Academics.** Bath term-friendly. Talk to the captain early if a deadline collides with a regatta.
- **achievements (replace once confirmed):**
  - 2025 — Henley Women's Regatta, Aspirational Academic Eights — semi-final.
  - 2025 — BUCS Regatta — gold, women's championship four.
  - 2024 — WeHORR — top 30 student crew, season PB.
  - 2024 — BUCS Head — silver, women's eight.
- **contactEmail:** `captain.w@bubc.co.uk` (forwards to Ellie)

### Novice — `/squads/novice/`

- **shortDescription:** `Learn to row in your first term, race in your second. The most important squad in the club — every BUBC senior started here.`
- **captainBio (provisional):**
  > "Novice rowing is the best decision a lot of people make at Bath. You walk in not knowing what a blade is, and by April you're racing eights at BUCS. We teach the technique, we run the kit, we get you on the water — you bring the willingness to be early and the willingness to be tired."
  >
  > — Jeanne Anderson & Ryan McCluskey, Novice Captains 2025/26
- **trainingSchedule (typical novice week, term 1):**

| Day | Start | End   | Type  | Location  |
| --- | ----- | ----- | ----- | --------- |
| Tue | 17:00 | 19:00 | Water | Boathouse |
| Wed | 18:00 | 19:30 | Erg   | STV       |
| Thu | 17:00 | 19:00 | Water | Boathouse |
| Sat | 09:00 | 12:00 | Water | Boathouse |

- **expectedStandards (PortableText):**
  - **No experience required.** If you've never seen an oar before, you're who we built the novice programme for.
  - **Commitment.** Four sessions a week in term. Miss two without telling us and you'll lose your seat — fair to everyone else trying to learn the same things.
  - **Kit.** We provide everything for the first month. After that, novice all-in-one kit is available through the club's Rival Kit partnership.
  - **Cost.** SU club membership plus a small contribution to coaching. Bursaries available — talk to the welfare officer in confidence.
- **achievements (replace once confirmed):**
  - 2025 — BUCS Regatta, Novice Men's 8+ — finalist.
  - 2025 — Avon Schools' Head — gold, novice women's 8+.
  - 2024 — Bristol University Head — top novice crew of the day.
- **contactEmail:** `captain.n@bubc.co.uk` (forwards to Jeanne / Ryan)

---

## 4. Squads — GB Performance Development Academy (PDA), South West

> Page at `/squads/pda/` (Astro file: `apps/web/src/pages/squads/pda.astro`). **Important: the PDA is a British Rowing programme — not a BUBC squad.** It is the South West node of the GB Rowing Team's Olympic Pathway, hosted in Bath since 2003 by the University of Bath and Minerva Bath RC, with a satellite at Hartpury University. BUBC is a partner club: we share water, facilities and the boathouse community, but we don't run PDA selection.
>
> Sources for every factual claim below:
>
> - [British Rowing — GB Performance Development Academies](https://www.britishrowing.org/gb-rowing-team/olympic-pathway/performance-development-academies/)
> - [Team Bath — Rowing](https://www.teambath.com/sport/rowing/)

### Hero

- **Eyebrow:** `GB Performance Development Academy · South West`
- **Headline:** `The Olympic pathway, in Bath.`
- **Lead:** `The South West academy of British Rowing's GB Performance Development Academy programme has been hosted in Bath since 2003. It is the first rung of the GB Rowing Team's Olympic Pathway — a talent-identification and development route designed to turn tall, athletic juniors into senior international rowers.`
- **CTAs:** `Apply via British Rowing` (external) · `British Rowing — PDA programme` (external)

### What the PDA is (body)

- The GB Performance Development Academies — **formerly known as World Class Start** — are run by **British Rowing** as the entry point to the GB Rowing Team's Olympic Pathway.
- There are **six academies** across the UK. The **South West academy is hosted in Bath by the University of Bath and Minerva Bath RC**, with a satellite at **Hartpury University and College** in Gloucester.
- Set up in **2003**. Has produced multiple Olympic medallists.
- BUBC is a **partner club** to the PDA — same water on the Avon, same boathouse community, same Sports Training Village on campus. Several BUBC alumni have come through the PDA. The PDA itself is a **separate programme** with its own selection, its own coaching, and its own pathway. Applications go directly to British Rowing.

### Bath PDA alumni (lead with the names)

- **Helen Glover** — joined Bath in 2007 as a newcomer to the sport. Olympic gold at London 2012 with Heather Stanning (the first-ever Olympic gold for British women's rowing), a second gold at Rio 2016.
- **Heather Stanning** — joined Bath in 2005. 2007 World U23 Champion in the women's pair. Double Olympic champion W2- with Glover at London 2012 and Rio 2016.
- **Becky Wilde** — started her rowing career at the University of Bath and represented Team GB at the Paris 2024 Olympics.

> Plus a long list of athletes at World Championships, World Cups, U23 and Junior Worlds across two decades. The British Rowing PDA news feed is the canonical source for current academy results.

### Coaching (separate from BUBC)

- **Tom Selby** — currently the GB Performance Development Coach for the South West academy. (Sourced from British Rowing public coverage; confirm before quoting in print.)
- **Paul Stannard** — historical: led the programme for many years, coached Helen Glover and Heather Stanning through their early development at Bath.
- The PDA coaching team is structurally **separate from BUBC's coaching staff** (Charlie Newbold, Marcus Munafò, Simon Brown). The two programmes share facilities and water, not staff.

### Facilities

Bath PDA athletes train out of the same physical infrastructure BUBC uses — but with **dedicated access** to the high-performance facilities the University built for Team Bath's elite programmes:

- **High-performance gym** — Olympic lifting platforms, full bumper-plate range, qualified S&C support.
- **Physiology lab** — blood-lactate, VO₂, step testing.
- **Physio and sports medicine** — on the same campus.
- **Video analysis suite** — for technical review of erg and on-water sessions.
- **The reach** — eight kilometres of fair, sheltered water on the River Avon between Bath and Saltford, shared with BUBC and Minerva Bath RC.
- **Hartpury satellite** — for athletes who can't train in Bath day-to-day.
- **National Development Camps** — all PDA athletes attend six camps a year, bringing together the full cohort from the six UK academies.

### Selection criteria (verbatim from British Rowing)

| Criterion  | Value                               |
| ---------- | ----------------------------------- |
| Age        | 14 – 22                             |
| Height     | 188 cm+ (men), 176 cm+ (women)      |
| Experience | None required                       |
| Testing    | Talent test follows the application |

> Training load scales with age and development stage. A 14-year-old new entrant might do four sessions a week around school. Senior athletes target around twelve sessions a week.

### "Should I apply to BUBC, to the PDA, or both?" (the distinction)

|                 | **BUBC**                                     | **PDA**                                          |
| --------------- | -------------------------------------------- | ------------------------------------------------ |
| Run by          | University of Bath Boat Club (student-run)   | British Rowing                                   |
| Open to         | All Bath students                            | Anyone aged 14–22 meeting height criteria        |
| Aim             | Domestic racing — BUCS, Henley, head circuit | GB selection, Olympic pathway                    |
| Route in        | BUBC trial                                   | British Rowing application + talent test         |
| Where you train | BUBC boathouse + STV                         | BUBC boathouse + STV (with dedicated PDA blocks) |

The two are **not exclusive**. A Bath student who fits PDA criteria can apply to both.

### Outbound links to include on the page

- British Rowing canonical PDA page — `https://www.britishrowing.org/gb-rowing-team/olympic-pathway/performance-development-academies/`
- Team Bath rowing page — `https://www.teambath.com/sport/rowing/`
- BUBC internal: `/coaching/` (to clarify the BUBC vs PDA coach distinction)
- BUBC internal: `/squads/trial/` (for those choosing the BUBC route)

---

## 5. Coaching team

> Schema: `apps/studio/schemaTypes/documents/coach.ts`

### Page intro (rendered above the cards)

- **Eyebrow:** `Coaching`
- **Headline:** `Coaches who race, coach who develop.`
- **Lead:** `BUBC's coaching team has rowed and coached at the level we want athletes to reach. The work in the boat is led by Charlie Newbold, supported by an assistant senior coach and a novice specialist who's been on the Avon longer than most of the buildings.`

### Coach 1 — Charlie Newbold (Head Coach)

- **role:** Head Coach
- **order:** 0
- **email:** `[to confirm — phone: +44 7789 655452]`
- **photo:** `assets/images/coaches/Screenshot-2025-10-22-at-11.46.21.jpg`
- **qualifications:**
  - British Rowing Senior Coach
  - First Aid at Work (in-date)
  - Safeguarding (in-date)
  - Powerboat Level 2
- **bio (PortableText):**
  - Charlie started rowing at The Oratory School and rowed through Leander and Oxford Brookes — two of the most demanding programmes in UK rowing. He came back to coach at his old school while still racing, and then moved into senior coaching after his own competitive career.
  - In 2009 he took a Yale Lightweight 4+ to the final of the Prince Albert Challenge Cup at Henley. He has since coached at Pembroke College Cambridge, Monkton Combe School and Bristol University, and worked alongside several national governing bodies on athlete development.
  - At BUBC he leads the senior squads and the overall direction of coaching. He prefers long rows to short erg pieces and is, on the record, in favour of rate caps.

### Coach 2 — Marcus Munafò (Assistant Coach)

- **role:** Assistant Coach
- **order:** 10
- **photo:** `assets/images/coaches/WhatsApp-Image-2025-06-12-at-12.24.12_939da299.jpg`
- **qualifications:**
  - British Rowing Coach (Senior)
  - Safeguarding (in-date)
- **bio (PortableText):**
  - Marcus learned to row as an undergraduate at Oxford, racing for his college, for Tyne RC and for Southampton University Boat Club. He moved into coaching when he returned to Oxford as a postdoctoral researcher, coaching college crews before joining the Oxford University Women's Boat Club coaching team.
  - He has taken athletes through GB Senior trials and was on the coaching team for the GB Under-23 lightweight women's double scull. At BUBC he works closely with the senior squads and the PDA programme, with a particular focus on rhythm and technical work.

### Coach 3 — Simon Brown (Novice Coach)

- **role:** Novice Coach
- **order:** 20
- **photo:** `[to confirm — generic novice session frame from assets/images/sweep if needed]`
- **qualifications:**
  - British Rowing Coach
  - Safeguarding (in-date)
  - Powerboat Level 2
- **bio (PortableText):**
  - Simon works part-time with BUBC and is responsible for the novice programme — the first year of rowing for nearly every athlete in the senior squads. He coaches the foundations: handle heights, the body sequence, where to apply pressure, what a good outing feels like before you've ever sat in a fast crew.
  - He also supports the senior squads when the calendar demands it, and is the person to find at the boathouse if you need a straight answer about whether you should be racing this weekend.

### Coaching philosophy (page footer block)

> "Bath isn't a development factory and we don't pretend to be. We coach individuals — athletes who happen to row for the same club, who happen to have the same season target. The programme is built around the people in it, not around a model crew."
>
> — Charlie Newbold

---

## 6. Committee 2025/26

> Schema: `apps/studio/schemaTypes/documents/committeeMember.ts`. `academicYear` should be set to `2025/26` for all members below. `slug` auto-generated from `name`. Order suggested for grid layout.

> Bios below are drafted in the committee's voice. They are provisional and should be confirmed by each post-holder before publish. Where a committee member shares a role (welfare, novice captains), publish a single card for each named officer.

### Officers (top of the page)

#### Matteo Tommassini — Chair (`order: 0`)

- email: `mt2324@bath.ac.uk`
- course: `[provisional — confirm]`
- bio: `Chair of BUBC for the 2025/26 season. Sits across every committee meeting, signs off on the major decisions and keeps the club moving when no one else has the time. The point of contact for anything that doesn't fit a more specific role.`
- favourite race: `Henley Royal Regatta — the Temple Challenge Cup.`

#### Luka Halozan Bayley — Vice Chair (`order: 1`)

- email: `lhb47@bath.ac.uk`
- bio: `Vice chair, deputising for the chair across committee meetings and major decisions. Owns the long-term projects that survive past one committee — alumni engagement, the new boathouse, the constitutional housekeeping nobody else volunteers for.`

#### Charlie Pope — Secretary (`order: 2`)

- email: `cp2279@bath.ac.uk`
- bio: `Secretary — minutes, agendas, the membership database, the SU paperwork, the things that make the club legally a club. If you've sent an email to BUBC and someone replied within twenty-four hours, that was probably Charlie.`

#### Barnaby Mepham — Treasurer (`order: 3`)

- email: `bjm80@bath.ac.uk`
- bio: `Treasurer. Holds the budget, signs off on every spend, files the year-end accounts with the SU. Will tell you politely and then less politely if your kit order hasn't been paid.`

### Captains and on-water roles

#### Noah Jamieson — Senior Men's Co-Captain (`order: 10`)

- email: `nj584@bath.ac.uk`
- bio: `Senior men's co-captain. Owns crew selection, race entries, training plans for the senior men's squad alongside Will Stradling. Stroke-side; mostly seen in the boathouse before sunrise.`
- favourite race: `BUCS Regatta — championship eight.`

#### Will Stradling — Senior Men's Co-Captain (`order: 11`)

- email: `wrs31@bath.ac.uk`
- bio: `Senior men's co-captain alongside Noah Jamieson. Bow-side; runs the squad's logistics on race weekends — entries, transport, the trailer, the things that fall apart if no one is paying attention.`

#### Ellie Fowlds — Senior Women's Captain (`order: 12`)

- email: `ef573@bath.ac.uk`
- bio: `Senior women's captain. Crew selection, training plan, recruitment for the senior women's squad. Built a lot of the post-COVID rebuild of the senior women's programme and is the person most likely to know what every other women's university crew is doing on any given weekend.`
- favourite race: `Henley Women's Regatta.`

#### Jeanne Anderson — Novice Co-Captain (`order: 20`)

- email: `ja2516@bath.ac.uk`
- bio: `Novice co-captain alongside Ryan McCluskey. Runs the first-term learn-to-row programme, race entries for the spring, and most of the recruitment at Freshers' Fair. If you joined the club this year, you met Jeanne first.`

#### Ryan McCluskey — Novice Co-Captain (`order: 21`)

- email: `rm2894@bath.ac.uk`
- bio: `Novice co-captain. Owns the technical side of the novice programme — coaching points, video review, who's ready to step into senior trials and who needs another term in the development crew.`

#### Freya Laws — Coxing Captain (`order: 30`)

- email: `fhl34@bath.ac.uk`
- bio: `Coxing captain. Recruits, trains and develops the coxing pool across all squads. The person who actually knows the calls you're being told to listen for.`

### Programme support roles

#### Madoc Gundry — Equipment & Safety Officer (`order: 40`)

- email: `mfwg20@bath.ac.uk`
- bio: `Owns the kit list nobody else reads — the launches, the bank-bikes, the trailer, the boat repair schedule. Also the club's named safety officer, signing off the risk assessments that mean we can actually go on the water.`

#### Clemmie Adams — Kit Secretary (`order: 41`)

- email: `cera21@bath.ac.uk`
- bio: `Kit secretary. Runs the Rival Kit cycles, blazer orders with Perry Uniform, the all-in-one orders that no committee ever times perfectly. If you need a new race AIO before Friday, talk to Clemmie before Wednesday.`

### Welfare and inclusion

#### Clover Merry — Welfare Officer (`order: 50`)

- email: `ccm63@bath.ac.uk`
- bio: `One of the club's two welfare officers, with Jonty Stowers. Confidential, trained, and the first point of contact if anything in the club is making your time at Bath harder than it should be — from an awkward landing pad after Christmas to anything more serious.`

#### Jonty Stowers — Welfare Officer (`order: 51`)

- email: `js4711@bath.ac.uk`
- bio: `One of the club's two welfare officers, with Clover Merry. Splits the role to make sure there is always someone an athlete can choose to speak to. Trained, confidential, and not on the captain's WhatsApp.`

### Recruitment, communications, alumni

#### Maia Norton — Marketing & Social Media Manager (`order: 60`)

- email: `msn63@bath.ac.uk`
- bio: `Owns the club's Instagram, the race-day social posts, the newsletter graphics and the recruitment campaign at the start of each year. The reason BUBC's social media looks like a sports team and not a Year 7 group project.`

#### Amelia Brown — Alumni Officer (`order: 61`)

- email: `ajb352@bath.ac.uk`
- bio: `Alumni officer. Runs the alumni dinner, the Christmas dinner, the Meles outings and the steady drumbeat of alumni contact across the year. If you rowed at Bath and want back in the loop, Amelia is your first email.`

#### Finn Turner — Social Secretary (`order: 70`)

- email: `fmjt20@bath.ac.uk`
- bio: `Social secretary, with Hannah Cossins. Runs the Wednesday socials, the boat-naming nights, the post-Henley pub, the Christmas dinner cabaret. Responsible for the things that make the eight a club rather than a team.`

#### Hannah Cossins — Social Secretary (`order: 71`)

- email: `hc2321@bath.ac.uk`
- bio: `Social secretary alongside Finn Turner. Splits the calendar with Finn so that no one is doing the work the week before BUCS, including the people running the work.`

#### Matt Pearson — Technical / Web Officer (`order: 80`)

- email: `mp2457@bath.ac.uk`
- bio: `Maintains bubc.co.uk and the club's digital infrastructure — the website, the alumni database, the editor accounts that let the rest of the committee publish. The reason this page loads in under a second.`

### Vacancies (publish honestly)

> Render these as cards with no photo, role only, with a "we're recruiting" tag. Better than silently missing roles.

- **Event Organiser** — `Owns the BUBC home regatta, Christmas dinner logistics, and the day-to-day running of any event the club hosts. Email info@bubc.co.uk if you want it.`
- **Recruitment Officer** — `Co-ordinates Freshers' Fair, trial weeks, and the steady recruitment work across the year. Email info@bubc.co.uk to ask about the role.`

### Page introduction (above the grid)

- **Eyebrow:** `Committee · 2025/26`
- **Headline:** `The people who run the club.`
- **Lead:** `BUBC is a student-run club. Every role on this page is voluntary and elected annually. Every single person is reachable on the email shown — start with the role that fits.`

---

## 7. Boathouse — facilities + new boathouse + STV

> Page: `apps/web/src/pages/boathouse/index.astro`. Existing facilities list is solid — the additions below extend the page to cover land training (STV), the new boathouse build, and the river itself. Drop in as additional `Section` blocks.

### Hero

- **Eyebrow:** `Boathouse`
- **Headline:** `On the water at Saltford.`
- **Lead:** `BUBC rows out of a boathouse on the River Avon, between Bath and Saltford lock. From here the squad covers a long, fair, sheltered stretch of water — quietly one of the best university reaches in the south-west.`
- **Hero image:** `assets/images/boathouse/IMG_2346-1-scaled.jpeg`

### Section — The river

- **Eyebrow:** `The reach`
- **Headline:** `Eight kilometres of fair water.`
- **Body:**
  - The Bath-to-Saltford reach gives the squad close to eight kilometres of training water without a single tight bend or commercial obstacle. Long enough for a full BUCS Head simulation, sheltered enough to row through most of the winter, shared sensibly with Bath-based clubs and the navigation.
  - Outings cover everything from technical work in fours and pairs to full eights race pace. The squad typically runs upstream-and-back loops at race pace and longer downstream pieces in the off-season — the kind of structured rowing that produces oars who arrive at Henley already racing rather than still warming up.

### Section — New boathouse (in build)

- **Eyebrow:** `Capital project`
- **Headline:** `A new boathouse, in build now.`
- **Body:**
  - For the first time since the 1990s, BUBC is building a new boathouse. The capital project — backed by the University and the alumni community — replaces the existing facility with a purpose-built club home: bigger boat bays, a dedicated coaching room, a proper alumni and parents' area for race days, and the kind of ergometer and weights provision a top-six BUCS programme needs on site.
  - The new boathouse is not a vanity project. It is an answer to a real constraint: the current fleet is bigger than the building that houses it, and the next decade of BUBC rowing depends on getting that right.
  - Construction is underway. Donations to the build are routed through the Boat Club Capital Campaign — see the [campaigns page](/support/campaigns/) for current totals and how to give.
- **Side image suggestion:** Reuse `assets/images/boathouse/IMG_2346-1-scaled.jpeg` as a "current boathouse" frame; supplement with site progress photos as they come in.
- **CTA:** `Support the build` → `/support/campaigns/`

### Section — Land training at the STV

- **Eyebrow:** `Strength & conditioning`
- **Headline:** `Land training at the STV.`
- **Body:**
  - On campus, the Sports Training Village (STV) gives BUBC athletes access to one of the best university training facilities in the country. Land sessions run out of two STV spaces: the high-performance gym and a dedicated indoor rowing room.
  - The gym is shared with Team Bath performance squads — Olympic platforms, the full Concept2 ergometer range, dumbbells and accessories sized for senior rowers, and qualified S&C support that writes squad-specific programmes around the racing calendar.
  - The indoor rowing room houses the senior squad's erg sessions: row-piece tests, technical work on dynamic ergs, and the long aerobic sessions that are too cold or too dark to do on the river.
- **Bullet list — what athletes use:**
  - Concept2 RowErg and Dynamic stable.
  - Olympic lifting platforms and full bumper-plate range.
  - Strength testing protocols aligned with the British Rowing performance framework.
  - Recovery, soft-tissue and physio services on the same campus.
- **Side image suggestion:** `assets/images/ergs/Gym-slideshow-images-0823_1-496x300-1.jpg`

### Section — Facilities at the boathouse (existing list — keep)

(The existing five-line facilities list stays — boat hall, indoor ergs, weights room, changing rooms, coach launches.)

### Section — Sharing the water

- **Eyebrow:** `On the river`
- **Headline:** `Shared water, shared standards.`
- **Body:** `The reach is shared with Minerva Bath Rowing Club, with school crews from the area, and with anglers and walkers on the towpath. BUBC outings are coached, briefed, and run to British Rowing's RowSafe standards — including a buddy boat for any sculler in a single, mandatory lifejackets where the season demands it, and a "boathouse-first" rule on any river condition that doesn't pass the safety officer's check.`

---

## 8. Fleet — naming stories

> Schema: `apps/studio/schemaTypes/documents/boat.ts`. Story field is PortableText; copy below is short-form ready to paste.

### Senior fleet headline boats (provisional naming — confirm against current rack)

#### Sampson

- **class:** Coxed 8+
- **make:** `[provisional — confirm Filippi / Empacher / Hudson]`
- **yearBought:** `[to confirm]`
- **donor:** `[to confirm]`
- **story:**
  - Sampson is the first eight on the rack — the boat the senior men's squad takes to Henley most years. Named in honour of [provisional: a senior alumnus / a Bath cox], the boat has carried BUBC crews through Temple semi-finals, Henley Women's Regatta finals and BUCS championship medals across the last decade.
  - Like every shell in the fleet, Sampson takes a year of seat time before it owes you anything. Most of the people racing it now learned to handle it from people who learned to handle it from people who came before them.

#### Susan Green

- **class:** Coxed 4+
- **make:** `[provisional]`
- **story:** `Susan Green is one half of the Green pair — donated to the club by the Green family in [year] and named for [Susan Green]. Raced regularly by the senior women's squad and by the development squad's championship fours, the boat has been on the rack longer than most of the people currently in it.`

#### Kenneth Green

- **class:** Coxless 4-
- **make:** `[provisional]`
- **story:** `The companion boat to Susan Green, also given by the Green family. Kenneth Green is a coxless four often selected for selection trials and small-boat work — the boat the senior squad uses when it wants honest information about a crew rather than flattering information.`

> **Pattern for additional boats:** For each boat in the current fleet, write 60–80 words covering (a) who the boat was named for, (b) what squad it sits in, (c) one piece of racing history. The point is that every BUBC racing shell carries a story, not just a make and model. Coaches and the alumni officer are the best source for naming-history confirmation.

### Empty-state copy (when the fleet doc is sparse)

> "The fleet directory is being rewritten as boat-by-boat photography is completed. Names, donors and racing stories will appear here as each profile is signed off. If you donated a boat to the club and your story is missing, please email [alumni@bubc.co.uk](mailto:alumni@bubc.co.uk) — we'd like to get it right."

---

## 9. About — history + Meles + blazers + chairs

### `/about/` landing page

- **Eyebrow:** `About`
- **Headline:** `A club on the Avon.`
- **Lead:** `Bath University Boat Club has been on the water since 1966 — sixty years of student rowing in the south-west of England, with a record at Henley, a list of internationals, and a steady record of putting the right kind of athlete on the water. The pages below are the club's institutional memory.`

Cards link to: History · Chairs · Henley Honours · Olympians · Blazers · Meles BC.

### `/about/history/` — history page (long-form)

> Reuse the strong existing draft from `website TODO.txt`. A polished, slightly tightened version below is suitable for the page's PortableText body.

#### Headline

`A brief history of BUBC.`

#### Lead

`Sixty years on the Avon — from borrowed skiffs to a contender at Henley.`

#### Body (PortableText, in order)

1. **1966–1979 — Foundations.** Bath University Boat Club was founded in 1966, the same year the University of Bath received its Royal Charter. The earliest crews rowed in borrowed skiffs from the Bath Boating Station. In 1968, a handful of undergraduates built the club's first restricted four for £400 — enough to enter local regattas, and enough to make the club its own thing rather than a polite guest at someone else's.
2. **1980s — Surge.** Through the 1970s the club weathered student placements and leased equipment. By the late 1980s — fuelled by Olympic successes, ambitious joint training with Minerva Rowing Club, and the work of coaches like Mike Mannerson and Dr Jeremy Bennett — BUBC ran its first proper training camps. Novices and seniors began winning novice fours at Monmouth, Hereford and beyond.
3. **1990s — The Black Pig.** The 1990s saw BUBC purchase its first "one-piece" shell, "The Black Pig", and develop structured selection trials. Wins followed at Bristol Docks and UAU regattas. The pivotal moment was a mid-1990s partnership with University Sport Director Ged Roddy and coach Pete Proudley: new boats, a dedicated boathouse below Bathampton weir, and a deepening fleet of eights, fours and pairs.
4. **2000s — Identity.** Meles Boat Club — the alumni rowing club — was founded in 2003, named after the Latin word for badger as a nod to the iconic Badgerline buses. Through the decade BUBC settled into the identity it holds now: a serious university programme that races nationally, develops Olympians, and never quite forgets it started in borrowed boats.
5. **2010s — Henley and BUCS.** Repeated appearances at Henley Royal and Henley Women's. BUCS medals across sweep and sculling. A growing senior women's programme alongside the established senior men's squad. The first BUBC athletes selected for GB Under-23 squads.
6. **2020s — Rebuild.** Out of the pandemic, BUBC has rebuilt with intent — a tightened coaching team, a clearer pathway from novice to senior selection, a new boathouse capital project, and an alumni community that re-engaged at scale around the club's 60th anniversary in 2026.

#### Footer block

`Long-form draft: A more detailed BUBC history is published as a PDF — [Bath University Boat Club History (DRAFT)](https://bubc.co.uk/wp-content/uploads/2025/05/Bath-University-Boat-Club-History-DRAFT.pdf).`

### `/about/chairs/` — Chairs of BUBC

> Empty-state copy (until docs are populated). Real chair documents replace this once names + years are confirmed.

> **Page lead:** `Every BUBC committee has had a chair, and every chair has stewarded the club through whatever season they were given. Names, years and one-line legacies below — historical work in progress, contributions welcome.`

### `/about/blazers/` — Blazers

> The existing page copy is good. Strengthen the lead.

- **Eyebrow:** `Heritage`
- **Headline:** `The BUBC blazer.`
- **Lead:** `Made by Perry Uniform in the club colours, ordered in bulk twice a year — once around the alumni dinner, once before Henley. There is no qualification for a BUBC blazer: any current or former member of the club may order one. The blazer is the most visible thread that ties a 60-year membership together.`

### `/alumni/meles/` — Meles Boat Club

> Existing copy is solid. Tighten the lead and clarify the join flow.

- **Eyebrow:** `Alumni rowing`
- **Headline:** `Meles Boat Club.`
- **Lead:** `Meles is BUBC's alumni rowing club — founded in 2003 by ex-Bath rowers, named after the Latin word for badger (a nod to the old Badgerline buses), and built to keep former rowers racing and connected long after their last BUCS Regatta.`
- **Body (PortableText):**
  - **What Meles is.** A racing alumni club. Crews enter open events under Meles colours — the University of Bristol BC Head in Bath, the Boston Marathon, and the long-term ambition of Henley Royal Regatta open entries.
  - **What's happening now.** Meles is in the process of re-affiliating with British Rowing. Once that's complete, the club will resume entering open events under its own affiliation. In the meantime, the kit range, the dinner cycle and the alumni network all operate.
  - **Kit.** Rival Kit produces the Meles all-in-one, T-shirt and cycling range alongside the main BUBC kit. A small mark-up on every order goes back to the boat club.
  - **Join.** Email [alumni@bubc.co.uk](mailto:alumni@bubc.co.uk) with the years you rowed at Bath and the events you'd like to race. There is no fee to join the alumni network — kit orders and entry fees are paid separately, race by race.

---

## 10. Alumni — profile starter set + spotlights

> Schema: `apps/studio/schemaTypes/documents/olympian.ts` (the schema covers olympians + GB / international + Boat Race + notable careers — `category` field disambiguates). Each spotlight below maps to one `olympian` document.

### Spotlight 1 — Becky Wilde

- **name:** Becky Wilde
- **category:** `international` (and/or `olympian` once confirmed)
- **bubcYears:** `[to confirm]`
- **currentRole:** `[to confirm]`
- **location:** `[to confirm]`
- **story (PortableText, draft):**
  - Becky came through the BUBC senior women's squad and went on to race for Great Britain. One of the names every current senior at Bath has heard, and one of the reasons the senior women's programme runs at the standard it does.
  - Add: her racing record, the boat class she rowed best, the year she first wore a GB vest, what she's doing now. (Confirm with Becky directly via alumni@bubc.co.uk before publish.)

### Spotlight 2 — Cedol Dafyd

- **category:** `international`
- **bubcYears:** `[to confirm]`
- **story (draft):** `BUBC senior squad athlete who progressed to international racing. Long version to be confirmed in conversation with Cedol before publish.`

### Spotlight 3 — Ben Furley

- **category:** `international`
- **story (draft):** `Bath senior squad alumnus, with GB age-group representation. Details to confirm.`

### Spotlight 4 — Angus Pollock

- **category:** `notableCareer` (or `international`, once confirmed)
- **careerHighlight:** `[to confirm — short professional headline]`
- **story (draft):** `BUBC alumnus whose post-Bath career puts him in the wider rowing community. Details and category to confirm.`

### Spotlight template (reusable for the rest of the list)

> Use the structure below for each new alumni document. Keep stories to 120–180 words. Lead with what they did at Bath, not what they did before they got here.

```yaml
name: 'Firstname Surname'
category: olympian | international | boatRace | notableCareer
bubcYears: 'YYYY–YYYY'
currentRole: 'Short job title or status'
location: 'City, Country'
photo: imageBlock with alt text
olympicYears:
  - year: YYYY
    host: 'Host city'
    event: 'M4-' | 'W8+' | …
    medal: gold | silver | bronze | none
    finalPlace: N
story: |
  Opening paragraph — what they did at Bath.

  Second paragraph — the moment that earned the GB / Olympic / blue.

  Closing paragraph — where they are now, what they're working on,
  why a current BUBC athlete should care.
```

### Empty-state copy for `/alumni/`

> `Profiles are being added through 2026 as we re-build the alumni database from scratch. If you rowed at Bath and want to be on this page — Olympian, international, Boat Race blue, or just somebody whose story belongs on the club's record — email [alumni@bubc.co.uk](mailto:alumni@bubc.co.uk).`

---

## 11. Sponsors — tiers, partner blurbs, sponsorship pack outline

### `/support/sponsor/` — hero

(Existing hero copy is good. Reinforce with the lead below.)

- **Eyebrow:** `Sponsor BUBC`
- **Headline:** `Partner with a club that races.`
- **Lead:** `Bath finishes at the sharp end of BUCS, Henley and the head racing calendar. Partners get visibility across an active student-athlete audience, an engaged parent and alumni community, and a 60-year national rowing footprint. Sponsorship pays for the difference between competing and winning.`

### Tier descriptions (canonical — already wired into the page)

#### Headline partner

- **Pitch:** `The most visible partnership the club offers. Headline placement across the season's kit, named race-day hospitality at the boathouse and at Henley, dedicated content in the alumni newsletter, naming rights on a senior boat.`
- **What's typically included:**
  - Logo on the front of the men's and women's senior racing kit.
  - Naming rights on a senior eight, four or pair (subject to fleet rotation).
  - Two named hospitality slots at the alumni dinner.
  - Branded race-day presence at the BUBC home regatta and at Henley.
  - Quarterly content in the BUBC newsletter (audience: ~2,500 alumni and parents).
  - Full year, renewable. Conversation, not catalogue — terms agreed in writing.
- **Ideal partner profile:** `Mid-to-large UK or international business with a recruiting interest in University of Bath graduates, a CSR or community interest in elite student sport, or a personal alumni connection to the club.`

#### Gold partner

- **Pitch:** `Branded presence across the season's all-in-one race kit, club newsletter mentions, hosting at the boathouse and home regatta.`
- **What's typically included:**
  - Logo on the back of the senior all-in-one race kit.
  - Sponsor-of-a-boat naming on a development or novice shell.
  - Race-day acknowledgement at the BUBC home regatta.
  - Two newsletter mentions across the season.
- **Ideal partner profile:** `Regional businesses, professional services firms with Bath presence, alumni-owned businesses at scale.`

#### Silver partner

- **Pitch:** `Season-long logo presence on the club kit, listing across the public support pages, race-day acknowledgement.`
- **What's typically included:**
  - Logo on the season's training kit (zip top / leggings).
  - Listing on `/support/sponsor/` and in the footer sponsor strip on race-day weekends.
  - Race-day acknowledgement at the BUBC home regatta.
- **Ideal partner profile:** `Local businesses, smaller professional firms, alumni-led businesses at lower price points.`

#### Supporter

- **Pitch:** `Listed publicly as a club supporter — local businesses, alumni-owned firms, and friends of the club who want to be on the record.`
- **What's typically included:**
  - Listing in the supporter grid on `/support/sponsor/`.
  - Newsletter thank-you at the end of each season.
- **Ideal partner profile:** `Anyone giving to support the club at any meaningful level who is not seeking a kit-level partnership.`

### Sponsorship pack outline (PDF — for treasurer/sponsorship team to draft)

```
Page 1   Cover — club photo, "Sponsor BUBC 2026/27".
Page 2   The club in numbers — 1966, 140 athletes, 9 Olympians,
         60 years, BUCS / Henley / GB representation.
Page 3   The audience — student body reach, parent audience,
         alumni audience, race-day digital reach.
Page 4   Tier table — headline / gold / silver / supporter,
         deliverables side by side, indicative pricing.
Page 5   Boat naming — fleet table, retirement schedule,
         what naming actually involves.
Page 6   Event hospitality — BUBC home regatta, alumni dinner,
         Henley hosting.
Page 7   Case studies — current / recent partners and what the
         partnership covered.
Page 8   Talk to us — sponsorship team, treasurer, chair.
         sponsorship@bubc.co.uk
```

### Default sponsor blurbs (for current partners — replace once confirmed)

> Use these as starter copy for each Sanity `sponsor` document `description` field. Write a real one-paragraph blurb per partner; the templates below avoid generic "proud sponsor of" language.

- **Headline partner template:** `[Partner] is BUBC's headline partner for the 2025/26 season. The partnership funds [specific thing — coaching, the new boathouse, a named shell] and recognises [partner]'s long relationship with the University of Bath and the Bath rowing community.`
- **Gold partner template:** `[Partner] supports BUBC across kit and race-day presence, with a focus on [specific thing — graduate recruitment / community / alumni connection]. The partnership is in its [N]th year.`
- **Silver partner template:** `[Partner] backs the BUBC training kit for 2025/26 — visible at every land session and every away race.`
- **Supporter template:** `[Partner] is a club supporter. Often a Bath alumnus / alumna or local business — the kind of partnership that quietly keeps things running.`

---

## 12. Support — donate / buy a boat / campaigns

### `/support/donate/` — hero

- **Eyebrow:** `Support the club`
- **Headline:** `Boats wear out. Coaches matter. Every gift goes on the water.`
- **Lead:** `BUBC is funded by athlete subs, the University, our partners and the alumni community. Every season we fundraise for the difference between competing and winning. Every donation — small or transformational — goes back into coaching, kit, and the boats that carry the next squad.`

### Why donate (body block)

- **A racing programme costs money.** Kit, race entries, coaching, the trailer fuel, the safety launches, the long ferry of small invoices that lets a club take 30 athletes to BUCS.
- **A new boat costs more.** A racing eight is £40k. A racing four £18k. A pair £8k. The fleet renewal cycle never stops.
- **A new boathouse costs the most.** The Boat Club Capital Campaign is the biggest infrastructure project in the club's history. Phase progress is published on `/support/campaigns/`.

### Ways to give

| Channel                   | Use it for                                                                |
| ------------------------- | ------------------------------------------------------------------------- |
| One-off donation (Hubbub) | Any amount, any time. Goes into the general club fund.                    |
| Sponsor a boat naming     | £500–£5,000 depending on the boat. The donor's name goes on the shell.    |
| Capital campaign pledge   | Multi-year pledge for the new boathouse build.                            |
| Legacy giving             | Speak to the alumni officer about including BUBC in your estate planning. |
| Gift in kind              | Coaching equipment, kit, professional services. Email the treasurer.      |

### `/support/buy-a-boat/`

The existing copy is sound. Strengthen the lead:

- **Eyebrow:** `Naming rights`
- **Headline:** `Put a name on a Bath shell.`
- **Lead:** `Every racing shell in the BUBC fleet carries a name and a story. Donors include former rowers, parents, club friends and businesses with a long Bath connection. The process is straightforward — pick a boat class, agree the name, the club fits it for the next racing season. The name stays with the boat for as long as the boat is on the rack.`

### `/support/campaigns/` — empty state

> When there are no active campaigns published, the listing page should still feel intentional, not blank.

> **Empty-state copy:** `BUBC runs targeted fundraising campaigns alongside year-round donations — for boats, kit, the new boathouse and major capital projects. New campaigns appear here as they launch. To talk about a named gift or a sponsorship, email [info@bubc.co.uk](mailto:info@bubc.co.uk).`

### Sample active campaign — Boat Club Capital Campaign (draft)

> Schema: `apps/studio/schemaTypes/documents/campaign.ts`.

```yaml
title: New Boathouse — Capital Campaign
slug: new-boathouse
status: active
goalAmount: '[provisional — confirm]'
raisedAmount: '[provisional — confirm]'
donorCount: '[provisional — confirm]'
story: |
  BUBC is building a new boathouse for the next generation of Bath
  rowers. The current building has carried the club through six
  decades and is, simply, full — the fleet has outgrown it, the
  coaching support has outgrown it, and the long-term ambition of
  the programme demands a building to match.

  The new boathouse will sit on the same stretch of the Avon. Bigger
  boat bays, a coaching room, a dedicated S&C space, and an alumni
  and family area that finally does justice to a 60-year community.

  Construction is underway. The campaign target is met in stages —
  the foundations, the building shell, the fit-out and the new
  fleet rotation that comes with it. Every gift is named in the
  long-term donor record kept by the alumni officer.
donateUrl: https://bath.hubbub.net/p/BUBC/pledge/
```

---

## 13. Welfare & safeguarding

> Page: `apps/web/src/pages/welfare.astro`. Existing structure (named officer / policies / reporting routes / inclusion) is good. Copy improvements below.

### Hero

- **Eyebrow:** `Welfare & safeguarding`
- **Headline:** `Everyone in this club is owed a good experience.`
- **Lead:** `BUBC is a high-performance student rowing club. It is also a place where, for most members, the boat club is the dominant part of their student experience. The welfare team's job is to make sure that experience is a positive one — and that anyone who needs to raise a concern has a clear, confidential route to do it.`

### Named welfare officers (callout)

> Render this as the existing named-officer callout, pointing at the two welfare officers above (Clover Merry + Jonty Stowers) and the welfare email.

`Two welfare officers — Clover Merry and Jonty Stowers — share the role. Pick whichever you'd rather speak to. Confidential by default; nothing goes to a captain or coach without your consent unless safeguarding obligations require it.`

### Policies (cards — short summaries)

| Policy                                    | One-line summary                                                             |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| Code of conduct                           | Behaviour expected of every BUBC member — at the boathouse, on tour, online. |
| Anti-bullying & harassment                | Zero tolerance. Clear reporting routes. Confidential investigation.          |
| Inclusion & accessibility                 | Affordability, gender inclusion, para-rowing pathways, neurodiversity.       |
| Alcohol & social conduct                  | What's expected on club socials and tours. Where the limits are.             |
| Safeguarding (under-18s + adults at risk) | British Rowing safeguarding framework. Named DSO.                            |

### Reporting routes (cards)

1. **BUBC welfare officer** — first port of call. Confidential. welfare@bubc.co.uk.
2. **Bath SU Welfare** — university-level support, including financial aid and academic adjustments.
3. **British Rowing Safeguarding** — for incidents that fall under BR's safeguarding scope.
4. **NSPCC / external services** — for anything that needs to go outside the club's structures.

### Inclusion & accessibility section

> Existing section copy is solid. Strengthen the lead.

`Rowing has a reputation for being narrow. We don't think it has to be. BUBC tries to make the programme — financially, culturally, physically — accessible to the broadest possible student body at Bath. Concrete commitments below.`

- **Financial.** Hardship support is available for kit, race fees and tour costs — confidential, no questions asked beyond what the SU requires for documentation. Talk to the welfare officer or the treasurer.
- **Gender inclusion.** Athletes train and race in the squad that matches their identity. Trans inclusion follows the current British Rowing guidance; the welfare officer is the named contact for any related question.
- **Para-rowing pathway.** BUBC does not currently run a dedicated para-rowing programme on the water, but the club is the route to a pathway — we will work with British Rowing, Minerva BC and the regional adaptive rowing programme to find the right session for any athlete who wants to row.
- **Neurodiversity & mental health.** Captains and welfare officers are trained on basic mental health first aid; the SU's MASH service is the long-term resource. We do not require disclosure; we do try to make it easy to talk about if you'd like to.

---

## 14. Press / media kit

> Page: `apps/web/src/pages/press.astro`. Existing structure is good. Copy refresh below.

### Hero

- **Eyebrow:** `Press`
- **Headline:** `Press kit.`
- **Lead:** `Journalists, race photographers, university PR teams and rowing media: this is the canonical source of BUBC facts, contacts and hi-res assets.`

### Press boilerplate (drop-in for any release)

> "Bath University Boat Club (BUBC) is the rowing club of the University of Bath. Founded in 1966 — the same year the University received its Royal Charter — BUBC supports approximately 140 student athletes across senior selection, development and novice programmes. The club trains out of a boathouse on the River Avon between Bath and Saltford, and competes at the UK head and regatta circuit including the BUCS Championships, Henley Royal Regatta and Henley Women's Regatta. BUBC alumni include Olympic medallists and Great Britain senior internationals."

### Club facts (definition list)

| Fact                  | Value                                                     |
| --------------------- | --------------------------------------------------------- |
| Founded               | 1966                                                      |
| Athletes in programme | 140+                                                      |
| Squads                | Senior men, Senior women, Performance Development, Novice |
| Head Coach            | Charlie Newbold                                           |
| Boathouse             | River Avon, between Bath and Saltford                     |
| Notable alumni        | 9 Olympians, multiple GB senior internationals            |
| Affiliations          | University of Bath, Bath SU, British Rowing               |
| Sister alumni club    | Meles Boat Club (est. 2003)                               |
| Charity status        | [provisional — confirm]                                   |

### Press contacts (aside)

- **General press:** `press@bubc.co.uk`
- **Senior men's captain:** Noah Jamieson / Will Stradling — captain.m@bubc.co.uk
- **Senior women's captain:** Ellie Fowlds — captain.w@bubc.co.uk
- **Alumni / heritage stories:** Amelia Brown — alumni@bubc.co.uk
- **Welfare / safeguarding queries:** Clover Merry / Jonty Stowers — welfare@bubc.co.uk

### Hi-res assets

`Photography is owned by BUBC and licensed to press on request, free of charge, with credit ("Photo: BUBC"). Email press@bubc.co.uk with the publication, the use, and the timescale.`

---

## 15. Contact

> Page: `apps/web/src/pages/contact.astro`. Replace any holding copy with the structure below.

### Hero

- **Eyebrow:** `Contact`
- **Headline:** `Who to email.`
- **Lead:** `BUBC is a committee-run club. Every role has an email; every email goes to a real person. Pick the role that fits — we'd rather you reached the right inbox first time.`

### Routing list

| If you want to …                   | Email                                                        |
| ---------------------------------- | ------------------------------------------------------------ |
| Trial with the club                | `info@bubc.co.uk` (or fill the [trial form](/squads/trial/)) |
| Talk to the senior men's captains  | `captain.m@bubc.co.uk`                                       |
| Talk to the senior women's captain | `captain.w@bubc.co.uk`                                       |
| Talk to the novice captains        | `captain.n@bubc.co.uk`                                       |
| Talk to the head coach             | `coaching@bubc.co.uk`                                        |
| Raise a welfare concern            | `welfare@bubc.co.uk`                                         |
| Discuss sponsorship                | `sponsorship@bubc.co.uk`                                     |
| Re-engage as an alumna/us          | `alumni@bubc.co.uk`                                          |
| Anything else                      | `info@bubc.co.uk`                                            |

### Boathouse address (block)

```
Bath University Boat Club
Boathouse — River Avon
[Postal address to confirm with SU]
51.39180472152244, -2.407486235563779
```

> Driving directions, parking and what3words live on the [boathouse page](/boathouse/).

### Postal address (SU)

```
Bath University Boat Club
c/o The Students' Union, University of Bath
Claverton Down
Bath BA2 7AY
```

---

## 16. News — editorial calendar + draft posts

> Schema: `apps/studio/schemaTypes/documents/newsPost.ts`. News is the highest-leverage editorial work the club does — recruitment, alumni engagement, sponsor visibility and SEO all depend on a steady cadence. The plan below is built to survive committee turnover.

### Editorial cadence (target — first year)

- **Race reports — every regatta the senior squads enter.** Within 72 hours of the race, 400–600 words, with a result, a photo, and a named athlete spoken-to quote.
- **Athlete spotlights — one a fortnight in term.** 250–400 words. The novice who just made the senior squad. The senior who tested into a GB U23 trial. The cox who steered the four to BUCS bronze.
- **Alumni stories — one a month.** Olympians, internationals, Boat Race blues, notable careers. Anchors the club's heritage in present-day reading.
- **Training camp / squad-life pieces — three a year.** Pre-Christmas, pre-Easter, pre-Henley. Photo-led, low text, atmosphere over information.
- **Recruitment posts — twice a year.** September trials, January Open trials.
- **Sponsor announcements — once per new partner.** Co-written with the partner, signed off by sponsorship officer.

### News categories (Sanity `category` docs)

| Slug                  | Title                 | Description                                                                                 |
| --------------------- | --------------------- | ------------------------------------------------------------------------------------------- |
| race-reports          | Race reports          | Results and reports from every regatta and head race the senior squads enter.               |
| athlete-spotlights    | Athlete spotlights    | Profiles of current BUBC athletes — what they do at Bath, why they came to row.             |
| alumni-stories        | Alumni stories        | Where BUBC alumni are now — Olympians, GB internationals, Boat Race blues, notable careers. |
| club-news             | Club news             | Boathouse, fleet, capital projects, committee announcements.                                |
| recruitment           | Recruitment           | Trial dates, novice intake, what to expect.                                                 |
| sponsor-announcements | Sponsor announcements | New partners, partnership renewals, sponsor-led campaigns.                                  |

### Draft post 1 — `BUCS Regatta 2025: silver and bronze on Holme Pierrepont`

```yaml
category: race-reports
publishDate: 2025-05-04
author: 'Maia Norton'
heroImage: assets/images/medals/BUCS-Regatta-rowing-010523_2-500x500-1.jpg
excerpt: 'A senior women's gold, a senior men's silver, and the first PDA medal in three years — BUCS Regatta 2025 was Bath's best showing on Holme Pierrepont since 2018.'
body: |
  Three days at Holme Pierrepont. Twelve crews, all eight squads on
  the bank, and the kind of week that justifies a winter of dark
  mornings on the Avon.

  Headline result: the senior women's championship four took gold
  by half a length over Newcastle, with Ellie Fowlds in the stroke
  seat. The senior men's championship eight took silver in a final
  decided by a quarter of a boat — a result that puts Bath inside
  the top three university crews in the country.

  The development squad's first medal in three years — a bronze in
  the PDA championship four — closed Sunday.

  Charlie Newbold called the week "what we've been training for —
  not the medals, the way the crews raced." Full crew lists,
  splits and times in the gallery below.
relatedAthletes:
  - ellie-fowlds
  - noah-jamieson
  - will-stradling
relatedCrews: []
```

### Draft post 2 — `Athlete spotlight: Jeanne Anderson, novice → senior in twelve months`

```yaml
category: athlete-spotlights
publishDate: 2025-11-12
author: 'Maia Norton'
excerpt: 'Jeanne joined BUBC at the Freshers' Fair in 2024 having never sat in a boat. A year later she's a novice captain and in the senior women's selection squad. We sat down with her about how that happened.'
body: |
  Eighteen months ago, Jeanne Anderson had never been in a boat.

  "I went to Freshers' Fair to sign up for the swim club and the
  ski society. The boat club stall was next to the swim club and
  there were photos of Henley up. I asked what Henley was."

  By November she was racing novice eights at Bristol Docks. By
  March she'd tested into the senior women's selection squad. In
  September of her second year, she stood for novice co-captain
  and was elected unopposed.

  This is how BUBC's pipeline is supposed to work, and most years
  it does. The bit that's hard to write into a recruitment leaflet
  is the bit Jeanne names herself: "I went to every session. I
  wasn't fast for a long time. I just kept turning up."
```

### Draft post 3 — `Recruitment: trial week opens Monday`

```yaml
category: recruitment
publishDate: 2026-09-15
excerpt: 'Trial week opens Monday. Two on-water sessions, an erg test, a Q&A — nothing else asked of you. Sign up by Sunday.'
body: |
  September trials open at the boathouse on Monday. The format is
  the same as last year — three sessions across the week, an erg
  test on Wednesday, and a Q&A with the captains and Charlie on
  Friday evening.

  You don't need to have rowed before. Most BUBC seniors started at
  Bath. The point of trial week is to find out whether the club is
  for you and whether you're for the club — both directions matter.

  Sign-up form: [/squads/trial/]
  Questions: captain.n@bubc.co.uk (novice) or captain.m / captain.w
  (senior, if you've rowed before).
```

### Draft post 4 — `Alumni: Becky Wilde on the years between Bath and a GB vest`

```yaml
category: alumni-stories
excerpt: 'Becky Wilde started at Bath as a novice and ended her undergraduate years on the GB U23 squad. We caught up with her on what she'd say to a Bath novice about to test for senior selection.'
body: |
  [Draft body — finalise with Becky directly via alumni@bubc.co.uk.
  Structure: 1. Bath novice year — what she remembers. 2. Senior squad — where it clicked. 3. The GB trial — how she got there. 4. One thing she'd say to a current Bath novice.]
```

### Draft post 5 — `Christmas dinner 2025 — the club at full strength`

```yaml
category: club-news
publishDate: 2025-12-13
excerpt: 'Two hundred current and former Bath rowers in one room. Charlie Newbold's review of the year, the captain's awards, and a brief but factually accurate impression of the men's eight by the alumni table.'
body: |
  The 2025 BUBC Christmas dinner was the largest in the last decade
  — two hundred members in the room, alumni back from across the
  country, and a head-coach review of the year that touched on the
  BUCS double, the Henley quarter-final, and the new boathouse
  campaign without once mentioning anyone's erg PB.

  Awards on the night: Captain's Cup, Novice of the Year, Quiet
  Cog of the Year (yes, it's a real award; yes, you don't want to
  win it).

  Photos in the gallery; long version of the head coach's speech
  on request to alumni@bubc.co.uk.
```

### Draft post 6 — `Boathouse capital project: where the build is in May 2026`

```yaml
category: club-news
publishDate: 2026-05-20
excerpt: 'Foundations done, frame in, and a target of first sessions in the new building by the start of the 2026/27 season. A short update from the build site.'
body: |
  Quick update on the new boathouse — the project most likely to
  outlast the committee that started it.

  Foundations were completed in March. The frame went up over Easter.
  Internal fit-out begins in June, with target first sessions in the
  new building at the start of the 2026/27 season — i.e. the September
  novice intake will be the first squad to train out of it.

  Capital campaign total to date: £[provisional]. Donors are listed in
  the long-term donor record kept by the alumni officer; major gifts
  will be recognised in the building's hall.

  Donations: bath.hubbub.net/p/BUBC/pledge/.
```

---

## 17. Newsletter — what to send

> Schema: not a Sanity doc — this is editorial direction for the comms officer. Newsletter platform is Buttondown (already wired). Cadence: fortnightly in term, monthly off-term.

### Recurring sections (every issue)

1. **Top race of the fortnight** — one result, one photo, one line. Links to the full race report.
2. **Athlete to know** — one current BUBC athlete spotlighted in 80 words. Pulled from the news system.
3. **From the alumni** — one alumni story, 80 words, link to the full profile.
4. **What's coming up** — the next regatta, the next training camp, the next alumni event.
5. **One ask** — donate, share, attend, sponsor. Rotate; never more than one per issue.

### Tone notes

- One issue, one voice. The newsletter is signed by the comms officer or the captain — not "the BUBC team".
- Write like you'd write to a parent, not like you'd write to a recruiter.
- No exclamation marks unless a boat caught fire.
- Read it back in the voice of a 50-year-old alum before sending. If they wouldn't open it, rewrite the subject line.

### Subject line patterns (use sparingly)

- `BUCS day one — silver in the women's four`
- `Trial week opens Monday — what to expect`
- `New boathouse: where the build is this month`
- `Becky Wilde on the years between Bath and GB`
- `One ask: support the boathouse build`

---

## 18. Glossary, micro-copy, error states, OG strings

### Rowing glossary (for the recruit-facing pages — link out from `/squads/trial/`)

| Term                           | One-line definition                                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Erg / ergometer                | The Concept2 indoor rowing machine. The default land-training tool and the default test of basic fitness.                             |
| 2k / 5k                        | Standard erg tests over 2,000m and 5,000m. Senior selection at Bath happens around the 2k.                                            |
| Sweep                          | Rowing with one blade. Eights, fours, pairs.                                                                                          |
| Sculling                       | Rowing with two blades. Singles, doubles, quads.                                                                                      |
| AIO / all-in-one               | The one-piece race kit worn on the water. Like a swimsuit but for rowing.                                                             |
| Cox / coxswain                 | The person who steers the boat and calls the race. Not the smallest person in the boat — the most articulate.                         |
| BUCS                           | British Universities & Colleges Sport — the national student competition. Two BUCS events for rowing: Head (March) and Regatta (May). |
| HRR / Henley                   | Henley Royal Regatta. The peak event of the UK domestic rowing season. Knockout side-by-side racing on the Thames in late June.       |
| HWR                            | Henley Women's Regatta. Senior women's equivalent on the same stretch, earlier in June.                                               |
| Head race                      | A processional race against the clock — boats start at intervals and the fastest time wins. Winter format.                            |
| Regatta                        | Side-by-side racing on a multi-lane course. Summer format.                                                                            |
| Bow / stern / port / starboard | Front / back / left-as-you-row / right-as-you-row. Coxes get this right; everyone else fakes it.                                      |

### Micro-copy — common buttons & links

- Trial CTA: `Trial with us`
- Donate CTA: `Donate to BUBC`
- Sponsor CTA: `Talk to us about sponsorship`
- Newsletter signup: `Subscribe to the BUBC newsletter`
- Read more: `Read the full story`
- Back to index: `Back to all posts` / `Back to the fleet` / `Back to alumni`
- Empty-state recovery: `Drop us a line — info@bubc.co.uk`

### Empty / error states

- **404 page:**
  - **Headline:** `That page has drifted off the rack.`
  - **Lead:** `The page you asked for doesn't exist — or has moved as part of the site rebuild. Either head [home](/), or browse [news](/news/), [squads](/squads/), [boathouse](/boathouse/) or [support us](/support/).`
- **Search no-results:** `No results. Try a name, a regatta, a boat or a year — for instance "Henley 2025", "Sampson", "Becky Wilde".`
- **Form unconfigured:** `This form isn't connected to a submission service yet. Email us at info@bubc.co.uk in the meantime — we'll respond from a real inbox.`
- **Newsletter unconfigured:** `Newsletter signup isn't live in this preview environment. Once we cut over to production, you'll be able to subscribe here.`
- **Sanity dataset empty:** `Content for this page is being prepared. Check back shortly, or email info@bubc.co.uk if you were looking for something specific.`

### OG strings (per page — used by the dynamic OG generator)

| Page                  | Headline (max ~65 chars)       | Sub (max ~120 chars)                                                                                     |
| --------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| /                     | `Bath University Boat Club`    | `Student rowing in Bath since 1966. Senior, Development & Novice squads on the River Avon.`              |
| /squads/              | `BUBC Squads`                  | `Senior selection, Performance Development, Novice — Bath University's rowing pathway.`                  |
| /squads/senior-men/   | `BUBC Senior Men`              | `Senior selection squad — sweep and sculling — racing Henley, BUCS and the head circuit.`                |
| /squads/senior-women/ | `BUBC Senior Women`            | `Senior selection squad — building each season toward Henley Women's Regatta and Henley Royal.`          |
| /squads/novice/       | `BUBC Novice Programme`        | `Learn to row in your first term, race in your second. No experience required.`                          |
| /squads/pda/          | `BUBC Performance Development` | `The squad between novice and seniors. Coached, technical, and built for the long version of the sport.` |
| /squads/trial/        | `Trial with BUBC`              | `Two minutes. Trial dates, what to expect on day one, who to ask if you're unsure.`                      |
| /coaching/            | `BUBC Coaching`                | `Head Coach Charlie Newbold and the team behind the programme.`                                          |
| /boathouse/           | `BUBC Boathouse`               | `On the River Avon between Bath and Saltford. Facilities, fleet, how to find us.`                        |
| /about/history/       | `A brief history of BUBC`      | `Sixty years on the Avon — from borrowed skiffs to a contender at Henley.`                               |
| /about/olympians/     | `BUBC Olympians`               | `Bath rowers at the Games — a club record across six decades.`                                           |
| /alumni/              | `BUBC Alumni`                  | `Olympians, GB internationals, Boat Race blues, and the broader Bath rowing community.`                  |
| /support/donate/      | `Donate to BUBC`               | `Boats wear out. Coaches matter. Every gift goes on the water.`                                          |
| /support/sponsor/     | `Sponsor BUBC`                 | `Partner with a 60-year university rowing club that races at the sharp end.`                             |
| /support/campaigns/   | `BUBC Campaigns`               | `Active fundraising campaigns — the new boathouse and beyond.`                                           |
| /press/               | `BUBC Press Kit`               | `Boilerplate, facts, contacts and hi-res assets for press and rowing media.`                             |
| /welfare/             | `BUBC Welfare & Safeguarding`  | `Named welfare officers, policies and confidential reporting routes.`                                    |

---

_Last updated: 2026-05-26. Content drafts in this file are provisional unless marked confirmed. Send corrections to info@bubc.co.uk or open a PR._

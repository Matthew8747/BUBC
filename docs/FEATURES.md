# BUBC Site — Open Feature Backlog

> The site is built. This file is now just the **forward-looking backlog**: ideas not yet built and decisions still open. Shipped and abandoned features are intentionally not listed here — read the code (or `graphify-out/`) for what exists.

## Open ideas (not built)

| ID  | Feature                          | Status                 | Notes                                                                                                               |
| --- | -------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| C3  | "What's it like" page            | 🟡 Agreed, not built   | Structured `page` doc: hero, weekly schedule grid, photo gallery, 2 quotes, sticky CTA.                             |
| C4  | Parent information page          | ❓ Needs decision      | Safety, time commitment, cost, fitness, kit, regatta logistics. Could reuse the C3 structured-page approach.        |
| C7  | Inclusion & accessibility policy | ❓ Needs decision      | Currently a section of `/welfare/`. Promote to its own page only if there's enough content.                         |
| P4  | Crew lists with photos           | 🟡 Deferred            | Separate `crew` doc keyed on squad + season; supports archive / yearbook use.                                       |
| P7  | Athlete profiles                 | 📋 Latent              | `athlete` schema exists (referenced by news/results) but has no public index page. Decide if athletes get profiles. |
| A5  | Alumni world map                 | 🟡 When data exists    | `location` field is on the alumni schema. Build (Mapbox/Leaflet) once enough profiles populate it.                  |
| W1  | Strava club embed                | 🟡 Under consideration | Needs the club Strava account + widget URL.                                                                         |
| W2  | Erg leaderboard                  | ❓ Needs decision      | Top 2k/5k by squad/gender. Needs a source of truth (Sanity doc / Airtable) **and** a maintainer commitment.         |
| F5  | Sponsorship pack PDF             | ❓ Needs content       | `/support/sponsor/` links to a mailto until a pack PDF exists.                                                      |
| F6  | Erg-athon / Boat Race event page | ❓ When scheduled      | Live total embed during fundraising events. Could extend the `campaign` schema with an event date.                  |
| C9  | Annual review / yearbook PDF     | ❓ Needs process       | An editorial deliverable, not a build task. Alumni keep these; drives donations.                                    |
| I9  | Sanity Presentation live preview | 📋 Nice to have        | Two-dataset workflow + draft route. Big QoL win for non-developer editors.                                          |

## Out of scope (deliberate non-goals)

- **E-commerce / merch** — Rival Kit handles kit, Perry handles blazers. Link out, don't sell on-site.
- **Member portal / training log** — use Strava / Concept2 ErgData.
- **Live race scoring** — link out to British Rowing / regatta sites.
- **Self-hosted auth** — Sanity handles editor auth.
- **Cloudflare Pages** — Vercel is the host; Cloudflare is DNS + email + analytics only.

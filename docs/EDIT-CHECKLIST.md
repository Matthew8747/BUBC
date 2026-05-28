# Where to edit what — the BUBC editing cheatsheet

> "Did the seed populate this? Where do I change it?" — one page, every editable surface on the site, with the answer.
>
> Companion docs: [POPULATE.md](POPULATE.md) (how to seed) · [CONTENT-EDITING.md](CONTENT-EDITING.md) (Studio editor walkthrough) · [CONTENT-BOOK.md](CONTENT-BOOK.md) (the canonical copy).

## Three buckets

| Bucket                   | Where you edit                                        | Effort                               |
| ------------------------ | ----------------------------------------------------- | ------------------------------------ |
| 🟢 **Sanity (Studio)**   | `localhost:3333` — fill in fields, hit Publish        | Easy, no developer needed            |
| 🟡 **Sanity OR code**    | Either: Sanity if seeded, otherwise the `.astro` file | Easy if seeded, otherwise dev change |
| 🔴 **Code (Astro file)** | `.astro` file in the repo, then commit + push         | Requires editing source code         |

---

## Quick troubleshooting first

### 🧯 "I created a squad / news post / boat in Studio but the image isn't showing"

The Picture component on the live site does a strict check: `image.asset._ref` or `image.asset._id` must exist on the doc. If either is missing, you see the diagonal-stripe placeholder instead.

**Most common cause:** when you created the doc, you either skipped the image upload OR uploaded an image but missed the **alt text** field. Alt text is required by the schema; without it, the doc stays in _draft_ state and the live site never sees it.

**Fix:**

1. Open the doc in Studio.
2. Click the heroImage / photo field.
3. If empty, click **Select** → pick a photo from the asset library (already populated by `seed:images`) or upload a new one.
4. **Fill in the alt text** (one short sentence describing the image).
5. Drag the **hotspot** (the small circle) onto the most important part of the image — usually a face or the bow of the boat.
6. Click **Publish** (bottom-right). Status pill should change from _Edited_ → _Published_.
7. Refresh `localhost:4321/squads/<your-squad-slug>/` — image should appear.

If the status pill stays as _Edited_ after clicking Publish, **scroll up the form** — Sanity highlights the missing required field in red.

### 🧯 "I published in Studio but the dev site doesn't update on refresh"

The Astro dev server reads from Sanity's CDN, which caches reads for ~60 seconds. Two options:

- **Wait 60 seconds**, then refresh. The CDN cache will have expired.
- **Restart the dev server** — Ctrl-C in the terminal, then `pnpm dev` again. Picks up the latest immediately.

(There's a cleaner fix — disable the CDN in dev — but that requires a code change you previously rejected. If you change your mind, the patch is in `apps/web/src/lib/sanity.ts`: `useCdn: !import.meta.env.DEV`.)

---

## Bucket 1 — 🟢 Sanity (everything below lives in the Studio)

These pages all read from Sanity. Edit in Studio, click Publish, refresh.

### Site chrome (header, footer, contact, social)

- **What it controls:** logo, primary nav, footer columns, contact email, boathouse coordinates (driving the OpenStreetMap embed), social-icon links, live-race-banner.
- **Where:** Studio → **Site settings** (top of the left nav, singleton).
- **Seeded:** ✅ `seed:settings`.

### Home page

- **What it controls:** hero (headline + sub + image + 2 CTAs), stat strip (4 numbers), squad-pathway cards, sponsor strip, closing CTAs.
- **Where:** Studio → **Home page** (singleton, near the top of left nav).
- **Seeded:** ✅ `seed:homepage`. **Featured news** intentionally blank — when blank, the home page auto-shows the 3 most recent news posts.

### Squads — `/squads/`, `/squads/senior-men/`, `/squads/senior-women/`, `/squads/novice/`

- **What it controls:** hero image, captain (reference to a committee member), captain bio, training schedule, expected standards (rich text), achievements, photo gallery, contact email.
- **Where:** Studio → **Squads** → pick a squad.
- **Seeded:** ✅ `seed:squads`. Captain refs resolved from `seed:committee`; coach refs from `seed:coaches`.
- **Watch out:** the squad's `photos` field (the gallery) is empty by default. Pick 4-8 action shots from the asset library when you're ready.

### Committee

- **What it controls:** the entire `/committee/` page.
- **Where:** Studio → **Committee members**.
- **Seeded:** ✅ `seed:committee` — 19 members for 2025/26 with photos + roles + emails + provisional bios.
- **Bios are provisional drafts.** Walk each through with the named officer before sharing the live URL widely.

### Coaches

- **What it controls:** the `/coaching/` page.
- **Where:** Studio → **Coaches**.
- **Seeded:** ✅ `seed:coaches`. Charlie + Marcus got best-guess photo mappings; verify each portrait is correct.

### News posts

- **What it controls:** every news article on `/news/` and `/news/<slug>/`.
- **Where:** Studio → **News posts** (+ **News categories** for the filter pills).
- **Seeded:** ✅ `seed:news-categories` (6 categories) + `seed:news` (6 draft posts).
- **The draft posts are placeholders for the editorial calendar.** Real race reports / spotlights are written fresh in Studio; the seeded drafts can be edited or deleted.

### Sponsors

- **What it controls:** `/support/sponsor/`, the home-page sponsor strip, the footer sponsor band.
- **Where:** Studio → **Sponsors**.
- **Seeded:** ✅ `seed:sponsors` — Embecosm, Mazars, SU Bath, Rival Kit.
- **Tier order:** `headline` → `gold` → `silver` → `supporter`. `showOnHome=true` controls visibility in the home-page strip (headline + gold tier should always be true; silver optional).

### Campaigns

- **What it controls:** `/support/campaigns/`, `/support/campaigns/<slug>/`, the donation thermometer on the donate page.
- **Where:** Studio → **Campaigns**.
- **Seeded:** ✅ `seed:campaigns` — New Boathouse Capital Campaign.
- **Update each time you check Hubbub:** `raisedAmount` and `donorCount` are manual; the thermometer percent is computed automatically.

### Fleet (boats)

- **What it controls:** `/boathouse/fleet/`, `/boathouse/fleet/<slug>/`.
- **Where:** Studio → **Boats**.
- **Seeded:** ✅ `seed:fleet` — Sampson, Susan Green, Kenneth Green (provisional metadata).
- **Add more boats freely.** Each boat needs: name, slug, make, class, status. Year / donor / story optional but recommended.

### Alumni

- **What it controls:** `/alumni/`, `/alumni/profile/<slug>/`, `/about/olympians/` (filtered to `category === 'olympian'`).
- **Where:** Studio → **Alumni profile** (the doc type is internally `olympian` but covers all four categories).
- **Seeded:** ✅ `seed:alumni` — Becky Wilde, Cedol Dafyd, Ben Furley, Angus Pollock as drafts.
- **Stories are placeholders — confirm each with the named person before sharing publicly.**

### Henley honours

- **What it controls:** `/about/henley-honours/`.
- **Where:** Studio → **Henley honours**.
- **Seeded:** ✅ `seed:henley-honours` — 5 recent appearances with provisional crew lists.
- **Crew lists are placeholders.** Backfill from BUBC archives / alumni records before sharing publicly.

### Past chairs

- **What it controls:** `/about/chairs/`.
- **Where:** Studio → **Past chair**.
- **Seeded:** ✅ `seed:chairs` — 5 year-only skeletons.
- **Names need backfilling** from SU records by the alumni officer.

### Buy a boat (boats needed)

- **What it controls:** the price-range table on `/support/buy-a-boat/`.
- **Where:** Studio → **Boat needed (Buy-a-Boat)**.
- **Seeded:** ✅ `seed:boats-needed` — 5 boats (M8+, W8+, 4+, 1x, 2x).
- **Price ranges are indicative** — confirm against current Empacher / Filippi / Hudson quotes.

### Long-form pages (history, welfare, meles, blazers)

- **What they control:** `/about/history/`, `/welfare/`, `/alumni/meles/`, `/about/blazers/`. The Astro routes look for a `page` doc by slug first; if missing, fall back to hardcoded copy.
- **Where:** Studio → **Page** → pick by slug.
- **Seeded:** ✅ `seed:pages` — all four pre-populated with the canonical copy from CONTENT-BOOK.md. Edit freely in Studio.

---

## Bucket 2 — 🟡 Sanity OR code

These have hardcoded fallbacks; the Sanity doc overrides if present.

### About landing — `/about/`

- **Current:** hardcoded in [`apps/web/src/pages/about/index.astro`](../apps/web/src/pages/about/index.astro).
- **Why:** purely structural — links to history, chairs, olympians, etc.
- **If you want to edit:** add a `page` doc with slug `about` in Studio and the page will read from there (you may need to also edit the .astro file to query the new doc — ask Matt if so).

### Contact page — `/contact/`

- **Current:** mostly hardcoded in [`apps/web/src/pages/contact.astro`](../apps/web/src/pages/contact.astro). Boathouse coordinates pull from settings.
- **What you can change in Sanity now:** the boathouse lat/lng/what3words via Settings → Contact tab.
- **What needs code:** the email routing table, the postal address.

### Press page — `/press/`

- **Current:** entirely hardcoded in [`apps/web/src/pages/press.astro`](../apps/web/src/pages/press.astro).
- **Why:** the boilerplate, facts table and brand-assets pointer are static.

---

## Bucket 3 — 🔴 Code-only (these need editing in the repo)

These pages don't read from Sanity. To change them, edit the `.astro` file, commit, push. Vercel auto-deploys on push to `main`.

### `/squads/pda/` — Performance Development Academy (hybrid: Sanity card + code page)

The PDA is a British Rowing programme, not a BUBC squad, so it's handled specially:

- **The CARD on `/squads/`** is a normal **Sanity squad doc** (Studio → Squads → "Performance Development"). Edit its name, pitch, image, and ordering there like any squad. To make it link to the detail page (and stop a generic squad page being generated for it), fill in the new **External link** field on that squad doc with `/squads/pda/`. _(If you'd rather the card jump straight to British Rowing, put their URL there instead.)_
- **The DETAIL page** at `/squads/pda/` is still rich editorial **code** in [`apps/web/src/pages/squads/pda.astro`](../apps/web/src/pages/squads/pda.astro) — Olympic alumni, eligibility, the "apply via British Rowing" links. The generic squad template can't reproduce this, so it stays in code.
- **Likely code edits:** if the head coach changes, update the **"A separate coaching team"** section (around line 170 — currently names Tom Selby).

> **The "External link" field is new.** Any squad with it set links its card straight to that URL and is skipped by the dynamic `/squads/<slug>/` route. Leave it blank for normal BUBC squads. **Until you set it on the PDA doc, `pnpm build` prints a harmless warning** about `/squads/pda` conflicting between the static page and the squad route — setting `externalUrl` to `/squads/pda/` clears it.

### `/squads/trial/` — Trial form

- **File:** [`apps/web/src/pages/squads/trial.astro`](../apps/web/src/pages/squads/trial.astro)
- **Why static:** Formspree integration + form validation logic.
- **Likely edits:**
  - "What to expect" bullet list (lines ~49-55) — what the trial day involves.
  - Form fields (height/weight ranges, course examples) — lines ~135-155.

### `/boathouse/` — Boathouse page

- **File:** [`apps/web/src/pages/boathouse/index.astro`](../apps/web/src/pages/boathouse/index.astro)
- **Why static:** the facilities list, STV section and new-boathouse capital-project section are stable editorial copy.
- **Pulls from Sanity:** `settings.boathouseLocation` (lat/lng for the map) and `fleetQuery` (for the fleet teaser cards).
- **Likely edits:** the "Facilities" five-line bullet list (~line 76-110), the new-boathouse copy (~line 162-200), the STV three-card grid (~line 230-260).

**Example edit** — to update the boathouse facilities list:

```astro
{/* find this block, around line 76 */}
<ul class="mt-6 space-y-4 text-[--color-ink]">
  <li class="flex gap-3">
    <span class="mt-1 h-1.5 w-1.5 rounded-full bg-[--color-gold] flex-shrink-0"></span>
    <span>
      <strong class="font-display">Boat hall</strong> housing the senior eights, fours, pairs, sculling
      fleet, and reserve boats.
    </span>
  </li>
  {/* ...add or edit list items here... */}
</ul>
```

### `/welfare/` — Welfare & safeguarding

- **File:** [`apps/web/src/pages/welfare.astro`](../apps/web/src/pages/welfare.astro)
- **Pulls from Sanity:** if a `page` doc with slug `welfare` exists, its body is rendered above the policies/reporting cards. (Seeded by `seed:pages` — so you can edit this in Studio.)
- **Hardcoded:** the welfare-officer callout box, the 5 policy cards, the 4 reporting-route cards, the inclusion & accessibility bullets.

### `/contact/` — Contact page

- **File:** [`apps/web/src/pages/contact.astro`](../apps/web/src/pages/contact.astro)
- **Hardcoded:** the email routing table (who to email for what), the postal addresses.

### `/press/` — Press kit

- **File:** [`apps/web/src/pages/press.astro`](../apps/web/src/pages/press.astro)
- **Hardcoded:** the press boilerplate, club facts dl (founded/athletes/etc.), press contacts aside, hi-res assets pointer.

### `/about/` landing + `/about/blazers/` + `/about/chairs/` shell

- **Files:** [`apps/web/src/pages/about/index.astro`](../apps/web/src/pages/about/index.astro), [`apps/web/src/pages/about/blazers.astro`](../apps/web/src/pages/about/blazers.astro), [`apps/web/src/pages/about/chairs.astro`](../apps/web/src/pages/about/chairs.astro)
- **About landing:** the card grid linking to history, henley, olympians, chairs, blazers, meles. Hardcoded.
- **Blazers:** if `page` doc with slug `blazers` exists, its body renders; otherwise the hardcoded blazer-tier criteria (`Full`, `Half`, etc.) is shown. Hardcoded structure.
- **Chairs:** shells out to the `chair` docs; the page structure (decade grouping, intro) is hardcoded.

### `/support/donate/` — Donate page

- **File:** [`apps/web/src/pages/support/donate.astro`](../apps/web/src/pages/support/donate.astro)
- **Hardcoded:** the hero, "why donate" bullets, ways-to-give grid, Hubbub link.
- **Pulls from Sanity:** active campaigns (rendered with thermometers below the static content).

### `/support/buy-a-boat/` — Buy-a-boat process

- **File:** [`apps/web/src/pages/support/buy-a-boat.astro`](../apps/web/src/pages/support/buy-a-boat.astro)
- **Pulls from Sanity:** the price-range table (`boatForSale` docs from `seed:boats-needed`).
- **Hardcoded:** the 4-step process narrative.

### Live race banner

- **File:** [`apps/web/src/components/layout/LiveRaceBanner.astro`](../apps/web/src/components/layout/LiveRaceBanner.astro) — component code.
- **Edit in Sanity:** Settings → Live race banner section. Toggle `active`, set event name, URL, tone.
- **Hardcoded:** the visual treatment (colours, animation, dismiss behaviour).

### Header / Footer

- **Files:** [`Header.astro`](../apps/web/src/components/layout/Header.astro), [`Footer.astro`](../apps/web/src/components/layout/Footer.astro)
- **Pulls from Sanity:** nav items, footer columns, social links, sponsor strip (via `settings`).
- **Hardcoded:** the markup, the burger animation, the search button.

---

## How to edit code (for the dev-curious)

If you're comfortable with code edits:

1. **Open the file in VS Code** (or your editor of choice).
2. **Find the section** — every `.astro` file uses `{/* comment markers */}` to identify each section.
3. **Edit the text** between `>` and `<`. Most copy is between simple HTML tags like `<p>`, `<h2>`, `<li>`.
4. **Save the file** — if `pnpm dev` is running, the browser hot-reloads in ~1 second.
5. **Commit and push** when you're happy:
   ```powershell
   git add apps/web/src/pages/welfare.astro
   git commit -m "update welfare officer copy"
   git push
   ```
6. Vercel auto-deploys on push to `main`. Live in ~60 seconds.

**The bits to leave alone unless you know what you're doing:**

- Anything between `---` and `---` at the top of an `.astro` file (that's the JS frontmatter — controls data fetching).
- Anything starting with `import` or `const` (logic / dependencies).
- The `class=` attributes (those are Tailwind styles — change them and the layout will likely break).
- Anything inside `<script>` tags (client-side JS).

The safe edits are: text between HTML tags, image references, and URLs.

---

## After every edit — sanity check

Before pushing a code change:

1. **In the dev server window**, check the page renders without an obvious error message at the top.
2. **Browser DevTools** (F12) → Console — should be clean.
3. **Resize the browser** to ~375px width — mobile layout should still look right.

If anything's broken, undo the change (Ctrl-Z) or `git checkout apps/web/src/pages/<file>` to reset.

---

_Last updated: 2026-05-26 (session 10 — full seed pipeline, edit checklist)._

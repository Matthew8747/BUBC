# Populating the BUBC site — a practical guide

> The "what do I actually do?" doc. Step-by-step, with examples and the exact commands.
>
> Audience: Matthew (developer) and the future committee Technical Officer. If you are a non-technical editor adding a single news post, you want [CONTENT-EDITING.md](CONTENT-EDITING.md) instead — that document is the no-code, Studio-only path. This one assumes shell access and is optimised for bulk population.
>
> Companion docs: [plan.md](plan.md) (architecture) · [CONTENT-BOOK.md](CONTENT-BOOK.md) (production-ready copy for every page) · [CONTENT-EDITING.md](CONTENT-EDITING.md) (Studio-only editor guide) · [DEPLOYMENT.md](DEPLOYMENT.md) (Vercel + webhook setup).

---

## TL;DR — the 30-minute path to a populated site

```powershell
# 1. Get a Sanity API write token from
#    https://www.sanity.io/manage/personal/project/j7zcx618/api
#    Role: Editor. Copy the `sk...` string.

# 2. In your terminal, set it for the current PowerShell session:
$env:SANITY_API_WRITE_TOKEN = "skXXXXXXXXXX..."

# 3. Upload every photo from assets/images/ to Sanity (≈3 minutes for 200 photos):
pnpm --filter @bubc/studio seed:images

# 4. Create the 19 committee documents with photos + bios attached:
pnpm --filter @bubc/studio seed:committee

# 5. Create the three coach documents:
pnpm --filter @bubc/studio seed:coaches

# 6. Open Studio to review and tweak:
pnpm --filter @bubc/studio dev
# → http://localhost:3333
```

That is everything for the people pages. Squads, news, sponsors and campaigns are still manual in the Studio — instructions [below](#manual-content-in-the-studio).

---

## Do I need Sanity for this at all?

**Yes — for anything dynamic.** The site reads its content from Sanity at build time. The pages that show real-world data (committee, news, results, sponsors, campaigns, alumni, fleet, squads detail) all query Sanity.

**No — for static editorial pages.** Pages whose copy is hard-coded into `.astro` files (Boathouse, PDA, Welfare summary, About landing) don't go through Sanity. To change those, edit the Astro file directly and the deploy will rebuild.

How to tell which is which:

| Page                                                              | Source of content                                        |
| ----------------------------------------------------------------- | -------------------------------------------------------- |
| `/` (home)                                                        | Mostly Sanity (`homePage` singleton). Defaults if empty. |
| `/squads/`                                                        | Sanity (`squad` docs), with defaults if empty            |
| `/squads/senior-men/`, `/squads/senior-women/`, `/squads/novice/` | Sanity (`squad` docs)                                    |
| `/squads/pda/`                                                    | Hard-coded in `apps/web/src/pages/squads/pda.astro`      |
| `/squads/trial/`                                                  | Hard-coded + Formspree                                   |
| `/coaching/`                                                      | Sanity (`coach` docs)                                    |
| `/boathouse/`                                                     | Hard-coded + `settings.boathouseLocation`                |
| `/boathouse/fleet/`, `/boathouse/fleet/<slug>/`                   | Sanity (`boat` docs)                                     |
| `/news/`, `/news/<slug>/`                                         | Sanity (`newsPost` docs)                                 |
| `/committee/`                                                     | Sanity (`committeeMember` docs)                          |
| `/support/sponsor/`                                               | Sanity (`sponsor` docs)                                  |
| `/support/campaigns/`                                             | Sanity (`campaign` docs)                                 |
| `/alumni/`, `/alumni/profile/<slug>/`                             | Sanity (`olympian` / alumni-profile docs)                |
| `/about/history/`, `/about/chairs/`, `/about/blazers/`            | Sanity (`page` doc, optional) with hard-coded fallback   |
| `/welfare/`, `/contact/`, `/press/`                               | Mostly hard-coded                                        |

Rule of thumb: **anything in a card grid is Sanity**; long-form editorial pages are mostly hard-coded.

---

## Step 1 — Get a Sanity write token

The seed scripts and any future write operations need a token. The Studio itself (when you log in at the Studio URL) uses a different token (your user session); the scripts authenticate as an API client.

1. Open <https://www.sanity.io/manage/personal/project/j7zcx618/api>.
2. Sign in (GitHub — same account as the Studio).
3. Click **Tokens** → **Add API token**.
4. Name: `bubc-seed-scripts`. Permissions: **Editor**.
5. Copy the `sk...` value. You will not see it again. Stash it in your password manager.

Then in any PowerShell session you want to seed from:

```powershell
$env:SANITY_API_WRITE_TOKEN = "sk............"
```

If you'd rather not paste it each session, drop it in `apps/studio/.env.local` (this file is in `.gitignore`):

```
SANITY_API_WRITE_TOKEN=sk............
```

…and load it with `dotenv-cli` or just `$env:SANITY_API_WRITE_TOKEN = (Get-Content apps/studio/.env.local | …)`. The simplest path is to paste it each session.

---

## Step 2 — Bulk-import all photos

The repo has ~200 photos in `assets/images/<category>/<file>`. The seed script:

1. Walks the folder tree.
2. For each file, computes a SHA-256 hash.
3. If a doc with that hash already exists in Sanity, skips.
4. Otherwise uploads the file to Sanity's asset CDN AND creates an `imageLibrary` document tagged with the folder name (category) — so editors can filter and browse.

### Run it

```powershell
# Dry-run first to preview what would happen (no token required):
pnpm --filter @bubc/studio seed:images -- --dry-run

# Real upload:
pnpm --filter @bubc/studio seed:images

# Only one category at a time (handy when adding new photos to an existing folder):
pnpm --filter @bubc/studio seed:images -- --category=committee
pnpm --filter @bubc/studio seed:images -- --category=henley
```

Output looks like:

```
Sanity project: j7zcx618 / dataset: production
Mode: live import
Categories: alumni, avon, blades, boathouse, committee, …

committee      ( 19) +++++++++++++++++++
henley         ( 12) ............
sweep          ( 30) ++++++++++++++++++............
…

Done. Created 154 · skipped 28 (duplicate) · failed 0.
```

Re-running is safe. The hash check means duplicates aren't re-uploaded.

### What you get in Sanity

After running, open the Studio (`pnpm --filter @bubc/studio dev` → <http://localhost:3333>) and click **Image library** in the left nav. You'll see every photo grouped by category. Each carries a sensible default alt text — refine it when you have time, especially for hero photos.

The photos are also in Sanity's underlying **asset library** — visible from any image picker in any document. That's the key trick: once a photo is in the asset library, the committee / coach / news editor can pick it from the library when filling in their `photo` field, without re-uploading.

---

## Step 3 — Seed the committee

The `committee` folder already has 19 headshots, one per officer (filenames match first names). The seed script creates a `committeeMember` document for each, attaches the photo, fills in role / order / email / bio.

### Run it

```powershell
# Dry run (lists the 19 entries and which photo each gets):
pnpm --filter @bubc/studio seed:committee -- --dry-run

# Real run:
pnpm --filter @bubc/studio seed:committee

# Replace existing entries (e.g. if you've edited the script and want to re-seed):
pnpm --filter @bubc/studio seed:committee -- --replace
```

### What the script writes

For each of:

- **Officers** — Chair (Matteo), Vice Chair (Luka), Secretary (Charlie), Treasurer (Barnaby)
- **Captains** — Noah & Will (senior men), Ellie (senior women), Jeanne & Ryan (novice), Freya (coxing)
- **Programme support** — Madoc (equipment), Clemmie (kit)
- **Welfare** — Clover & Jonty
- **Comms** — Maia (marketing), Amelia (alumni)
- **Socials** — Finn & Hannah
- **Tech** — Matt

…it creates a doc with:

```yaml
_id: committee-matteo-tommassini-2025-26
_type: committeeMember
name: Matteo Tommassini
slug: matteo-tommassini
role: Chair
order: 0
academicYear: 2025/26
photo:
  _type: imageBlock
  asset: <link to uploaded photo>
  alt: Matteo Tommassini, 2025/26 BUBC committee
email: mt2324@bath.ac.uk
bio: 'Chair of BUBC for the 2025/26 season. …'
```

Documents are **published immediately** — they're live on the site within the next deploy. To undo: open the doc in Studio → ⋯ menu → **Unpublish** (or **Delete**).

### Reviewing the bios

The bios are drafted in committee voice (drawn from [CONTENT-BOOK.md](CONTENT-BOOK.md) section 6). They're provisional — confirm each one with the post-holder before you share the live URL widely. Open each card in Studio, edit the bio field, hit Publish. The live site updates within ~60 seconds.

### A teammate just got elected — adding one person

You can either:

- Add a single entry to the array at the top of `apps/studio/scripts/seed-committee.mjs` and re-run with `--replace`.
- Or just add them in Studio: **Committee members → +** → fill in fields → upload headshot → Publish.

For one person, the Studio route is faster.

---

## Step 4 — Seed the coaches

```powershell
pnpm --filter @bubc/studio seed:coaches -- --dry-run
pnpm --filter @bubc/studio seed:coaches
```

Creates three documents:

- **Charlie Newbold** (Head Coach) — with a best-guess photo from `assets/images/coaches/Screenshot-2025-10-22-at-11.46.21.jpg`.
- **Marcus Munafò** (Assistant Coach) — with a best-guess photo from `assets/images/coaches/WhatsApp-Image-2025-06-12-at-12.24.12_939da299.jpg`.
- **Simon Brown** (Novice Coach) — no photo on file. The page shows the styled placeholder until you upload one in Studio.

**Important:** the Charlie/Marcus photo mappings are guesses (the filenames don't say which coach they are). Open each doc in Studio after seeding, check the portrait is actually that person, and swap if wrong.

---

## Manual content in the Studio

For the rest, the fastest path is the Studio's form-based editor. The seed scripts could be extended for sponsors / squads / news, but the volume is low enough that doing it in Studio is faster and gives you a feel for the editor that you'll need when handing over to the next committee.

### Start the Studio locally

```powershell
pnpm --filter @bubc/studio dev
# Open http://localhost:3333
```

Sign in with GitHub. You should see your committee documents already listed under **Committee members**.

> Deployed Studio: `pnpm --filter @bubc/studio deploy` will publish the Studio at `bubc.sanity.studio`. Do that when other editors need to sign in — for now, running it locally is fine.

### Home page

Studio → **Home page** (singleton, top of left nav). Fill in:

- **Hero** — eyebrow, headline, sub, two CTAs, hero image (pick from the asset library — e.g. one of the `sweep/mens/` shots).
- **Stat strip** — four numbers (founded year, athletes, Olympians, decades on the Avon). Defaults if blank.
- **Squad pathway** — four cards. Override the defaults if you want different copy.
- **Closing CTAs** — three boxes. Defaults if blank.

Publish. The home page refreshes in the next deploy.

> Copy is in [CONTENT-BOOK.md § 2](CONTENT-BOOK.md#2-home-page-singleton).

### Site settings

Studio → **Site settings**. The fields that matter most before launch:

- **Boathouse location** — paste these:
  - Lat: `51.39180472152244`
  - Lng: `-2.407486235563779`
- **Live race banner** — leave unticked until a race weekend.
- **Sponsor strip** — auto-populates from headline + gold sponsors.

> Copy and exact values in [CONTENT-BOOK.md § 1](CONTENT-BOOK.md#1-settings-singleton).

### Squads (senior men, senior women, novice)

Studio → **Squads** → green +. One doc per squad.

Pick the right fields:

- **Name**: "Senior men" / "Senior women" / "Novice"
- **Slug**: `senior-men` / `senior-women` / `novice`
- **Tier**: senior / senior / novice
- **Gender**: men / women / mixed
- **Short description** — see CONTENT-BOOK.md § 3 for each squad.
- **Hero image** — pick from the asset library. Recommended:
  - Senior men → `assets/images/sweep/mens/4M3A0017-scaled.jpg`
  - Senior women → `assets/images/sweep/womens/440964856_18413151817066530…`
  - Novice → `assets/images/crews/IMG_8303.JPG`
- **Captain** — reference a `committeeMember` document. Pick the relevant captain from the dropdown.
- **Captain bio** — short callout text, max 400 chars. Drafts in CONTENT-BOOK.md.
- **Coaches** — array of references to the `coach` docs you seeded earlier.
- **Training schedule** — one entry per session. Day / start / end / type / location. The table in CONTENT-BOOK.md § 3 maps directly.
- **Expected standards** — PortableText (rich text). Copy from CONTENT-BOOK.md.
- **Achievements** — array. Year / title / detail.
- **Photo gallery** — array of imageBlocks. Pick from the asset library.
- **Contact email** — captain.m@bubc.co.uk / captain.w@bubc.co.uk / captain.n@bubc.co.uk.

Publish. Each squad gets its own page at `/squads/<slug>/`.

### News posts

Studio → **News posts** → green +. The repeat task that the comms officer will pick up — see [CONTENT-EDITING.md § 4](CONTENT-EDITING.md#publishing-a-news-post) for the official walkthrough.

For the first few posts, six drafts live in [CONTENT-BOOK.md § 16](CONTENT-BOOK.md#16-news--editorial-calendar--draft-posts) — BUCS report, athlete spotlight, recruitment, alumni, Christmas dinner, May 2026 boathouse update. Paste, attach a hero image, publish.

You'll also want to set up **categories** first (Studio → News categories → create one for each of: Race reports, Athlete spotlights, Alumni stories, Club news, Recruitment, Sponsor announcements).

### Sponsors

Studio → **Sponsors** → green +. For each sponsor:

- Name
- Logo — upload the file from `assets/images/sponsors/` (the seed:images step already added them to the asset library; pick from there)
- Website
- Tier — headline / gold / silver / supporter
- Since (year started)
- Description — tier-appropriate copy. Templates in CONTENT-BOOK.md § 11.
- "Show on homepage strip" — tick for headline + gold sponsors.

Publish. Site updates within ~60 seconds.

### Campaigns

Studio → **Campaigns** → green +. The "New Boathouse" draft in [CONTENT-BOOK.md § 12](CONTENT-BOOK.md#12-support--donate--buy-a-boat--campaigns) is ready to paste.

Fields:

- Title / slug / status (active)
- Goal amount, raised amount, donor count (numbers, no currency symbol)
- Story (PortableText)
- Gallery
- Donate URL (`https://bath.hubbub.net/p/BUBC/pledge/`)

The donation thermometer renders automatically once the doc is published.

### Boats / fleet

Studio → **Boats** → green +. The fleet is currently empty; CONTENT-BOOK.md § 8 has drafts for three boats and a reusable template.

Per boat:

- Name (Sampson / Susan Green / etc.)
- Slug
- Make + class + year bought + donor
- Photo
- Story (PortableText — 60–80 words is plenty)
- Status (active / retired / sold)

`/boathouse/fleet/` lists them all; `/boathouse/fleet/<slug>/` is the per-boat profile page.

### Alumni profiles

Studio → **Alumni profile** → green +. (Schema is named `olympian` for migration reasons; the form covers four categories.)

Pick the category — Olympian / GB international / Boat Race / Notable career — and the relevant achievement sub-fields appear.

CONTENT-BOOK.md § 10 has spotlight drafts for Becky Wilde, Cedol Dafyd, Ben Furley and Angus Pollock. Confirm each with the alumnus before publishing.

---

## After publishing — make sure the site actually rebuilds

Sanity → Vercel needs a webhook so editor publishes trigger a deploy. The setup is one-time:

1. Open Sanity manage → Project → **API** → **Webhooks** → **Create Webhook**.
2. Name: `vercel-deploy-hook`.
3. URL: copy from Vercel → BUBC project → **Settings** → **Git** → **Deploy Hooks** → create one for `main`.
4. Dataset: production.
5. Trigger on: Create, Update, Delete.
6. Filter (advanced): leave blank (rebuild for any change).
7. HTTP method: POST.
8. Save.

Detailed steps with screenshots are in [DEPLOYMENT.md § Sanity webhook](DEPLOYMENT.md).

Once wired: publishing a doc in Studio → Vercel rebuilds → live site updates in ~60 seconds.

In dev (before the webhook is wired): manually trigger a Vercel deploy from the dashboard, or push any commit to `main`, to see Sanity changes go live.

---

## What you can't (or shouldn't) do via seed scripts

- **Real bios** — the script bios are drafts. They need each committee member's confirmation before publishing widely. Edit in Studio after seeding.
- **Image hotspots** — the script uploads photos without a hotspot set (so the centre is used by default). For portraits especially, open in Studio and drag the hotspot dot onto the face.
- **Photo credit fields** — left blank by the seed. Fill in if photos are owned by a named photographer.
- **Anything you don't have permission for** — don't seed sponsor logos for partners that haven't agreed yet, alumni stories for people you haven't asked, etc.

---

## Troubleshooting

### "Missing SANITY_API_WRITE_TOKEN"

You forgot to set the env var, or you set it in a different terminal session. Re-run:

```powershell
$env:SANITY_API_WRITE_TOKEN = "sk..."
```

### "Insufficient permissions"

Your token has the wrong role. In sanity.io/manage → Tokens, delete the old one, create a new one with **Editor** role.

### "photo not found: …"

The seed script expects the photo file to live at the exact path it names. Check:

```powershell
ls assets/images/committee/
```

…and either rename the file in the folder, or update the `photo:` field in `apps/studio/scripts/seed-committee.mjs`.

### Committee doc was created but the photo is missing

The photo upload failed silently. Look for `✗ photo not found` lines in the script output. The doc still exists; open it in Studio and upload the photo manually.

### "I ran the seed twice and got duplicates"

You shouldn't — the scripts use stable IDs of the form `committee-<slug>-<year-stripped>`. If you do see duplicates, they're coming from the Studio (someone created a doc manually with a different ID). Delete the manual one.

### Live site doesn't reflect my changes

- Check the doc is published, not in draft state (status pill bottom-right says "Published").
- Check the Sanity → Vercel webhook is wired (see above).
- Wait ~90 seconds; static rebuilds aren't instant.
- If still no change, push any commit to `main` to force a rebuild.

---

_Last updated: 2026-05-26 (session 9). Update this file when a new seed script lands or the workflow changes._

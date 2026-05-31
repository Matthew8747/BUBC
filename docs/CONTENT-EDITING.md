# Editing the BUBC website

> A practical guide for the Comms Officer, Captains, and anyone else publishing content. No coding knowledge required.
>
> The website pulls all of its content from a separate tool called **Sanity Studio**. You edit there; the live site rebuilds itself within ~60 seconds of you hitting Publish.
>
> **What to publish and how often** is in [CONTENT-CADENCE.md](CONTENT-CADENCE.md). This file covers **how** to publish each thing once you've decided to.

---

## Contents

1. [How this works (one paragraph)](#how-this-works)
2. [Logging in](#logging-in)
3. [Tour of the Studio](#tour-of-the-studio)
4. [Publishing a news post](#publishing-a-news-post) — the most common task
5. [Photos and alt text](#photos-and-alt-text)
6. [Toggling the live race banner](#live-race-banner) — regatta day
7. [Updating site settings](#updating-site-settings) — nav, footer, logo
8. [Adding a committee member](#adding-a-committee-member)
9. [Adding a coach](#adding-a-coach)
10. [Adding a campaign](#adding-a-campaign)
11. [Adding a sponsor](#adding-a-sponsor)
12. [Adding a regatta result](#adding-a-regatta-result)
13. [Updating the home page](#updating-the-home-page)
14. [What you should not touch](#what-you-should-not-touch)
15. [Common gotchas](#common-gotchas)
16. [Getting help](#getting-help)

---

<a id="how-this-works"></a>

## 1. How this works

Sanity Studio is a small web app where you fill in forms — headlines, dates, photos, body text. When you press Publish, the data is saved to Sanity. A few seconds later the website rebuilds itself with your changes baked in, and serves the new version from Vercel.

You never edit the website's HTML directly. You never have to think about "deployments" or "the server." The flow is: **edit → publish → wait ~60 seconds → live**.

> Loom walkthrough: _coming soon — sit with the outgoing comms officer for a real-time demo, then record one._

<a id="logging-in"></a>

## 2. Logging in

1. Open <https://bubc.sanity.studio>. (If that URL doesn't load, the Studio hasn't been deployed yet — ask the developer; the procedure is in [STUDIO-HOSTING.md](STUDIO-HOSTING.md).)
2. You'll see a "Continue with…" screen. Pick the option that matches the account you were invited under — usually **Google** or **GitHub**.
3. If you've never been invited, ask the President or current Comms Officer. Sanity invites by email; check your spam folder if it doesn't arrive.

Once you're in, you stay logged in across sessions for several weeks. Re-authentication is by clicking the same buttons.

<a id="tour-of-the-studio"></a>

## 3. Tour of the Studio

The screen is split into three columns:

- **Far left — document types**. Top-to-bottom: _Home page_, _Site settings_ (these are the only two singletons — only one of each ever exists), then groups for News & events, Squads & people, Heritage, Boats, Fundraising, and Pages.
- **Middle — list**. When you click "News posts" you see every post; clicking one opens it on the right.
- **Right — editor**. The form for the selected document, with tabs across the top (Content / Metadata / Related / SEO for news; similar groupings for everything else).

Across the bottom of the editor:

- **Status pill** — shows _Draft_, _Published_, or _Edited_ (you've changed a published doc, the change is not yet live).
- **Publish** button — bottom-right. Click to push the current draft live.
- **History icon** (clock) — top-right of the editor. View every previous version. Click any version → **Restore** to roll back.

> Rule of thumb: a draft is not on the live site. A published document is. If the status pill says _Edited_, your last save is in draft form and not yet visible to the public.

<a id="publishing-a-news-post"></a>

## 4. Publishing a news post

This is the most common task. It takes 5–10 minutes once you have the copy and photos ready.

### Step-by-step

1. **Left nav → News posts → green "+" button** (top of the list). A new blank post opens.
2. **Title** — keep it under 70 characters for good SEO. Example: "Senior men retain Temple at HRR 2026".
3. **Slug** — click _Generate_. This becomes the URL: `bubc.co.uk/news/<slug>/`. You can edit it if Sanity guessed something awkward, but never include spaces or punctuation other than dashes.
4. **Publish date** — defaults to now. Set it forward if you want to schedule (note: scheduling currently means "leave the post as a draft until the date and hit Publish manually" — automatic future publishing is not wired up).
5. **Author** — free text. Usually "BUBC Press" for committee-written posts, or a person's name if it's a signed report.
6. **Category** — pick from the dropdown. If the category you want doesn't exist, see _News categories_ in the left nav and create it first. Standard categories: _Race report_, _Squad update_, _Fundraising_, _Alumni_, _Announcement_.
7. **Hero image** — upload a photo. **Alt text is required** — see [§5](#photos-and-alt-text). Click and drag the small dot inside the image to set the "hotspot" — that's the point that stays visible when the image is cropped to a different shape on different pages.
8. **Excerpt** — 200 characters max. Shown on the news index card and on Twitter/LinkedIn previews. Write a punchy summary that stands alone if someone never clicks through.
9. **Body** — the main copy. Click anywhere to start typing. Use the formatting toolbar at the top:
   - **H2 / H3** for sub-headings (never H1 — the title is the H1).
   - **Bold** sparingly, **italics** for boat names and regatta names (e.g. _Henley Royal Regatta_).
   - **Link** — highlight text, click the link icon, paste URL.
   - **Block quote** — for pull-quotes from athletes / coaches.
   - **Image** — drops a full-width image into the flow. Alt text required.
10. **Related athletes / squads / regatta result** (Related tab) — optional, but useful for SEO. Pick from existing documents.
11. **SEO tab** — leave blank unless you want a different title / description for search engines than what's on the post itself.

### Saving and publishing

- **Save** happens automatically every few seconds while you type — you'll see the status pill move between _Saving_ and _Edited_.
- **Publish** when you're ready. The site rebuilds in the background; the new post is live at `bubc.co.uk/news/<slug>/` within ~60 seconds. You'll also see it appear on the home page's news rail and at the top of `/news/`.

> **If you're an Editor (not an Administrator), you won't see a Publish button.** That's intentional — drafts go to an Administrator (President / outgoing maintainer) for review first. Save your draft, then tell the Admin it's ready (Slack / WhatsApp / email). Full process: [REVIEW-WORKFLOW.md](REVIEW-WORKFLOW.md).

### Editing a post after it's published

Same screen, same Publish button. While you edit, the live site keeps showing the previous version — only when you press Publish does the new version go out.

### Un-publishing a post

Three-dot menu in the top-right of the editor → **Unpublish**. The post stays as a draft (you can re-publish later) but disappears from the live site within ~60 seconds.

<a id="photos-and-alt-text"></a>

## 5. Photos and alt text

Every image you upload has to have **alt text** — a short description of what's in the photo. This is non-negotiable: it's required by accessibility law for public-sector-affiliated websites, and it's what screen readers read aloud to blind users.

### Writing good alt text

- **Describe the photo**, don't title it. ❌ "Henley win photo" → ✅ "BUBC senior men crossing the finish line at Henley Royal Regatta, blades raised".
- **One sentence**, under 200 characters.
- **Don't start with "Image of…" / "Photo of…"** — screen readers already announce it's an image.
- **Mention named athletes** when it's a portrait or a small crew shot — helps SEO too.
- **If the photo is purely decorative** (a texture, a divider, a stock illustration) — tick the **Decorative image** toggle below the alt-text field. The image will then be hidden from screen readers.

### Hotspot

The little draggable circle inside the photo preview. Set it to the most important part of the image — usually a face or the bow of a boat. When the photo is cropped to fit different layouts on the site (16:9 banner, 4:5 card, 1:1 portrait), the hotspot stays in shot.

### Photo credit + caption

Two optional fields below the alt text. **Caption** appears next to the image on the page (useful for archive photos). **Credit** is for the photographer's name — appears small underneath. Both are blank by default.

> Loom walkthrough: _coming soon — uploading a photo and setting alt + hotspot._

<a id="live-race-banner"></a>

## 6. Live race banner — regatta day

A coloured bar across the top of every page, pointing visitors at the official live tracker (British Rowing, HRR website, etc.). Use during BUCS, Henley Royal, Henley Women's, BUSA, Head of the River.

### Turning it on

1. Left nav → **Site settings** (near the top).
2. Open the **Live race banner** section (it's collapsed by default).
3. Tick **Show banner**.
4. Fill in:
   - **Event name** — short, e.g. "HRR 2026".
   - **Message** (optional) — context, e.g. "BUBC men race the Temple at 12:45 today".
   - **Live results URL** — the British Rowing or regatta-organiser link.
   - **Link label** — defaults to "Follow live".
   - **Tone** — Navy (default), Gold (use for fundraising-related events), Blade red (use for race day — most visible).
5. **Publish** the Site settings document. The banner appears on every page within ~60 seconds.

### Turning it off

Same screen, untick **Show banner**, publish. Banner disappears within ~60 seconds.

### Visitor behaviour

The banner has a dismiss button — once a visitor closes it, it stays dismissed for that session. If you change the event name, it reappears for everyone (treated as a new banner).

<a id="updating-site-settings"></a>

## 7. Updating site settings

The Site Settings document holds everything global to the site: logo, navigation, footer, social links, contact details.

You shouldn't need to touch this often. When you do, the affected layouts (the header on every page, the footer on every page) update within ~60 seconds.

The fields are grouped into tabs:

- **General** — site title, default meta description, logo, charity number.
- **Contact** — primary email, postal address, boathouse coordinates (lat/lng + what3words). The coordinates power the OpenStreetMap embed on `/boathouse/`.
- **Navigation** — the six items in the main nav, plus the small utility links and the accent CTA button (defaults to "Trial with us").
- **Footer** — up to four columns of links.
- **Social** — your Instagram, YouTube, Strava, etc. URLs. Icons appear automatically based on the platform.
- **Live race banner** — see [§6](#live-race-banner).

> If you accidentally delete a link or column, hit the **History** clock icon (top-right) and restore the previous version. Don't panic.

<a id="adding-a-committee-member"></a>

## 8. Adding a committee member

The `/committee/` page automatically shows the **current academic year**'s committee — that means once you've added the 2026/27 cohort, the page will switch over from 2025/26 automatically on 1 September 2026.

### Step-by-step

1. Left nav → **Committee members** → green "+" button.
2. **Name** — full name as you want it displayed.
3. **Slug** — click Generate.
4. **Role** — e.g. "President", "Men's Captain", "Welfare Officer", "Treasurer". Title case.
5. **Display order** — smaller = earlier on the page. President should be `0`, Men's Captain `10`, Women's Captain `20`, etc. Treasurer and Welfare Officer typically `30`. Default `100` means alphabetical-ish at the bottom.
6. **Academic year** — exactly `2026/27` format (four digits, slash, two digits). Validated automatically.
7. **Headshot** — upload a portrait photo, ideally square or close to it. Alt text usually just the person's name. Hotspot on the face.
8. **Degree course** — e.g. "MEng Mechanical Engineering, 3rd year".
9. **Email** — the committee role's BUBC email (`captain.m@bubc.co.uk`, `welfare@bubc.co.uk`, etc.). Not personal addresses.
10. **Short bio** — ~3–4 sentences. Who they are, what they row, one sentence on what motivates them. Public-facing — keep it warm but professional.
11. **Publish**.

### Updating mid-year

Same fields. The display order can be tweaked any time without changing the academic year.

### Replacing the full committee at handover

Don't delete the old committee members — keep them so the historical record survives. Just add the new ones with a new academic year, and the page will switch over automatically on 1 September.

<a id="adding-a-coach"></a>

## 9. Adding a coach

Left nav → **Coaches** → green "+" button. Fields are similar to committee member but include:

- **Qualifications** — array of strings. Examples: "British Rowing Level 3", "GB U23 cox 2018", "World Class Start coach".
- **Bio** — full PortableText body (rich text). Can include linked athletes, photos, etc.

Coaches appear on `/coaching/`. Sort order is field-driven — set lower numbers to appear higher up the page.

<a id="adding-a-campaign"></a>

## 10. Adding a campaign

A campaign is a fundraising drive with a target — e.g. "Help us buy a new senior men's eight". Appears with a thermometer.

1. Left nav → **Campaigns** → green "+" button.
2. **Title** — e.g. "Replace the Empacher VIII".
3. **Slug** — Generate.
4. **Status** — Active / Reached / Closed. Active campaigns surface on `/support/donate/` and `/support/campaigns/`.
5. **Goal amount** — number, in GBP. No comma, no currency symbol. E.g. `25000`.
6. **Raised amount** — current total. Update this manually each time you check Hubbub.
7. **Donor count** — optional, total number of donors so far.
8. **Story** — PortableText. Tell the donor why this campaign matters.
9. **Gallery** — optional photo gallery.
10. **Donate URL** — the Hubbub link visitors should hit to donate.

The thermometer fills automatically based on raised / goal. Cap is 100% — if you raise more than the goal, the bar shows 100%, which is the correct behaviour.

<a id="adding-a-sponsor"></a>

## 11. Adding a sponsor

Left nav → **Sponsors** → green "+".

- **Name** — sponsor name.
- **Logo** — upload. Use a high-res file; the site picks the right size. Alt text = company name.
- **Website** — full URL with `https://`.
- **Tier** — Headline, Gold, Silver, Supporter. Tiers control how prominently the logo appears on `/support/sponsor/`.
- **Since** — the year the partnership started.
- **Description** — short paragraph on the partnership.

The sponsor strip in the footer + the sponsor page both refresh from this list.

<a id="adding-a-regatta-result"></a>

## 12. Adding a regatta result

Left nav → **Regatta results** → green "+". Fields:

- **Regatta** — name, e.g. "Henley Royal Regatta".
- **Year** — four digits.
- **Event** — boat class, e.g. "Temple Challenge Cup" or "Men's Senior 8+".
- **Crew name** — internal label, e.g. "BUBC M8+".
- **Athletes** — array of references to the `Athlete` documents (create those first if needed).
- **Finish** — string, e.g. "Winners", "Lost in semi", "3rd in heat".
- **Time** — race time, free-form (`6:45.2`).
- **Video** — optional video link.
- **Photos** — gallery.

Results power both the `/results/` archive (filterable by year + regatta) and the related-results section on news posts.

<a id="updating-the-home-page"></a>

## 13. Updating the home page

Left nav → **Home page** (singleton — there's only one). Sections:

- **Hero** — eyebrow line, headline, sub-headline, two CTA buttons, hero image.
- **Stat strip** — four big numbers below the hero. Editable: founded year, Olympians count, Henley wins, members. If left blank, the strip shows sensible defaults.
- **Featured news** — the news rail picks the three most recent posts automatically; you don't curate this manually.
- **Squad pathway** — four cards. Defaults to senior men / senior women / novice / trial — override if you want different copy.
- **Sponsor strip** — populated automatically from your Sponsor documents (headline + gold tiers shown).
- **Closing CTAs** — three boxes at the bottom (trial / donate / sponsor). Override copy if needed.

Publish to push changes live.

<a id="what-you-should-not-touch"></a>

## 14. What you should not touch

Treat these as off-limits unless you're a developer or you've been explicitly trained:

- **Singleton enforcement** — never try to create a second `Home page` or `Site settings` document.
- **The "Pages" document type** — used for one-off body content on `/about/history/`, `/welfare/`, etc. Editable, but ask a developer before adding a new one (it needs a slug that matches a route the developer has set up).
- **The Vision tool** (left nav, magnifying glass icon) — that's a GROQ playground for developers. Read-only by accident, but don't run queries you don't understand.
- **Schema fields** — if you see a field labelled differently from this doc, the schema was updated. Update this doc rather than working around the change.
- **Anything outside Sanity Studio** — Vercel, GitHub, Cloudflare. Editors don't need to touch these. If you think you do, ask first.

<a id="common-gotchas"></a>

## 15. Common gotchas

- **"My post isn't on the live site"** — give it 60 seconds. Most builds take 30–90 seconds. If after 3 minutes nothing has appeared, check the Vercel dashboard: is there a deploy in progress or failed? If a deploy failed, the change won't go live — alert the developer.
- **"The image looks cropped weird on the home page but right on the news post"** — set the hotspot (see [§5](#photos-and-alt-text)). The site crops differently on different pages; the hotspot tells it what to keep.
- **"The slug field looks empty"** — click _Generate_. Don't try to invent one.
- **"I can't publish — the button is greyed out"** — usually means a required field is empty or invalid. Scroll up the form; the offending field will have a red highlight and an error message.
- **"The committee page shows last year's committee"** — academic year hasn't rolled over yet (rolls over 1 September), or you forgot to set the academic year on the new committee members. Set it to `2026/27` (current cohort).
- **"I deleted something by accident"** — hit the History clock icon (top-right of the editor) and restore. Sanity keeps full version history forever.
- **"The font looks different on mobile"** — that's intentional (the site adapts). Open it on desktop to check; if the difference is unintentional, alert the developer.

<a id="getting-help"></a>

## 16. Getting help

- **A specific document broke or won't publish** → try History → Restore previous version. Then ask the President or current developer.
- **Studio looks completely different from this doc** → Sanity Studio is on version 5; the screenshots referenced in Loom walkthroughs assume version 5. If a major update lands and the layout shifts, ping the developer to update this guide.
- **You broke the live site** → see [HANDOVER.md § Emergency procedures](HANDOVER.md#7-emergency-procedures). Rolling back is one click in Vercel.
- **You want to add a feature that doesn't exist** → that's a developer change. Open a request in [FEATURES.md](FEATURES.md) and discuss with the President.

For broader concerns:

- Editor / publishing questions: ask the outgoing Comms Officer.
- Account access / security: ask the President.
- Technical / breaking changes: ask the developer-successor or Matthew (`matthew164798@gmail.com`).

---

_Last updated 2026-05-25. Update this file when a schema field changes, a new content type is added, or a Studio version-update changes the layout._

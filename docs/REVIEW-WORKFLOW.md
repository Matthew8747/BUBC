# Review workflow — who can publish what

> **Audience:** the President, Comms Officer, and anyone deciding who gets which role in Sanity.
> **Goal:** let the wider committee write and edit content, without giving everyone the power to push it live unreviewed.
>
> Companion docs: [CONTENT-EDITING.md](CONTENT-EDITING.md) (how editors use the Studio) · [STUDIO-HOSTING.md](STUDIO-HOSTING.md) (how the Studio gets deployed) · [HANDOVER.md](HANDOVER.md).

---

## The model

Sanity has two relevant roles for our setup:

| Role              | Can do                                                                                                                                 | Who gets it                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **Administrator** | Everything. Create, edit, **publish**, **unpublish**, **delete**, invite members, change project settings.                             | President + outgoing maintainer. **Two people only.**     |
| **Editor**        | Create, edit, and save drafts on any document. **Cannot publish, unpublish, or delete.** Their changes wait in draft for admin review. | Comms Officer, Captains, anyone trusted to write content. |

The Publish, Unpublish, and Delete buttons are **hidden from non-Administrator users** in the Studio (wired in [`apps/studio/sanity.config.ts`](../apps/studio/sanity.config.ts)). So Editors physically can't push something live by accident or in haste — those buttons aren't on their screen.

The Viewer role exists too (read-only) but we don't use it — drafts are private to Editors and Admins, so a Viewer would see almost nothing useful.

---

## The flow

```
Editor                                Administrator
──────                                ─────────────
1. Opens Sanity, hits + on
   News posts.
2. Writes the post.
   Uploads photo + alt text.
3. Hits Save (auto-saves
   actually). Doc is now a
   DRAFT — yellow "Edited" dot
   in the document list.
4. Tells the Admin in Slack /
   WhatsApp / email: "draft
   ready for review."
                                       5. Opens the doc in Sanity.
                                          Reads it. Tweaks if needed.
                                       6. Hits Publish.
                                          Live on bubc.co.uk in ~60s.
```

There's no formal "Submit for review" button in this setup — it's a conversation. The yellow draft indicator in the document list is the signal. Most committees handle this in their existing comms channel (Slack channel #website, or a WhatsApp group).

> **Want it more structured?** A community plugin called [`sanity-plugin-workflow`](https://www.sanity.io/plugins/sanity-plugin-workflow) adds a kanban board with explicit `Needs review → Approved → Published` states and reviewer assignment. Free, open source. Worth installing if the team grows or the volume of drafts gets confusing — but for a typical committee, the simpler convention above is enough.

---

## Adding someone as an Editor

1. <https://www.sanity.io/manage> → project **j7zcx618** → **Members** tab → **Invite member**.
2. Enter their email.
3. Role: **Editor**.
4. Send. They'll get a Sanity invite email.
5. When they accept and sign in, point them at <https://bubc.sanity.studio> and at [CONTENT-EDITING.md](CONTENT-EDITING.md).
6. Tell them: **"You can write and save anything. Tell me / the President when something's ready, and I'll publish it."**

---

## Admin's review checklist

When an Editor flags a draft as ready, before hitting Publish:

- [ ] **Read the body** — does it say what it should? Tone matches the rest of the site?
- [ ] **Title and excerpt** — concise, no exclamation marks, surnames after first mention?
- [ ] **Hero image** — does it have alt text? Is the hotspot on the face / bow?
- [ ] **Publish date** — sensible (defaults to now)?
- [ ] **Category** — picked? Make sense?
- [ ] **Related squads/athletes** — linked where appropriate?
- [ ] **Slug** — generated, no awkward characters?
- [ ] **Facts** — names spelled right, results correct, opposition crews named correctly?

Once happy, click **Publish**. The change is live on the site within ~60 seconds (via the Sanity → Vercel webhook — see [DEPLOYMENT.md](DEPLOYMENT.md#sanity--vercel-deploy-webhook)).

---

## What happens to existing drafts when someone leaves

When an Editor leaves the committee:

1. <https://www.sanity.io/manage> → Members → click their row → **Remove**.
2. Their drafts stay. Any draft they were halfway through is still there, owned by no-one in particular; an Admin or a successor Editor can pick it up.
3. Their published work stays — Sanity tracks who created each version in the doc history, even after they're removed.

---

## Edge cases

### "I'm an Admin and I want to give someone trusted Publish access too — without making them an Admin"

You can't, on the free Sanity plan. Custom roles ("Editor, but with publish") are a paid feature (Growth plan, ~$99/mo). Three workarounds:

- **Promote them to Administrator** — fine for one or two trusted people (President + Comms Officer). Don't sprawl beyond that.
- **Wait until needed** — most committees don't have publish-bottleneck problems; a single Admin reviewing drafts in batches works.
- **Pay for Growth** — overkill unless the team is much larger.

### "I want to bypass the gate for myself only — I'm Admin and the friction is annoying"

You already do. The gate hides Publish from non-Admins. As Administrator, you see Publish on every doc. The change is invisible to you.

### "An Editor saved a draft, then we decided to scrap it"

Two options:

- **Editor discards their own changes** — Document menu → **Discard changes**. Available to everyone.
- **Admin deletes the draft** — only Admins see the Delete action.

### "I want to disable this and let everyone publish again"

Open [`apps/studio/sanity.config.ts`](../apps/studio/sanity.config.ts), remove or comment out the block that filters `ADMIN_ONLY_ACTIONS`, and re-run `pnpm --filter @bubc/studio run deploy`.

---

_Last updated 2026-05-31. Update this file if the role gate changes or a different review tool is adopted._

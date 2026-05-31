# Hosting the Sanity Studio online

> **Audience:** the developer/maintainer of the BUBC website.
> **Goal:** stop forcing committee editors to clone the repo and run `pnpm studio` locally. Once this guide is done, they will just visit a URL, sign in, and edit.
>
> Companion docs: [CONTENT-EDITING.md](CONTENT-EDITING.md) (what editors do once they're in) · [HANDOVER.md](HANDOVER.md) · [DEPLOYMENT.md](DEPLOYMENT.md).

---

## How this works

The Studio is just a Vite/React app. Sanity offers free hosting for it at `<hostname>.sanity.studio` — they build it from the code in `apps/studio/` and serve it from their own CDN. We deploy it once with the Sanity CLI; after that, editors only need a browser.

```
apps/studio/  ──sanity deploy──▶  bubc.sanity.studio  ◀──browser──  committee editors
       │
       │ schema changes are bundled in
       │ each deploy — re-run when the schema changes
```

The content itself (news posts, photos, settings) lives in Sanity's dataset — the Studio is just the editor UI pointing at it.

---

## One-time setup

You only need to do these steps once, the very first time the Studio is deployed.

### 1. Make sure the CLI is logged in as the right account

The CLI must be authenticated against the **GitHub** account that owns Sanity project `j7zcx618` — not Google. If you log in with Google you'll get _"project ID not found, or you do not have access"_.

```powershell
npx sanity logout
npx sanity login
# pick "Continue with GitHub"
```

### 2. Pick (and remember) the hostname

The default is `<project-name>.sanity.studio`. We'll use **`bubc.sanity.studio`**.

You don't reserve this in advance — the deploy command (next step) prompts you for a hostname the first time, then remembers it for future deploys.

### 3. Run the deploy

```powershell
pnpm --filter @bubc/studio run deploy
```

The CLI will:

1. Run `sanity build` to produce a static bundle of the Studio.
2. Ask **"Studio hostname (<something>.sanity.studio):"** — type `bubc` and press enter.
3. Upload the bundle to Sanity's CDN.
4. Print the live URL: <https://bubc.sanity.studio>.

If the hostname is already taken (someone else got there first), pick a fallback — `bubc-bath`, `bathbubc`, `universityofbathbc`. We don't depend on the URL anywhere in the codebase, so any hostname is fine — just update the references in [CONTENT-EDITING.md §2](CONTENT-EDITING.md#logging-in) and [HANDOVER.md §3](HANDOVER.md#3-the-stack-at-a-glance) to match.

### 4. Verify

1. Open <https://bubc.sanity.studio> (or whatever hostname you chose).
2. Sign in with the GitHub account.
3. Confirm you can see the same left-hand navigation as the local Studio (Home page, Site settings, News, Squads, etc.).

If you see a CORS error in the browser console (very rare — `sanity deploy` configures CORS for the hostname automatically), add the studio URL manually at <https://www.sanity.io/manage> → project `j7zcx618` → **API** → **CORS Origins** → **Add CORS origin** → `https://bubc.sanity.studio` with **Allow credentials** ticked.

---

## Inviting editors

Editors don't need GitHub access, Vercel access, or the repo. They just need a Sanity account and to be added to the project.

> **Review gate** — the Studio is configured so only **Administrators** see the Publish, Unpublish, and Delete buttons. Editors can write and save drafts, but an Administrator has to review and publish. Full rationale + checklist in [REVIEW-WORKFLOW.md](REVIEW-WORKFLOW.md).

1. Go to <https://www.sanity.io/manage> → project **j7zcx618** → **Members** tab.
2. **Invite member** → enter their email → choose role:

   | Role              | Use for                                                                                                                                                     |
   | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Administrator** | President + outgoing maintainer only (≤2). Can publish, unpublish, delete, change project settings, invite/remove members, deploy a new Studio bundle.      |
   | **Editor**        | Comms Officer, Captains, anyone who writes news posts or updates squad data. Can read/write/save drafts; **cannot publish** — an Admin reviews + publishes. |
   | **Viewer**        | Optional — if you want someone to see the Studio without editing (e.g. a sponsor reviewing a draft). They can read but not save.                            |

3. Send. Sanity emails them a link.
4. When they accept, they pick how to sign in — Google, GitHub, or email/password. That's their choice; the project doesn't care.
5. Tell them the URL: <https://bubc.sanity.studio>. Point them at [CONTENT-EDITING.md](CONTENT-EDITING.md).

> **Free-tier cap:** Sanity's free plan allows up to 20 non-admin users. Far more than we need.

---

## After it's deployed

### Re-deploying when the schema changes

Whenever someone in the repo edits anything under `apps/studio/schemaTypes/` (adds a field, renames a doc type, etc.), the live Studio still shows the **old** schema until you re-deploy:

```powershell
pnpm --filter @bubc/studio run deploy
```

This is fast (~30-60 seconds) and non-destructive — content already entered is preserved; editors just see the new fields.

> **Tip:** put this in the committee handover checklist. After any code PR that touches `apps/studio/`, the next thing to do (after merging) is re-deploy the Studio. Content edits without a re-deploy means editors are filling in a stale form.

### Editor changes go live in ~60 seconds

When an editor hits Publish, Sanity stores the change. The live site at bubc.co.uk only sees it on the next build — which is triggered by the **Sanity → Vercel webhook** described in [DEPLOYMENT.md § Sanity → Vercel deploy webhook](DEPLOYMENT.md#sanity--vercel-deploy-webhook). If that webhook isn't set up yet, content changes won't appear on the live site until the next git push to `main`.

### Removing a member

Same Members tab → click the member row → **Remove**. Do this at every committee turnover for departing members. Keep at least one Administrator other than the outgoing maintainer at all times.

### Switching Administrator

Two admins must always exist before one steps down. Promote the incoming maintainer to **Administrator**, **then** demote the outgoing one to Editor (or remove entirely). Doing it in the other order can lock the project.

---

## Troubleshooting

| Symptom                                                                  | Cause / fix                                                                                                                                                                               |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ERR_PNPM_INVALID_DEPLOY_TARGET` — "This command requires one parameter" | You ran `pnpm --filter @bubc/studio deploy` (without `run`). That hits pnpm's _own_ workspace-deploy command instead of our `deploy` script. Use `pnpm --filter @bubc/studio run deploy`. |
| `sanity deploy` errors with "project not found"                          | CLI auth is on the wrong account. Run `npx sanity logout && npx sanity login` → **Continue with GitHub**.                                                                                 |
| `sanity deploy` hangs at "Building Studio"                               | Make sure the repo `pnpm install` is fresh. From the repo root: `pnpm install --frozen-lockfile`, then retry.                                                                             |
| Editor logs in but sees a blank left-hand nav                            | The Studio was deployed before the schema was finished. From the repo, run `pnpm --filter @bubc/studio run deploy` again to push the current schema.                                      |
| Editor publishes a post, but it doesn't appear on bubc.co.uk             | The Sanity → Vercel webhook isn't wired. Set it up — [DEPLOYMENT.md § Sanity → Vercel deploy webhook](DEPLOYMENT.md#sanity--vercel-deploy-webhook). Until then, push triggers a deploy.   |
| Editor says "I can't see the new field I was told about"                 | Code change merged but Studio hasn't been re-deployed. Re-run `pnpm --filter @bubc/studio run deploy`.                                                                                    |
| Hostname `bubc` is already taken                                         | Pick another (`bubc-bath`, `bathrowing`, etc.). The first run prompts; subsequent runs reuse what you chose.                                                                              |

---

_Last updated 2026-05-31. Update this file when the hostname changes, a new role is introduced, or the deploy command changes._

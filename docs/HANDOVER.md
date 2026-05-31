# Committee Handover — bubc.co.uk

> You've inherited the website. This doc is the one-page brief: what it is, where the keys live, and which longer doc to open when. Read this first.
>
> If you only have ten minutes, read §1, §3, and §6.

---

## 1. What this site is

**bubc.co.uk** is a statically-built website hosted on Vercel, with content edited through a separate CMS called **Sanity Studio**. There is no server, no database, no admin panel — every page is rebuilt from scratch each time someone publishes a change.

You do not need to write code to update the site. Almost everything an editor needs to do happens in Sanity Studio. See [CONTENT-EDITING.md](CONTENT-EDITING.md).

## 2. Reading order

Pick the document that matches your role:

| You are…                                              | Read                                                                                                                                      |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Comms officer / captain — publishing news, etc.**   | [CONTENT-EDITING.md](CONTENT-EDITING.md) + [CONTENT-CADENCE.md](CONTENT-CADENCE.md)                                                       |
| **President / treasurer — overseeing the site**       | This file + [DEPLOYMENT.md](DEPLOYMENT.md) sections "Vercel" and "Sanity → Vercel deploy hook" + [REVIEW-WORKFLOW.md](REVIEW-WORKFLOW.md) |
| **Developer-successor — taking over the code**        | [plan.md](plan.md), then [PROGRESS.md](PROGRESS.md), then [DEPLOYMENT.md](DEPLOYMENT.md) + [STUDIO-HOSTING.md](STUDIO-HOSTING.md)         |
| **Concerned about security / a vulnerability report** | [SECURITY.md](SECURITY.md)                                                                                                                |
| **Just looking at what features exist**               | [FEATURES.md](FEATURES.md)                                                                                                                |

## 3. The stack at a glance

Five systems make the site work. You need to know what each one does and who has the password.

| System         | Purpose                                                                       | Where to log in                                                                              |
| -------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **GitHub**     | Source code lives here. Developers push changes; everything else is automatic | <https://github.com/Matthew8747/BUBC>                                                        |
| **Vercel**     | Hosts the live site. Auto-deploys whenever GitHub or Sanity changes           | <https://vercel.com> (sign in with GitHub)                                                   |
| **Sanity**     | Content management. News posts, photos, committee, etc. are all edited here   | <https://bubc.sanity.studio> (once deployed — see §6) / <https://sanity.io/manage> for admin |
| **Cloudflare** | Domain DNS, email forwarding, anonymous web analytics                         | <https://dash.cloudflare.com>                                                                |
| **Formspree**  | Handles the trial-with-us form submissions                                    | <https://formspree.io>                                                                       |
| **Buttondown** | Newsletter signup (optional — only if you want to send a newsletter)          | <https://buttondown.email>                                                                   |

The full deploy + secrets story is in [DEPLOYMENT.md](DEPLOYMENT.md). Don't be intimidated — for normal editorial use you only need Sanity.

## 4. Where credentials live

**Strongly recommended: a shared 1Password or Bitwarden vault** that the President, Treasurer, and outgoing maintainer all have access to. Add a new login each time the committee changes. Don't email passwords.

Until that vault exists, treat the current maintainer as the source of truth. Email them before you assume something is lost.

Minimum credential inventory the vault should hold:

- Domain registrar login (the company `bubc.co.uk` is registered with — confirm with treasurer)
- GitHub account credentials for the BUBC org owner (or an "owner" team membership)
- Vercel account credentials (or team invite)
- Sanity admin account credentials (only two people should have admin tier — see [SECURITY.md § Sanity (CMS) authorisation](SECURITY.md))
- Cloudflare account credentials
- Formspree / Buttondown / Sentry / Cloudflare Analytics keys (these are also in Vercel env vars)

If you're handed credentials by the outgoing committee, **change passwords immediately** and confirm 2FA is on.

## 5. Who owns what

Fill these in as committee changes — don't leave them blank.

| Responsibility                                                           | Current owner                                   |
| ------------------------------------------------------------------------ | ----------------------------------------------- |
| Annual domain renewal (~£10/yr — failed payment = site goes dark)        | _Treasurer (confirm registrar holds card)_      |
| Vercel & GitHub bills (£0 today; flag if usage goes over free tier)      | _Treasurer (check Vercel dashboard quarterly)_  |
| Sanity admin tier (can edit settings/nav/footer + invite editors)        | _President + Comms Officer_                     |
| Editorial publishing (news posts, photos, results)                       | _Comms Officer + Captains_                      |
| Welfare officer named on `/welfare/` page                                | _Welfare Officer_                               |
| Press / media contact                                                    | _Press Officer (or Comms if not appointed)_     |
| Code maintenance (rare — only if something breaks or a feature is added) | _Outgoing developer until a successor is named_ |

## 6. Annual checklist (do at committee turnover)

Each year when the new committee takes over:

1. **Update committee members in Sanity** — see [CONTENT-EDITING.md § Adding a committee member](CONTENT-EDITING.md#adding-a-committee-member). The current committee shows automatically based on academic year (UK September rollover).
2. **Confirm the new President + Comms Officer have Sanity access** at <https://www.sanity.io/manage> → project `j7zcx618` → Members. Remove anyone who's left the club.
3. **Rotate any shared passwords** that the previous committee knew (vault entries flagged "shared with cohort").
4. **Update the "Past maintainers" list** at the bottom of this file.
5. **Check Vercel + Cloudflare account access** — at minimum, two committee members should be able to log in.
6. **Verify domain auto-renewal is set** with the registrar.
7. **Review the Captains' / Welfare Officer's email forwarders** in Cloudflare Email Routing — point them at the new committee members' personal addresses.

## 7. Emergency procedures

### "The site is broken"

Quickest fix: **roll back to the previous deploy**.

1. Log into <https://vercel.com> → the BUBC project → **Deployments** tab.
2. Find the previous deploy with a green check (usually one or two above the broken one).
3. Click `…` → **Promote to Production**.
4. Live within seconds.

Then open a GitHub issue or email the developer-successor.

Full procedure with screenshots is in [DEPLOYMENT.md § Rollback procedure](DEPLOYMENT.md#rollback-procedure).

### "An editor accidentally published something they shouldn't have"

In Sanity Studio: open the document, click the version-history clock icon (top-right of the editor), pick the previous version, click **Restore**. The site re-deploys automatically within ~60 seconds.

### "We've lost access to \_\_\_ entirely"

| Lost                   | Recovery route                                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sanity admin login     | <https://www.sanity.io/manage> — the other admin can re-invite you. If both lost: contact Sanity support with proof of project ownership.           |
| Vercel team access     | The Vercel team owner can re-invite. If the owner has left: contact Vercel support with the GitHub org ownership.                                   |
| GitHub org ownership   | Contact GitHub support with proof. Critical — without this you cannot push fixes.                                                                   |
| Domain registrar login | Use account recovery on the registrar. Without this the domain will eventually expire — track down the registrar via WHOIS lookup as a last resort. |
| Cloudflare account     | If you've lost the account that owns the BUBC zone, you can re-add the domain with new nameservers from the registrar.                              |

### "I just spotted a security issue"

Stop what you're doing. Read [SECURITY.md § Incident response (rollback)](SECURITY.md). Roll back the deploy if a regression went live. Email **press@bubc.co.uk** with subject `Security: <short summary>`.

## 8. The launch path (one-time, only if not done yet)

If the site is still on `bubc-web.vercel.app` and you're taking it live on `bubc.co.uk`, work through the **Launch checklist** in [PROGRESS.md](PROGRESS.md#launch-checklist-remaining-manual-steps), roughly in this order:

1. Vercel env vars (`SANITY_PROJECT_ID`, `SANITY_DATASET`)
2. Formspree form ID (trial form) + Buttondown username (newsletter)
3. Deploy Sanity Studio (`pnpm --filter @bubc/studio run deploy`) + invite editors
4. Sanity → Vercel deploy webhook (see [DEPLOYMENT.md](DEPLOYMENT.md))
5. Cloudflare DNS + email + DNS cutover to Vercel (launch day)
6. _(optional)_ Cloudflare Web Analytics token, Sentry DSN

## 9. Glossary (the words developers use)

- **Build** — the process that turns source code + Sanity content into the live HTML files. Takes ~90 seconds.
- **Deploy** — pushing those built files to Vercel's CDN. Happens automatically after a build.
- **PR (Pull Request)** — a proposal to change the code. Reviewed and merged on GitHub. Each PR gets a preview URL.
- **Preview deploy** — a temporary URL like `bubc-git-feature-x.vercel.app` that lets you see proposed changes before they go live.
- **Dataset** — Sanity term for the content database. We have one: `production`.
- **Singleton** — Sanity term for a document that only ever has one instance. Site Settings + Home Page are singletons.
- **GROQ** — Sanity's query language. You won't write any unless you're a developer.

## 10. Past maintainers

Roll this list forward at every committee turnover. Newest at the top.

| Year(s)   | Maintainer     | Email                   | What they did                                                                      |
| --------- | -------------- | ----------------------- | ---------------------------------------------------------------------------------- |
| 2025–2026 | Matthew (BUBC) | matthew164798@gmail.com | Built the current site (Astro + Sanity, replacing the previous WordPress install). |
| ...       | ...            | ...                     | ...                                                                                |

---

_Last updated 2026-05-25. Update this file whenever a committee changes hands or a system in §3 is replaced._

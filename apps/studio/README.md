# @bubc/studio — Sanity Studio for BUBC

Real-time editor for all bubc.co.uk content. Runs locally during development and is deployed to a Sanity-hosted URL (e.g. `bubc.sanity.studio`) for committee editors.

## Quick start

```bash
# From repo root
cp apps/studio/.env.example apps/studio/.env
pnpm --filter @bubc/studio dev
```

Open <http://localhost:3333>.

## Project details

- **Project ID:** `j7zcx618`
- **Dataset:** `production`
- **Sanity version:** v5 (with React 19)
- **Auth:** CLI must be authenticated with the GitHub account that owns this project — not Google. If you see "project ID not found, or you do not have access", run `npx sanity logout && npx sanity login` and pick **Continue with GitHub**.

## Schema organisation

```
schemaTypes/
├── documents/    # Top-level document types (squad, athlete, newsPost, …)
├── singletons/   # Site-wide singletons (settings, homePage)
├── objects/      # Reusable inline objects (seo, imageBlock, ctaBlock, …)
└── index.ts      # Schema registry — combines all of the above
```

The Sanity structure (left-hand nav) is customised in `structure.ts` so singletons appear at the top and aren't duplicable/deletable.

## Useful commands

```bash
pnpm dev              # start studio at localhost:3333
pnpm build            # build static studio bundle
pnpm run deploy       # deploy to Sanity-hosted URL
                      # ("run" is required — `pnpm deploy` triggers pnpm's own
                      # workspace-deploy command, not this package script)
pnpm typecheck        # tsc --noEmit
pnpm typegen          # generate TS types from schemas into ./sanity.types.ts
pnpm manage           # open this project in sanity.io/manage
```

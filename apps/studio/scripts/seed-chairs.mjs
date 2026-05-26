#!/usr/bin/env node
/**
 * Seed BUBC chair history.
 *
 * Recent chairs are populated as skeleton entries — name + years only, no bio.
 * The historical list before ~2015 is not on file and is left to the alumni
 * officer to backfill. Current chair (2025/26) is Matteo Tommassini and lives
 * in the committeeMember docs separately; this seed covers PAST chairs.
 *
 * All entries marked [provisional] should be confirmed against the SU records
 * before publishing.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:chairs
 *   pnpm --filter @bubc/studio seed:chairs -- --dry-run
 */
import {
  getSanityClient,
  parseSeedArgs,
  docExists,
  printHeader,
  printSummary,
} from './lib/_helpers.mjs'

const args = parseSeedArgs()
const {client, projectId, dataset} = getSanityClient({allowMissingToken: args['dry-run']})

const CHAIRS = [
  // Skeleton entries — names are placeholders. Replace before publishing.
  {slug: 'chair-2024-25', name: '[Provisional — 2024/25 chair name]', yearFrom: 2024, yearTo: 2025},
  {slug: 'chair-2023-24', name: '[Provisional — 2023/24 chair name]', yearFrom: 2023, yearTo: 2024},
  {slug: 'chair-2022-23', name: '[Provisional — 2022/23 chair name]', yearFrom: 2022, yearTo: 2023},
  {slug: 'chair-2021-22', name: '[Provisional — 2021/22 chair name]', yearFrom: 2021, yearTo: 2022},
  {slug: 'chair-2020-21', name: '[Provisional — 2020/21 chair name]', yearFrom: 2020, yearTo: 2021},
]

async function run() {
  printHeader('Past chairs', projectId, dataset, args, CHAIRS.length)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const c of CHAIRS) {
    const id = `chair-${c.slug}`

    if (args['dry-run']) {
      console.log(`  · ${c.slug.padEnd(20)} ${c.yearFrom}–${c.yearTo}  ${c.name}`)
      continue
    }

    try {
      const exists = await docExists(client, id)
      if (exists && !args.replace) {
        console.log(`  · ${c.slug.padEnd(20)} (exists — skipped)`)
        stats.skipped++
        continue
      }

      const doc = {
        _id: id,
        _type: 'chair',
        name: c.name,
        slug: {_type: 'slug', current: c.slug},
        yearFrom: c.yearFrom,
        yearTo: c.yearTo,
      }

      await client.createOrReplace(doc)
      console.log(`  ${exists ? '↻' : '+'} ${c.slug.padEnd(20)} ${exists ? 'replaced' : 'created'}`)
      if (exists) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${c.slug}: ${err.message}`)
      stats.failed++
    }
  }

  printSummary(stats)
  console.log(
    'Note: chair names are PLACEHOLDERS. The alumni officer needs to backfill from SU records before publishing /about/chairs/.\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

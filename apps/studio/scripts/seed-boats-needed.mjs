#!/usr/bin/env node
/**
 * Seed the "buy a boat" listing — boats the club is fundraising for.
 *
 * Drives /support/buy-a-boat/. Price ranges are indicative — confirm against
 * current Empacher/Filippi pricing before publishing.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:boats-needed
 *   pnpm --filter @bubc/studio seed:boats-needed -- --dry-run
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

const BOATS_NEEDED = [
  {
    slug: 'senior-mens-8',
    boatType: "Senior men's heavyweight 8+",
    priceRange: '£42,000 – £48,000',
    status: 'needed',
    priority: 10,
    notes:
      "Top of the fleet renewal cycle — the senior men's race eight is on borrowed time and a named donor / corporate gift would let us order ahead of the 2026 season.",
  },
  {
    slug: 'senior-womens-8',
    boatType: "Senior women's heavyweight 8+",
    priceRange: '£42,000 – £48,000',
    status: 'needed',
    priority: 20,
    notes:
      "The senior women's race eight is shared across BUCS and Henley Women's Regatta entries. A dedicated shell gives the women's programme its own rigging and seat setup.",
  },
  {
    slug: 'coxed-four',
    boatType: 'Heavyweight coxed four (4+)',
    priceRange: '£18,000 – £22,000',
    status: 'needed',
    priority: 30,
    notes:
      "Replaces an ageing Filippi 4+ that's been in the fleet since 2010. Used by the development squad and second eights at BUCS.",
  },
  {
    slug: 'single-scull',
    boatType: 'Heavyweight single scull (1x)',
    priceRange: '£8,000 – £12,000',
    status: 'needed',
    priority: 40,
    notes:
      'Single sculls develop the technical skills senior squad athletes need. The club currently runs one single between 60 athletes.',
  },
  {
    slug: 'lightweight-double',
    boatType: 'Lightweight double scull (2x)',
    priceRange: '£12,000 – £16,000',
    status: 'needed',
    priority: 50,
    notes:
      'A lightweight 2x would open the senior lightweight events at BUCS and BUSA. We currently have no lightweight-spec shells.',
  },
]

async function run() {
  printHeader('Boats needed (Buy a boat)', projectId, dataset, args, BOATS_NEEDED.length)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const b of BOATS_NEEDED) {
    const id = `boatForSale-${b.slug}`

    if (args['dry-run']) {
      console.log(`  · ${b.boatType.padEnd(40)} ${b.priceRange.padEnd(20)} ${b.status}`)
      continue
    }

    try {
      const exists = await docExists(client, id)
      if (exists && !args.replace) {
        console.log(`  · ${b.boatType.padEnd(40)} (exists — skipped)`)
        stats.skipped++
        continue
      }

      const doc = {
        _id: id,
        _type: 'boatForSale',
        boatType: b.boatType,
        priceRange: b.priceRange,
        status: b.status,
        priority: b.priority,
        notes: b.notes,
      }

      await client.createOrReplace(doc)
      console.log(
        `  ${exists ? '↻' : '+'} ${b.boatType.padEnd(40)} ${exists ? 'replaced' : 'created'}`,
      )
      if (exists) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${b.boatType}: ${err.message}`)
      stats.failed++
    }
  }

  printSummary(stats)
  console.log(
    'Note: price ranges are PROVISIONAL — confirm against current Empacher/Filippi/Hudson pricing before publishing.\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

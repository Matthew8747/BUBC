#!/usr/bin/env node
/**
 * Seed BUBC fleet (boats) with provisional naming stories.
 *
 * These three boats are drafts from CONTENT-BOOK.md § 8. Names are real;
 * make, year, donor and detailed history are PROVISIONAL placeholders for
 * the kit/equipment officer to refine in Studio. Edit aggressively.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:fleet
 *   pnpm --filter @bubc/studio seed:fleet -- --dry-run
 */
import {
  getSanityClient,
  parseSeedArgs,
  docExists,
  findImage,
  para,
  printHeader,
  printSummary,
} from './lib/_helpers.mjs'

const args = parseSeedArgs()
const {client, projectId, dataset} = getSanityClient({allowMissingToken: args['dry-run']})

const FLEET = [
  {
    slug: 'sampson',
    name: 'Sampson',
    make: 'Empacher',
    class: '8+',
    weight: 'heavy',
    yearBought: 2018,
    donor: 'BUBC Alumni',
    status: 'active',
    photoPattern: 'sweep/mens',
    story: [
      para(
        "Sampson is the first eight on the rack — the boat the senior men's squad takes to Henley most years.",
      ),
      para(
        'Like every shell in the fleet, Sampson takes a year of seat time before it owes you anything. Most of the people racing it now learned to handle it from people who learned to handle it from people who came before them.',
      ),
    ],
  },
  {
    slug: 'susan-green',
    name: 'Susan Green',
    make: 'Filippi',
    class: '4+',
    weight: 'heavy',
    yearBought: 2012,
    donor: 'The Green family',
    status: 'active',
    photoPattern: 'sweep/mens',
    story: [
      para(
        'Susan Green is one half of the Green pair — donated to the club by the Green family and named for Susan Green.',
      ),
      para(
        "Raced regularly by the senior women's squad and by the development squad's championship fours, the boat has been on the rack longer than most of the people currently in it.",
      ),
    ],
  },
  {
    slug: 'kenneth-green',
    name: 'Kenneth Green',
    make: 'Filippi',
    class: '4-',
    weight: 'heavy',
    yearBought: 2012,
    donor: 'The Green family',
    status: 'active',
    photoPattern: 'sweep/mens',
    story: [
      para('The companion boat to Susan Green, also given by the Green family.'),
      para(
        'Kenneth Green is a coxless four often selected for selection trials and small-boat work — the boat the senior squad uses when it wants honest information about a crew rather than flattering information.',
      ),
    ],
  },
]

async function run() {
  printHeader('Fleet (boats)', projectId, dataset, args, FLEET.length)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const b of FLEET) {
    const id = `boat-${b.slug}`

    if (args['dry-run']) {
      console.log(`  · ${b.name.padEnd(20)} ${b.make} ${b.class}  donor=${b.donor}`)
      continue
    }

    try {
      const exists = await docExists(client, id)
      if (exists && !args.replace) {
        console.log(`  · ${b.name.padEnd(20)} (exists — skipped)`)
        stats.skipped++
        continue
      }

      const photo = await findImage(client, b.photoPattern, `BUBC ${b.name}`)

      const doc = {
        _id: id,
        _type: 'boat',
        name: b.name,
        slug: {_type: 'slug', current: b.slug},
        make: b.make,
        class: b.class,
        weight: b.weight,
        yearBought: b.yearBought,
        donor: b.donor,
        status: b.status,
        story: b.story,
        ...(photo ? {photo} : {}),
      }

      await client.createOrReplace(doc)
      console.log(`  ${exists ? '↻' : '+'} ${b.name.padEnd(20)} ${exists ? 'replaced' : 'created'}`)
      if (exists) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${b.name}: ${err.message}`)
      stats.failed++
    }
  }

  printSummary(stats)
  console.log(
    'Note: boat MAKE, YEAR and DONOR are PROVISIONAL — confirm with kit officer (Clemmie) before publishing.\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

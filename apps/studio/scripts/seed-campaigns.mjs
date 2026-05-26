#!/usr/bin/env node
/**
 * Seed active fundraising campaigns.
 *
 * Currently: the New Boathouse Capital Campaign. Amounts marked [provisional]
 * — the editor will refresh `raisedAmount` and `donorCount` each time they
 * check Hubbub.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:campaigns
 *   pnpm --filter @bubc/studio seed:campaigns -- --dry-run
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

const CAMPAIGNS = [
  {
    slug: 'new-boathouse',
    title: 'New Boathouse — Capital Campaign',
    status: 'active',
    goalAmount: 500000,
    raisedAmount: 150000,
    donorCount: 87,
    shortDescription:
      "The biggest infrastructure project in the club's history — a purpose-built boathouse on the Avon. Foundations are in; we're funding the fit-out.",
    heroPattern: 'boathouse',
    story: [
      para(
        'BUBC is building a new boathouse for the next generation of Bath rowers. The current building has carried the club through six decades and is, simply, full — the fleet has outgrown it, the coaching support has outgrown it, and the long-term ambition of the programme demands a building to match.',
      ),
      para(
        'The new boathouse will sit on the same stretch of the Avon. Bigger boat bays, a coaching room, a dedicated S&C space, and an alumni and family area that finally does justice to a 60-year community.',
      ),
      para(
        'Construction is underway. The campaign target is met in stages — the foundations, the building shell, the fit-out and the new fleet rotation that comes with it. Every gift is named in the long-term donor record kept by the alumni officer.',
      ),
    ],
    donateUrl: 'https://bath.hubbub.net/p/BUBC/pledge/',
  },
]

async function run() {
  printHeader('Fundraising campaigns', projectId, dataset, args, CAMPAIGNS.length)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const c of CAMPAIGNS) {
    const id = `campaign-${c.slug}`

    if (args['dry-run']) {
      console.log(`  · ${c.title.padEnd(40)} £${c.raisedAmount}/${c.goalAmount}`)
      continue
    }

    try {
      const exists = await docExists(client, id)
      if (exists && !args.replace) {
        console.log(`  · ${c.title.padEnd(40)} (exists — skipped)`)
        stats.skipped++
        continue
      }

      const heroImage = await findImage(client, c.heroPattern, c.title)

      const doc = {
        _id: id,
        _type: 'campaign',
        title: c.title,
        slug: {_type: 'slug', current: c.slug},
        status: c.status,
        ...(heroImage ? {heroImage} : {}),
        goalAmount: c.goalAmount,
        raisedAmount: c.raisedAmount,
        donorCount: c.donorCount,
        shortDescription: c.shortDescription,
        story: c.story,
        donateUrl: c.donateUrl,
      }

      await client.createOrReplace(doc)
      console.log(
        `  ${exists ? '↻' : '+'} ${c.title.padEnd(40)} ${exists ? 'replaced' : 'created'}`,
      )
      if (exists) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${c.title}: ${err.message}`)
      stats.failed++
    }
  }

  printSummary(stats)
  console.log(
    'Note: goal/raised/donor numbers are PROVISIONAL — edit in Studio with real totals from Hubbub.\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

#!/usr/bin/env node
/**
 * Seed sponsor documents.
 *
 * Logos are pulled from `assets/images/sponsors/` via the asset library — make
 * sure seed:images has run first. Names + websites for the confirmed sponsors
 * (Embecosm, Mazars, SU Bath) are real; the rest are best-guess from logo
 * filenames and should be reviewed in Studio before publishing.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:sponsors
 *   pnpm --filter @bubc/studio seed:sponsors -- --dry-run --replace
 */
import {
  getSanityClient,
  parseSeedArgs,
  docExists,
  findImage,
  printHeader,
  printSummary,
} from './lib/_helpers.mjs'

const args = parseSeedArgs()
const {client, projectId, dataset} = getSanityClient({allowMissingToken: args['dry-run']})

const SPONSORS = [
  {
    slug: 'embecosm',
    name: 'Embecosm',
    logoPattern: 'sponsors/embecosm',
    website: 'https://www.embecosm.com',
    tier: 'gold',
    description:
      "Embecosm support BUBC across kit and race-day presence, with a focus on the club's senior squads. A Bath-based software services firm and long-standing club partner.",
    showOnHome: true,
  },
  {
    slug: 'mazars',
    name: 'Mazars',
    logoPattern: 'sponsors/mazars-logo',
    website: 'https://www.mazars.com',
    tier: 'gold',
    description:
      'Mazars back BUBC as a Gold partner — an international professional-services firm whose UK practice has a long association with University of Bath graduates.',
    showOnHome: true,
  },
  {
    slug: 'su-bath',
    name: "The Students' Union, University of Bath",
    logoPattern: 'sponsors/SU-Bath-Logo',
    website: 'https://www.thesubath.com/',
    tier: 'headline',
    description:
      "BUBC is a constituent club of The Students' Union, University of Bath. The SU underwrites the club's core operations and is the reason BUBC has been the home of student rowing in Bath since 1966.",
    showOnHome: true,
  },
  {
    slug: 'rival-kit',
    name: 'Rival Kit',
    logoPattern: 'sponsors/RF_Logo',
    website: 'https://www.rival-kit.com/',
    tier: 'silver',
    description:
      'Rival Kit supplies BUBC racing kit, training kit and the Meles alumni range. Every Rival order through the BUBC store includes a small mark-up that goes back to the club.',
    showOnHome: false,
  },
]

async function run() {
  printHeader('Sponsors', projectId, dataset, args, SPONSORS.length)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const s of SPONSORS) {
    const id = `sponsor-${s.slug}`

    if (args['dry-run']) {
      console.log(`  · ${s.name.padEnd(40)} [${s.tier}] logo=${s.logoPattern}`)
      continue
    }

    try {
      const exists = await docExists(client, id)
      if (exists && !args.replace) {
        console.log(`  · ${s.name.padEnd(40)} (exists — skipped)`)
        stats.skipped++
        continue
      }

      const logo = await findImage(client, s.logoPattern, `${s.name} logo`)
      if (!logo) {
        console.error(`  ✗ ${s.name}: logo not found (looked for "${s.logoPattern}")`)
        stats.failed++
        continue
      }

      const doc = {
        _id: id,
        _type: 'sponsor',
        name: s.name,
        slug: {_type: 'slug', current: s.slug},
        logo,
        website: s.website,
        tier: s.tier,
        description: s.description,
        showOnHome: s.showOnHome,
      }

      await client.createOrReplace(doc)
      console.log(`  ${exists ? '↻' : '+'} ${s.name.padEnd(40)} ${exists ? 'replaced' : 'created'}`)
      if (exists) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${s.name}: ${err.message}`)
      stats.failed++
    }
  }

  printSummary(stats)
  console.log(
    'Note: sponsor descriptions are PROVISIONAL — confirm with each partner before going wide.\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

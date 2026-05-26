#!/usr/bin/env node
/**
 * Seed the Home page singleton.
 *
 * Hero image is pulled from the asset library — falls back to a sensible default
 * if seed:images hasn't run yet. Pathway squads + sponsor strip are wired to
 * references that resolve as those docs are seeded.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:homepage
 *   pnpm --filter @bubc/studio seed:homepage -- --dry-run
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

async function run() {
  printHeader('Home page (singleton)', projectId, dataset, args, 1)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  if (args['dry-run']) {
    console.log(
      '  Would write singleton with _id="homePage" — hero, 4 stats, 3 squad refs, 3 closing CTAs.\n',
    )
    return
  }

  try {
    const exists = await docExists(client, 'homePage')
    if (exists && !args.replace) {
      console.log('  · homePage (exists — skipped)')
      stats.skipped++
      printSummary(stats)
      return
    }

    const heroImage = await findImage(
      client,
      'sweep/mens/4M3A0017',
      'BUBC senior men on the River Avon',
    )
    if (!heroImage) {
      console.error('  ✗ hero image not found — run `pnpm --filter @bubc/studio seed:images` first')
      stats.failed++
      printSummary(stats)
      return
    }

    // Squad references (created by seed:squads).
    const pathwaySquads = []
    for (const slug of ['senior-men', 'senior-women', 'novice']) {
      if (await docExists(client, `squad-${slug}`)) {
        pathwaySquads.push({_type: 'reference', _ref: `squad-${slug}`, _key: `pw-${slug}`})
      }
    }

    const doc = {
      _id: 'homePage',
      _type: 'homePage',
      heroHeadline: 'A rowing club, sixty years on the water.',
      heroSubhead:
        'One hundred and forty student athletes — novices to internationals — training out of a single boathouse on the Avon. We row for results, but we row for each other first.',
      heroImage,
      heroCtas: [
        {
          _type: 'ctaBlock',
          _key: 'hero-cta-1',
          label: 'Trial with us',
          variant: 'gold',
          link: {_type: 'linkBlock', label: 'Trial', url: '/squads/trial/'},
        },
        {
          _type: 'ctaBlock',
          _key: 'hero-cta-2',
          label: 'Meet the squads',
          variant: 'ghost',
          link: {_type: 'linkBlock', label: 'Squads', url: '/squads/'},
        },
      ],
      stats: [
        {_type: 'statBlock', _key: 'stat-1', value: '1966', label: 'Founded'},
        {_type: 'statBlock', _key: 'stat-2', value: '140', label: 'Athletes', suffix: '+'},
        {_type: 'statBlock', _key: 'stat-3', value: '9', label: 'BUBC Olympians'},
        {_type: 'statBlock', _key: 'stat-4', value: '60', label: 'Years on the Avon'},
      ],
      pathwayIntro:
        'BUBC runs a tiered programme — senior selection, novice intake, and a pathway in between. Wherever you start, the boathouse is the same and so are the standards.',
      ...(pathwaySquads.length > 0 ? {pathwaySquads} : {}),
      sponsorStripHeading: 'With thanks to our sponsors',
      closingCtas: [
        {
          _type: 'ctaBlock',
          _key: 'closing-1',
          label: 'Trial with us',
          variant: 'gold',
          link: {_type: 'linkBlock', label: 'Trial', url: '/squads/trial/'},
        },
        {
          _type: 'ctaBlock',
          _key: 'closing-2',
          label: 'Donate',
          variant: 'solid',
          link: {_type: 'linkBlock', label: 'Donate', url: '/support/donate/'},
        },
        {
          _type: 'ctaBlock',
          _key: 'closing-3',
          label: 'Sponsor BUBC',
          variant: 'ghost',
          link: {_type: 'linkBlock', label: 'Sponsor', url: '/support/sponsor/'},
        },
      ],
    }

    await client.createOrReplace(doc)
    console.log(`  ${exists ? '↻' : '+'} homePage ${exists ? 'replaced' : 'created'}`)
    if (exists) stats.replaced++
    else stats.created++
  } catch (err) {
    console.error(`  ✗ homePage: ${err.message}`)
    stats.failed++
  }

  printSummary(stats)
  console.log(
    'Next: open Studio → Home page → review hero image, copy. Pin featured news posts if desired.\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

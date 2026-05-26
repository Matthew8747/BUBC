#!/usr/bin/env node
/**
 * Seed the six news categories used across the editorial calendar.
 *
 * Run before seed:news — news posts reference categories.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:news-categories
 *   pnpm --filter @bubc/studio seed:news-categories -- --dry-run --replace
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

const CATEGORIES = [
  {
    slug: 'race-reports',
    title: 'Race reports',
    description: 'Results and reports from every regatta and head race the senior squads enter.',
  },
  {
    slug: 'athlete-spotlights',
    title: 'Athlete spotlights',
    description: 'Profiles of current BUBC athletes — what they do at Bath, why they came to row.',
  },
  {
    slug: 'alumni-stories',
    title: 'Alumni stories',
    description:
      'Where BUBC alumni are now — Olympians, GB internationals, Boat Race blues, notable careers.',
  },
  {
    slug: 'club-news',
    title: 'Club news',
    description: 'Boathouse, fleet, capital projects, committee announcements.',
  },
  {
    slug: 'recruitment',
    title: 'Recruitment',
    description: 'Trial dates, novice intake, what to expect.',
  },
  {
    slug: 'sponsor-announcements',
    title: 'Sponsor announcements',
    description: 'New partners, partnership renewals, sponsor-led campaigns.',
  },
]

async function run() {
  printHeader('News categories', projectId, dataset, args, CATEGORIES.length)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  if (args['dry-run']) {
    for (const c of CATEGORIES) console.log(`  · category-${c.slug}  "${c.title}"`)
    console.log('')
    return
  }

  for (const c of CATEGORIES) {
    const id = `category-${c.slug}`
    try {
      const exists = await docExists(client, id)
      if (exists && !args.replace) {
        console.log(`  · ${c.title.padEnd(28)} (exists — skipped)`)
        stats.skipped++
        continue
      }
      await client.createOrReplace({
        _id: id,
        _type: 'category',
        title: c.title,
        slug: {_type: 'slug', current: c.slug},
        description: c.description,
      })
      console.log(
        `  ${exists ? '↻' : '+'} ${c.title.padEnd(28)} ${exists ? 'replaced' : 'created'}`,
      )
      if (exists) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${c.title}: ${err.message}`)
      stats.failed++
    }
  }

  printSummary(stats)
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

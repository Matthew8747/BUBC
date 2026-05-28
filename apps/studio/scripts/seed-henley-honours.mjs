#!/usr/bin/env node
/**
 * Seed Henley Royal + Women's Regatta honours.
 *
 * Entries below are PROVISIONAL — the result/event/crew names are drawn from
 * a mix of recent BUBC history and the standard event names at HRR/HWR. Treat
 * them as starter content that the comms officer or alumni officer can
 * refine. The point is to populate the /about/henley-honours/ page so it
 * isn't blank on launch.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:henley-honours
 *   pnpm --filter @bubc/studio seed:henley-honours -- --dry-run
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

// Helper — make a seat row.
const seat = (label, name) => ({_type: 'seat', _key: `seat-${label}-${name}`, seat: label, name})

const HONOURS = [
  {
    // VERIFIED result — see en.wikipedia.org/wiki/Bath_University_Boat_Club
    year: 2024,
    regatta: 'hrr',
    event: 'Double Sculls Challenge Cup',
    crewName: 'Bath (Gare / Dafydd)',
    finish: 'Winners',
    athletes: [seat('Bow', 'Jamie Gare'), seat('Stroke', 'Cedol Dafydd')],
    notes:
      'VERIFIED: BUBC won the Double Sculls Challenge Cup at Henley Royal Regatta 2024 (Jamie Gare & Cedol Dafydd). Confirm seat order and add the coach.',
  },
  {
    year: 2025,
    regatta: 'hrr',
    event: 'Temple Challenge Cup',
    crewName: "Bath 'A'",
    finish: 'Quarter-final',
    opposition: '[provisional]',
    athletes: [
      seat('Bow', '[provisional]'),
      seat('2', '[provisional]'),
      seat('3', '[provisional]'),
      seat('4', '[provisional]'),
      seat('5', '[provisional]'),
      seat('6', '[provisional]'),
      seat('7', 'Will Stradling'),
      seat('Stroke', 'Noah Jamieson'),
    ],
    cox: '[provisional]',
    coach: 'Charlie Newbold',
    notes: 'PROVISIONAL crew list — confirm and replace before publishing publicly.',
  },
  {
    year: 2025,
    regatta: 'hwr',
    event: 'Aspirational Academic Eights',
    crewName: 'Bath',
    finish: 'Semi-final',
    opposition: '[provisional]',
    athletes: [
      seat('Bow', '[provisional]'),
      seat('2', '[provisional]'),
      seat('3', '[provisional]'),
      seat('4', '[provisional]'),
      seat('5', '[provisional]'),
      seat('6', '[provisional]'),
      seat('7', '[provisional]'),
      seat('Stroke', 'Ellie Fowlds'),
    ],
    cox: '[provisional]',
    coach: 'Charlie Newbold',
    notes: "PROVISIONAL crew list — confirm with the women's captain before publishing.",
  },
  {
    year: 2024,
    regatta: 'hrr',
    event: 'Temple Challenge Cup',
    crewName: "Bath 'A'",
    finish: 'Round of 16',
    opposition: '[provisional]',
    athletes: [seat('Stroke', '[provisional]')],
    coach: 'Charlie Newbold',
    notes: 'PROVISIONAL — confirm crew list from 2024 season records.',
  },
  {
    year: 2023,
    regatta: 'hrr',
    event: 'Prince Albert Challenge Cup',
    crewName: 'Bath',
    finish: 'Q-Round',
    opposition: '[provisional]',
    athletes: [seat('Stroke', '[provisional]')],
    coach: 'Charlie Newbold',
    notes: 'PROVISIONAL — confirm before publish.',
  },
  {
    year: 2022,
    regatta: 'hrr',
    event: 'Britannia Challenge Cup',
    crewName: 'Bath',
    finish: 'Round of 32',
    athletes: [seat('Stroke', '[provisional]')],
    notes: 'PROVISIONAL — confirm before publish.',
  },
]

async function run() {
  printHeader('Henley honours', projectId, dataset, args, HONOURS.length)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const h of HONOURS) {
    const slug = `${h.year}-${h.regatta}-${h.event}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const id = `honour-${slug}`

    if (args['dry-run']) {
      console.log(
        `  · ${h.year} ${h.regatta.toUpperCase().padEnd(4)} ${h.event.padEnd(32)} ${h.finish}`,
      )
      continue
    }

    try {
      const exists = await docExists(client, id)
      if (exists && !args.replace) {
        console.log(`  · ${h.year} ${h.event.padEnd(32)} (exists — skipped)`)
        stats.skipped++
        continue
      }

      const doc = {
        _id: id,
        _type: 'henleyHonour',
        year: h.year,
        regatta: h.regatta,
        event: h.event,
        crewName: h.crewName,
        athletes: h.athletes,
        finish: h.finish,
        ...(h.opposition ? {opposition: h.opposition} : {}),
        ...(h.cox ? {cox: h.cox} : {}),
        ...(h.coach ? {coach: h.coach} : {}),
        ...(h.notes ? {notes: h.notes} : {}),
      }

      await client.createOrReplace(doc)
      console.log(
        `  ${exists ? '↻' : '+'} ${h.year} ${h.event.padEnd(32)} ${exists ? 'replaced' : 'created'}`,
      )
      if (exists) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${h.year} ${h.event}: ${err.message}`)
      stats.failed++
    }
  }

  printSummary(stats)
  console.log(
    'IMPORTANT: every Henley honour entry has PROVISIONAL crew lists. Confirm with archives before publishing widely.\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

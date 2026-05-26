#!/usr/bin/env node
/**
 * Seed BUBC chair history.
 *
 * Roster scraped from the legacy site (bubc.co.uk/chairs-of-bubc/) on
 * 2026-05-26, plus the three most-recent chairs supplied by the current
 * committee (Matteo Tommassini 2026/27, James Robinson 2025/26, Calla
 * Spires 2024/25). Years 2022/23 and 2023/24 are unrecorded on the legacy
 * page — left out here; backfill via Studio once the SU record is found.
 *
 * One document per academic year. Chairs serving multiple consecutive years
 * (e.g. John Laurenson 2019-21) get one entry per year so the timeline on
 * /about/chairs/ is accurate and complete.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:chairs
 *   pnpm --filter @bubc/studio seed:chairs -- --dry-run
 *   pnpm --filter @bubc/studio seed:chairs -- --replace   (overwrite existing)
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

/**
 * Chair entries — most recent first. Each row is one academic year.
 * Source: bubc.co.uk/chairs-of-bubc/ (legacy site) for 2021/22 and earlier;
 * current committee for 2024/25 onwards.
 */
const CHAIRS = [
  // Current / incoming — supplied by committee 2025/26
  {year: 2026, name: 'Matteo Tommassini'},
  {year: 2025, name: 'James Robinson'},
  {year: 2024, name: 'Calla Spires'},

  // 2022/23 and 2023/24 are unrecorded — backfill via Studio when known.

  // Scraped from bubc.co.uk/chairs-of-bubc/
  {year: 2021, name: 'Henry McLeod'},
  {year: 2020, name: 'John Laurenson'},
  {year: 2019, name: 'John Laurenson'},
  {year: 2018, name: 'James Hall'},
  {year: 2017, name: 'George Auger'},
  {year: 2016, name: 'George Auger'},
  {year: 2015, name: 'Lauren McCann'},
  {year: 2014, name: 'Stuart Gordon'},
  {year: 2013, name: 'Stuart Gordon'},
  {year: 2012, name: 'Rosie Steel'},
  {year: 2011, name: 'Robert Ashburner'},
  {year: 2010, name: 'Oliver Horncastle'},
  {year: 2009, name: 'Paddy Allen'},
  {year: 2008, name: 'Will Wjinberg'},
  {year: 2007, name: 'Trevor Iggenden'},
  {year: 2006, name: 'Greg Kinsey'},
  {year: 2005, name: 'Tom Booth'},
  {year: 2004, name: 'Henry Kelly'},
  {year: 2003, name: 'Oliver Griffiths'},
  {year: 2002, name: 'Chris Brooking'},
  {year: 2001, name: 'Dylan Samuel'},
  {year: 2000, name: 'Hugh McCaffrey'},
  {year: 1999, name: 'Sarah Lockwood'},
  {year: 1998, name: 'Brendan McGuirk'},
  {year: 1997, name: 'Harry Long'},
  {year: 1996, name: 'Jane Wild'},
  {year: 1995, name: 'Paul Sheen'},
  {year: 1994, name: 'Mark Lightowler'},
  {year: 1993, name: 'Mark Lightowler'},
  {year: 1992, name: 'Steph Jones'},

  // Sparse early-90s / late-80s records
  {year: 1989, name: 'Andy Noakes'},
  {year: 1984, name: 'Roger Ellmore'},
]

function slugify(name, yearFrom) {
  const namePart = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const yearShort = yearFrom.toString().slice(-2)
  const nextYearShort = (yearFrom + 1).toString().slice(-2)
  return `${namePart}-${yearShort}-${nextYearShort}`
}

async function run() {
  printHeader('Past chairs of BUBC', projectId, dataset, args, CHAIRS.length)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const c of CHAIRS) {
    const yearFrom = c.year
    const yearTo = c.year + 1
    const slug = slugify(c.name, yearFrom)
    const id = `chair-${slug}`
    const yearLabel = `${yearFrom}/${yearTo.toString().slice(-2)}`

    if (args['dry-run']) {
      console.log(`  · ${yearLabel.padEnd(8)} ${c.name}`)
      continue
    }

    try {
      const exists = await docExists(client, id)
      if (exists && !args.replace) {
        console.log(`  · ${yearLabel.padEnd(8)} ${c.name.padEnd(24)} (exists — skipped)`)
        stats.skipped++
        continue
      }

      const doc = {
        _id: id,
        _type: 'chair',
        name: c.name,
        slug: {_type: 'slug', current: slug},
        yearFrom,
        yearTo,
      }

      await client.createOrReplace(doc)
      console.log(
        `  ${exists ? '↻' : '+'} ${yearLabel.padEnd(8)} ${c.name.padEnd(24)} ${exists ? 'replaced' : 'created'}`,
      )
      if (exists) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${yearLabel} ${c.name}: ${err.message}`)
      stats.failed++
    }
  }

  printSummary(stats)
  console.log(
    'Note: 2022/23 and 2023/24 are unrecorded — add them in Studio if the names are found in SU records.',
  )
  console.log(
    'Source: bubc.co.uk/chairs-of-bubc/ scraped 2026-05-26 plus committee-supplied names for 2024-2026.\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

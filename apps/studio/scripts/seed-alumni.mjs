#!/usr/bin/env node
/**
 * Seed alumni profiles (schema is `olympian` for legacy reasons — the
 * `category` field disambiguates Olympian / international / Boat Race /
 * notable career).
 *
 * Four spotlight drafts from CONTENT-BOOK.md § 10. Stories are PROVISIONAL
 * — confirm with each named alum via alumni@bubc.co.uk before publishing.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:alumni
 *   pnpm --filter @bubc/studio seed:alumni -- --dry-run
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

const ALUMNI = [
  {
    slug: 'becky-wilde',
    name: 'Becky Wilde',
    category: 'international',
    bubcYears: '[provisional — confirm]',
    currentRole: 'Team GB rower',
    location: 'United Kingdom',
    photoPattern: 'alumni',
    story: [
      para(
        "Becky came through the BUBC senior women's squad and went on to race for Great Britain. One of the names every current senior at Bath has heard, and one of the reasons the senior women's programme runs at the standard it does.",
      ),
      para(
        "[Provisional draft — confirm racing record, the boat class she rowed best, the year she first wore a GB vest, and what she's doing now. Edit in Studio after speaking with Becky directly via alumni@bubc.co.uk.]",
      ),
    ],
    internationalAppearances: [
      {
        year: 2024,
        team: 'GB Senior',
        event: 'Paris 2024 Olympic Games',
        boat: '[provisional]',
        medal: 'none',
      },
    ],
  },
  {
    slug: 'cedol-dafyd',
    name: 'Cedol Dafyd',
    category: 'international',
    bubcYears: '[provisional — confirm]',
    currentRole: '[provisional]',
    location: '[provisional]',
    photoPattern: 'alumni',
    story: [
      para(
        'BUBC senior squad athlete who progressed to international racing. [Provisional — long version to be confirmed in conversation with Cedol before publish.]',
      ),
    ],
    internationalAppearances: [],
  },
  {
    slug: 'ben-furley',
    name: 'Ben Furley',
    category: 'international',
    bubcYears: '[provisional — confirm]',
    currentRole: '[provisional]',
    location: '[provisional]',
    photoPattern: 'alumni',
    story: [
      para(
        'Bath senior squad alumnus, with GB age-group representation. [Provisional — details to confirm.]',
      ),
    ],
    internationalAppearances: [],
  },
  {
    slug: 'angus-pollock',
    name: 'Angus Pollock',
    category: 'notableCareer',
    bubcYears: '[provisional — confirm]',
    currentRole: '[provisional]',
    location: '[provisional]',
    careerHighlight: '[Provisional — one-line career highlight for the alumni card.]',
    photoPattern: 'alumni',
    story: [
      para(
        'BUBC alumnus whose post-Bath career puts him in the wider rowing community. [Provisional — details and category to confirm.]',
      ),
    ],
  },
]

async function run() {
  printHeader('Alumni profiles', projectId, dataset, args, ALUMNI.length)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const a of ALUMNI) {
    const id = `alumni-${a.slug}`

    if (args['dry-run']) {
      console.log(`  · ${a.name.padEnd(20)} [${a.category}]`)
      continue
    }

    try {
      const exists = await docExists(client, id)
      if (exists && !args.replace) {
        console.log(`  · ${a.name.padEnd(20)} (exists — skipped)`)
        stats.skipped++
        continue
      }

      const photo = await findImage(client, a.photoPattern, `${a.name}, BUBC alumna/us`)

      const doc = {
        _id: id,
        _type: 'olympian',
        name: a.name,
        slug: {_type: 'slug', current: a.slug},
        category: a.category,
        bubcYears: a.bubcYears,
        currentRole: a.currentRole,
        location: a.location,
        ...(photo ? {photo} : {}),
        story: a.story,
      }

      if (a.category === 'international' && a.internationalAppearances) {
        doc.internationalAppearances = a.internationalAppearances.map((ia, i) => ({
          _type: 'internationalAppearance',
          _key: `intl-${a.slug}-${i}`,
          ...ia,
        }))
      }
      if (a.category === 'notableCareer' && a.careerHighlight) {
        doc.careerHighlight = a.careerHighlight
      }

      await client.createOrReplace(doc)
      console.log(`  ${exists ? '↻' : '+'} ${a.name.padEnd(20)} ${exists ? 'replaced' : 'created'}`)
      if (exists) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${a.name}: ${err.message}`)
      stats.failed++
    }
  }

  printSummary(stats)
  console.log(
    'Important: alumni stories are PROVISIONAL DRAFTS. Confirm with each alum via alumni@bubc.co.uk before sharing the live URL.\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

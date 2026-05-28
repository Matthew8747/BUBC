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
    category: 'olympian',
    bubcYears: '[confirm years]',
    currentRole: 'GB Rowing Team',
    location: 'United Kingdom',
    photoPattern: 'alumni',
    story: [
      para(
        "Becky Wilde studied at the University of Bath and came through the Bath rowing environment before joining the GB Rowing Team. At Paris 2024, in her first full senior season, she won Olympic bronze in the women's double sculls with Mathilda Hodgkins-Byrne.",
      ),
      para(
        'A former swimmer, Becky switched to rowing after the London 2012 Olympics and progressed through the GB pathway based at Bath. She was later named the British Olympic Association’s Female Olympic Athlete of the Year for rowing.',
      ),
      para(
        '[Confirm her exact BUBC years and add a personal quote before sharing widely — alumni@bubc.co.uk.]',
      ),
    ],
    olympicYears: [
      {
        year: 2024,
        host: 'Paris',
        event: 'W2x (double sculls)',
        medal: 'bronze',
      },
    ],
  },
  {
    slug: 'cedol-dafydd',
    name: 'Cedol Dafydd',
    category: 'international',
    bubcYears: '[confirm years]',
    currentRole: '[confirm]',
    location: '[confirm]',
    photoPattern: 'alumni',
    story: [
      para(
        'Cedol Dafydd is one of BUBC’s most successful recent oarsmen. In 2024 he won the Double Sculls Challenge Cup at Henley Royal Regatta with Jamie Gare — one of the club’s landmark Henley results.',
      ),
      para(
        '[Confirm any GB representation, current status and BUBC years before sharing widely — alumni@bubc.co.uk.]',
      ),
    ],
    internationalAppearances: [],
  },
  // --- Verified Bath-connected Olympians & internationals (session 11 research) ---
  // Sources: en.wikipedia.org/wiki/Bath_University_Boat_Club, British Rowing, Team Bath.
  // NOTE: Helen Glover & Heather Stanning (London 2012 + Rio 2016 gold) came through the
  // GB Start programme HOSTED at Bath, not the BUBC student club — they are celebrated on
  // /squads/pda/. Add them here only if the committee wants them in the BUBC alumni list.
  {
    slug: 'vicky-thornley',
    name: 'Vicky Thornley',
    category: 'olympian',
    bubcYears: '[confirm]',
    currentRole: '[confirm]',
    location: 'United Kingdom',
    photoPattern: 'alumni',
    story: [
      para(
        'Vicky Thornley studied Business Management at the University of Bath. She won Olympic silver in the women’s double sculls with Katherine Grainger at Rio 2016, raced in the women’s eight at London 2012, and finished fourth in the single sculls at Tokyo 2020.',
      ),
      para('[Confirm her BUBC connection and current role before publishing — alumni@bubc.co.uk.]'),
    ],
    olympicYears: [
      {year: 2012, host: 'London', event: 'W8+', medal: 'none', finalPlace: 5},
      {year: 2016, host: 'Rio de Janeiro', event: 'W2x (double sculls)', medal: 'silver'},
      {year: 2020, host: 'Tokyo', event: 'W1x (single sculls)', medal: 'none', finalPlace: 4},
    ],
  },
  {
    slug: 'sara-parfett',
    name: 'Sara Parfett',
    category: 'olympian',
    bubcYears: '[confirm]',
    currentRole: '[confirm]',
    location: 'United Kingdom',
    photoPattern: 'alumni',
    story: [
      para(
        'Sara Parfett rowed for Great Britain at the Tokyo 2020 Olympic Games, having developed through the Bath rowing environment. [Confirm boat class and BUBC years before publishing.]',
      ),
    ],
    olympicYears: [{year: 2020, host: 'Tokyo', event: 'W4- [confirm]', medal: 'none'}],
  },
  {
    slug: 'marcus-bateman',
    name: 'Marcus Bateman',
    category: 'international',
    bubcYears: '[confirm]',
    currentRole: '[confirm]',
    location: 'United Kingdom',
    photoPattern: 'alumni',
    story: [
      para(
        'Marcus Bateman won World Championship silver in the double sculls in 2010 and was a sweep spare for the GB team at the London 2012 Olympic Games. [Confirm BUBC years before publishing.]',
      ),
    ],
    internationalAppearances: [
      {
        year: 2010,
        team: 'GB Senior',
        event: 'World Rowing Championships',
        boat: '2x',
        medal: 'silver',
      },
    ],
  },
  {
    slug: 'adam-freeman',
    name: 'Adam Freeman',
    category: 'international',
    bubcYears: '[confirm]',
    currentRole: '[confirm]',
    location: 'United Kingdom',
    photoPattern: 'alumni',
    story: [
      para(
        'Adam Freeman finished sixth in the lightweight single sculls at the World Championships and was a lightweight sculling spare for the GB team at London 2012. [Confirm BUBC years before publishing.]',
      ),
    ],
    internationalAppearances: [
      {
        year: 2012,
        team: 'GB Senior',
        event: 'World Rowing Championships',
        boat: 'LM1x',
        medal: 'none',
        finalPlace: 6,
      },
    ],
  },
  {
    slug: 'sam-courty',
    name: 'Sam Courty',
    category: 'international',
    bubcYears: '[confirm]',
    currentRole: '[confirm]',
    location: 'United Kingdom',
    photoPattern: 'alumni',
    story: [
      para(
        'Sam Courty won bronze at the 2015 World U23 Championships and went on to race for the GB senior squad, including qualifying the women’s pair for Tokyo 2020. [Confirm whether she raced at the Games — if so, change her category to Olympian.]',
      ),
    ],
    internationalAppearances: [
      {
        year: 2015,
        team: 'GB U23',
        event: 'World Rowing U23 Championships',
        boat: 'W2-',
        medal: 'bronze',
      },
    ],
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

      if (a.category === 'olympian' && a.olympicYears) {
        doc.olympicYears = a.olympicYears.map((oy, i) => ({
          _type: 'olympicAppearance',
          _key: `oly-${a.slug}-${i}`,
          ...oy,
        }))
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

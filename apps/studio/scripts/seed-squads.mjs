#!/usr/bin/env node
/**
 * Seed the three core BUBC squads — senior men, senior women, novice.
 *
 * Captain references are resolved by slug against the `committeeMember` docs
 * created by seed:committee. Coach references resolved against `coach` docs
 * from seed:coaches. Hero images resolved from the asset library (seed:images).
 *
 * Re-runs are idempotent. Use --replace to force overwrite an existing squad.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:squads
 *   pnpm --filter @bubc/studio seed:squads -- --dry-run
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

const SQUADS = [
  {
    slug: 'senior-men',
    name: 'Senior men',
    tier: 'senior',
    gender: 'men',
    shortDescription:
      'Selection squad racing sweep and sculling across the UK head and regatta circuit, with Henley as the season target.',
    captainSlug: 'noah-jamieson',
    captainBio:
      "Senior men train ten sessions a week and pick crews by margins on the water and minutes on the erg. There's no head-coach mystery to it — turn up, get fit, row better than the person next to you. We'll race anyone.",
    coachSlugs: ['charlie-newbold', 'marcus-munafo'],
    heroPattern: 'sweep/mens',
    trainingSchedule: [
      {day: 'Mon', startTime: '06:30', endTime: '08:30', type: 'Water', location: 'Boathouse'},
      {day: 'Mon', startTime: '17:30', endTime: '19:00', type: 'Weights', location: 'STV'},
      {day: 'Tue', startTime: '06:30', endTime: '08:00', type: 'Erg', location: 'STV'},
      {day: 'Wed', startTime: '06:30', endTime: '08:30', type: 'Water', location: 'Boathouse'},
      {day: 'Wed', startTime: '17:30', endTime: '19:00', type: 'Weights', location: 'STV'},
      {day: 'Thu', startTime: '06:30', endTime: '08:00', type: 'Erg', location: 'STV'},
      {day: 'Fri', startTime: '07:00', endTime: '08:30', type: 'Water', location: 'Boathouse'},
      {day: 'Sat', startTime: '08:00', endTime: '11:00', type: 'Water', location: 'Boathouse'},
      {day: 'Sun', startTime: '08:00', endTime: '11:00', type: 'Water', location: 'Boathouse'},
    ],
    expectedStandards: [
      para(
        "**Erg.** 2k under 6:40 expected by Christmas of your first selected year. 5k under 17:30. We test honestly — there's no point pretending.",
      ),
      para(
        "**Attendance.** 90% across the term. If you're injured, you're at the boathouse with the squad. Sessions missed without notice are noticed.",
      ),
      para(
        '**Attitude.** First in, last out. Rig your own boat. Help cox a novice eight when asked. Race week is squad week.',
      ),
      para(
        '**Academics.** Your degree comes first; missing a lecture for a session is not a trade we ask you to make. The programme is built to fit Bath term dates.',
      ),
    ],
    achievements: [
      {year: 2025, title: 'Henley Royal Regatta — Temple Challenge Cup', detail: 'Quarter-final.'},
      {year: 2025, title: 'BUCS Regatta — Championship 8+', detail: 'Silver.'},
      {year: 2024, title: 'Head of the River Race', detail: 'Top 25 student crew.'},
      {year: 2024, title: 'BUCS Head — Championship 8+', detail: 'Bronze.'},
    ],
    contactEmail: 'captain.m@bubc.co.uk',
  },
  {
    slug: 'senior-women',
    name: 'Senior women',
    tier: 'senior',
    gender: 'women',
    shortDescription:
      "Selection squad racing the women's head and regatta circuit, building each year toward Henley Women's Regatta and Henley Royal.",
    captainSlug: 'ellie-fowlds',
    captainBio:
      "We're building a senior women's programme with a long memory and a shorter erg score. Bath has produced GB internationals from this squad. The standard is high because the people who came before us set it that way — we look after the standard, we don't lower it.",
    coachSlugs: ['charlie-newbold', 'marcus-munafo'],
    heroPattern: 'sweep/womens',
    trainingSchedule: [
      {day: 'Mon', startTime: '06:30', endTime: '08:30', type: 'Water', location: 'Boathouse'},
      {day: 'Mon', startTime: '17:30', endTime: '19:00', type: 'Weights', location: 'STV'},
      {day: 'Tue', startTime: '06:30', endTime: '08:00', type: 'Erg', location: 'STV'},
      {day: 'Wed', startTime: '06:30', endTime: '08:30', type: 'Water', location: 'Boathouse'},
      {day: 'Wed', startTime: '17:30', endTime: '19:00', type: 'Weights', location: 'STV'},
      {day: 'Thu', startTime: '06:30', endTime: '08:00', type: 'Erg', location: 'STV'},
      {day: 'Fri', startTime: '07:00', endTime: '08:30', type: 'Water', location: 'Boathouse'},
      {day: 'Sat', startTime: '08:00', endTime: '11:00', type: 'Water', location: 'Boathouse'},
      {day: 'Sun', startTime: '08:00', endTime: '11:00', type: 'Water', location: 'Boathouse'},
    ],
    expectedStandards: [
      para('**Erg.** 2k under 7:20 expected by Christmas of selected year. 5k under 19:30.'),
      para('**Attendance.** 90%. Same rule as every senior squad.'),
      para(
        "**Attitude.** We don't run on hype. We run on doing the work, communicating with each other, and racing properly when it matters.",
      ),
      para(
        '**Academics.** Bath term-friendly. Talk to the captain early if a deadline collides with a regatta.',
      ),
    ],
    achievements: [
      {
        year: 2025,
        title: "Henley Women's Regatta — Aspirational Academic 8+",
        detail: 'Semi-final.',
      },
      {year: 2025, title: 'BUCS Regatta — Championship 4-', detail: 'Gold.'},
      {
        year: 2024,
        title: "Women's Head of the River Race",
        detail: 'Top 30 student crew, season PB.',
      },
      {year: 2024, title: 'BUCS Head — Championship 8+', detail: 'Silver.'},
    ],
    contactEmail: 'captain.w@bubc.co.uk',
  },
  {
    slug: 'novice',
    name: 'Novice',
    tier: 'novice',
    gender: 'mixed',
    shortDescription:
      'Learn to row in your first term, race in your second. The most important squad in the club — every BUBC senior started here.',
    captainSlug: 'jeanne-anderson',
    captainBio:
      "Novice rowing is the best decision a lot of people make at Bath. You walk in not knowing what a blade is, and by April you're racing eights at BUCS. We teach the technique, we run the kit, we get you on the water — you bring the willingness to be early and the willingness to be tired.",
    coachSlugs: ['simon-brown'],
    heroPattern: 'crews/IMG_8303',
    trainingSchedule: [
      {day: 'Tue', startTime: '17:00', endTime: '19:00', type: 'Water', location: 'Boathouse'},
      {day: 'Wed', startTime: '18:00', endTime: '19:30', type: 'Erg', location: 'STV'},
      {day: 'Thu', startTime: '17:00', endTime: '19:00', type: 'Water', location: 'Boathouse'},
      {day: 'Sat', startTime: '09:00', endTime: '12:00', type: 'Water', location: 'Boathouse'},
    ],
    expectedStandards: [
      para(
        "**No experience required.** If you've never seen an oar before, you're who we built the novice programme for.",
      ),
      para(
        "**Commitment.** Four sessions a week in term. Miss two without telling us and you'll lose your seat — fair to everyone else trying to learn the same things.",
      ),
      para(
        "**Kit.** We provide everything for the first month. After that, novice all-in-one kit is available through the club's Rival Kit partnership.",
      ),
      para(
        '**Cost.** SU club membership plus a small contribution to coaching. Bursaries available — talk to the welfare officer in confidence.',
      ),
    ],
    achievements: [
      {year: 2025, title: 'BUCS Regatta — Novice 8+', detail: 'Finalist.'},
      {year: 2025, title: "Avon Schools' Head — Novice W8+", detail: 'Gold.'},
      {year: 2024, title: 'Bristol University Head', detail: 'Top novice crew of the day.'},
    ],
    contactEmail: 'captain.n@bubc.co.uk',
  },
]

async function run() {
  printHeader('Squads (senior men / women / novice)', projectId, dataset, args, SQUADS.length)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const s of SQUADS) {
    const id = `squad-${s.slug}`

    if (args['dry-run']) {
      console.log(
        `  · ${s.name.padEnd(16)} captain=${s.captainSlug}, coaches=${s.coachSlugs.join(',')}, hero=${s.heroPattern}`,
      )
      continue
    }

    try {
      const exists = await docExists(client, id)
      if (exists && !args.replace) {
        console.log(`  · ${s.name.padEnd(16)} (exists — skipped)`)
        stats.skipped++
        continue
      }

      const heroImage = await findImage(client, s.heroPattern, `BUBC ${s.name} squad`)
      if (!heroImage) {
        console.error(
          `  ✗ ${s.name}: hero image not found in asset library (run seed:images first)`,
        )
        stats.failed++
        continue
      }

      // Resolve captain reference — committee docs use _id like `committee-<slug>-2025-26`.
      const captainId = `committee-${s.captainSlug}-2025-26`
      const captainExists = await docExists(client, captainId)
      const captain = captainExists ? {_type: 'reference', _ref: captainId} : undefined

      // Resolve coach references.
      const coaches = []
      for (const coachSlug of s.coachSlugs) {
        const coachId = `coach-${coachSlug}`
        if (await docExists(client, coachId)) {
          coaches.push({_type: 'reference', _ref: coachId, _key: `coach-ref-${coachSlug}`})
        }
      }

      const doc = {
        _id: id,
        _type: 'squad',
        name: s.name,
        slug: {_type: 'slug', current: s.slug},
        tier: s.tier,
        gender: s.gender,
        shortDescription: s.shortDescription,
        heroImage,
        ...(captain ? {captain} : {}),
        captainBio: s.captainBio,
        ...(coaches.length > 0 ? {coaches} : {}),
        trainingSchedule: s.trainingSchedule.map((row, i) => ({
          _type: 'session',
          _key: `sess-${s.slug}-${i}`,
          ...row,
        })),
        expectedStandards: s.expectedStandards,
        achievements: s.achievements.map((a, i) => ({
          _type: 'achievement',
          _key: `ach-${s.slug}-${i}`,
          ...a,
        })),
        contactEmail: s.contactEmail,
      }

      await client.createOrReplace(doc)
      const missingRefs = []
      if (!captain) missingRefs.push('captain')
      if (coaches.length < s.coachSlugs.length) missingRefs.push('coaches')
      const note = missingRefs.length ? ` (missing: ${missingRefs.join(', ')})` : ''
      console.log(
        `  ${exists ? '↻' : '+'} ${s.name.padEnd(16)} ${exists ? 'replaced' : 'created'}${note}`,
      )
      if (exists) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${s.name}: ${err.message}`)
      stats.failed++
    }
  }

  printSummary(stats)
  console.log(
    'Next: open Studio → Squads → review each card. Add photo gallery, tweak training times.\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

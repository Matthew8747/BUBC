#!/usr/bin/env node
/**
 * Seed six draft news posts from CONTENT-BOOK.md § 16.
 *
 * Each post references one of the categories created by seed:news-categories.
 * Hero images resolved from the asset library; falls back to a placeholder
 * search if the exact filename isn't found.
 *
 * Posts cover: BUCS Regatta race report · Jeanne athlete spotlight ·
 * Recruitment / trial week · Becky Wilde alumni story · Christmas dinner
 * 2025 · May 2026 boathouse build update.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:news
 *   pnpm --filter @bubc/studio seed:news -- --dry-run
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

const POSTS = [
  {
    slug: 'bucs-regatta-2025-silver-and-bronze',
    title: 'BUCS Regatta 2025: silver and bronze on Holme Pierrepont',
    publishDate: '2025-05-04T18:00:00.000Z',
    author: 'Maia Norton',
    categorySlug: 'race-reports',
    heroPattern: 'medals/BUCS-Regatta-rowing',
    excerpt:
      "A senior women's gold, a senior men's silver, and the first PDA medal in three years — BUCS Regatta 2025 was Bath's best showing on Holme Pierrepont since 2018.",
    body: [
      para(
        'Three days at Holme Pierrepont. Twelve crews, all eight squads on the bank, and the kind of week that justifies a winter of dark mornings on the Avon.',
      ),
      para(
        "Headline result: the senior women's championship four took gold by half a length over Newcastle, with Ellie Fowlds in the stroke seat. The senior men's championship eight took silver in a final decided by a quarter of a boat — a result that puts Bath inside the top three university crews in the country.",
      ),
      para(
        "The development squad's first medal in three years — a bronze in the PDA championship four — closed Sunday.",
      ),
      para(
        'Charlie Newbold called the week "what we\'ve been training for — not the medals, the way the crews raced." Full crew lists, splits and times in the gallery below.',
      ),
    ],
  },
  {
    slug: 'athlete-spotlight-jeanne-anderson',
    title: 'Athlete spotlight: Jeanne Anderson, novice → senior in twelve months',
    publishDate: '2025-11-12T10:00:00.000Z',
    author: 'Maia Norton',
    categorySlug: 'athlete-spotlights',
    heroPattern: 'committee/Jeanne',
    excerpt:
      "Jeanne joined BUBC at the Freshers' Fair in 2024 having never sat in a boat. A year later she's a novice captain and in the senior women's selection squad. We sat down with her about how that happened.",
    body: [
      para('Eighteen months ago, Jeanne Anderson had never been in a boat.'),
      para(
        '"I went to Freshers\' Fair to sign up for the swim club and the ski society. The boat club stall was next to the swim club and there were photos of Henley up. I asked what Henley was."',
      ),
      para(
        "By November she was racing novice eights at Bristol Docks. By March she'd tested into the senior women's selection squad. In September of her second year, she stood for novice co-captain and was elected unopposed.",
      ),
      para(
        "This is how BUBC's pipeline is supposed to work, and most years it does. The bit that's hard to write into a recruitment leaflet is the bit Jeanne names herself: \"I went to every session. I wasn't fast for a long time. I just kept turning up.\"",
      ),
    ],
  },
  {
    slug: 'recruitment-trial-week-opens-monday',
    title: 'Recruitment: trial week opens Monday',
    publishDate: '2026-09-15T08:00:00.000Z',
    author: 'BUBC Press',
    categorySlug: 'recruitment',
    heroPattern: 'sweep/mens',
    excerpt:
      'Trial week opens Monday. Two on-water sessions, an erg test, a Q&A — nothing else asked of you. Sign up by Sunday.',
    body: [
      para(
        'September trials open at the boathouse on Monday. The format is the same as last year — three sessions across the week, an erg test on Wednesday, and a Q&A with the captains and Charlie on Friday evening.',
      ),
      para(
        "You don't need to have rowed before. Most BUBC seniors started at Bath. The point of trial week is to find out whether the club is for you and whether you're for the club — both directions matter.",
      ),
      para(
        "Sign-up form: [/squads/trial/](/squads/trial/). Questions: captain.n@bubc.co.uk (novice) or captain.m / captain.w (senior, if you've rowed before).",
      ),
    ],
  },
  {
    slug: 'alumni-becky-wilde',
    title: 'Alumni: Becky Wilde on the years between Bath and a GB vest',
    publishDate: '2025-10-08T10:00:00.000Z',
    author: 'Amelia Brown',
    categorySlug: 'alumni-stories',
    heroPattern: 'alumni',
    excerpt:
      "Becky Wilde started at Bath as a novice and ended her undergraduate years on the GB U23 squad. We caught up with her on what she'd say to a Bath novice about to test for senior selection.",
    body: [
      para(
        '[Draft body — finalise with Becky directly via alumni@bubc.co.uk before publishing publicly.]',
      ),
      para(
        "Structure: 1. Bath novice year — what she remembers. 2. Senior squad — where it clicked. 3. The GB trial — how she got there. 4. One thing she'd say to a current Bath novice.",
      ),
    ],
  },
  {
    slug: 'christmas-dinner-2025',
    title: 'Christmas dinner 2025 — the club at full strength',
    publishDate: '2025-12-13T22:00:00.000Z',
    author: 'Finn Turner',
    categorySlug: 'club-news',
    heroPattern: 'medals',
    excerpt:
      "Two hundred current and former Bath rowers in one room. Charlie Newbold's review of the year, the captain's awards, and a brief but factually accurate impression of the men's eight by the alumni table.",
    body: [
      para(
        "The 2025 BUBC Christmas dinner was the largest in the last decade — two hundred members in the room, alumni back from across the country, and a head-coach review of the year that touched on the BUCS double, the Henley quarter-final, and the new boathouse campaign without once mentioning anyone's erg PB.",
      ),
      para(
        "Awards on the night: Captain's Cup, Novice of the Year, Quiet Cog of the Year (yes, it's a real award; yes, you don't want to win it).",
      ),
      para(
        "Photos in the gallery; long version of the head coach's speech on request to alumni@bubc.co.uk.",
      ),
    ],
  },
  {
    slug: 'new-boathouse-may-2026-update',
    title: 'Boathouse capital project: where the build is in May 2026',
    publishDate: '2026-05-20T12:00:00.000Z',
    author: 'BUBC Press',
    categorySlug: 'club-news',
    heroPattern: 'boathouse',
    excerpt:
      'Foundations done, frame in, and a target of first sessions in the new building by the start of the 2026/27 season. A short update from the build site.',
    body: [
      para(
        'Quick update on the new boathouse — the project most likely to outlast the committee that started it.',
      ),
      para(
        'Foundations were completed in March. The frame went up over Easter. Internal fit-out begins in June, with target first sessions in the new building at the start of the 2026/27 season — i.e. the September novice intake will be the first squad to train out of it.',
      ),
      para(
        "Capital campaign total to date: [provisional]. Donors are listed in the long-term donor record kept by the alumni officer; major gifts will be recognised in the building's hall.",
      ),
      para('Donations: [bath.hubbub.net/p/BUBC/pledge/](https://bath.hubbub.net/p/BUBC/pledge/).'),
    ],
  },
]

async function run() {
  printHeader('News posts', projectId, dataset, args, POSTS.length)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const p of POSTS) {
    const id = `news-${p.slug}`

    if (args['dry-run']) {
      console.log(`  · ${p.title.slice(0, 60).padEnd(60)} [${p.categorySlug}]`)
      continue
    }

    try {
      const exists = await docExists(client, id)
      if (exists && !args.replace) {
        console.log(`  · ${p.title.slice(0, 60).padEnd(60)} (exists — skipped)`)
        stats.skipped++
        continue
      }

      // Category reference — seed-news-categories must have run first.
      const categoryId = `category-${p.categorySlug}`
      if (!(await docExists(client, categoryId))) {
        console.error(
          `  ✗ ${p.title}: category "${p.categorySlug}" not found — run seed:news-categories first`,
        )
        stats.failed++
        continue
      }

      const heroImage = await findImage(client, p.heroPattern, p.title)
      if (!heroImage) {
        console.error(`  ✗ ${p.title}: hero image not found — run seed:images first`)
        stats.failed++
        continue
      }

      const doc = {
        _id: id,
        _type: 'newsPost',
        title: p.title,
        slug: {_type: 'slug', current: p.slug},
        publishDate: p.publishDate,
        author: p.author,
        category: {_type: 'reference', _ref: categoryId},
        heroImage,
        excerpt: p.excerpt,
        body: p.body,
      }

      await client.createOrReplace(doc)
      console.log(
        `  ${exists ? '↻' : '+'} ${p.title.slice(0, 60).padEnd(60)} ${exists ? 'replaced' : 'created'}`,
      )
      if (exists) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${p.title}: ${err.message}`)
      stats.failed++
    }
  }

  printSummary(stats)
  console.log('Note: news bodies are DRAFTS. Review and refine each before sharing widely.\n')
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

#!/usr/bin/env node
/**
 * Seed generic `page` documents — history, welfare, blazers, meles.
 *
 * The Astro routes for these pages query Sanity by slug and fall back to
 * hardcoded copy when the doc is missing. Seeding them makes the content
 * editable in Studio (the SAME copy the hardcoded version currently shows,
 * but now under the editor's control).
 *
 * After this seed runs, the editor can rewrite any of these pages directly
 * in the Studio without touching the .astro source.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:pages
 *   pnpm --filter @bubc/studio seed:pages -- --dry-run
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

const PAGES = [
  {
    slug: 'history',
    title: 'A brief history of BUBC',
    intro: 'Sixty years on the Avon — from borrowed skiffs to a contender at Henley.',
    heroPattern: 'historical',
    body: [
      para(
        "**1966–1979 — Foundations.** Bath University Boat Club was founded in 1966, the same year the University of Bath received its Royal Charter. The earliest crews rowed in borrowed skiffs from the Bath Boating Station. In 1968, a handful of undergraduates built the club's first restricted four for £400 — enough to enter local regattas, and enough to make the club its own thing rather than a polite guest at someone else's.",
      ),
      para(
        '**1980s — Surge.** Through the 1970s the club weathered student placements and leased equipment. By the late 1980s — fuelled by Olympic successes, ambitious joint training with Minerva Rowing Club, and the work of coaches like Mike Mannerson and Dr Jeremy Bennett — BUBC ran its first proper training camps. Novices and seniors began winning novice fours at Monmouth, Hereford and beyond.',
      ),
      para(
        '**1990s — The Black Pig.** The 1990s saw BUBC purchase its first "one-piece" shell, "The Black Pig", and develop structured selection trials. Wins followed at Bristol Docks and UAU regattas. The pivotal moment was a mid-1990s partnership with University Sport Director Ged Roddy and coach Pete Proudley: new boats, a dedicated boathouse below Bathampton weir, and a deepening fleet of eights, fours and pairs.',
      ),
      para(
        '**2000s — Identity.** Meles Boat Club — the alumni rowing club — was founded in 2003, named after the Latin word for badger as a nod to the iconic Badgerline buses. Through the decade BUBC settled into the identity it holds now: a serious university programme that races nationally, develops Olympians, and never quite forgets it started in borrowed boats.',
      ),
      para(
        "**2010s — Henley and BUCS.** Repeated appearances at Henley Royal and Henley Women's. BUCS medals across sweep and sculling. A growing senior women's programme alongside the established senior men's squad. The first BUBC athletes selected for GB Under-23 squads.",
      ),
      para(
        "**2020s — Rebuild.** Out of the pandemic, BUBC has rebuilt with intent — a tightened coaching team, a clearer pathway from novice to senior selection, a new boathouse capital project, and an alumni community that re-engaged at scale around the club's 60th anniversary in 2026.",
      ),
      para(
        'Long-form draft: a more detailed BUBC history is published as a PDF — [Bath University Boat Club History (DRAFT)](https://bubc.co.uk/wp-content/uploads/2025/05/Bath-University-Boat-Club-History-DRAFT.pdf).',
      ),
    ],
  },
  {
    slug: 'welfare',
    title: 'Welfare & safeguarding',
    intro:
      "BUBC is a high-performance student rowing club. It is also a place where, for most members, the boat club is the dominant part of their student experience. The welfare team's job is to make sure that experience is a positive one — and that anyone who needs to raise a concern has a clear, confidential route to do it.",
    body: [
      para(
        "Two welfare officers — Clover Merry and Jonty Stowers — share the role. Pick whichever you'd rather speak to. Confidential by default; nothing goes to a captain or coach without your consent unless safeguarding obligations require it.",
      ),
      para('Contact: [welfare@bubc.co.uk](mailto:welfare@bubc.co.uk).'),
      para(
        "Rowing has a reputation for being narrow. We don't think it has to be. BUBC tries to make the programme — financially, culturally, physically — accessible to the broadest possible student body at Bath. Concrete commitments below.",
      ),
      para(
        '**Financial.** Hardship support is available for kit, race fees and tour costs — confidential, no questions asked beyond what the SU requires for documentation. Talk to the welfare officer or the treasurer.',
      ),
      para(
        '**Gender inclusion.** Athletes train and race in the squad that matches their identity. Trans inclusion follows the current British Rowing guidance; the welfare officer is the named contact for any related question.',
      ),
      para(
        '**Para-rowing pathway.** BUBC does not currently run a dedicated para-rowing programme on the water, but the club is the route to a pathway — we will work with British Rowing, Minerva BC and the regional adaptive rowing programme to find the right session for any athlete who wants to row.',
      ),
      para(
        "**Neurodiversity & mental health.** Captains and welfare officers are trained on basic mental health first aid; the SU's MASH service is the long-term resource. We do not require disclosure; we do try to make it easy to talk about if you'd like to.",
      ),
    ],
  },
  {
    slug: 'meles',
    title: 'Meles Boat Club',
    intro:
      "BUBC's alumni rowing club — founded in 2003 by ex-Bath rowers, named after the Latin word for badger (a nod to the old Badgerline buses), and built to keep former rowers racing and connected long after their last BUCS Regatta.",
    body: [
      para(
        '**What Meles is.** A racing alumni club. Crews enter open events under Meles colours — the University of Bristol BC Head in Bath, the Boston Marathon, and the long-term ambition of Henley Royal Regatta open entries.',
      ),
      para(
        "**What's happening now.** Meles is in the process of re-affiliating with British Rowing. Once that's complete, the club will resume entering open events under its own affiliation. In the meantime, the kit range, the dinner cycle and the alumni network all operate.",
      ),
      para(
        '**Kit.** Rival Kit produces the Meles all-in-one, T-shirt and cycling range alongside the main BUBC kit. A small mark-up on every order goes back to the boat club.',
      ),
      para(
        "**Join.** Email [alumni@bubc.co.uk](mailto:alumni@bubc.co.uk) with the years you rowed at Bath and the events you'd like to race. There is no fee to join the alumni network — kit orders and entry fees are paid separately, race by race.",
      ),
    ],
  },
  {
    slug: 'blazers',
    title: 'The BUBC blazer',
    intro:
      'Made by Perry Uniform in the club colours, ordered in bulk twice a year — once around the alumni dinner, once before Henley. There is no qualification for a BUBC blazer: any current or former member of the club may order one. The blazer is the most visible thread that ties a 60-year membership together.',
    body: [
      para(
        'BUBC blazers are supplied by Perry Uniform and made in bulk orders by the club to keep costs down. Orders typically happen prior to the alumni dinner and prior to Henley Royal Regatta — subscribe to the BUBC newsletter to be notified.',
      ),
      para(
        'If you would like to purchase a blazer outside of one of these windows, email [kit@bubc.co.uk](mailto:kit@bubc.co.uk) and the kit secretary will arrange an order.',
      ),
      para(
        'There is no qualification for a BUBC blazer — any current or past member of the club may purchase one if they wish.',
      ),
    ],
  },
]

async function run() {
  printHeader(
    'Page documents (history / welfare / meles / blazers)',
    projectId,
    dataset,
    args,
    PAGES.length,
  )
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const p of PAGES) {
    const id = `page-${p.slug}`

    if (args['dry-run']) {
      console.log(`  · ${p.slug.padEnd(12)} "${p.title}"`)
      continue
    }

    try {
      const exists = await docExists(client, id)
      if (exists && !args.replace) {
        console.log(`  · ${p.slug.padEnd(12)} (exists — skipped)`)
        stats.skipped++
        continue
      }

      const heroImage = p.heroPattern ? await findImage(client, p.heroPattern, p.title) : null

      const doc = {
        _id: id,
        _type: 'page',
        title: p.title,
        slug: {_type: 'slug', current: p.slug},
        intro: p.intro,
        ...(heroImage ? {heroImage} : {}),
        body: p.body,
      }

      await client.createOrReplace(doc)
      console.log(`  ${exists ? '↻' : '+'} ${p.slug.padEnd(12)} ${exists ? 'replaced' : 'created'}`)
      if (exists) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${p.slug}: ${err.message}`)
      stats.failed++
    }
  }

  printSummary(stats)
  console.log(
    'These pages now live in Sanity — edit them in Studio under "Page" docs. The hardcoded fallback in the .astro files stays in place but is overridden by the Sanity doc.\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

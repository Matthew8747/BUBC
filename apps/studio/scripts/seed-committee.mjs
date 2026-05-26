#!/usr/bin/env node
/**
 * Seed the 2025/26 committee into Sanity.
 *
 * For each entry in COMMITTEE below:
 *   1. Upload the headshot from `<repo>/assets/images/committee/<file>` to
 *      Sanity's asset CDN (skipped if a `committeeMember` doc with the same
 *      `_id` already exists — re-running is safe).
 *   2. Create / replace a `committeeMember` document with photo, role, email,
 *      bio, order and academic year.
 *
 * Idempotency: documents use stable, deterministic IDs of the form
 *   `committee-<slug>-<year-stripped>`
 * so a re-run overwrites the same doc rather than duplicating.
 *
 * Usage
 * -----
 *   $env:SANITY_API_WRITE_TOKEN = "skXXX..."     # PowerShell
 *   pnpm --filter @bubc/studio seed:committee
 *
 *   # Preview the plan without uploading or creating anything:
 *   pnpm --filter @bubc/studio seed:committee -- --dry-run
 *
 *   # Replace an existing committee (forces overwrite, otherwise existing docs
 *   # are left untouched):
 *   pnpm --filter @bubc/studio seed:committee -- --replace
 */
import {createClient} from '@sanity/client'
import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {parseArgs} from 'node:util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..')
const COMMITTEE_DIR = path.join(REPO_ROOT, 'assets', 'images', 'committee')

// ----------------------------------------------------------------------------
// CLI
// ----------------------------------------------------------------------------
const argv = process.argv.slice(2).filter((a) => a !== '--')
const {values: args} = parseArgs({
  args: argv,
  options: {
    'dry-run': {type: 'boolean', default: false},
    replace: {type: 'boolean', default: false},
    help: {type: 'boolean', default: false},
  },
})

if (args.help) {
  console.log(`
Seed the 2025/26 BUBC committee into Sanity.

Options:
  --dry-run    Don't upload — print the plan
  --replace    Overwrite existing committee docs (default: skip if present)
  --help       Show this message
`)
  process.exit(0)
}

// ----------------------------------------------------------------------------
// Roster
// ----------------------------------------------------------------------------
const ACADEMIC_YEAR = '2025/26'
const ACADEMIC_YEAR_ID = ACADEMIC_YEAR.replace('/', '-') // "2025-26"

const COMMITTEE = [
  {
    name: 'Matteo Tommassini',
    role: 'Chair',
    order: 0,
    photo: 'matteo.jpg',
    email: 'mt2324@bath.ac.uk',
    bio: 'Chair of BUBC for the 2025/26 season. Sits across every committee meeting, signs off on the major decisions, and keeps the club moving when no one else has the time. The point of contact for anything that does not fit a more specific role.',
  },
  {
    name: 'Luka Halozan Bayley',
    role: 'Vice Chair',
    order: 1,
    photo: 'luka.jpg',
    email: 'lhb47@bath.ac.uk',
    bio: 'Vice chair, deputising for the chair across committee meetings and major decisions. Owns the long-term projects that survive past one committee — alumni engagement, the new boathouse, and the constitutional housekeeping nobody else volunteers for.',
  },
  {
    name: 'Charlie Pope',
    role: 'Secretary',
    order: 2,
    photo: 'charlie.jpg',
    email: 'cp2279@bath.ac.uk',
    bio: 'Secretary — minutes, agendas, the membership database, the SU paperwork, the things that make the club legally a club. If you have sent an email to BUBC and someone replied within twenty-four hours, that was probably Charlie.',
  },
  {
    name: 'Barnaby Mepham',
    role: 'Treasurer',
    order: 3,
    photo: 'barnaby.jpg',
    email: 'bjm80@bath.ac.uk',
    bio: 'Treasurer. Holds the budget, signs off on every spend, and files the year-end accounts with the SU. Will tell you politely and then less politely if your kit order has not been paid.',
  },
  {
    name: 'Noah Jamieson',
    role: "Senior Men's Co-Captain",
    order: 10,
    photo: 'Noah.jpg',
    email: 'nj584@bath.ac.uk',
    bio: "Senior men's co-captain. Owns crew selection, race entries and training plans for the senior men's squad alongside Will Stradling. Stroke-side; mostly seen in the boathouse before sunrise.",
  },
  {
    name: 'Will Stradling',
    role: "Senior Men's Co-Captain",
    order: 11,
    photo: 'Will.jpg',
    email: 'wrs31@bath.ac.uk',
    bio: "Senior men's co-captain alongside Noah Jamieson. Bow-side; runs the squad's logistics on race weekends — entries, transport, the trailer, the things that fall apart if no one is paying attention.",
  },
  {
    name: 'Ellie Fowlds',
    role: "Senior Women's Captain",
    order: 12,
    photo: 'Ellie.jpg',
    email: 'ef573@bath.ac.uk',
    bio: "Senior women's captain. Crew selection, training plan, and recruitment for the senior women's squad. Built a lot of the post-COVID rebuild of the senior women's programme and is the person most likely to know what every other women's university crew is doing on any given weekend.",
  },
  {
    name: 'Jeanne Anderson',
    role: 'Novice Co-Captain',
    order: 20,
    photo: 'Jeanne.jpg',
    email: 'ja2516@bath.ac.uk',
    bio: "Novice co-captain alongside Ryan McCluskey. Runs the first-term learn-to-row programme, race entries for the spring, and most of the recruitment at Freshers' Fair. If you joined the club this year, you met Jeanne first.",
  },
  {
    name: 'Ryan McCluskey',
    role: 'Novice Co-Captain',
    order: 21,
    photo: 'Ryan.png',
    email: 'rm2894@bath.ac.uk',
    bio: "Novice co-captain. Owns the technical side of the novice programme — coaching points, video review, who's ready to step into senior trials, and who needs another term in the development crew.",
  },
  {
    name: 'Freya Laws',
    role: 'Coxing Captain',
    order: 30,
    photo: 'Freya.jpg',
    email: 'fhl34@bath.ac.uk',
    bio: 'Coxing captain. Recruits, trains and develops the coxing pool across all squads. The person who actually knows the calls you are being told to listen for.',
  },
  {
    name: 'Madoc Gundry',
    role: 'Equipment & Safety Officer',
    order: 40,
    photo: 'Madoc.jpg',
    email: 'mfwg20@bath.ac.uk',
    bio: "Owns the kit list nobody else reads — the launches, the bank-bikes, the trailer, the boat repair schedule. Also the club's named safety officer, signing off the risk assessments that mean we can actually go on the water.",
  },
  {
    name: 'Clemmie Adams',
    role: 'Kit Secretary',
    order: 41,
    photo: 'clemmie.jpg',
    email: 'cera21@bath.ac.uk',
    bio: 'Kit secretary. Runs the Rival Kit cycles, blazer orders with Perry Uniform, and the all-in-one orders that no committee ever times perfectly. If you need a new race AIO before Friday, talk to Clemmie before Wednesday.',
  },
  {
    name: 'Clover Merry',
    role: 'Welfare Officer',
    order: 50,
    photo: 'clover.png',
    email: 'ccm63@bath.ac.uk',
    bio: "One of the club's two welfare officers, with Jonty Stowers. Confidential, trained, and the first point of contact if anything in the club is making your time at Bath harder than it should be — from an awkward landing pad after Christmas to anything more serious.",
  },
  {
    name: 'Jonty Stowers',
    role: 'Welfare Officer',
    order: 51,
    photo: 'jonty.png',
    email: 'js4711@bath.ac.uk',
    bio: "One of the club's two welfare officers, with Clover Merry. Splits the role to make sure there is always someone an athlete can choose to speak to. Trained, confidential, and not on the captain's WhatsApp.",
  },
  {
    name: 'Maia Norton',
    role: 'Marketing & Social Media Manager',
    order: 60,
    photo: 'Maia.png',
    email: 'msn63@bath.ac.uk',
    bio: "Owns the club's Instagram, the race-day social posts, the newsletter graphics and the recruitment campaign at the start of each year. The reason BUBC's social media looks like a sports team and not a Year 7 group project.",
  },
  {
    name: 'Amelia Brown',
    role: 'Alumni Officer',
    order: 61,
    photo: 'amelia.jpg',
    email: 'ajb352@bath.ac.uk',
    bio: 'Alumni officer. Runs the alumni dinner, the Christmas dinner, the Meles outings and the steady drumbeat of alumni contact across the year. If you rowed at Bath and want back in the loop, Amelia is your first email.',
  },
  {
    name: 'Finn Turner',
    role: 'Social Secretary',
    order: 70,
    photo: 'Finn.png',
    email: 'fmjt20@bath.ac.uk',
    bio: 'Social secretary, with Hannah Cossins. Runs the Wednesday socials, the boat-naming nights, the post-Henley pub, and the Christmas dinner cabaret. Responsible for the things that make the eight a club rather than a team.',
  },
  {
    name: 'Hannah Cossins',
    role: 'Social Secretary',
    order: 71,
    photo: 'Hannah.png',
    email: 'hc2321@bath.ac.uk',
    bio: 'Social secretary alongside Finn Turner. Splits the calendar with Finn so that no one is doing the work the week before BUCS, including the people running the work.',
  },
  {
    name: 'Matt Pearson',
    role: 'Technical & Web Officer',
    order: 80,
    photo: 'Matt.jpg',
    email: 'mp2457@bath.ac.uk',
    bio: "Maintains bubc.co.uk and the club's digital infrastructure — the website, the alumni database, the editor accounts that let the rest of the committee publish. The reason this page loads in under a second.",
  },
]

// ----------------------------------------------------------------------------
// Sanity client
// ----------------------------------------------------------------------------
const projectId = process.env.SANITY_PROJECT_ID || 'j7zcx618'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!args['dry-run'] && !token) {
  console.error('\n❌ Missing SANITY_API_WRITE_TOKEN environment variable.')
  console.error('')
  console.error('Create one (role = "Editor") at:')
  console.error(`  https://www.sanity.io/manage/personal/project/${projectId}/api`)
  console.error('')
  console.error('Then run (PowerShell):')
  console.error('  $env:SANITY_API_WRITE_TOKEN = "skXXXXX..."')
  console.error('  pnpm --filter @bubc/studio seed:committee')
  console.error('')
  console.error('Or pass --dry-run to preview the plan without uploading.\n')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
})

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function docId(slug) {
  return `committee-${slug}-${ACADEMIC_YEAR_ID}`
}

async function uploadPhoto(photoFilename, displayName) {
  const filepath = path.join(COMMITTEE_DIR, photoFilename)
  try {
    await fs.access(filepath)
  } catch {
    console.error(`  ✗ photo not found: ${filepath}`)
    return null
  }
  const buffer = await fs.readFile(filepath)
  const asset = await client.assets.upload('image', buffer, {filename: photoFilename})
  return {
    _type: 'imageBlock',
    asset: {_type: 'reference', _ref: asset._id},
    alt: `${displayName}, ${ACADEMIC_YEAR} BUBC committee`,
    decorative: false,
  }
}

// ----------------------------------------------------------------------------
// Run
// ----------------------------------------------------------------------------
async function run() {
  console.log(`Sanity project: ${projectId} / dataset: ${dataset}`)
  console.log(`Academic year: ${ACADEMIC_YEAR}`)
  console.log(
    `Mode: ${args['dry-run'] ? 'DRY RUN' : args.replace ? 'live (replace mode)' : 'live'}`,
  )
  console.log(`Members: ${COMMITTEE.length}\n`)

  if (args['dry-run']) {
    for (const m of COMMITTEE) {
      const slug = slugify(m.name)
      console.log(
        `  ${m.order.toString().padStart(3)}  ${slug.padEnd(24)}  ${m.role.padEnd(36)}  ${m.photo}`,
      )
    }
    console.log('\nDry run complete — re-run without --dry-run to create.\n')
    return
  }

  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const m of COMMITTEE) {
    const slug = slugify(m.name)
    const id = docId(slug)

    try {
      const existing = await client.fetch('*[_id == $id][0]{_id}', {id})
      if (existing && !args.replace) {
        console.log(`  · ${m.name.padEnd(24)} (exists — skipped, pass --replace to overwrite)`)
        stats.skipped++
        continue
      }

      const photo = await uploadPhoto(m.photo, m.name)
      if (!photo) {
        stats.failed++
        continue
      }

      const doc = {
        _id: id,
        _type: 'committeeMember',
        name: m.name,
        slug: {_type: 'slug', current: slug},
        role: m.role,
        order: m.order,
        academicYear: ACADEMIC_YEAR,
        photo,
        email: m.email,
        bio: m.bio,
      }

      await client.createOrReplace(doc)
      if (existing) {
        console.log(`  ↻ ${m.name.padEnd(24)} replaced`)
        stats.replaced++
      } else {
        console.log(`  + ${m.name.padEnd(24)} created`)
        stats.created++
      }
    } catch (err) {
      console.error(`  ✗ ${m.name}: ${err.message}`)
      stats.failed++
    }
  }

  console.log('')
  console.log(
    `Done. Created ${stats.created} · replaced ${stats.replaced} · skipped ${stats.skipped} · failed ${stats.failed}.`,
  )
  console.log(
    '\nNext: open the Studio (`pnpm --filter @bubc/studio dev`) → Committee members → review each entry.',
  )
  console.log(
    'Note: docs are published immediately. To unpublish one, open it in Studio → ⋯ menu → Unpublish.',
  )
  console.log(
    'Bios in the seed are provisional drafts in committee voice — refine in Studio before sharing widely.\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

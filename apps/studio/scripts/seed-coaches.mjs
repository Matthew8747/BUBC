#!/usr/bin/env node
/**
 * Seed the BUBC coaching team into Sanity.
 *
 * Photos: Charlie + Marcus have provisional images in
 * `assets/images/coaches/` — the mapping here is a best guess; review and swap
 * in Studio if it is wrong. Simon has no photo on file, the doc is created
 * without one and shows the styled placeholder until a portrait is uploaded.
 *
 * Idempotent — stable IDs of the form `coach-<slug>`.
 *
 * Usage
 * -----
 *   $env:SANITY_API_WRITE_TOKEN = "skXXX..."
 *   pnpm --filter @bubc/studio seed:coaches
 *   pnpm --filter @bubc/studio seed:coaches -- --dry-run
 *   pnpm --filter @bubc/studio seed:coaches -- --replace
 */
import {createClient} from '@sanity/client'
import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {parseArgs} from 'node:util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..')
const COACHES_DIR = path.join(REPO_ROOT, 'assets', 'images', 'coaches')

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
Seed the BUBC coaching team into Sanity.

Options:
  --dry-run    Print the plan without uploading anything
  --replace    Overwrite existing coach docs (default: skip if present)
  --help       Show this message
`)
  process.exit(0)
}

// ----------------------------------------------------------------------------
// Roster
// ----------------------------------------------------------------------------

/**
 * A PortableText block paragraph helper.
 */
function para(text) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: Math.random().toString(36).slice(2, 10), text, marks: []}],
  }
}

const COACHES = [
  {
    name: 'Charlie Newbold',
    role: 'Head Coach',
    order: 0,
    // Best-guess photo mapping — swap in Studio if wrong.
    photo: 'Screenshot-2025-10-22-at-11.46.21.jpg',
    qualifications: [
      'British Rowing Senior Coach',
      'First Aid at Work',
      'British Rowing Safeguarding (in-date)',
      'RYA Powerboat Level 2',
    ],
    email: 'coaching@bubc.co.uk',
    bio: [
      para(
        'Charlie started rowing at The Oratory School and rowed through Leander and Oxford Brookes — two of the most demanding programmes in UK rowing. He came back to coach at his old school while still racing, and then moved into senior coaching after his own competitive career.',
      ),
      para(
        'In 2009 he took a Yale Lightweight 4+ to the final of the Prince Albert Challenge Cup at Henley. He has since coached at Pembroke College Cambridge, Monkton Combe School and Bristol University, and worked alongside several national governing bodies on athlete development.',
      ),
      para(
        'At BUBC he leads the senior squads and the overall direction of coaching. He prefers long rows to short erg pieces and is, on the record, in favour of rate caps.',
      ),
    ],
  },
  {
    name: 'Marcus Munafò',
    role: 'Assistant Coach',
    order: 10,
    photo: 'WhatsApp-Image-2025-06-12-at-12.24.12_939da299.jpg',
    qualifications: ['British Rowing Coach (Senior)', 'British Rowing Safeguarding (in-date)'],
    email: 'coaching@bubc.co.uk',
    bio: [
      para(
        'Marcus learned to row as an undergraduate at Oxford, racing for his college, for Tyne RC and for Southampton University Boat Club. He moved into coaching when he returned to Oxford as a postdoctoral researcher, coaching college crews before joining the Oxford University Women’s Boat Club coaching team.',
      ),
      para(
        'He has taken athletes through GB Senior trials and was on the coaching team for the GB Under-23 lightweight women’s double scull. At BUBC he works closely with the senior squads and the PDA programme, with a particular focus on rhythm and technical work.',
      ),
    ],
  },
  {
    name: 'Simon Brown',
    role: 'Novice Coach',
    order: 20,
    photo: null, // no portrait on file yet — upload in Studio
    qualifications: [
      'British Rowing Coach',
      'British Rowing Safeguarding (in-date)',
      'RYA Powerboat Level 2',
    ],
    email: 'coaching@bubc.co.uk',
    bio: [
      para(
        'Simon works part-time with BUBC and is responsible for the novice programme — the first year of rowing for nearly every athlete in the senior squads. He coaches the foundations: handle heights, the body sequence, where to apply pressure, what a good outing feels like before you have ever sat in a fast crew.',
      ),
      para(
        'He also supports the senior squads when the calendar demands it, and is the person to find at the boathouse if you need a straight answer about whether you should be racing this weekend.',
      ),
    ],
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
  console.error(`Create one at https://www.sanity.io/manage/personal/project/${projectId}/api`)
  console.error('Role = "Editor". Then re-run with $env:SANITY_API_WRITE_TOKEN set.\n')
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
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function uploadPhoto(filename, displayName, role) {
  const filepath = path.join(COACHES_DIR, filename)
  try {
    await fs.access(filepath)
  } catch {
    console.error(`  · photo not found: ${filepath} — leaving photo blank`)
    return null
  }
  const buffer = await fs.readFile(filepath)
  const asset = await client.assets.upload('image', buffer, {filename})
  return {
    _type: 'imageBlock',
    asset: {_type: 'reference', _ref: asset._id},
    alt: `${displayName}, ${role}, BUBC`,
    decorative: false,
  }
}

// ----------------------------------------------------------------------------
// Run
// ----------------------------------------------------------------------------
async function run() {
  console.log(`Sanity project: ${projectId} / dataset: ${dataset}`)
  console.log(
    `Mode: ${args['dry-run'] ? 'DRY RUN' : args.replace ? 'live (replace mode)' : 'live'}`,
  )
  console.log(`Coaches: ${COACHES.length}\n`)

  if (args['dry-run']) {
    for (const c of COACHES) {
      console.log(
        `  ${c.order.toString().padStart(3)}  ${slugify(c.name).padEnd(20)}  ${c.role.padEnd(18)}  ${c.photo ?? '(no photo)'}`,
      )
    }
    console.log('\nDry run complete — re-run without --dry-run to create.\n')
    return
  }

  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  for (const c of COACHES) {
    const slug = slugify(c.name)
    const id = `coach-${slug}`

    try {
      const existing = await client.fetch('*[_id == $id][0]{_id}', {id})
      if (existing && !args.replace) {
        console.log(`  · ${c.name.padEnd(20)} (exists — skipped)`)
        stats.skipped++
        continue
      }

      let photo = null
      if (c.photo) {
        photo = await uploadPhoto(c.photo, c.name, c.role)
      }

      const doc = {
        _id: id,
        _type: 'coach',
        name: c.name,
        slug: {_type: 'slug', current: slug},
        role: c.role,
        order: c.order,
        ...(photo ? {photo} : {}),
        qualifications: c.qualifications,
        email: c.email,
        bio: c.bio,
      }

      await client.createOrReplace(doc)
      console.log(
        `  ${existing ? '↻' : '+'} ${c.name.padEnd(20)} ${existing ? 'replaced' : 'created'}`,
      )
      if (existing) stats.replaced++
      else stats.created++
    } catch (err) {
      console.error(`  ✗ ${c.name}: ${err.message}`)
      stats.failed++
    }
  }

  console.log('')
  console.log(
    `Done. Created ${stats.created} · replaced ${stats.replaced} · skipped ${stats.skipped} · failed ${stats.failed}.`,
  )
  console.log('\nNext: open Studio → Coaches → verify photo mappings (auto-guesses) and publish.\n')
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

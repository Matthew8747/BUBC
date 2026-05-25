#!/usr/bin/env node
/**
 * Bulk-import photos from <repo>/assets/images/<category>/<file> into Sanity.
 *
 * For each image:
 *   1. Compute SHA-256 of the file contents.
 *   2. Skip if an `imageLibrary` document with that hash already exists
 *      (idempotent — re-running won't double up).
 *   3. Upload binary to Sanity's asset CDN.
 *   4. Create an `imageLibrary` document that references the asset, with a
 *      sensible category-derived alt text the editor can refine.
 *
 * Usage
 * -----
 *   # Auth: create a write token at https://www.sanity.io/manage → project → API
 *   #       then export it (PowerShell):  $env:SANITY_API_WRITE_TOKEN = "skXXX..."
 *   #       or bash:                       SANITY_API_WRITE_TOKEN=skXXX...
 *
 *   pnpm --filter @bubc/studio seed:images                  # everything
 *   pnpm --filter @bubc/studio seed:images -- --category=avon  # one folder
 *   pnpm --filter @bubc/studio seed:images -- --dry-run     # no uploads, just plan
 *
 * Re-running is safe. The hash check makes it idempotent.
 */
import {createClient} from '@sanity/client'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import {fileURLToPath} from 'node:url'
import {parseArgs} from 'node:util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..')
const IMAGES_ROOT = path.join(REPO_ROOT, 'assets', 'images')

// ----------------------------------------------------------------------------
// CLI
// ----------------------------------------------------------------------------
// pnpm forwards a literal "--" separator into argv in some versions; drop it
// so parseArgs doesn't treat it as a positional.
const argv = process.argv.slice(2).filter((a) => a !== '--')
const {values: args} = parseArgs({
  args: argv,
  options: {
    category: {type: 'string'},
    'dry-run': {type: 'boolean', default: false},
    help: {type: 'boolean', default: false},
  },
  allowPositionals: true,
})

if (args.help) {
  console.log(`
Bulk-import photos into Sanity's imageLibrary.

Options:
  --category <name>  Only import the named category folder (e.g. avon, henley)
  --dry-run          Don't upload — list what would happen
  --help             Show this message
`)
  process.exit(0)
}

// ----------------------------------------------------------------------------
// Sanity client
// ----------------------------------------------------------------------------
const projectId = process.env.SANITY_PROJECT_ID || 'j7zcx618'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!args['dry-run'] && !token) {
  console.error('\n❌ Missing SANITY_API_WRITE_TOKEN environment variable.')
  console.error('')
  console.error('Create one at:')
  console.error(`  https://www.sanity.io/manage/personal/project/${projectId}/api`)
  console.error('')
  console.error('Choose role = "Editor". Then run (PowerShell):')
  console.error('  $env:SANITY_API_WRITE_TOKEN = "skXXXXX..."')
  console.error('  pnpm --filter @bubc/studio seed:images')
  console.error('')
  console.error('Or pass --dry-run to see what would be imported without uploading.\n')
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
// Alt-text generation
// ----------------------------------------------------------------------------
const CATEGORY_ALT = {
  alumni: 'BUBC alumni',
  avon: 'River Avon in Bath',
  awards: 'BUBC award',
  blades: 'BUBC blade',
  boathouse: 'BUBC boathouse',
  boating: 'Bath crew launching onto the Avon',
  camp: 'BUBC training camp',
  campaigns: 'BUBC fundraising campaign',
  coaches: 'BUBC coach',
  committee: 'BUBC committee member',
  crews: 'BUBC crew',
  ergs: 'BUBC erg session',
  events: 'BUBC event',
  general: 'University of Bath Boat Club',
  henley: 'BUBC at Henley Royal Regatta',
  historical: 'Historical BUBC photograph',
  horr: 'Bath crew at Head of the River Race',
  kit: 'BUBC racing kit',
  medals: 'BUBC medal',
  meeles: 'Meles Boat Club',
  minerva: 'Minerva Bath Rowing Club',
  scenic: 'Bath rowing scenery',
  sculling: 'BUBC sculling crew',
  sponsors: 'BUBC sponsor',
  sweep: 'BUBC sweep crew',
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function generateAlt(category, filename) {
  const base = CATEGORY_ALT[category] || `BUBC ${category}`
  // Pull a date hint out of common filename patterns (WhatsApp / IMG-YYYYMMDD).
  const dateMatch = filename.match(/(20\d{2})[-_]?(\d{2})[-_]?(\d{2})/)
  if (dateMatch) {
    const [, year, month] = dateMatch
    const monthIdx = Number.parseInt(month, 10) - 1
    if (monthIdx >= 0 && monthIdx < 12) return `${base} — ${MONTH_NAMES[monthIdx]} ${year}`
  }
  return base
}

function generateTitle(category, relativeFilename) {
  // relativeFilename may be `mens/IMG_8303.JPG` — surface that prefix so the
  // Studio list shows "Sculling — mens / IMG_8303".
  const dir = path.dirname(relativeFilename)
  const stem = path.parse(relativeFilename).name
  const trimmed = stem.length > 50 ? stem.slice(0, 47) + '…' : stem
  const cat = category.charAt(0).toUpperCase() + category.slice(1)
  if (dir && dir !== '.') return `${cat} — ${dir} / ${trimmed}`
  return `${cat} — ${trimmed}`
}

// ----------------------------------------------------------------------------
// File walk + import
// ----------------------------------------------------------------------------
async function sha256(filepath) {
  const data = await fs.readFile(filepath)
  return crypto.createHash('sha256').update(data).digest('hex')
}

async function findExistingByHash(hash) {
  const id = await client.fetch('*[_type == "imageLibrary" && fileHash == $hash][0]._id', {hash})
  return id || null
}

async function importOne(category, relativeFilename) {
  const filepath = path.join(IMAGES_ROOT, category, relativeFilename)
  const hash = await sha256(filepath)

  if (args['dry-run']) return {status: 'would-create'}

  const existingId = await findExistingByHash(hash)
  if (existingId) return {status: 'skipped', id: existingId}

  const buffer = await fs.readFile(filepath)
  const uploadFilename = path.basename(relativeFilename)
  const asset = await client.assets.upload('image', buffer, {filename: uploadFilename})

  const doc = await client.create({
    _type: 'imageLibrary',
    title: generateTitle(category, relativeFilename),
    category,
    image: {
      _type: 'image',
      asset: {_type: 'reference', _ref: asset._id},
      alt: generateAlt(category, uploadFilename),
      decorative: false,
    },
    sourceFilename: relativeFilename.replaceAll(path.sep, '/'),
    fileHash: hash,
  })
  return {status: 'created', id: doc._id}
}

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i

/** Recursively list image files under `dir`, returning paths relative to `dir`. */
async function listImagesUnder(dir) {
  const out = []
  async function recurse(current, prefix) {
    const entries = await fs.readdir(current, {withFileTypes: true})
    for (const entry of entries) {
      const next = path.join(current, entry.name)
      const rel = prefix ? path.join(prefix, entry.name) : entry.name
      if (entry.isDirectory()) await recurse(next, rel)
      else if (entry.isFile() && IMAGE_EXT.test(entry.name)) out.push(rel)
    }
  }
  await recurse(dir, '')
  return out
}

async function walk() {
  // Confirm the images folder exists.
  try {
    await fs.access(IMAGES_ROOT)
  } catch {
    console.error(`\n❌ Images folder not found: ${IMAGES_ROOT}`)
    console.error('Expected layout: <repo>/assets/images/<category>/<file>.jpg\n')
    process.exit(1)
  }

  const entries = await fs.readdir(IMAGES_ROOT, {withFileTypes: true})
  let folders = entries.filter((d) => d.isDirectory()).map((d) => d.name)
  if (args.category) folders = folders.filter((c) => c === args.category)
  if (folders.length === 0) {
    console.error(
      `No category folders found${args.category ? ` matching "${args.category}"` : ''}.`,
    )
    process.exit(1)
  }

  console.log(`Sanity project: ${projectId} / dataset: ${dataset}`)
  console.log(`Mode: ${args['dry-run'] ? 'DRY RUN (no uploads)' : 'live import'}`)
  console.log(`Categories: ${folders.join(', ')}\n`)

  const stats = {created: 0, skipped: 0, failed: 0, wouldCreate: 0}

  for (const category of folders) {
    const files = await listImagesUnder(path.join(IMAGES_ROOT, category))
    if (files.length === 0) {
      console.log(`${category.padEnd(14)} (empty)`)
      continue
    }
    process.stdout.write(`${category.padEnd(14)} (${String(files.length).padStart(3, ' ')}) `)
    for (const filename of files) {
      try {
        const result = await importOne(category, filename)
        if (result.status === 'created') {
          stats.created++
          process.stdout.write('+')
        } else if (result.status === 'skipped') {
          stats.skipped++
          process.stdout.write('.')
        } else if (result.status === 'would-create') {
          stats.wouldCreate++
          process.stdout.write('?')
        }
      } catch (err) {
        stats.failed++
        process.stdout.write('!')
        console.error(`\n  ✗ ${category}/${filename}: ${err.message}`)
      }
    }
    process.stdout.write('\n')
  }

  console.log('')
  if (args['dry-run']) {
    console.log(`Dry run complete — would create ${stats.wouldCreate} document(s).`)
    console.log(`Re-run without --dry-run to actually upload.`)
  } else {
    console.log(
      `Done. Created ${stats.created} · skipped ${stats.skipped} (duplicate) · failed ${stats.failed}.`,
    )
    console.log(
      `\nNext: open Studio (\`pnpm studio\`) → Image library → refine alt text where needed.`,
    )
  }
}

walk().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

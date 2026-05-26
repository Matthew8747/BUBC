/**
 * Shared helpers for the seed-*.mjs scripts.
 *
 * Each seed script imports from here so they all share the same Sanity client
 * setup, slugify, PortableText builders, and asset lookup helpers.
 */
import {createClient} from '@sanity/client'
import {parseArgs} from 'node:util'

// ----------------------------------------------------------------------------
// CLI parsing
// ----------------------------------------------------------------------------

export function parseSeedArgs() {
  const argv = process.argv.slice(2).filter((a) => a !== '--')
  const {values: args} = parseArgs({
    args: argv,
    options: {
      'dry-run': {type: 'boolean', default: false},
      replace: {type: 'boolean', default: false},
      help: {type: 'boolean', default: false},
    },
  })
  return args
}

// ----------------------------------------------------------------------------
// Sanity client
// ----------------------------------------------------------------------------

export function getSanityClient({allowMissingToken = false} = {}) {
  const projectId = process.env.SANITY_PROJECT_ID || 'j7zcx618'
  const dataset = process.env.SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_WRITE_TOKEN

  if (!token && !allowMissingToken) {
    console.error('\n❌ Missing SANITY_API_WRITE_TOKEN environment variable.')
    console.error(`   Create one at https://www.sanity.io/manage/personal/project/${projectId}/api`)
    console.error('   Role = "Editor". Then re-run with the env var set, e.g.')
    console.error('     $env:SANITY_API_WRITE_TOKEN = "skXXX..."')
    console.error('   Or pass --dry-run to preview without uploading.\n')
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-01-01',
    token,
    useCdn: false,
  })

  return {client, projectId, dataset}
}

// ----------------------------------------------------------------------------
// Slugify
// ----------------------------------------------------------------------------

export function slugify(input) {
  return (
    String(input)
      .toLowerCase()
      .normalize('NFD')
      // Strip combining diacritical marks (U+0300 to U+036F).
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
}

// ----------------------------------------------------------------------------
// PortableText builders
// ----------------------------------------------------------------------------

let keyCounter = 0
function key() {
  // Deterministic-ish — predictable inside a single run so dry-runs are stable.
  return `k${(keyCounter++).toString(36)}`
}

/**
 * Build a PortableText paragraph block from a plain string.
 * Supports inline `[link text](url)` for outbound links.
 */
export function para(text) {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
  const children = []
  const markDefs = []
  let lastIndex = 0
  let match
  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      children.push({
        _type: 'span',
        _key: key(),
        text: text.slice(lastIndex, match.index),
        marks: [],
      })
    }
    const markKey = key()
    markDefs.push({_type: 'link', _key: markKey, href: match[2]})
    children.push({
      _type: 'span',
      _key: key(),
      text: match[1],
      marks: [markKey],
    })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    children.push({
      _type: 'span',
      _key: key(),
      text: text.slice(lastIndex),
      marks: [],
    })
  }
  if (children.length === 0) {
    children.push({_type: 'span', _key: key(), text: '', marks: []})
  }
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs,
    children,
  }
}

/** Build a PortableText list (bullet) block from an array of strings. */
export function bullets(items) {
  return items.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  }))
}

// ----------------------------------------------------------------------------
// Asset / image library lookup
// ----------------------------------------------------------------------------

/**
 * Find an asset reference in Sanity by matching against an `imageLibrary`
 * document's `sourceFilename` field. The seed:images script populates these.
 *
 * @param {object} client - Sanity client
 * @param {string} pattern - Substring of the source filename (e.g. "Noah.jpg" or "committee/Noah").
 * @returns {Promise<{_type: 'imageBlock', asset: {_type: 'reference', _ref: string}, alt: string, decorative: boolean} | null>}
 */
export async function findImage(client, pattern, fallbackAlt = '') {
  if (!client) return null
  const result = await client.fetch(
    `*[_type == "imageLibrary" && sourceFilename match $pattern][0]{
      "assetId": image.asset._ref,
      "alt": image.alt
    }`,
    {pattern: `*${pattern}*`},
  )
  if (!result?.assetId) return null
  return {
    _type: 'imageBlock',
    asset: {_type: 'reference', _ref: result.assetId},
    alt: result.alt || fallbackAlt || '',
    decorative: false,
  }
}

/** Same as findImage but throws if not found — useful when an image is required. */
export async function requireImage(client, pattern, fallbackAlt = '') {
  const img = await findImage(client, pattern, fallbackAlt)
  if (!img) {
    throw new Error(
      `Image not found in Sanity asset library: "${pattern}". Run \`pnpm --filter @bubc/studio seed:images\` first.`,
    )
  }
  return img
}

// ----------------------------------------------------------------------------
// Existing-document check
// ----------------------------------------------------------------------------

export async function docExists(client, id) {
  if (!client) return false
  const existing = await client.fetch('*[_id == $id][0]{_id}', {id})
  return Boolean(existing)
}

// ----------------------------------------------------------------------------
// Header banner for a seed run
// ----------------------------------------------------------------------------

export function printHeader(name, projectId, dataset, args, count) {
  console.log(`\n${name}`)
  console.log(`  Sanity project: ${projectId} / dataset: ${dataset}`)
  console.log(`  Mode: ${args['dry-run'] ? 'DRY RUN' : args.replace ? 'live (replace)' : 'live'}`)
  if (count != null) console.log(`  Items: ${count}`)
  console.log('')
}

export function printSummary(stats) {
  console.log('')
  console.log(
    `  Done. Created ${stats.created} · replaced ${stats.replaced ?? 0} · skipped ${stats.skipped} · failed ${stats.failed}.`,
  )
  console.log('')
}

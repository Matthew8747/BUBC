#!/usr/bin/env node
/**
 * Run every seed script in dependency order.
 *
 * Order matters: docs that reference other docs must be created after their
 * targets. The order below is the canonical "fresh dataset" sequence.
 *
 *   1. images              (asset library)
 *   2. settings            (singleton, no refs)
 *   3. committee           (referenced by squads, news, alumni)
 *   4. coaches             (referenced by squads)
 *   5. news-categories     (referenced by news)
 *   6. sponsors            (referenced by home page strip)
 *   7. squads              (refs committee + coaches)
 *   8. campaigns
 *   9. fleet
 *  10. alumni
 *  11. news                (refs categories)
 *  12. homepage            (refs squads + sponsors)
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:all
 *   pnpm --filter @bubc/studio seed:all -- --dry-run
 *   pnpm --filter @bubc/studio seed:all -- --replace
 */
import {spawn} from 'node:child_process'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const STEPS = [
  {name: 'images', file: 'import-images.mjs', label: 'Photos → Sanity asset library'},
  {name: 'settings', file: 'seed-settings.mjs', label: 'Site settings (singleton)'},
  {name: 'committee', file: 'seed-committee.mjs', label: '19 committee members'},
  {name: 'coaches', file: 'seed-coaches.mjs', label: '3 coaches'},
  {name: 'news-categories', file: 'seed-news-categories.mjs', label: '6 news categories'},
  {name: 'sponsors', file: 'seed-sponsors.mjs', label: 'Sponsors (4 partners)'},
  {name: 'squads', file: 'seed-squads.mjs', label: '3 squads (senior men/women, novice)'},
  {name: 'campaigns', file: 'seed-campaigns.mjs', label: 'Active fundraising campaigns'},
  {name: 'fleet', file: 'seed-fleet.mjs', label: 'Fleet (Sampson + Greens)'},
  {name: 'alumni', file: 'seed-alumni.mjs', label: '4 alumni profiles'},
  {name: 'news', file: 'seed-news.mjs', label: '6 draft news posts'},
  {name: 'henley-honours', file: 'seed-henley-honours.mjs', label: 'Henley honours (5 entries)'},
  {name: 'pages', file: 'seed-pages.mjs', label: 'Page docs (history, welfare, meles, blazers)'},
  {name: 'chairs', file: 'seed-chairs.mjs', label: '5 past chairs (skeleton)'},
  {name: 'boats-needed', file: 'seed-boats-needed.mjs', label: '5 boats needed (Buy-a-Boat)'},
  {name: 'homepage', file: 'seed-homepage.mjs', label: 'Home page (singleton)'},
]

const forwardArgs = process.argv.slice(2).filter((a) => a !== '--')

function runStep(file, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(__dirname, file), ...args], {
      stdio: 'inherit',
      env: process.env,
    })
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${file} exited with code ${code}`))
    })
  })
}

async function run() {
  console.log('━'.repeat(60))
  console.log('  BUBC seed:all — full Sanity population')
  console.log('━'.repeat(60))
  if (forwardArgs.includes('--dry-run')) console.log('  (DRY RUN — no writes)\n')

  const failures = []
  for (const step of STEPS) {
    console.log('━'.repeat(60))
    console.log(`  ${step.name.padEnd(20)} — ${step.label}`)
    console.log('━'.repeat(60))
    try {
      await runStep(step.file, forwardArgs)
    } catch (err) {
      failures.push({step: step.name, err: err.message})
      console.error(`\n  ⚠ ${step.name} failed: ${err.message}`)
      console.error(`  Continuing with remaining steps.\n`)
    }
  }

  console.log('━'.repeat(60))
  if (failures.length === 0) {
    console.log('  ✓ All seed steps completed.')
  } else {
    console.log(`  ⚠ Completed with ${failures.length} failed step(s):`)
    failures.forEach((f) => console.log(`     - ${f.step}: ${f.err}`))
  }
  console.log('━'.repeat(60))
  console.log(
    '\nOpen Studio (pnpm --filter @bubc/studio dev) to review. Most fields are PROVISIONAL drafts — refine before publishing widely.\n',
  )
}

run().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})

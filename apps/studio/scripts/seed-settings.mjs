#!/usr/bin/env node
/**
 * Seed the site-wide Settings singleton.
 *
 * Singleton ID is `settings` (per structure.ts convention). Re-running with
 * --replace overwrites; otherwise the script skips if the doc exists.
 *
 * Usage:
 *   pnpm --filter @bubc/studio seed:settings
 *   pnpm --filter @bubc/studio seed:settings -- --dry-run
 *   pnpm --filter @bubc/studio seed:settings -- --replace
 */
import {
  getSanityClient,
  parseSeedArgs,
  docExists,
  printHeader,
  printSummary,
} from './lib/_helpers.mjs'

const args = parseSeedArgs()
const {client, projectId, dataset} = getSanityClient({allowMissingToken: args['dry-run']})

const SETTINGS = {
  _id: 'settings',
  _type: 'settings',
  siteTitle: 'University of Bath Boat Club',
  siteDescription:
    'Bath University Boat Club (BUBC) — student rowing in Bath since 1966. Senior, Development and Novice squads on the River Avon.',
  charityNumber: '',
  contactEmail: 'info@bubc.co.uk',
  address:
    "Bath University Boat Club\nc/o The Students' Union, University of Bath\nClaverton Down\nBath BA2 7AY",
  boathouseLocation: {
    lat: 51.39180472152244,
    lng: -2.407486235563779,
    what3words: '',
  },
  primaryNav: [
    {_type: 'linkBlock', _key: 'nav-squads', label: 'Squads', url: '/squads/'},
    {_type: 'linkBlock', _key: 'nav-coaching', label: 'Coaching', url: '/coaching/'},
    {_type: 'linkBlock', _key: 'nav-boathouse', label: 'Boathouse', url: '/boathouse/'},
    {_type: 'linkBlock', _key: 'nav-news', label: 'News', url: '/news/'},
    {_type: 'linkBlock', _key: 'nav-alumni', label: 'Alumni', url: '/alumni/'},
    {_type: 'linkBlock', _key: 'nav-support', label: 'Support', url: '/support/'},
  ],
  utilityNav: [{_type: 'linkBlock', _key: 'util-contact', label: 'Contact', url: '/contact/'}],
  primaryCta: {
    _type: 'ctaBlock',
    label: 'Trial with us',
    variant: 'gold',
    link: {_type: 'linkBlock', label: 'Trial', url: '/squads/trial/'},
  },
  footerColumns: [
    {
      _type: 'footerColumn',
      _key: 'foot-club',
      heading: 'Club',
      links: [
        {_type: 'linkBlock', _key: 'fc-about', label: 'About', url: '/about/'},
        {_type: 'linkBlock', _key: 'fc-hist', label: 'History', url: '/about/history/'},
        {_type: 'linkBlock', _key: 'fc-hh', label: 'Henley Honours', url: '/about/henley-honours/'},
        {_type: 'linkBlock', _key: 'fc-oly', label: 'Olympians', url: '/about/olympians/'},
        {_type: 'linkBlock', _key: 'fc-comm', label: 'Committee', url: '/committee/'},
        {_type: 'linkBlock', _key: 'fc-welf', label: 'Welfare', url: '/welfare/'},
        {_type: 'linkBlock', _key: 'fc-press', label: 'Press', url: '/press/'},
      ],
    },
    {
      _type: 'footerColumn',
      _key: 'foot-row',
      heading: 'Row',
      links: [
        {_type: 'linkBlock', _key: 'fr-sm', label: 'Senior men', url: '/squads/senior-men/'},
        {_type: 'linkBlock', _key: 'fr-sw', label: 'Senior women', url: '/squads/senior-women/'},
        {_type: 'linkBlock', _key: 'fr-nov', label: 'Novice', url: '/squads/novice/'},
        {_type: 'linkBlock', _key: 'fr-pda', label: 'Performance Development', url: '/squads/pda/'},
        {_type: 'linkBlock', _key: 'fr-trial', label: 'Trial', url: '/squads/trial/'},
        {_type: 'linkBlock', _key: 'fr-coach', label: 'Coaching', url: '/coaching/'},
      ],
    },
    {
      _type: 'footerColumn',
      _key: 'foot-support',
      heading: 'Support',
      links: [
        {_type: 'linkBlock', _key: 'fs-don', label: 'Donate', url: '/support/donate/'},
        {_type: 'linkBlock', _key: 'fs-boat', label: 'Buy a boat', url: '/support/buy-a-boat/'},
        {_type: 'linkBlock', _key: 'fs-spon', label: 'Sponsor', url: '/support/sponsor/'},
        {_type: 'linkBlock', _key: 'fs-camp', label: 'Campaigns', url: '/support/campaigns/'},
      ],
    },
    {
      _type: 'footerColumn',
      _key: 'foot-connect',
      heading: 'Connect',
      links: [
        {
          _type: 'linkBlock',
          _key: 'fcn-ig',
          label: 'Instagram',
          url: 'https://instagram.com/bubcuk',
          external: true,
        },
        {
          _type: 'linkBlock',
          _key: 'fcn-strava',
          label: 'Strava',
          url: 'https://www.strava.com/clubs/bubc',
          external: true,
        },
        {
          _type: 'linkBlock',
          _key: 'fcn-yt',
          label: 'YouTube',
          url: 'https://www.youtube.com/@bubc',
          external: true,
        },
        {
          _type: 'linkBlock',
          _key: 'fcn-mail',
          label: 'info@bubc.co.uk',
          url: 'mailto:info@bubc.co.uk',
          external: true,
        },
      ],
    },
  ],
  footerNote:
    "The University of Bath Boat Club is a constituent club of The Students' Union, University of Bath.",
  liveRaceBanner: {
    active: false,
    eventName: '',
    message: '',
    liveResultsUrl: '',
    ctaLabel: 'Follow live',
    tone: 'navy',
  },
  social: [
    {
      _type: 'socialLink',
      _key: 'soc-ig',
      platform: 'instagram',
      url: 'https://instagram.com/bubcuk',
    },
    {
      _type: 'socialLink',
      _key: 'soc-strava',
      platform: 'strava',
      url: 'https://www.strava.com/clubs/bubc',
    },
    {
      _type: 'socialLink',
      _key: 'soc-yt',
      platform: 'youtube',
      url: 'https://www.youtube.com/@bubc',
    },
  ],
}

async function run() {
  printHeader('Site settings (singleton)', projectId, dataset, args, 1)
  const stats = {created: 0, replaced: 0, skipped: 0, failed: 0}

  if (args['dry-run']) {
    console.log(
      '  Would write singleton with _id="settings" — 6 nav items, 4 footer columns, contact, boathouse coords, social links.\n',
    )
    return
  }

  try {
    const exists = await docExists(client, 'settings')
    if (exists && !args.replace) {
      console.log('  · settings (exists — skipped, pass --replace to overwrite)')
      stats.skipped++
    } else {
      await client.createOrReplace(SETTINGS)
      console.log(`  ${exists ? '↻' : '+'} settings ${exists ? 'replaced' : 'created'}`)
      if (exists) stats.replaced++
      else stats.created++
    }
  } catch (err) {
    console.error(`  ✗ settings: ${err.message}`)
    stats.failed++
  }

  printSummary(stats)
  console.log(
    'Next: open Studio → Site settings → review values (boathouse lat/lng, social URLs).\n',
  )
}

run().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})

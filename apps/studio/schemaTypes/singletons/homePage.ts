import {defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'stats', title: 'Stat strip'},
    {name: 'news', title: 'News rail'},
    {name: 'pathway', title: 'Squad pathway'},
    {name: 'sponsors', title: 'Sponsor strip'},
    {name: 'cta', title: 'Closing CTAs'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // Hero -------------------------------------------------------------------
    defineField({
      name: 'heroHeadline',
      title: 'Hero headline',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'heroSubhead',
      title: 'Hero sub-headline',
      type: 'text',
      rows: 2,
      group: 'hero',
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      description: '16:9 wide environmental shot. Should be > 2000px wide.',
      type: 'imageBlock',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroCtas',
      title: 'Hero CTAs',
      type: 'array',
      of: [{type: 'ctaBlock'}],
      group: 'hero',
      validation: (rule) => rule.max(2),
    }),

    // Stat strip -------------------------------------------------------------
    defineField({
      name: 'stats',
      title: 'Stat strip',
      description: '4–5 stat items, e.g. years founded, Olympians, blades, blazers.',
      type: 'array',
      of: [{type: 'statBlock'}],
      group: 'stats',
      validation: (rule) => rule.max(5),
    }),

    // News rail --------------------------------------------------------------
    defineField({
      name: 'featuredNews',
      title: 'Featured news',
      description: 'Pin specific posts. Leave empty to auto-show the 3 most recent posts.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'newsPost'}]}],
      group: 'news',
      validation: (rule) => rule.max(3),
    }),

    // Squad pathway ---------------------------------------------------------
    defineField({
      name: 'pathwayIntro',
      title: 'Pathway intro',
      type: 'text',
      rows: 2,
      group: 'pathway',
    }),
    defineField({
      name: 'pathwaySquads',
      title: 'Pathway squads',
      description: 'Cards shown in the "find your level" section.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'squad'}]}],
      group: 'pathway',
      validation: (rule) => rule.max(4),
    }),

    // Sponsor strip ----------------------------------------------------------
    defineField({
      name: 'sponsorStripHeading',
      title: 'Sponsor strip heading',
      type: 'string',
      initialValue: 'With thanks to our sponsors',
      group: 'sponsors',
    }),
    defineField({
      name: 'sponsorStrip',
      title: 'Sponsors shown on home',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'sponsor'}]}],
      group: 'sponsors',
    }),

    // Closing CTAs ----------------------------------------------------------
    defineField({
      name: 'closingCtas',
      title: 'Closing CTAs',
      description: 'Bottom-of-home call-to-action band.',
      type: 'array',
      of: [{type: 'ctaBlock'}],
      group: 'cta',
      validation: (rule) => rule.max(3),
    }),

    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {
    prepare: () => ({title: 'Home page'}),
  },
})

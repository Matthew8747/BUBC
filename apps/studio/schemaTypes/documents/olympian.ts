import {defineField, defineType} from 'sanity'

/**
 * `olympian` doubles as the broader alumni profile schema (FEATURES.md A4).
 *
 * The doc name is kept as `olympian` to avoid a destructive Sanity migration;
 * the `category` field disambiguates whether an entry should appear on:
 *   - /about/olympians/ (category === 'olympian')
 *   - /alumni/ (any category)
 *
 * Each category has its own optional supporting fields. Olympic medallists
 * fill in `olympicYears`; British team rowers without an Olympic cap fill
 * in `internationalAppearances`; Boat Race blues fill in `boatRaceAppearances`;
 * notable non-rowing careers fill in `careerHighlight` (with the rest of the
 * story in `story`).
 */
export const olympian = defineType({
  name: 'olympian',
  title: 'Alumni profile',
  type: 'document',
  groups: [
    {name: 'core', title: 'Core', default: true},
    {name: 'achievements', title: 'Achievements'},
    {name: 'meta', title: 'SEO & meta'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'core',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 60},
      group: 'core',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description:
        'Drives where this profile appears: Olympian → /about/olympians/ + /alumni/; everything else → /alumni/ only.',
      type: 'string',
      group: 'core',
      options: {
        list: [
          {title: 'Olympian', value: 'olympian'},
          {title: 'GB / international team', value: 'international'},
          {title: 'Boat Race (Oxford / Cambridge blue)', value: 'boatRace'},
          {title: 'Notable career', value: 'notableCareer'},
        ],
        layout: 'radio',
      },
      initialValue: 'olympian',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'photo', title: 'Photo', type: 'imageBlock', group: 'core'}),
    defineField({
      name: 'bubcYears',
      title: 'BUBC years',
      description: 'e.g. "2014–2017"',
      type: 'string',
      group: 'core',
    }),
    defineField({
      name: 'currentRole',
      title: 'Current role / status',
      type: 'string',
      group: 'core',
    }),
    defineField({
      name: 'location',
      title: 'Current location',
      description: 'City / country. Used by the (future) alumni map.',
      type: 'string',
      group: 'core',
    }),

    defineField({
      name: 'olympicYears',
      title: 'Olympic appearances',
      description: 'Fill for Olympian category. Each row = one Games.',
      type: 'array',
      group: 'achievements',
      hidden: ({document}) => document?.category !== 'olympian',
      of: [
        {
          type: 'object',
          name: 'olympicAppearance',
          fields: [
            {name: 'year', type: 'number', title: 'Year', validation: (r) => r.required()},
            {name: 'host', type: 'string', title: 'Host city'},
            {name: 'event', type: 'string', title: 'Event', description: 'e.g. "M4-", "W8+"'},
            {
              name: 'medal',
              type: 'string',
              title: 'Medal',
              options: {
                list: [
                  {title: 'Gold', value: 'gold'},
                  {title: 'Silver', value: 'silver'},
                  {title: 'Bronze', value: 'bronze'},
                  {title: 'No medal', value: 'none'},
                ],
              },
            },
            {name: 'finalPlace', type: 'number', title: 'Final place'},
          ],
          preview: {
            select: {year: 'year', event: 'event', medal: 'medal'},
            prepare: ({year, event, medal}) => ({
              title: `${year} · ${event ?? '—'}`,
              subtitle: medal && medal !== 'none' ? `${medal} medal` : undefined,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'internationalAppearances',
      title: 'GB / international appearances',
      description:
        'Senior / U23 / U21 / Junior — World Champs, Euros, World Cups. Fill for International category.',
      type: 'array',
      group: 'achievements',
      hidden: ({document}) => document?.category !== 'international',
      of: [
        {
          type: 'object',
          name: 'internationalAppearance',
          fields: [
            {name: 'year', type: 'number', title: 'Year', validation: (r) => r.required()},
            {
              name: 'team',
              type: 'string',
              title: 'Team / age group',
              description: 'e.g. "GB Senior", "GB U23", "GB Junior"',
            },
            {
              name: 'event',
              type: 'string',
              title: 'Event',
              description: 'e.g. "World Rowing Championships", "European Championships"',
            },
            {name: 'boat', type: 'string', title: 'Boat class', description: 'e.g. "M2-", "W8+"'},
            {
              name: 'medal',
              type: 'string',
              title: 'Medal',
              options: {
                list: [
                  {title: 'Gold', value: 'gold'},
                  {title: 'Silver', value: 'silver'},
                  {title: 'Bronze', value: 'bronze'},
                  {title: 'No medal', value: 'none'},
                ],
              },
            },
            {name: 'finalPlace', type: 'number', title: 'Final place'},
          ],
          preview: {
            select: {year: 'year', event: 'event', medal: 'medal'},
            prepare: ({year, event, medal}) => ({
              title: `${year} · ${event ?? '—'}`,
              subtitle: medal && medal !== 'none' ? `${medal} medal` : undefined,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'boatRaceAppearances',
      title: 'Boat Race appearances',
      description: 'Oxford / Cambridge blue boat or reserves. Fill for Boat Race category.',
      type: 'array',
      group: 'achievements',
      hidden: ({document}) => document?.category !== 'boatRace',
      of: [
        {
          type: 'object',
          name: 'boatRaceAppearance',
          fields: [
            {name: 'year', type: 'number', title: 'Year', validation: (r) => r.required()},
            {
              name: 'university',
              type: 'string',
              title: 'University',
              options: {
                list: [
                  {title: 'Oxford (Dark Blues)', value: 'oxford'},
                  {title: 'Cambridge (Light Blues)', value: 'cambridge'},
                ],
                layout: 'radio',
              },
              validation: (r) => r.required(),
            },
            {
              name: 'boat',
              type: 'string',
              title: 'Boat',
              options: {
                list: [
                  {title: 'Blue Boat', value: 'blue'},
                  {title: 'Reserves (Isis / Goldie)', value: 'reserves'},
                ],
                layout: 'radio',
              },
            },
            {
              name: 'result',
              type: 'string',
              title: 'Result',
              options: {
                list: [
                  {title: 'Won', value: 'won'},
                  {title: 'Lost', value: 'lost'},
                ],
              },
            },
          ],
          preview: {
            select: {year: 'year', uni: 'university', result: 'result'},
            prepare: ({year, uni, result}) => ({
              title: `${year} · ${uni ?? '—'}`,
              subtitle: result ? result.toUpperCase() : undefined,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'careerHighlight',
      title: 'Career highlight',
      description: 'One-line professional headline shown on the alumni card.',
      type: 'string',
      group: 'achievements',
      hidden: ({document}) => document?.category !== 'notableCareer',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (context.document?.category === 'notableCareer' && !value) {
            return 'Add a one-line career highlight for the alumni card.'
          }
          return true
        }),
    }),

    defineField({
      name: 'story',
      title: 'Story',
      type: 'portableText',
      group: 'achievements',
    }),

    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'meta'}),
  ],
  orderings: [
    {
      title: 'Newest Olympics first',
      name: 'olympicYearDesc',
      by: [{field: 'olympicYears[0].year', direction: 'desc'}],
    },
    {
      title: 'Name (A–Z)',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'name', bubc: 'bubcYears', category: 'category', media: 'photo'},
    prepare: ({title, bubc, category, media}) => {
      const label =
        category === 'olympian'
          ? 'Olympian'
          : category === 'international'
            ? 'GB / International'
            : category === 'boatRace'
              ? 'Boat Race'
              : category === 'notableCareer'
                ? 'Notable career'
                : 'Alumni'
      return {title, subtitle: [label, bubc].filter(Boolean).join(' · '), media}
    },
  },
})

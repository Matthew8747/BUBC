import {defineField, defineType} from 'sanity'

export const squad = defineType({
  name: 'squad',
  title: 'Squad',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Squad name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 60},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tier',
      title: 'Squad tier',
      description: 'Used for ordering and visual grouping.',
      type: 'string',
      options: {
        list: [
          {title: 'Senior', value: 'senior'},
          {title: 'Development', value: 'development'},
          {title: 'Novice', value: 'novice'},
          {title: 'Trial', value: 'trial'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          {title: "Men's", value: 'men'},
          {title: "Women's", value: 'women'},
          {title: 'Mixed', value: 'mixed'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      description: 'One-sentence pitch shown on pathway cards.',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External link',
      description:
        'Optional. Use for a "linked" programme that isn\'t a standard BUBC squad — e.g. the GB Performance Development Academy. When set, the squad card links straight here and NO squad detail page is generated (so the captain/training/standards fields below are ignored). Accepts a full URL (https://…) or a site path (/squads/pda/).',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageBlock',
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as {externalUrl?: string} | undefined
          if (doc?.externalUrl) return true
          return value ? true : 'Required'
        }),
    }),
    defineField({
      name: 'captains',
      title: 'Captains',
      description:
        'Add one captain, or up to three for squads with co-captains (e.g. novice and senior men). The public page pluralises labels and the email CTA automatically.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'committeeMember'}, {type: 'athlete'}]}],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'captainBio',
      title: 'Captain(s) bio',
      description:
        "A short paragraph about the squad's leadership — shown in the captain callout (max 400 chars). One shared paragraph even when there are co-captains. Required unless this squad uses an External link.",
      type: 'text',
      rows: 4,
      validation: (rule) =>
        rule.max(400).custom((value, context) => {
          const doc = context.document as {externalUrl?: string} | undefined
          if (doc?.externalUrl) return true
          return value ? true : 'Required for squads with a detail page'
        }),
    }),
    defineField({
      name: 'coaches',
      title: 'Coaches',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'coach'}]}],
    }),
    defineField({
      name: 'trainingNarrative',
      title: 'Training week — paragraph',
      description:
        'Optional. A short paragraph describing the training week. Use this instead of the structured schedule below when the rhythm is hard to pin to fixed weekly slots — e.g. pre-season erg block, weather-dependent water sessions, varied novice timetable. When this is filled in, the public page shows the paragraph in place of the schedule table.',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.max(800),
    }),
    defineField({
      name: 'trainingSchedule',
      title: 'Training schedule',
      description:
        'Weekly outline — one row per session. Skip this if you filled in the paragraph above; the page will show the paragraph instead.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'session',
          fields: [
            {
              name: 'day',
              type: 'string',
              title: 'Day',
              options: {
                list: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                layout: 'radio',
              },
            },
            {name: 'startTime', type: 'string', title: 'Start time (HH:MM)'},
            {name: 'endTime', type: 'string', title: 'End time (HH:MM)'},
            {
              name: 'type',
              type: 'string',
              title: 'Session type',
              options: {
                list: ['Water', 'Erg', 'Weights', 'Circuit', 'Tank', 'Rest'],
              },
            },
            {name: 'location', type: 'string', title: 'Location'},
          ],
          preview: {
            select: {day: 'day', start: 'startTime', type: 'type', location: 'location'},
            prepare: ({day, start, type, location}) => ({
              title: `${day ?? '?'} ${start ?? ''} · ${type ?? ''}`,
              subtitle: location,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'expectedStandards',
      title: 'Expected standards',
      description: 'PB targets, attendance, attitude — set expectations clearly.',
      type: 'portableText',
    }),
    defineField({
      name: 'achievements',
      title: 'Recent achievements',
      description:
        'Headline milestones for the squad — promotions, overall titles, season summaries. For race-by-race results, use the Recent results field below.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'achievement',
          fields: [
            {name: 'year', type: 'number', title: 'Year', validation: (r) => r.required()},
            {name: 'title', type: 'string', title: 'Achievement', validation: (r) => r.required()},
            {name: 'detail', type: 'text', rows: 2, title: 'Detail'},
          ],
          preview: {
            select: {year: 'year', title: 'title'},
            prepare: ({year, title}) => ({title, subtitle: year?.toString()}),
          },
        },
      ],
    }),
    defineField({
      name: 'recentResults',
      title: 'Recent results',
      description:
        'Race-by-race results shown on the squad page so visitors can see the scoreboard without digging through news posts. Keep this list short — 4-8 most recent. Optionally link a race report (news post) or external results page; the result row becomes a link if either is set.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'recentResult',
          fields: [
            {
              name: 'date',
              type: 'date',
              title: 'Race date',
              validation: (r) => r.required(),
            },
            {
              name: 'regatta',
              type: 'string',
              title: 'Regatta',
              description: 'e.g. "BUCS Regatta", "Henley Royal Regatta", "Bristol Avon Head".',
              validation: (r) => r.required(),
            },
            {
              name: 'event',
              type: 'string',
              title: 'Event / boat class',
              description: 'e.g. "Champ 8+", "Beginner 4+", "Temple Challenge Cup".',
            },
            {
              name: 'crewLabel',
              type: 'string',
              title: 'Crew label',
              description: 'Optional — e.g. "Bath A", "Senior 1st VIII".',
            },
            {
              name: 'finish',
              type: 'string',
              title: 'Finish',
              description: 'e.g. "Gold", "Winners", "Semi-final", "3rd, 1.4s back".',
              validation: (r) => r.required(),
            },
            {
              name: 'raceReport',
              type: 'reference',
              title: 'Race report (news post)',
              description: 'Optional — link a news post that covers this race in detail.',
              to: [{type: 'newsPost'}],
            },
            {
              name: 'externalUrl',
              type: 'url',
              title: 'External link',
              description:
                'Optional fallback — e.g. the British Rowing / regatta-organiser results page. Used only if no race report is linked above.',
            },
          ],
          preview: {
            select: {
              date: 'date',
              regatta: 'regatta',
              event: 'event',
              finish: 'finish',
            },
            prepare: ({date, regatta, event, finish}) => ({
              title: `${regatta}${event ? ` — ${event}` : ''}`,
              subtitle: [date, finish].filter(Boolean).join(' · '),
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'galleryHeading',
      title: 'Gallery heading',
      description:
        'Heading for the photo section. Defaults to "The season so far." Rename it (e.g. "Silverware & seasons") to show medal photos from previous years.',
      type: 'string',
    }),
    defineField({
      name: 'galleryIntro',
      title: 'Gallery intro',
      description: 'Optional sentence shown under the gallery heading.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'photos',
      title: 'Photo gallery',
      description: 'Add a caption to any photo (e.g. "BUCS gold, 2024") — it shows when enlarged.',
      type: 'array',
      of: [{type: 'imageBlock'}],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'contactEmail',
      title: 'Squad contact email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Tier then name',
      name: 'tierName',
      by: [
        {field: 'tier', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'tier', media: 'heroImage'},
  },
})

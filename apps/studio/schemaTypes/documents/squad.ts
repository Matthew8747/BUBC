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
      name: 'captain',
      title: 'Captain',
      type: 'reference',
      to: [{type: 'committeeMember'}, {type: 'athlete'}],
    }),
    defineField({
      name: 'captainBio',
      title: 'Captain bio',
      description:
        'Shown in a callout on the squad page (max 400 chars). Required unless this squad uses an External link.',
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
      name: 'trainingSchedule',
      title: 'Training schedule',
      description: 'Weekly outline — one row per session.',
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
      name: 'photos',
      title: 'Photo gallery',
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

import {defineField, defineType} from 'sanity'

export const henleyHonour = defineType({
  name: 'henleyHonour',
  title: 'Henley honour',
  description: "A BUBC crew that competed at Henley Royal or Henley Women's Regatta.",
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.required().min(1839).max(2100),
    }),
    defineField({
      name: 'regatta',
      title: 'Regatta',
      type: 'string',
      options: {
        list: [
          {title: 'Henley Royal Regatta', value: 'hrr'},
          {title: "Henley Women's Regatta", value: 'hwr'},
        ],
        layout: 'radio',
      },
      initialValue: 'hrr',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'string',
      description: 'e.g. "Temple Challenge Cup", "Wyfold", "Prince Albert".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'crewName',
      title: 'Crew name',
      type: 'string',
      description: 'e.g. "Bath \'A\'", "Bath / Reading composite".',
    }),
    defineField({
      name: 'athletes',
      title: 'Athletes',
      description: 'Crew list from bow to stroke.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'seat',
          fields: [
            {
              name: 'seat',
              type: 'string',
              title: 'Seat',
              description: 'e.g. "Bow", "2", "Stroke".',
            },
            {
              name: 'athlete',
              type: 'reference',
              to: [{type: 'athlete'}],
              title: 'Athlete (if recorded)',
            },
            {name: 'name', type: 'string', title: 'Name (free text fallback)'},
          ],
          preview: {
            select: {seat: 'seat', name: 'name', athlete: 'athlete.name'},
            prepare: ({seat, name, athlete}) => ({
              title: `${seat ?? '—'} · ${athlete ?? name ?? '—'}`,
            }),
          },
        },
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({name: 'cox', title: 'Cox (name)', type: 'string'}),
    defineField({name: 'coach', title: 'Coach (name)', type: 'string'}),
    defineField({
      name: 'finish',
      title: 'Furthest round reached',
      type: 'string',
      description: 'e.g. "Final", "Semi-final", "Q-Round", "Winners".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'opposition',
      title: 'Final opposition',
      type: 'string',
      description: 'Crew that beat us, or that we beat in the final.',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: 'Year (newest first)',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
    },
  ],
  preview: {
    select: {year: 'year', event: 'event', finish: 'finish'},
    prepare: ({year, event, finish}) => ({
      title: `${year} · ${event}`,
      subtitle: finish,
    }),
  },
})

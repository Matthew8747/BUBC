import {defineField, defineType} from 'sanity'

export const regattaResult = defineType({
  name: 'regattaResult',
  title: 'Regatta result',
  type: 'document',
  fields: [
    defineField({
      name: 'regatta',
      title: 'Regatta',
      type: 'string',
      description: 'e.g. "BUCS Regatta", "Henley Royal Regatta", "Henley Women\'s Regatta".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.required().min(1900).max(2100),
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'string',
      description: 'e.g. "Temple Challenge Cup", "Champ 8+", "Beginner 4+".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'crewName',
      title: 'Crew name',
      type: 'string',
      description: 'How the crew was billed, e.g. "Bath \'A\' VIII".',
    }),
    defineField({
      name: 'athletes',
      title: 'Athletes',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'athlete'}]}],
    }),
    defineField({
      name: 'cox',
      title: 'Cox',
      type: 'reference',
      to: [{type: 'athlete'}],
    }),
    defineField({
      name: 'coach',
      title: 'Coach',
      type: 'reference',
      to: [{type: 'coach'}],
    }),
    defineField({
      name: 'finish',
      title: 'Finish',
      description: 'Free text — e.g. "Winners", "2nd, 1.2s back", "QF, lost to Leander".',
      type: 'string',
    }),
    defineField({
      name: 'time',
      title: 'Time',
      description: 'e.g. "5:42.7".',
      type: 'string',
    }),
    defineField({
      name: 'video',
      title: 'Video URL',
      type: 'url',
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [{type: 'imageBlock'}],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'portableText',
    }),
  ],
  orderings: [
    {
      title: 'Most recent first',
      name: 'yearDesc',
      by: [
        {field: 'year', direction: 'desc'},
        {field: 'regatta', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {regatta: 'regatta', year: 'year', event: 'event', finish: 'finish'},
    prepare: ({regatta, year, event, finish}) => ({
      title: `${year} ${regatta}`,
      subtitle: [event, finish].filter(Boolean).join(' — '),
    }),
  },
})

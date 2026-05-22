import {defineField, defineType} from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 80},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Regatta', value: 'regatta'},
          {title: 'Head race', value: 'head'},
          {title: 'Training camp', value: 'camp'},
          {title: 'Social', value: 'social'},
          {title: 'Alumni event', value: 'alumni'},
          {title: 'Fundraiser', value: 'fundraiser'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Start date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      description: 'Leave blank for single-day events.',
    }),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'portableText',
    }),
    defineField({name: 'heroImage', title: 'Hero image', type: 'imageBlock'}),
    defineField({
      name: 'registerUrl',
      title: 'Register / RSVP URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto']}),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  orderings: [
    {title: 'Soonest first', name: 'dateAsc', by: [{field: 'date', direction: 'asc'}]},
    {title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', date: 'date', type: 'type', media: 'heroImage'},
    prepare: ({title, date, type, media}) => ({
      title,
      subtitle: [type, date].filter(Boolean).join(' · '),
      media,
    }),
  },
})

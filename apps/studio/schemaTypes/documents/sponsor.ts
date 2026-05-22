import {defineField, defineType} from 'sanity'

export const sponsor = defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 60},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'imageBlock',
      description: 'Transparent SVG preferred. Logos render against the paper background.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'tier',
      title: 'Tier',
      type: 'string',
      options: {
        list: [
          {title: 'Headline', value: 'headline'},
          {title: 'Gold', value: 'gold'},
          {title: 'Silver', value: 'silver'},
          {title: 'Supporter', value: 'supporter'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'since',
      title: 'Partnership started',
      type: 'date',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'showOnHome',
      title: 'Featured on homepage strip',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Tier',
      name: 'tier',
      by: [
        {field: 'tier', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'tier', media: 'logo'},
  },
})

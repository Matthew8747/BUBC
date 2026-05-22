import {defineField, defineType} from 'sanity'

export const chair = defineType({
  name: 'chair',
  title: 'Past chair',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 60},
    }),
    defineField({
      name: 'yearFrom',
      title: 'Year started',
      type: 'number',
      validation: (rule) => rule.required().min(1900).max(2100),
    }),
    defineField({
      name: 'yearTo',
      title: 'Year ended',
      type: 'number',
      validation: (rule) => rule.min(1900).max(2100),
    }),
    defineField({name: 'photo', title: 'Photo', type: 'imageBlock'}),
    defineField({name: 'bio', title: 'Bio', type: 'portableText'}),
  ],
  orderings: [
    {
      title: 'Most recent first',
      name: 'yearDesc',
      by: [{field: 'yearFrom', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'name', from: 'yearFrom', to: 'yearTo', media: 'photo'},
    prepare: ({title, from, to, media}) => ({
      title,
      subtitle: `${from ?? '?'} – ${to ?? 'present'}`,
      media,
    }),
  },
})

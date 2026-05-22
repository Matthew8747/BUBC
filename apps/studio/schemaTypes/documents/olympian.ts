import {defineField, defineType} from 'sanity'

export const olympian = defineType({
  name: 'olympian',
  title: 'Olympian',
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
    defineField({name: 'photo', title: 'Photo', type: 'imageBlock'}),
    defineField({
      name: 'bubcYears',
      title: 'BUBC years',
      description: 'e.g. "2014–2017"',
      type: 'string',
    }),
    defineField({
      name: 'olympicYears',
      title: 'Olympic appearances',
      type: 'array',
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
      name: 'story',
      title: 'Story',
      type: 'portableText',
    }),
    defineField({
      name: 'currentRole',
      title: 'Current role',
      type: 'string',
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'name', bubc: 'bubcYears', media: 'photo'},
    prepare: ({title, bubc, media}) => ({title, subtitle: bubc, media}),
  },
})

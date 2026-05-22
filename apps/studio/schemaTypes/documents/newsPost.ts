import {defineField, defineType} from 'sanity'

export const newsPost = defineType({
  name: 'newsPost',
  title: 'News post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Metadata'},
    {name: 'relations', title: 'Related'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 80},
      group: 'meta',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish date',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'meta',
      description: 'Free text — most posts are by "BUBC Press" or a committee member.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      group: 'meta',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageBlock',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Shown on index cards and in OG previews. Max 200 chars.',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'relatedAthletes',
      title: 'Related athletes',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'athlete'}]}],
      group: 'relations',
    }),
    defineField({
      name: 'relatedSquads',
      title: 'Related squads',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'squad'}]}],
      group: 'relations',
    }),
    defineField({
      name: 'relatedResult',
      title: 'Related regatta result',
      type: 'reference',
      to: [{type: 'regattaResult'}],
      group: 'relations',
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'dateDesc',
      by: [{field: 'publishDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'publishDate',
      category: 'category.title',
      media: 'heroImage',
    },
    prepare: ({title, date, category, media}) => {
      const formatted = date ? new Date(date).toLocaleDateString('en-GB') : '—'
      return {
        title,
        subtitle: [category, formatted].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})

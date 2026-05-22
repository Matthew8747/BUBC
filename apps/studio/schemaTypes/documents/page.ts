import {defineField, defineType} from 'sanity'

/**
 * Generic landing page for content that doesn't fit a more specific schema.
 * Used for /welfare/, /press/, /about/blazers/, etc.
 */
export const page = defineType({
  name: 'page',
  title: 'Page',
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
      name: 'intro',
      title: 'Lead paragraph',
      type: 'text',
      rows: 3,
      description: 'Used as the opening paragraph and OG description.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageBlock',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
    }),
    defineField({
      name: 'ctas',
      title: 'Call-to-action buttons',
      type: 'array',
      of: [{type: 'ctaBlock'}],
      validation: (rule) => rule.max(2),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {select: {title: 'title', media: 'heroImage'}},
})

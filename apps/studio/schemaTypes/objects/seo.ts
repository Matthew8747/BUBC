import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Overrides the page title in <title> and OG tags. ~60 chars max.',
      validation: (rule) => rule.max(70).warning('Most search engines truncate after ~60 chars.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(170).warning('Most engines truncate after ~160 chars.'),
    }),
    defineField({
      name: 'image',
      title: 'Social share image',
      type: 'imageBlock',
      description: 'Used for Open Graph / Twitter cards. 1200×630 recommended.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

import {defineField, defineType} from 'sanity'

export const campaign = defineType({
  name: 'campaign',
  title: 'Fundraising campaign',
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
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Reached', value: 'reached'},
          {title: 'Closed', value: 'closed'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageBlock',
    }),
    defineField({
      name: 'goalAmount',
      title: 'Goal amount (£)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'raisedAmount',
      title: 'Raised so far (£)',
      type: 'number',
      validation: (rule) => rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'donorCount',
      title: 'Donor count',
      type: 'number',
      validation: (rule) => rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      description: 'One sentence pitch shown on the support page card.',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'story',
      title: 'Story',
      type: 'portableText',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'imageBlock'}],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'donateUrl',
      title: 'Donate URL',
      description: 'External Hubbub / JustGiving / Stripe page.',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'hubbubUrl',
      title: 'Hubbub project URL (auto-update)',
      description:
        'Optional. A Hubbub project page, e.g. https://bath.hubbub.net/p/BUBC/. If set, the site reads the live raised total + donor count from this page at build time and shows them instead of the manual figures above (falling back to the manual figures if Hubbub is unreachable). The goal still comes from "Goal amount".',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'status', media: 'heroImage'},
  },
})

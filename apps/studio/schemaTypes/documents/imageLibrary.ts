import {defineField, defineType} from 'sanity'

/**
 * imageLibrary — a flat, browsable pool of photos editors can pull into other
 * documents (homePage, squad, news, etc.). Seeded once from the local
 * `assets/images/<category>/` folders via `scripts/import-images.ts`.
 *
 * Why a separate document type rather than uploading straight to the Sanity
 * asset library? Two reasons:
 *   1. We can attach a `category` tag (sweep, henley, ergs…) so the Studio
 *      list filters down to the right shoot when an editor is filling a
 *      gallery.
 *   2. Alt text is enforced at the schema layer here — the seed script
 *      pre-fills a sensible default, but editors can refine it.
 */
const CATEGORIES = [
  'alumni',
  'avon',
  'awards',
  'blades',
  'boathouse',
  'boating',
  'camp',
  'campaigns',
  'coaches',
  'committee',
  'crews',
  'ergs',
  'events',
  'general',
  'henley',
  'historical',
  'horr',
  'kit',
  'medals',
  'meeles',
  'minerva',
  'scenic',
  'sculling',
  'sponsors',
  'sweep',
] as const

export const imageLibrary = defineType({
  name: 'imageLibrary',
  title: 'Image library',
  type: 'document',
  fieldsets: [
    {name: 'metadata', title: 'Origin & credit', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Short label that appears in the Studio list. Generated on seed; edit freely.',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: CATEGORIES.map((c) => ({title: c, value: c})),
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description:
            'Describe what is in the image. The seed script pre-fills a generic alt from the folder name — please refine it.',
          validation: (rule) =>
            rule.custom((alt, ctx) => {
              const parent = ctx.parent as {decorative?: boolean} | undefined
              if (parent?.decorative) return true
              if (!alt || alt.trim().length === 0)
                return 'Alt text is required (or mark as decorative).'
              if (alt.length > 200) return 'Alt text should be under 200 characters.'
              return true
            }),
        }),
        defineField({
          name: 'decorative',
          title: 'Decorative image',
          description: 'Tick if this image is purely decorative and adds no information.',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
        defineField({name: 'credit', title: 'Photo credit', type: 'string'}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sourceFilename',
      title: 'Original filename',
      type: 'string',
      readOnly: true,
      fieldset: 'metadata',
    }),
    defineField({
      name: 'fileHash',
      title: 'Content hash',
      description: 'SHA-256 of the original file. Used by the seed script to avoid duplicates.',
      type: 'string',
      readOnly: true,
      fieldset: 'metadata',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'image'},
  },
  orderings: [
    {
      title: 'Category, then title',
      name: 'byCategory',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'title', direction: 'asc'},
      ],
    },
  ],
})

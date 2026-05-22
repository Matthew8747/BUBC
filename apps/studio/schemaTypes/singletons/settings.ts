import {defineField, defineType} from 'sanity'

/**
 * Site-wide settings. Editors only ever see one document of this type.
 * Singleton enforcement happens in structure.ts (no duplicate / delete actions).
 */
export const settings = defineType({
  name: 'settings',
  title: 'Site settings',
  type: 'document',
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'contact', title: 'Contact'},
    {name: 'nav', title: 'Navigation'},
    {name: 'footer', title: 'Footer'},
    {name: 'social', title: 'Social'},
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
      group: 'general',
      initialValue: 'University of Bath Boat Club',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site description',
      type: 'text',
      rows: 3,
      group: 'general',
      description: "Used as the default meta description on pages that don't set their own.",
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'imageBlock',
      group: 'general',
    }),
    defineField({
      name: 'charityNumber',
      title: 'Charity number',
      type: 'string',
      group: 'general',
    }),

    // Contact ---------------------------------------------------------------
    defineField({
      name: 'contactEmail',
      title: 'Primary contact email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'address',
      title: 'Postal address',
      type: 'text',
      rows: 4,
      group: 'contact',
    }),
    defineField({
      name: 'boathouseLocation',
      title: 'Boathouse coordinates',
      type: 'object',
      group: 'contact',
      fields: [
        {name: 'lat', type: 'number', title: 'Latitude'},
        {name: 'lng', type: 'number', title: 'Longitude'},
        {name: 'what3words', type: 'string', title: 'what3words address'},
      ],
    }),

    // Navigation -------------------------------------------------------------
    defineField({
      name: 'primaryNav',
      title: 'Primary nav',
      description: 'Up to 6 items. Ordered.',
      type: 'array',
      group: 'nav',
      of: [{type: 'linkBlock'}],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'utilityNav',
      title: 'Utility nav (top-right)',
      type: 'array',
      group: 'nav',
      of: [{type: 'linkBlock'}],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'primaryCta',
      title: 'Header CTA button',
      description: 'The accent-coloured button in the top-right. Usually "Trial with us".',
      type: 'ctaBlock',
      group: 'nav',
    }),

    // Footer -----------------------------------------------------------------
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      description: 'Up to 4 columns. Each has a heading and a list of links.',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          name: 'footerColumn',
          fields: [
            {name: 'heading', type: 'string', title: 'Heading', validation: (r) => r.required()},
            {name: 'links', type: 'array', title: 'Links', of: [{type: 'linkBlock'}]},
          ],
          preview: {select: {title: 'heading'}},
        },
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer fine print',
      description: 'Copyright line, charity disclaimer, etc.',
      type: 'text',
      rows: 3,
      group: 'footer',
    }),

    // Social -----------------------------------------------------------------
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'array',
      group: 'social',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            {
              name: 'platform',
              type: 'string',
              title: 'Platform',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Strava', value: 'strava'},
                  {title: 'X / Twitter', value: 'x'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'TikTok', value: 'tiktok'},
                ],
              },
              validation: (r) => r.required(),
            },
            {name: 'url', type: 'url', title: 'URL', validation: (r) => r.required()},
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site settings'}),
  },
})

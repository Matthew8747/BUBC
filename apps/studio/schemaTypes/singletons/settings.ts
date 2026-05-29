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
    {name: 'boathouse', title: 'Boathouse & STV'},
    {name: 'nav', title: 'Navigation'},
    {name: 'footer', title: 'Footer'},
    {name: 'social', title: 'Social'},
    {name: 'race', title: 'Live race banner'},
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

    // Boathouse & STV --------------------------------------------------------
    defineField({
      name: 'boathousePhotos',
      title: 'Boathouse photos',
      description:
        'Photos of the boathouse and the reach. Shown in a gallery on the Boathouse page. Click to enlarge on the site.',
      type: 'array',
      group: 'boathouse',
      of: [{type: 'imageBlock'}],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'stvPhotos',
      title: 'STV photos',
      description:
        'Photos of the Sports Training Village — land training, gym, erg room. Shown in the STV section of the Boathouse page.',
      type: 'array',
      group: 'boathouse',
      of: [{type: 'imageBlock'}],
      options: {layout: 'grid'},
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

    // Live race banner -------------------------------------------------------
    defineField({
      name: 'liveRaceBanner',
      title: 'Live race banner',
      description:
        "Optional callout pinned above the header on every page. Use it during BUCS, HRR, or Henley Women's to point at the official live tracker. Turn off when racing's over.",
      type: 'object',
      group: 'race',
      options: {collapsible: true, collapsed: true},
      fields: [
        {
          name: 'active',
          type: 'boolean',
          title: 'Show banner',
          initialValue: false,
        },
        {
          name: 'eventName',
          type: 'string',
          title: 'Event name',
          description: 'Short label that appears in upper-case at the start.',
        },
        {
          name: 'message',
          type: 'string',
          title: 'Message',
          description: 'Optional context, e.g. "BUBC Men race the Temple at 12:45".',
        },
        {
          name: 'liveResultsUrl',
          type: 'url',
          title: 'Live results URL',
          description: 'External link — usually British Rowing or HRR official site.',
          validation: (rule) =>
            rule.uri({scheme: ['http', 'https'], allowRelative: false}).warning(),
        },
        {
          name: 'ctaLabel',
          type: 'string',
          title: 'Link label',
          description: 'Defaults to "Follow live".',
        },
        {
          name: 'tone',
          type: 'string',
          title: 'Tone',
          options: {
            list: [
              {title: 'Navy (default)', value: 'navy'},
              {title: 'Gold (fundraising)', value: 'gold'},
              {title: 'Blade red (race day)', value: 'blade'},
            ],
            layout: 'radio',
          },
          initialValue: 'navy',
        },
      ],
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

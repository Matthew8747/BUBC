import {defineField, defineType} from 'sanity'

export const boatForSale = defineType({
  name: 'boatForSale',
  title: 'Boat needed (Buy-a-Boat)',
  description: 'A boat the club is fundraising for, shown on /support/buy-a-boat/.',
  type: 'document',
  fields: [
    defineField({
      name: 'boatType',
      title: 'Boat type',
      type: 'string',
      description: 'e.g. "Heavyweight 8+", "Lightweight 1x".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priceRange',
      title: 'Price range',
      type: 'string',
      description: 'e.g. "£28,000 – £35,000". Plain text — editors decide the format.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Needed', value: 'needed'},
          {title: 'Funded — on order', value: 'funded'},
          {title: 'Delivered', value: 'delivered'},
        ],
        layout: 'radio',
      },
      initialValue: 'needed',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priority',
      title: 'Priority order',
      description: 'Smaller = higher up the list.',
      type: 'number',
      initialValue: 100,
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
      description: "Optional context — why it's needed, who it benefits.",
    }),
  ],
  orderings: [
    {
      title: 'Priority',
      name: 'priority',
      by: [{field: 'priority', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'boatType', subtitle: 'priceRange', status: 'status'},
    prepare: ({title, subtitle, status}) => ({
      title,
      subtitle: `${subtitle ?? ''} · ${status}`,
    }),
  },
})

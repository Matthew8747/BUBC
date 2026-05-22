import {defineField, defineType} from 'sanity'

export const boat = defineType({
  name: 'boat',
  title: 'Boat',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Boat name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 60},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'make',
      title: 'Make',
      type: 'string',
      description: 'e.g. Empacher, Filippi, Hudson, Janousek.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'class',
      title: 'Class',
      type: 'string',
      options: {
        list: [
          {title: 'Single (1x)', value: '1x'},
          {title: 'Double (2x)', value: '2x'},
          {title: 'Pair (2-)', value: '2-'},
          {title: 'Quad (4x)', value: '4x'},
          {title: 'Coxed quad (4x+)', value: '4x+'},
          {title: 'Four (4-)', value: '4-'},
          {title: 'Coxed four (4+)', value: '4+'},
          {title: 'Eight (8+)', value: '8+'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'weight',
      title: 'Weight category',
      type: 'string',
      options: {
        list: [
          {title: 'Heavyweight', value: 'heavy'},
          {title: 'Lightweight', value: 'light'},
        ],
      },
    }),
    defineField({
      name: 'yearBought',
      title: 'Year acquired',
      type: 'number',
      validation: (rule) => rule.min(1960).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: 'donor',
      title: 'Donor / sponsor',
      type: 'string',
      description: 'Person, company, or fund that paid for the boat.',
    }),
    defineField({
      name: 'story',
      title: 'Story',
      description: 'Naming story, history of crews who have rowed it, anecdotes.',
      type: 'portableText',
    }),
    defineField({name: 'photo', title: 'Photo', type: 'imageBlock'}),
    defineField({
      name: 'currentCrew',
      title: 'Current crew',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'athlete'}]}],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Reserve', value: 'reserve'},
          {title: 'Retired', value: 'retired'},
          {title: 'For sale', value: 'forSale'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'namingCeremonyDate',
      title: 'Naming ceremony date',
      type: 'date',
    }),
    defineField({
      name: 'bayNumber',
      title: 'Boathouse bay',
      description: 'Bay number for the fleet visualiser.',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Class then name',
      name: 'className',
      by: [
        {field: 'class', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'name', make: 'make', boatClass: 'class', media: 'photo'},
    prepare: ({title, make, boatClass, media}) => ({
      title,
      subtitle: [make, boatClass].filter(Boolean).join(' · '),
      media,
    }),
  },
})

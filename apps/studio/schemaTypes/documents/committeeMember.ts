import {defineField, defineType} from 'sanity'

export const committeeMember = defineType({
  name: 'committeeMember',
  title: 'Committee member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 60},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. "President", "Men\'s Captain", "Welfare Officer", "Treasurer".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      description: 'Smaller = earlier. President = 0, Captains = 10, then alphabetical.',
      type: 'number',
      initialValue: 100,
    }),
    defineField({
      name: 'academicYear',
      title: 'Academic year',
      description: 'e.g. "2026/27". Used to filter current vs past committees.',
      type: 'string',
      validation: (rule) => rule.required().regex(/^\d{4}\/\d{2}$/, {name: 'YYYY/YY format'}),
    }),
    defineField({
      name: 'photo',
      title: 'Headshot',
      type: 'imageBlock',
    }),
    defineField({
      name: 'course',
      title: 'Degree course',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'bio',
      title: 'Short bio',
      type: 'text',
      rows: 4,
    }),
  ],
  orderings: [
    {
      title: 'Year then role order',
      name: 'yearOrder',
      by: [
        {field: 'academicYear', direction: 'desc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
})

import {defineField, defineType} from 'sanity'

export const coach = defineType({
  name: 'coach',
  title: 'Coach',
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
      description: 'e.g. "Head Coach", "Senior Men\'s Coach", "Sculling Specialist".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Smaller number = earlier in the list. Head Coach should be 0.',
      initialValue: 100,
    }),
    defineField({
      name: 'photo',
      title: 'Headshot',
      type: 'imageBlock',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'portableText',
    }),
    defineField({
      name: 'qualifications',
      title: 'Qualifications',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'order',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
})

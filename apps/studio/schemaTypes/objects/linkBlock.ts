import {defineField, defineType} from 'sanity'

export const linkBlock = defineType({
  name: 'linkBlock',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
    }),
    defineField({
      name: 'external',
      title: 'Opens in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

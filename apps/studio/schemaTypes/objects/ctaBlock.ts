import {defineField, defineType} from 'sanity'

export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'Call-to-action button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'linkBlock',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Visual style',
      type: 'string',
      options: {
        list: [
          {title: 'Solid (primary)', value: 'solid'},
          {title: 'Ghost (secondary)', value: 'ghost'},
        ],
        layout: 'radio',
      },
      initialValue: 'solid',
      validation: (rule) => rule.required(),
    }),
  ],
})

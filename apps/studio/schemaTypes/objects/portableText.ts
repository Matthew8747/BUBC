import {defineArrayMember, defineType} from 'sanity'

/**
 * Editorial body content. Used by newsPost, campaigns, history, etc.
 *
 * Block-level styles are intentionally restricted: editors can choose h2 / h3,
 * blockquote, and a couple of list types. No h1 (that's the page title).
 * Inline marks include a pull-quote-friendly `lead` decorator.
 */
export const portableText = defineType({
  name: 'portableText',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Body', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Heading 4', value: 'h4'},
        {title: 'Pull quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bulleted', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Lead paragraph', value: 'lead'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule) =>
                  rule
                    .required()
                    .uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
              },
              {name: 'external', type: 'boolean', title: 'Opens in new tab', initialValue: false},
            ],
          },
        ],
      },
    }),
    defineArrayMember({type: 'imageBlock'}),
    defineArrayMember({
      type: 'object',
      name: 'embed',
      title: 'Video embed',
      fields: [
        {
          name: 'url',
          title: 'Video URL',
          type: 'url',
          description: 'YouTube or Vimeo URL.',
          validation: (rule) => rule.required(),
        },
        {name: 'caption', title: 'Caption', type: 'string'},
      ],
    }),
  ],
})

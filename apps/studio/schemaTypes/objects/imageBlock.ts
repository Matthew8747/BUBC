import {defineField, defineType} from 'sanity'

/**
 * Reusable image with mandatory alt text.
 *
 * Use this *instead of* the raw `image` type anywhere editors upload an image.
 * Enforces WCAG: every decorative-or-meaningful image gets a non-empty alt
 * (decorative images should still set alt="" explicitly via the toggle).
 */
export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'Describe what is in the image for screen readers and SEO. If purely decorative, mark the image as decorative below.',
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
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'credit',
      title: 'Photo credit',
      type: 'string',
    }),
  ],
})

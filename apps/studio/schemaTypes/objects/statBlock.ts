import {defineField, defineType} from 'sanity'

export const statBlock = defineType({
  name: 'statBlock',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description:
        'The headline number, e.g. "27" or "1.2k". Plain text so editors can write "60+".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'suffix',
      title: 'Suffix',
      type: 'string',
      description: 'Optional unit shown smaller after the value, e.g. "kg" or "years".',
    }),
  ],
  preview: {
    select: {value: 'value', label: 'label', suffix: 'suffix'},
    prepare: ({value, label, suffix}) => ({
      title: `${value ?? '—'}${suffix ? ` ${suffix}` : ''}`,
      subtitle: label,
    }),
  },
})

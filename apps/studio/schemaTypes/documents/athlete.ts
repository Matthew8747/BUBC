import {defineField, defineType} from 'sanity'

export const athlete = defineType({
  name: 'athlete',
  title: 'Athlete',
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
      name: 'photo',
      title: 'Headshot',
      type: 'imageBlock',
    }),
    defineField({
      name: 'squad',
      title: 'Squad',
      type: 'reference',
      to: [{type: 'squad'}],
    }),
    defineField({
      name: 'side',
      title: 'Bow / Stroke side',
      type: 'string',
      options: {
        list: [
          {title: 'Bow side', value: 'bow'},
          {title: 'Stroke side', value: 'stroke'},
          {title: 'Bisweptual', value: 'bi'},
          {title: 'Scull', value: 'scull'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'academicYear',
      title: 'University year',
      type: 'string',
      options: {
        list: [
          {title: '1st year', value: '1'},
          {title: '2nd year', value: '2'},
          {title: '3rd year', value: '3'},
          {title: '4th year / placement', value: '4'},
          {title: 'Postgraduate', value: 'pg'},
        ],
      },
    }),
    defineField({
      name: 'course',
      title: 'Degree course',
      type: 'string',
    }),
    defineField({
      name: 'height',
      title: 'Height (cm)',
      type: 'number',
    }),
    defineField({
      name: 'weight',
      title: 'Weight (kg)',
      type: 'number',
    }),
    defineField({
      name: 'hometown',
      title: 'Hometown',
      type: 'string',
    }),
    defineField({
      name: 'previousClub',
      title: 'Previous club',
      type: 'string',
    }),
    defineField({
      name: 'pb2k',
      title: '2k PB (mm:ss.t)',
      type: 'string',
      description: 'Concept2 2000m ergo PB, e.g. "6:12.4".',
    }),
    defineField({
      name: 'pb5k',
      title: '5k PB (mm:ss.t)',
      type: 'string',
    }),
    defineField({
      name: 'achievements',
      title: 'Achievements',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'showOnPublicSite',
      title: 'Show on public site',
      description: 'Off by default — opt-in for privacy.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'name', squad: 'squad.name', media: 'photo'},
    prepare: ({title, squad, media}) => ({title, subtitle: squad ?? '—', media}),
  },
})

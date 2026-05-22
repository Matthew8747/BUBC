import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes, SINGLETON_TYPES} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'j7zcx618'
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

export default defineConfig({
  name: 'default',
  title: 'BUBC',

  projectId,
  dataset,

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Prevent duplicate/delete on singletons so editors can't accidentally
    // create a second Site Settings or a second Home Page document.
    actions: (prev, {schemaType}) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({action}) => action !== 'duplicate' && action !== 'delete')
        : prev,

    // Hide singletons from the global "New document" menu — they're created
    // automatically and accessed from the left-nav.
    newDocumentOptions: (prev) => prev.filter((opt) => !SINGLETON_TYPES.has(opt.templateId)),
  },
})

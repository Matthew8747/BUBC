import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes, SINGLETON_TYPES} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'j7zcx618'
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

// Actions hidden from non-Administrators. Editor-tier users can create and
// edit drafts but cannot push them live, unpublish published docs, or delete
// anything — an Administrator reviews and publishes. See docs/REVIEW-WORKFLOW.md.
const ADMIN_ONLY_ACTIONS = new Set(['publish', 'unpublish', 'delete'])

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
    actions: (prev, context) => {
      let actions = prev

      // Prevent duplicate/delete on singletons so editors can't accidentally
      // create a second Site Settings or a second Home Page document.
      if (SINGLETON_TYPES.has(context.schemaType)) {
        actions = actions.filter(({action}) => action !== 'duplicate' && action !== 'delete')
      }

      // Review gate: only Administrators can publish/unpublish/delete.
      const isAdmin =
        context.currentUser?.roles?.some((role) => role.name === 'administrator') ?? false
      if (!isAdmin) {
        actions = actions.filter(({action}) => !action || !ADMIN_ONLY_ACTIONS.has(action))
      }

      return actions
    },

    // Hide singletons from the global "New document" menu — they're created
    // automatically and accessed from the left-nav.
    newDocumentOptions: (prev) => prev.filter((opt) => !SINGLETON_TYPES.has(opt.templateId)),
  },
})

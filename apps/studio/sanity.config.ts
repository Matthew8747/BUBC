import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schema } from './schemas/index';

export default defineConfig({
  name: 'bubc-studio',
  title: 'BUBC Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema,
});

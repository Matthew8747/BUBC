// Ambient module declarations for environment variables Astro injects at
// build time. See https://docs.astro.build/en/guides/environment-variables/.
//
// (Astro's own client/server types are pulled in by `astro/client` via
// tsconfig.json's compilerOptions.types, so we don't need a triple-slash ref.)

interface ImportMetaEnv {
  readonly SANITY_PROJECT_ID?: string;
  readonly SANITY_DATASET?: string;
  readonly SANITY_API_READ_TOKEN?: string;
  readonly PUBLIC_FORMSPREE_TRIAL_ID?: string;
  readonly PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN?: string;
  readonly PUBLIC_BUTTONDOWN_USERNAME?: string;
  readonly PUBLIC_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/gallery',
  timeout: 60000,
  retries: 0,
  workers: 3,
  expect: { timeout: 8000 },
  outputDir: '.audit/gallery/artifacts',
  reporter: [['list'], ['html', { outputFolder: '.audit/gallery/report', open: 'never' }], ['json', { outputFile: '.audit/gallery/results.json' }]],
  use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: ['vuetify', 'primevue', 'shadcn'].flatMap((provider, index) => ['ar', 'en'].flatMap(locale => ['light', 'dark'].map(mode => ({
    name: `${provider}-${locale}-${mode}`,
    metadata: { provider, locale, mode },
    use: { baseURL: `http://127.0.0.1:${41801 + index}` }
  }))))
})

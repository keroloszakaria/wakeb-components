import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/docs',
  workers: 3,
  retries: 0,
  outputDir: '.audit/docs/artifacts',
  reporter: [['list'], ['json', { outputFile: '.audit/docs/results.json' }]],
  use: { browserName: 'chromium', baseURL: 'http://127.0.0.1:41735', screenshot: 'only-on-failure' },
  projects: ['en', 'ar'].flatMap(locale => ['light', 'dark'].flatMap(mode => ['wide', 'small'].map(size => ({
    name: `${locale}-${mode}-${size}`,
    metadata: { locale, mode, size },
    use: { viewport: size === 'small' ? { width: 390, height: 844 } : { width: 1440, height: 1000 } },
  })))),
  webServer: { command: 'npm run docs:preview -- --port 41735', url: 'http://127.0.0.1:41735', reuseExistingServer: false },
})

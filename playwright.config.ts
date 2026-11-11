import { defineConfig } from '@playwright/test'

// One actual packed consumer per provider; the same tests run in every visual context.
export default defineConfig({
  testDir: './tests/browser',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  workers: 4,
  retries: 0,
  timeout: 30000,
  expect: { timeout: 5000 },
  outputDir: '.audit/browser/artifacts',
  reporter: [['list'], ['html', { outputFolder: '.audit/browser/report', open: 'never' }], ['json', { outputFile: '.audit/browser/results.json' }]],
  use: { browserName: 'chromium', headless: true, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: ['vuetify', 'primevue', 'shadcn'].flatMap((provider, index) =>
    ['light', 'dark'].flatMap(mode => ['ltr', 'rtl'].flatMap(direction => ['wide', 'small'].map(size => ({
      name: `${provider}-${mode}-${direction}-${size}`,
      metadata: { provider, mode, direction, size },
      use: { baseURL: `http://127.0.0.1:${41731 + index}`, viewport: size === 'small' ? { width: 390, height: 844 } : { width: 1280, height: 900 } },
    })))),
  ),
  webServer: {
    command: 'node scripts/browser-server.mjs',
    url: 'http://127.0.0.1:41731/health',
    timeout: 180000,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})

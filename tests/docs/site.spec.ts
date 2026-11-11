import { test, expect } from '@playwright/test'

for (const slug of ['components/accordion', 'components/data-table', 'guide/agents']) test(`readable bilingual ${slug}`, async ({ page }, info) => {
  const { locale, mode } = info.project.metadata
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.addInitScript(mode => { localStorage.setItem('vitepress-theme-appearance', mode) }, String(mode))
  await page.goto(`/${locale === 'ar' ? 'ar/' : ''}${slug}`)
  await expect(page.locator('html')).toHaveAttribute('lang', String(locale))
  if (locale === 'ar') await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect.poll(() => page.locator('html').evaluate(el => el.classList.contains('dark'))).toBe(mode === 'dark')
  await expect(page.locator('.vp-doc h1')).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
  if (slug.startsWith('components/')) {
    await expect(page.locator('.w-demo, .foundation-demo')).toBeVisible()
    await expect(page.locator('.vp-doc div.language-vue')).toHaveCount(2)
    const direction = await page.locator('.vp-doc div.language-vue').first().evaluate(el => getComputedStyle(el).direction)
    expect(direction).toBe('ltr')
  } else {
    for (const suffix of ['wakeb-components-skill.zip', 'wakeb-components-mcp-0.8.0-alpha.0.tgz']) {
      const response = await page.request.get(`/downloads/${suffix}`)
      expect(response.ok()).toBe(true)
      expect((await response.body()).length).toBeGreaterThan(1000)
    }
  }
  await page.screenshot({ path: info.outputPath(slug.replace('/', '-') + '.png'), fullPage: true })
  expect(errors).toEqual([])
})

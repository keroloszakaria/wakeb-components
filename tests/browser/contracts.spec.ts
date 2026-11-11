import { test as base, expect, type Locator, type Page, type TestInfo } from '@playwright/test'
import reference from '../../docs/reference-data.mjs'

// Capture dev-mode Vue warnings as well as browser errors; production builds hide useful hydration diagnostics.
const test = base.extend<{ diagnostics: void }>({
  diagnostics: [async ({ page, browser }, use, info) => {
    const messages: string[] = []
    page.on('pageerror', error => messages.push(`pageerror: ${error.message}`))
    page.on('console', message => { if (['warning', 'error'].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`) })
    await use()
    const vue = await page.evaluate(() => ({ client: (window as any).__wakebDiagnostics, server: document.querySelector('#ssr-warnings')?.textContent })).catch(() => null)
    await info.attach('browser-diagnostics', { body: JSON.stringify({ browser: browser.version(), messages, vue }, null, 2), contentType: 'application/json' })
    expect(messages, 'browser console and uncaught exceptions').toEqual([])
    expect(vue?.client?.warnings ?? [], 'Vue client warnings (including hydration)').toEqual([])
    expect(JSON.parse(vue?.server ?? '[]'), 'Vue server warnings').toEqual([])
  }, { auto: true }],
})

async function visit(page: Page, info: TestInfo, params: Record<string, string> = {}) {
  const { mode, direction } = info.project.metadata
  await page.goto(`/?${new URLSearchParams({ mode, direction, ...params })}`)
  await page.waitForFunction(() => (window as any).__wakebReady)
  if (params.hydrate !== 'manual') await page.waitForFunction(() => (window as any).__wakebDiagnostics.hydrated)
}
const set = (page: Page, patch: Record<string, unknown>, index = 0) => page.evaluate(({ patch, index }) => Object.assign((window as any).__wakebHarness[index], patch), { patch, index })
const state = (page: Page) => page.evaluate(() => JSON.parse(JSON.stringify((window as any).__wakebHarness[0])))
const dialog = (page: Page, name = 'Modal 0') => page.getByRole('dialog', { name, exact: true })
async function closed(panel: Locator, info: TestInfo, kind = 'modal') {
  if (info.project.metadata.provider === 'vuetify' && kind === 'drawer') {
    // Vuetify retains the closed drawer, translated outside the viewport and inert.
    await expect(panel).toHaveAttribute('inert', '')
    await expect(panel).not.toBeInViewport()
  } else await expect(panel).toBeHidden()
}

test('all 39 components hydrate without replacing server nodes or breaking ID references', async ({ page }, info) => {
  await visit(page, info, { hydrate: 'manual' })
  await page.evaluate(() => { (window as any).__ssrHeading = document.querySelector('h1'); (window as any).__ssrInput = document.querySelector('input[name="example"]') })
  const references = await page.locator('[role="tab"], .accordion__title-trigger').evaluateAll(elements => elements.map(el => [el.id, el.getAttribute('aria-controls')]))
  await page.evaluate(() => (window as any).__wakebHydrate())
  expect(await page.evaluate(() => (window as any).__ssrHeading === document.querySelector('h1') && (window as any).__ssrInput === document.querySelector('input[name="example"]'))).toBe(true)
  expect(await page.locator('[role="tab"], .accordion__title-trigger').evaluateAll(elements => elements.map(el => [el.id, el.getAttribute('aria-controls')]))).toEqual(references)
  await expect(page.getByRole('status', { name: 'Loading report' })).toBeVisible()
  await expect(page.getByTestId('composition')).toBeVisible()
  expect(await page.locator('[data-component]').evaluateAll(elements => [...new Set(elements.map(el => el.getAttribute('data-component')))].sort())).toEqual(reference.map(entry => entry.name).sort())
  expect(await page.locator('[id]').evaluateAll(elements => { const ids = elements.map(el => el.id); return ids.filter((id, i) => ids.indexOf(id) !== i) })).toEqual([])
  await page.screenshot({ path: info.outputPath('all-components.png'), fullPage: true })
})

test('form models update through native editing, keyboard toggles and disabled states', async ({ page }, info) => {
  await visit(page, info)
  const email = page.getByRole('textbox', { name: 'Contact email', exact: true })
  await email.fill('ada@example.com')
  await page.getByRole('textbox', { name: 'Review notes', exact: true }).fill('Ready for review')
  await expect.poll(async () => (await state(page)).email).toBe('ada@example.com')
  await expect.poll(async () => (await state(page)).notes).toBe('Ready for review')
  await email.fill('')
  await email.blur()
  await expect(email).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText('Email required', { exact: true })).toBeVisible()
  const consent = page.getByRole('checkbox', { name: 'Accept terms', exact: true })
  await consent.focus()
  await page.keyboard.press('Space')
  await expect.poll(async () => (await state(page)).consent).toBe(true)
  const notifications = page.getByLabel('Enable notifications', { exact: true })
  await notifications.focus()
  await page.keyboard.press('Space')
  await expect.poll(async () => (await state(page)).notifications).toBe(true)
  await page.getByTestId('forms').getByRole('button', { name: 'End', exact: true }).click()
  await expect.poll(async () => (await state(page)).alignment).toBe('end')
  await set(page, { formDisabled: true })
  for (const input of [email, consent, notifications]) await expect(input).toBeDisabled()
})

test('popover activation, explicit close and Escape preserve focus', async ({ page }, info) => {
  await visit(page, info)
  const opener = page.getByRole('button', { name: 'Open filter help', exact: true })
  await opener.click()
  await expect(page.getByText('Choose filters', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Done with help', exact: true }).click()
  await expect(page.getByText('Choose filters', { exact: true })).toBeHidden()
  await opener.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('Choose filters', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByText('Choose filters', { exact: true })).toBeHidden()
  await expect(opener).toBeFocused()
})

test('table selection, keyboard sorting, loading, empty view and list activation work', async ({ page }, info) => {
  await visit(page, info)
  const table = page.getByTestId('elements').getByRole('table')
  await expect(table).toContainText('Gate 3')
  await expect(table).toContainText('Online')
  const rows = table.getByRole('checkbox')
  await rows.nth(1).check()
  await expect.poll(async () => (await state(page)).tableSelection).toEqual([1])
  await rows.first().check()
  await expect.poll(async () => (await state(page)).tableSelection).toEqual([1, 2])
  const header = table.getByRole('columnheader', { name: 'Camera', exact: true })
  const sortButton = header.getByRole('button')
  if (await sortButton.count()) await sortButton.focus()
  else await header.focus()
  await page.keyboard.press('Enter')
  await expect.poll(async () => (await state(page)).tableSort).toEqual([{ key: 'name', order: 'asc' }])
  await expect(header).toHaveAttribute('aria-sort', 'ascending')
  await expect.poll(async () => (await state(page)).tableOptions.at(-1)).toMatchObject({ page: 1, sortBy: [{ key: 'name', order: 'asc' }] })
  await set(page, { tableLoading: true })
  await expect(page.getByTestId('elements').locator('[aria-busy="true"]')).not.toHaveCount(0)
  await set(page, { tableLoading: false, tableEmpty: true })
  await expect(table).toContainText('No cameras')
  const profileRow = page.locator('[data-component="WList"]').getByRole('listitem').filter({ hasText: 'Profile' })
  const profile = await profileRow.getByRole('button').count() ? profileRow.getByRole('button') : profileRow
  await profile.focus()
  await page.keyboard.press('Enter')
  await expect.poll(async () => (await state(page)).listValue).toBe('profile')
  const locked = page.locator('[data-component="WList"]').getByRole('listitem').filter({ hasText: 'Locked account' })
  if (await locked.getByRole('button').count()) await expect(locked.getByRole('button')).toBeDisabled()
  else await expect(locked).toHaveAttribute('aria-disabled', 'true')
})

for (const open of ['modal', 'drawer']) test(`initially open ${open} hydrates, closes and cleans teleported hosts`, async ({ page }, info) => {
  await visit(page, info, { scene: 'overlays', open, hydrate: 'manual' })
  await page.evaluate(() => (window as any).__wakebHydrate())
  const panel = dialog(page, open === 'modal' ? 'Modal 0' : 'Drawer 0')
  await expect(panel).toBeVisible()
  await expect.poll(() => panel.evaluate(el => el.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await closed(panel, info, open)
  await page.evaluate(() => (window as any).__wakebUnmount())
  await expect(page.locator('[role="dialog"]:visible')).toHaveCount(0)
  expect(await page.locator('body').evaluate(el => getComputedStyle(el).overflow)).not.toBe('hidden')
})

test('progress has accurate 10% geometry with empty, long and slotted labels', async ({ page }, info) => {
  await visit(page, info)
  for (let index = 0; index < 4; index++) {
    const geometry = await page.getByTestId(`progress-${index}`).evaluate(el => {
      const style = getComputedStyle(el)
      const available = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.columnGap)
      return { actual: el.querySelector('.segmented-progress__fill')!.getBoundingClientRect().width, expected: available * .1 }
    })
    expect(Math.abs(geometry.actual - geometry.expected)).toBeLessThanOrEqual(1)
  }
})

test('button SVGs retain requested sizes and native paragraph margins cannot stretch buttons', async ({ page }, info) => {
  await visit(page, info)
  for (const name of ['Plain action', 'Export report']) {
    const button = page.getByRole('button', { name, exact: true })
    const icon = button.locator('svg').first()
    await expect.poll(() => icon.evaluate(el => { const rect = el.getBoundingClientRect(); return Math.abs(rect.width - 20) < .5 && Math.abs(rect.height - 20) < .5 })).toBe(true)
    expect((await button.boundingBox())!.height).toBeLessThan(60)
    await expect(button.locator('p')).toHaveCSS('margin-top', '0px')
    await expect(button.locator('p')).toHaveCSS('margin-bottom', '0px')
  }
})

test('tabs link unique panels and implement arrows, Home and End with actual focus', async ({ page }, info) => {
  await visit(page, info)
  const lists = page.getByRole('tablist')
  for (const list of await lists.all()) {
    const tabs = list.getByRole('tab')
    await tabs.nth(0).focus()
    await page.keyboard.press(info.project.metadata.direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight')
    await expect(tabs.nth(1)).toBeFocused()
    await page.keyboard.press('End')
    await expect(tabs.nth(2)).toBeFocused()
    await page.keyboard.press('Home')
    await expect(tabs.nth(0)).toBeFocused()
    for (const tab of await tabs.all()) {
      await tab.click()
      const controls = await tab.getAttribute('aria-controls')
      const panel = page.locator(`[id="${controls}"]`)
      await expect(panel).toBeVisible()
      await expect(panel).toHaveAttribute('aria-labelledby', (await tab.getAttribute('id'))!)
    }
  }
})

test('tree collapse and removal recover real focus without stealing external focus', async ({ page }, info) => {
  await visit(page, info)
  const root = page.getByRole('treeitem', { name: 'Root', exact: true })
  const child = page.getByRole('treeitem', { name: 'Child', exact: true })
  await child.focus()
  await set(page, { expanded: [] })
  await expect(root).toBeFocused()
  await set(page, { expanded: ['root'] })
  await child.focus()
  await set(page, { nodes: [{ id: 'root', name: 'Root', children: [] }, { id: 'other', name: 'Other' }] })
  await expect(root).toBeFocused()
  const outside = page.getByTestId('outside')
  await outside.focus()
  await set(page, { expanded: [] })
  await expect(outside).toBeFocused()
})

test('buttons submit/reset once and suppress native actions while loading, with and without tooltips', async ({ page }, info) => {
  await visit(page, info)
  for (const name of ['Plain action', 'Tooltip action']) {
    const button = page.getByRole('button', { name, exact: true })
    await button.click()
    const before = await state(page)
    expect(before.clicks).toBe(before.submits)
    await set(page, { loading: true })
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await button.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Space')
    const after = await state(page)
    expect(after.clicks).toBe(before.clicks)
    expect(after.submits).toBe(before.submits)
    await set(page, { loading: false })
  }
  await page.getByRole('button', { name: 'Reset action' }).click()
  expect((await state(page)).resets).toBe(1)
})

test('secondary token overrides paint normal, hover, disabled and loading states', async ({ page }, info) => {
  await visit(page, info)
  const button = page.getByRole('button', { name: 'Secondary action', exact: true })
  await page.mouse.move(0, 0)
  await expect(button).toHaveCSS('background-color', 'rgb(17, 34, 51)')
  await button.hover()
  await expect(button).toHaveCSS('background-color', 'rgb(34, 51, 68)')
  await set(page, { dropdownDisabled: true })
  await expect(button).toHaveCSS('background-color', 'rgb(51, 68, 85)')
  await set(page, { dropdownDisabled: false, loading: true })
  await expect(button).toHaveCSS('background-color', 'rgb(68, 85, 102)')
})

test('dropdown links skip disabled rows with keyboard and emit item before model once', async ({ page }, info) => {
  await visit(page, info)
  const trigger = page.getByTestId('dropdown').getByRole('button', { name: 'Actions' })
  await page.evaluate(() => {
    const spacer = document.createElement('div')
    spacer.style.height = '1300px'
    document.body.prepend(spacer)
  })
  await trigger.scrollIntoViewIfNeeded()
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  await trigger.click()
  const disabled = page.getByRole('menuitem', { name: 'Disabled link' })
  const enabled = page.getByRole('menuitem', { name: 'Enabled link' })
  await expect(enabled).toBeInViewport()
  await expect(disabled).toHaveAttribute('aria-disabled', 'true')
  expect(await disabled.getAttribute('href')).toBeNull()
  await page.keyboard.press('ArrowDown')
  // PrimeVue uses aria-activedescendant on the focused menu; the other providers move DOM focus.
  await expect.poll(() => enabled.evaluate(el => el === document.activeElement || el.contains(document.activeElement) || document.activeElement?.getAttribute('aria-activedescendant') === el.id)).toBe(true)
  await page.keyboard.press('Enter')
  await expect.poll(async () => (await state(page)).events).toEqual([['selectedItem', 0], ['modelValue', 0]])
  await trigger.click()
  const last = page.getByRole('menuitem', { name: 'Last link' })
  await expect(last).toBeInViewport()
  await last.click()
  await expect.poll(async () => (await state(page)).events).toEqual([['selectedItem', 0], ['modelValue', 0], ['selectedItem', 'last'], ['modelValue', 'last']])
  expect(new URL(page.url()).hash).not.toBe('#forbidden')
  await set(page, { loading: true })
  await expect(trigger).toBeDisabled()
})

for (const kind of ['modal', 'drawer']) test(`${kind} traps Tab, honors persistence and restores opener focus`, async ({ page }, info) => {
  await visit(page, info, { scene: 'overlays', persistent: 'true', descriptionOnly: 'true' })
  const opener = page.getByTestId(`open-${kind}`)
  await opener.click()
  const panel = dialog(page, kind === 'modal' ? 'Modal 0' : 'Drawer 0')
  await expect(panel).toBeVisible()
  for (let n = 0; n < 8; n++) {
    await page.keyboard.press(n < 4 ? 'Tab' : 'Shift+Tab')
    expect(await panel.evaluate(el => el.contains(document.activeElement))).toBe(true)
  }
  if (kind === 'modal') await expect(panel.locator('.wakeb-modal__description')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(panel).toBeVisible()
  await page.mouse.click(2, 2)
  await expect(panel).toBeVisible()
  await set(page, { persistent: false })
  await page.keyboard.press('Escape')
  await closed(panel, info, kind)
  await expect(opener).toBeFocused()
})

test('Escape closes a modal inside a drawer before closing the drawer', async ({ page }, info) => {
  await visit(page, info, { scene: 'overlays' })
  await page.getByTestId('open-drawer').click()
  await page.getByTestId('open-nested').click()
  await expect(dialog(page, 'Nested modal')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog(page, 'Nested modal')).toBeHidden()
  await expect(dialog(page, 'Drawer 0')).toBeVisible()
  await page.keyboard.press('Escape')
  await closed(dialog(page, 'Drawer 0'), info, 'drawer')
})

test('two hydrated apps keep independent theme and direction on teleported overlays', async ({ page }, info) => {
  await visit(page, info, { scene: 'overlays', twoApps: 'true' })
  for (let index = 0; index < 2; index++) {
    await page.locator(`[data-app="${index}"]`).getByTestId('open-modal').click()
    const panel = dialog(page, `Modal ${index}`)
    await expect(panel).toBeVisible()
    const scope = await panel.evaluate(el => ({ primary: getComputedStyle(el).getPropertyValue('--wakeb-ui-primary').trim(), direction: getComputedStyle(el).direction }))
    expect(scope.primary).toBe(index ? '#a6216a' : '#087f8c')
    expect(scope.direction).toBe(index ? (info.project.metadata.direction === 'rtl' ? 'ltr' : 'rtl') : info.project.metadata.direction)
    await panel.getByRole('button', { name: 'Close modal' }).click()
    await expect(panel).toBeHidden()
  }
  await page.evaluate(() => (window as any).__wakebUnmount())
  await expect(page.locator('[role="dialog"]:visible')).toHaveCount(0)
})

test('carousel pauses for hover, keyboard focus and reduced motion, then cleans up on unmount', async ({ page }, info) => {
  await visit(page, info)
  const region = page.getByTestId('carousel').getByRole('region')
  await region.scrollIntoViewIfNeeded()
  await page.mouse.move(0, 0)
  await set(page, { cycle: true })
  await expect.poll(async () => (await state(page)).events.filter((event: any) => event[0] === 'slide').length).toBeGreaterThan(0)
  await region.hover()
  const hovered = (await state(page)).events.length
  await page.waitForTimeout(600)
  expect((await state(page)).events.length).toBe(hovered)
  const indicator = page.getByRole('button', { name: /Go to slide 1|الانتقال إلى الشريحة 1/ })
  await indicator.focus()
  await page.mouse.move(0, 0)
  const focused = (await state(page)).events.length
  await page.waitForTimeout(600)
  expect((await state(page)).events.length).toBe(focused)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await indicator.blur()
  const reduced = (await state(page)).events.length
  await page.waitForTimeout(600)
  expect((await state(page)).events.length).toBe(reduced)
  await indicator.click()
  expect((await state(page)).submits).toBe(0)
  await set(page, { carousel: false })
  const removed = (await state(page)).events.length
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.waitForTimeout(600)
  expect((await state(page)).events.length).toBe(removed)
})

test('badge overflow keeps circle geometry and keyboard tooltips are positioned beside their trigger', async ({ page }, info) => {
  await visit(page, info)
  // Hover opens this informational popup too. Use native keyboard activation to open it
  // without a preceding pointer hover turning the subsequent click into a close request.
  const overflow = page.getByRole('button', { name: 'More badges' })
  await overflow.scrollIntoViewIfNeeded()
  await overflow.focus()
  await page.keyboard.press('Enter')
  const icon = page.locator('.badge-stack__icon-wrap:visible').last()
  await expect(icon).toBeVisible()
  expect(await icon.evaluate(el => el.closest('.fixture') === null)).toBe(true)
  // The provider's enter transition can scale X and Y independently. Measure the settled popup.
  await expect.poll(() => icon.evaluate(el => { const rect = el.getBoundingClientRect(); return rect.width > 0 && rect.height > 0 && Math.abs(rect.width - rect.height) < 1 })).toBe(true)
  const circle = await icon.evaluate(el => { const style = getComputedStyle(el); const rect = el.getBoundingClientRect(); return { width: rect.width, height: rect.height, radius: style.borderRadius } })
  expect(circle.width).toBeGreaterThan(0)
  expect(Math.abs(circle.width - circle.height)).toBeLessThan(1)
  expect(parseFloat(circle.radius)).toBeGreaterThanOrEqual(circle.width / 2)
  await page.keyboard.press('Escape')
  await page.mouse.move(0, 0)
  const trigger = page.getByRole('button', { name: 'Accessible tooltip', exact: true })
  await trigger.scrollIntoViewIfNeeded()
  await trigger.focus()
  const tooltip = page.getByRole('tooltip', { name: 'Accessible tooltip', exact: true })
  await expect(tooltip).toBeVisible()
  // Vuetify's role is on the viewport overlay, reka-ui's is on its accessible text.
  // Measure the actual painted bubble, after positioning/enter animations have settled.
  await expect.poll(() => tooltip.evaluate((el) => {
    const bubble = el.querySelector('.v-overlay__content') ?? el.closest('.wakeb-sc-tooltip') ?? el
    const trigger = document.querySelector('.wakeb-tooltip-btn button')!
    const a = trigger.getBoundingClientRect(), b = bubble.getBoundingClientRect()
    return b.width > 0 && b.height > 0 && Math.abs(b.x - a.x) < 300 && Math.abs(b.y - a.y) < 150
  })).toBe(true)
  await expect(trigger).toHaveAttribute('aria-describedby', (await tooltip.getAttribute('id'))!)
})

test('default text and surfaces stay readable in dark mode and component color overrides win', async ({ page }, info) => {
  await visit(page, info)
  const dark = info.project.metadata.mode === 'dark'
  await expect(page.locator('.tree__node-label').first()).toHaveCSS('color', dark ? 'rgb(242, 244, 247)' : 'rgb(16, 24, 40)')
  await expect(page.getByRole('tab', { name: 'First two', exact: true })).toHaveCSS('color', dark ? 'rgb(242, 244, 247)' : 'rgb(52, 64, 84)')
  await expect(page.locator('.accordion').first()).toHaveCSS('background-color', dark ? 'rgb(29, 41, 57)' : 'rgb(255, 255, 255)')
  await expect(page.locator('.accordion__title-trigger').first()).toHaveCSS('color', dark ? 'rgb(242, 244, 247)' : 'rgb(16, 24, 40)')
  await expect(page.locator('.sidebar__inner')).toHaveCSS('background-color', dark ? 'rgb(29, 41, 57)' : 'rgb(255, 255, 255)')
  await expect(page.locator('.sidebar__inner')).toHaveCSS('color', dark ? 'rgb(242, 244, 247)' : 'rgb(16, 24, 40)')
  await expect(page.getByRole('button', { name: 'Export report', exact: true })).toHaveCSS('color', dark ? 'rgb(242, 244, 247)' : 'rgb(52, 64, 84)')
  await page.getByRole('tree').evaluate(el => (el as HTMLElement).style.setProperty('--wakeb-tree-paragraph-primary', '#123456'))
  await expect(page.locator('.tree__node-label').first()).toHaveCSS('color', 'rgb(18, 52, 86)')
})

test('concurrent SSR requests have deterministic IDs and two roots hydrate without sharing configuration', async ({ page, request }, info) => {
  const query = new URLSearchParams({ mode: info.project.metadata.mode, direction: info.project.metadata.direction, twoApps: 'true', hydrate: 'manual' })
  const [first, repeated, other] = await Promise.all([
    request.get(`/?${query}`), request.get(`/?${query}`), request.get('/?mode=dark&direction=rtl&twoApps=true&hydrate=manual'),
  ])
  for (const response of [first, repeated, other]) expect(response.status()).toBe(200)
  const ids = (html: string) => [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1])
  expect(ids(await first.text())).toEqual(ids(await repeated.text()))
  expect(await other.text()).toContain('dir="rtl"')
  await visit(page, info, { twoApps: 'true', hydrate: 'manual' })
  await page.evaluate(() => (window as any).__wakebHydrate())
  expect(await page.locator('[id]').evaluateAll(elements => { const ids = elements.map(el => el.id); return ids.filter((id, i) => ids.indexOf(id) !== i) })).toEqual([])
  await expect(page.locator('[data-app="0"]')).toHaveAttribute('dir', info.project.metadata.direction)
  await expect(page.locator('[data-app="1"]')).toHaveAttribute('dir', info.project.metadata.direction === 'rtl' ? 'ltr' : 'rtl')
})

test('keyboard focus is visible and skeleton columns respond to actual viewport breakpoints', async ({ page }, info) => {
  await visit(page, info)
  await page.keyboard.press('Tab')
  const button = page.getByRole('button', { name: 'Plain action', exact: true })
  await button.focus()
  expect(await button.evaluate(el => el.matches(':focus-visible'))).toBe(true)
  await expect.poll(() => button.evaluate(el => { const style = getComputedStyle(el); return style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0 })).toBe(true)
  const col = page.getByTestId('display').locator('.wakeb-grid-col')
  const ratio = await col.evaluate(el => el.getBoundingClientRect().width / el.parentElement!.getBoundingClientRect().width)
  expect(Math.abs(ratio - (info.project.metadata.size === 'small' ? 1 : 1 / 3))).toBeLessThan(.02)
})

test('modal width is measured in the browser and outside press closes only nonpersistent overlays', async ({ page }, info) => {
  await visit(page, info, { scene: 'overlays', descriptionOnly: 'true' })
  await page.getByTestId('open-modal').click()
  const panel = dialog(page)
  await expect(panel.locator('.wakeb-modal__description')).toBeVisible()
  const content = panel.locator('.wakeb-modal__card')
  expect((await content.boundingBox())!.width).toBeLessThanOrEqual(321)
  await page.mouse.click(2, 2)
  await expect(panel).toBeHidden()
  await page.getByTestId('open-drawer').click()
  const drawer = dialog(page, 'Drawer 0')
  await expect(drawer).toBeVisible()
  // The end drawer's scrim is on the opposite side in RTL.
  await page.mouse.click(info.project.metadata.direction === 'rtl' ? page.viewportSize()!.width - 2 : 2, 2)
  await closed(drawer, info, 'drawer')
})

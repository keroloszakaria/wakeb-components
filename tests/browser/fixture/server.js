import { renderToString } from '@vue/server-renderer'
import { createRoots } from './app.js'

export async function renderPage(options) {
  const warnings = []
  const roots = createRoots(options, warnings)
  const rendered = await Promise.all(roots.map(async ({ app }, index) => {
    const context = {}
    const html = await renderToString(app, context)
    return { html: `<div id="app-${index}">${html}</div>`, teleports: context.teleports ?? {} }
  }))
  const teleports = rendered.flatMap(result => Object.entries(result.teleports))
  const body = teleports.filter(([target]) => target === 'body').map(([, html]) => html).join('')
  const vuetify = teleports.filter(([target]) => target === '.v-overlay-container').map(([, html]) => html).join('')
  const json = JSON.stringify(options).replaceAll('<', '\\u003c')
  return `<!doctype html><html lang="${options.direction === 'rtl' ? 'ar' : 'en'}" dir="${options.direction ?? 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Wakeb browser contracts</title></head><body>${rendered.map(result => result.html).join('')}<div class="v-overlay-container">${vuetify}</div>${body}<script id="fixture-options" type="application/json">${json}</script><script id="ssr-warnings" type="application/json">${JSON.stringify(warnings).replaceAll('<', '\\u003c')}</script><script type="module" src="/client.js"></script></body></html>`
}

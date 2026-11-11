import { createServer } from 'node:http'
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createWorkDir, FRAMEWORKS, installedVersion, npm, offlineFlags, packTarball, root, run } from './consumer-harness.mjs'

// Deliberately outside the repository: optional peers cannot resolve via the workspace.
const work = createWorkDir('wakeb-browser-')
const packed = packTarball(work)
const evidence = { archive: packed.filename, integrity: packed.integrity, consumers: {} }
const resources = []
let ready = false
for (const [index, framework] of FRAMEWORKS.entries()) {
  const dir = join(work, framework)
  mkdirSync(join(dir, 'plugins'), { recursive: true })
  const peers = { vuetify: ['vuetify'], primevue: ['primevue', '@primeuix/themes'], shadcn: ['reka-ui'] }[framework]
  const versions = Object.fromEntries(['vue', '@vue/server-renderer', 'vite', ...peers].map(name => [name, installedVersion(name)]))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies: { 'wakeb-components': packed.path, ...versions } }))
  console.log(run([npm, 'install', '--ignore-scripts', '--no-audit', '--no-fund', ...offlineFlags()], dir))
  for (const file of ['app.js', 'client.js', 'server.js', 'fixture.css']) copyFileSync(join(root, 'tests/browser/fixture', file), join(dir, file))
  writeFileSync(join(dir, 'plugins/wakeb-components.js'), `import { createWakebComponents } from 'wakeb-components'\nexport default createWakebComponents({ framework: '${framework}' })\n`)
  const { createServer: createVite } = await import(pathToFileURL(join(dir, 'node_modules/vite/dist/node/index.js')).href)
  const { wakebComponents } = await import(pathToFileURL(join(dir, 'node_modules/wakeb-components/dist/vite.js')).href)
  const vite = await createVite({ root: dir, configFile: false, plugins: [wakebComponents()], define: { __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: false, __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true }, server: { middlewareMode: true, hmr: { port: 41831 + index } }, appType: 'custom' })
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1')
    if (url.pathname === '/health') { res.writeHead(ready ? 200 : 503); res.end(ready ? 'ready' : 'preparing'); return }
    if (url.pathname === '/favicon.ico') { res.writeHead(204); res.end(); return }
    if (url.pathname !== '/') { vite.middlewares(req, res, () => { res.writeHead(404); res.end() }); return }
    try {
      const { renderPage } = await vite.ssrLoadModule('/server.js')
      const result = await renderPage(Object.fromEntries(url.searchParams))
      const html = await vite.transformIndexHtml(req.url, result)
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(html)
    } catch (error) {
      vite.ssrFixStacktrace(error)
      console.error(error)
      res.writeHead(500); res.end(String(error.stack))
    }
  })
  await new Promise(resolve => server.listen(41731 + index, '127.0.0.1', resolve))
  resources.push({ server, vite })
  evidence.consumers[framework] = { dir, versions, port: 41731 + index }
}
mkdirSync(join(root, '.audit/browser'), { recursive: true })
writeFileSync(join(root, '.audit/browser/consumers.json'), JSON.stringify(evidence, null, 2) + '\n')
ready = true
console.log(`Browser consumers ready: ${work}`)
const close = async () => { await Promise.all(resources.map(async ({ server, vite }) => { server.close(); await vite.close() })); process.exit() }
process.on('SIGINT', close)
process.on('SIGTERM', close)

import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createWorkDir, FRAMEWORKS, installedVersion, npm, offlineFlags, packTarball, root, run } from './consumer-harness.mjs'

assert(npm, 'Run: npm exec --call "node scripts/gallery-server.mjs"')
const work = createWorkDir('wakeb-gallery-')
let packed
if (process.argv.includes('--tested-package')) {
  const receipt = JSON.parse(readFileSync(join(root, '.audit/browser/consumers.json'), 'utf8'))
  const archive = join(dirname(receipt.consumers.vuetify.dir), receipt.archive)
  const integrity = 'sha512-' + createHash('sha512').update(readFileSync(archive)).digest('base64')
  assert.equal(integrity, receipt.integrity, 'The browser-tested archive must match its receipt')
  const path = join(work, receipt.archive)
  copyFileSync(archive, path)
  packed = { path, filename: receipt.archive, integrity }
} else {
  console.log(run([npm, 'run', 'build'], root))
  packed = packTarball(work)
}
const evidence = { archive: packed.filename, integrity: packed.integrity, consumers: {} }
const servers = []
try {
  for (const [index, framework] of FRAMEWORKS.entries()) {
    const dir = join(work, framework)
    mkdirSync(join(dir, 'plugins'), { recursive: true })
    const peers = { vuetify: ['vuetify'], primevue: ['primevue', '@primeuix/themes'], shadcn: ['reka-ui'] }[framework]
    const versions = Object.fromEntries(['vue', 'vite', ...peers].map(name => [name, installedVersion(name)]))
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies: { 'wakeb-components': packed.path, ...versions } }))
    console.log(run([npm, 'install', '--ignore-scripts', '--no-audit', '--no-fund', ...offlineFlags()], dir))
    for (const file of readdirSync(join(root, 'examples/provider-gallery'))) copyFileSync(join(root, 'examples/provider-gallery', file), join(dir, file))
    writeFileSync(join(dir, 'plugins/wakeb-components.js'), `import { createWakebComponents } from 'wakeb-components'\nexport default createWakebComponents({ framework: '${framework}' })\n`)
    const { createServer } = await import(pathToFileURL(join(dir, 'node_modules/vite/dist/node/index.js')).href)
    const { wakebComponents } = await import(pathToFileURL(join(dir, 'node_modules/wakeb-components/dist/vite.js')).href)
    const port = 41801 + index
    const server = await createServer({ root: dir, configFile: false, plugins: [wakebComponents()], define: { __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: false, __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true }, server: { host: '127.0.0.1', port, strictPort: true } })
    await server.listen()
    servers.push(server)
    evidence.consumers[framework] = { dir, versions, url: `http://127.0.0.1:${port}/` }
    console.log(`${framework}: http://127.0.0.1:${port}/?lang=ar&theme=light`)
  }
  mkdirSync(join(root, '.audit/gallery'), { recursive: true })
  writeFileSync(join(root, '.audit/gallery/consumers.json'), JSON.stringify(evidence, null, 2) + '\n')
  console.log('All three isolated provider galleries are ready. Ctrl+C stops them together.')
} catch (error) {
  await Promise.all(servers.map(server => server.close()))
  throw error
}
const close = async () => { await Promise.all(servers.map(server => server.close())); process.exit() }
process.on('SIGINT', close)
process.on('SIGTERM', close)

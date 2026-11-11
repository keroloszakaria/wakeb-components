import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const work = mkdtempSync(join(tmpdir(), 'wakeb-mcp-'))
const run = (args, cwd = root, env = process.env) => execFileSync(process.execPath, args, { cwd, env, windowsHide: true, encoding: 'utf8', timeout: 120000 })
assert(process.env.npm_execpath, 'Use npm run check:agents:package')
const packed = JSON.parse(run([process.env.npm_execpath, 'pack', '--json', '--ignore-scripts', '--pack-destination', work], join(root, 'packages/mcp')))[0]
for (const path of ['server.mjs', 'catalog.json', 'LICENSE']) assert(packed.files.some(file => file.path === path), path)
assert(!packed.files.some(file => /node_modules|test\.mjs|\.env/.test(file.path)))
writeFileSync(join(work, 'package.json'), JSON.stringify({ private: true, type: 'module' }))
run([process.env.npm_execpath, 'install', '--ignore-scripts', '--no-audit', '--no-fund', join(work, packed.filename)], work)
console.log(run(['--test', 'packages/mcp/test.mjs'], root, { ...process.env, WAKEB_MCP_TEST_ENTRY: resolve(work, 'node_modules/wakeb-components-mcp/server.mjs') }))
console.log(`Packed MCP verified outside the repository: ${work}`)

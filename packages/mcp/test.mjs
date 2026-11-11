import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/client'
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio'

test('real stdio handshake, all contracts, bilingual resources, prompt and validation', async () => {
  const catalog = JSON.parse(readFileSync(new URL('./catalog.json', import.meta.url), 'utf8'))
  const transport = new StdioClientTransport({ command: process.execPath, args: [process.env.WAKEB_MCP_TEST_ENTRY ?? fileURLToPath(new URL('./server.mjs', import.meta.url))], cwd: tmpdir(), stderr: 'pipe' })
  let diagnostics = ''
  transport.stderr?.on('data', data => { diagnostics += data.toString() })
  const client = new Client({ name: 'wakeb-verification', version: '1.0.0' })
  try {
    await client.connect(transport)
    const tools = await client.listTools()
    assert.deepEqual(tools.tools.map(tool => tool.name).sort(), ['get_component', 'get_guide', 'list_components'])
    assert(tools.tools.every(tool => tool.annotations.readOnlyHint && !tool.annotations.openWorldHint))
    const call = (name, args) => client.callTool({ name, arguments: args })
    const listing = await call('list_components', {})
    assert.equal(listing.structuredContent.total, 39)
    assert.equal(listing.structuredContent.version, catalog.version)
    assert.equal(listing.structuredContent.status, 'unreleased')
    for (const entry of catalog.components) {
      const english = (await call('get_component', { name: entry.name })).structuredContent
      const arabic = (await call('get_component', { name: entry.slug, locale: 'ar' })).structuredContent
      assert.equal(english.name, entry.name)
      assert.equal(arabic.summary, entry.summary[1])
      assert.equal(english.props.length, entry.props.length)
      assert.deepEqual(english.events, entry.eventSignatures)
      assert.deepEqual(english.slots, entry.slotSignatures)
      assert.match(english.usage, /from 'wakeb-components'/)
      assert.match(arabic.example.source, /<template>/)
      const resource = await client.readResource({ uri: `wakeb://components/${entry.slug}/ar` })
      assert.deepEqual(JSON.parse(resource.contents[0].text), arabic)
    }
    assert((await call('list_components', { query: 'modelValue' })).structuredContent.total > 5)
    assert((await call('list_components', { query: 'نص', locale: 'ar' })).structuredContent.total > 0)
    assert.equal((await call('list_components', { query: 'does-not-exist' })).structuredContent.total, 0)
    assert.equal((await call('get_component', { name: '../package.json' })).isError, true)
    assert.equal((await call('get_component', { name: 'WAutocomplete' })).isError, true)
    assert.equal((await call('get_component', { name: 'WButton', locale: 'invalid' })).isError, true)
    for (const topic of Object.keys(catalog.guides)) for (const locale of ['en', 'ar']) {
      const guide = (await call('get_guide', { topic, locale })).structuredContent
      assert.equal(guide.markdown, catalog.guides[topic][locale === 'ar' ? 1 : 0])
    }
    const resources = await client.listResources()
    assert.equal(resources.resources.length, 79)
    const index = await client.readResource({ uri: 'wakeb://catalog' })
    assert.equal(JSON.parse(index.contents[0].text).components.length, 39)
    const prompts = await client.listPrompts()
    assert.equal(prompts.prompts[0].name, 'write_wakeb_component')
    const prompt = await client.getPrompt({ name: 'write_wakeb_component', arguments: { task: 'Build a review form', framework: 'primevue' } })
    assert.match(prompt.messages[0].content.text, /primevue/)
    assert.match(prompt.messages[0].content.text, /get_component/)
    assert.equal(diagnostics, '')
  } finally {
    await client.close()
  }
})

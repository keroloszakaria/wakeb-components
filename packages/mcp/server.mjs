#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { McpServer } from '@modelcontextprotocol/server'
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio'
import { z } from 'zod'

// Fixed, generated package data only: no workspace paths, shells or network calls.
const catalog = JSON.parse(readFileSync(new URL('./catalog.json', import.meta.url), 'utf8'))
const server = new McpServer({ name: 'wakeb-components', version: catalog.version }, { instructions: `Wakeb ${catalog.version} is an unreleased candidate. Discover components, read exact contracts, then get provider setup before writing code. Never assume a native provider API is a Wakeb API.` })
const locale = z.enum(['en', 'ar']).default('en')
const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
const result = value => ({ content: [{ type: 'text', text: JSON.stringify(value, null, 2) }], structuredContent: value })
const error = message => ({ isError: true, content: [{ type: 'text', text: message }] })
const metadata = { package: catalog.package, version: catalog.version, status: catalog.status }
function localized(entry, language) {
  const i = language === 'ar' ? 1 : 0
  return { ...metadata, name: entry.name, providers: catalog.providers, summary: entry.summary[i], props: entry.props.map(([name, type, defaultValue, en, ar]) => ({ name, type, default: defaultValue, description: i ? ar : en })), events: entry.eventSignatures, eventBehavior: entry.events?.[i] ?? (i ? 'لا أحداث مخصصة معلنة.' : 'No declared component events.'), slots: entry.slotSignatures, slotBehavior: entry.slots[i], cssVariables: entry.variables.map(([name, defaultValue]) => ({ name, default: defaultValue })), attributeTarget: entry.attrs[i], accessibilityAndLimits: entry.limits[i], keyboard: entry.keyboard.map(([key, en, ar]) => ({ key, behavior: i ? ar : en })), usage: entry.usage, example: { title: entry.recipe.title[i], description: entry.recipe.description[i], source: entry.recipe.source }, documentation: `https://wakeb-components.surge.sh/${i ? 'ar/' : ''}components/${entry.slug}` }
}
server.registerTool('list_components', { description: 'Find exported Wakeb components by name, purpose or prop in English or Arabic. Empty query lists all components.', inputSchema: z.object({ query: z.string().max(200).default(''), locale }), annotations }, async ({ query, locale }) => {
  const matches = catalog.components.filter(entry => [entry.name, entry.slug, ...entry.summary, ...entry.props.map(row => row[0])].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase()))
  return result({ ...metadata, components: matches.map(entry => ({ name: entry.name, summary: entry.summary[locale === 'ar' ? 1 : 0], slug: entry.slug })), total: matches.length })
})
server.registerTool('get_component', { description: 'Read exact Wakeb props, defaults, typed event/slot signatures, CSS variables, accessibility, provider limits and complete Vue examples. Accepts an export name or documented slug.', inputSchema: z.object({ name: z.string().min(1).max(100), locale }), annotations }, async ({ name, locale }) => {
  const entry = catalog.components.find(entry => [entry.name.toLowerCase(), entry.slug].includes(name.toLowerCase()))
  return entry ? result(localized(entry, locale)) : error(`Unknown Wakeb component: ${name}. Use list_components; no contract is inferred.`)
})
server.registerTool('get_guide', { description: 'Read installation, providers, customization, SSR, data models, agents or verification guidance in the requested language. The providers guide covers all three setups.', inputSchema: z.object({ topic: z.enum(Object.keys(catalog.guides)), locale }), annotations }, async ({ topic, locale }) => result({ ...metadata, topic, markdown: catalog.guides[topic][locale === 'ar' ? 1 : 0] }))
server.registerResource('catalog', 'wakeb://catalog', { description: 'Versioned component discovery index', mimeType: 'application/json' }, async uri => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify({ ...metadata, providers: catalog.providers, components: catalog.components.map(({ name, slug, summary }) => ({ name, slug, summary })) }) }] }))
for (const entry of catalog.components) for (const language of ['en', 'ar']) server.registerResource(`${entry.name}-${language}`, `wakeb://components/${entry.slug}/${language}`, { mimeType: 'application/json', description: `${entry.name} ${language} contract` }, async uri => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(localized(entry, language)) }] }))
server.registerPrompt('write_wakeb_component', { description: 'Prepare a Wakeb coding task using actual component contracts and provider integration.', argsSchema: z.object({ task: z.string().min(1).max(4000), framework: z.enum(['vuetify', 'primevue', 'shadcn']) }) }, ({ task, framework }) => ({ messages: [{ role: 'user', content: { type: 'text', text: `Implement this Vue 3 task: ${task}\nUse Wakeb Components ${catalog.version} (${catalog.status}), framework '${framework}'. Read get_guide(topic='providers') and discover components using list_components. Read get_component for every component used. Follow those exact props, models, events and slots, and return complete typed Vue SFCs. Keep app data and routing outside Wakeb. Preserve accessible names, keyboard interaction, RTL and focus behavior. Do not infer npm availability from this candidate catalog.` } }] }))

await server.connect(new StdioServerTransport())

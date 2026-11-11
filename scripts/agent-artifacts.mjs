import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import reference from '../docs/reference-data.mjs'
import recipes, { keyboard } from '../docs/recipes.mjs'
import { exampleSource } from './component-examples.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const source = ts.createSourceFile('contracts.ts', readFileSync(join(root, 'src/contracts.ts'), 'utf8'), ts.ScriptTarget.Latest, true)
const declarations = Object.fromEntries(source.statements.filter(node => ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)).map(node => [node.name.text, node]))
export function contractMembers(map, component) {
  const key = declarations[map].members.find(node => node.name.getText(source) === component)
  const declaration = declarations[key.type.getText(source)]
  return declaration.members?.map(node => ({ name: node.name?.getText(source).replaceAll('"', '') ?? `[${node.parameters.map(parameter => parameter.getText(source)).join(', ')}]`, signature: node.getText(source) })) ?? []
}
export const components = reference.map(entry => ({
  ...entry,
  eventSignatures: contractMembers('WakebComponentEmits', entry.name),
  slotSignatures: contractMembers('WakebComponentSlots', entry.name),
  usage: exampleSource(entry),
  recipe: { ...recipes[entry.name], source: exampleSource(entry, recipes[entry.name]) },
  keyboard: keyboard[entry.name] ?? [],
}))
export function generateAgentArtifacts() {
  const guides = Object.fromEntries(['installation', 'providers', 'customization', 'ssr', 'data-models', 'agents', 'verification'].map(slug => [slug, ['', 'ar/'].map(locale => readFileSync(join(root, 'docs', locale, 'guide', slug + '.md'), 'utf8'))]))
  const catalog = { schemaVersion: 1, package: pkg.name, version: pkg.version, status: 'unreleased', providers: ['vuetify', 'primevue', 'shadcn'], components, guides }
  writeFileSync(join(root, 'packages/mcp/catalog.json'), JSON.stringify(catalog, null, 2) + '\n')
  writeFileSync(join(root, 'packages/mcp/LICENSE'), readFileSync(join(root, 'LICENSE')))
  const folder = join(root, '.agents/skills/wakeb-components/references')
  mkdirSync(folder, { recursive: true })
  writeFileSync(join(folder, 'index.md'), `# Wakeb Components ${pkg.version} (unreleased)\n\n${components.map(entry => `- [${entry.name}](${entry.slug}.md): ${entry.summary[0]}`).join('\n')}\n`)
  for (const entry of components) {
    const props = entry.props.map(([name, type, fallback, en]) => `| \`${name}\` | \`${type.replaceAll('|', '\\|')}\` | \`${fallback}\` | ${en} |`).join('\n')
    const text = `# ${entry.name}\n\n${entry.summary[0]}\n\n## Usage\n\n\`\`\`vue\n${entry.usage}\`\`\`\n\n## Props\n\n| Prop | Type | Default | Meaning |\n| --- | --- | --- | --- |\n${props}\n\n## Events\n\n${entry.events?.[0] ?? 'No declared component events.'}\n\n\`\`\`ts\n${entry.eventSignatures.map(event => event.signature).join('\n')}\n\`\`\`\n\n## Slots\n\n${entry.slots[0]}\n\n\`\`\`ts\n${entry.slotSignatures.map(slot => slot.signature).join('\n')}\n\`\`\`\n\n## Attributes\n\n${entry.attrs[0]}\n\n## CSS variables\n\n${entry.variables.map(([name, fallback]) => `- \`${name}\`: ${fallback}`).join('\n') || 'No component-specific CSS variables.'}\n\n## Accessibility and limits\n\n${entry.limits[0]}\n\n## ${entry.recipe.title[0]}\n\n${entry.recipe.description[0]}\n\n\`\`\`vue\n${entry.recipe.source}\`\`\`\n`
    writeFileSync(join(folder, entry.slug + '.md'), text)
  }
  // Keep guide cross-references useful when the skill is used offline in another project.
  for (const file of readdirSync(join(root, 'docs/guide')).filter(file => file.endsWith('.md'))) {
    let markdown = readFileSync(join(root, 'docs/guide', file), 'utf8');
    markdown = markdown.replace(/\]\(\.\/([\w-]+)(#[^)]*)?\)/g, ']($1.md$2)')
      .replace(/\]\(\.\.\/components\/([^)]*)\)/g, ']($1.md)');
    writeFileSync(join(folder, file), markdown);
  }
  console.log(`Generated versioned agent catalog and skill references for ${components.length} components.`)
}

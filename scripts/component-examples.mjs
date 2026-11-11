import reference from '../docs/reference-data.mjs'
import recipes from '../docs/recipes.mjs'

// One copyable SFC contract for the site, packed-consumer compilation and the agent catalog.
export function exampleSource(entry, variant) {
  const template = variant?.template ?? entry.example
  const names = [...new Set(template.match(/\bW[A-Z]\w+/g) ?? [entry.name])]
  return `<script setup lang="ts">\nimport { ${names.join(', ')} } from 'wakeb-components'${(variant?.setup ?? entry.setup) ? '\n' + (variant?.setup ?? entry.setup) : ''}\n</script>\n\n<template>\n  ${template}\n</template>\n`
}

export const examples = reference.flatMap(entry => [
  { name: entry.name, slug: entry.slug, source: exampleSource(entry) },
  { name: entry.name + 'Recipe', slug: entry.slug, source: exampleSource(entry, recipes[entry.name]) },
])

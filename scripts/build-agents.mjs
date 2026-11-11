import { fileURLToPath } from 'node:url'
import { generateAgentArtifacts } from './agent-artifacts.mjs'
import { writeComponentPages } from './component-pages.mjs'
writeComponentPages(fileURLToPath(new URL('..', import.meta.url)))
generateAgentArtifacts()

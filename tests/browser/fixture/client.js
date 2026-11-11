import { nextTick } from 'vue'
import { createRoots } from './app.js'
import 'wakeb-components/style.css'
import './fixture.css'

window.__wakebDiagnostics = { warnings: [], errors: [], hydrated: false }
const options = JSON.parse(document.querySelector('#fixture-options').textContent)
const roots = createRoots(options, window.__wakebDiagnostics.warnings)
window.__wakebHarness = roots.map(root => root.state)
window.__wakebUnmount = () => roots.forEach(root => root.app.unmount())
window.__wakebHydrate = async () => {
  roots.forEach((root, index) => root.app.mount(`#app-${index}`))
  await nextTick()
  window.__wakebDiagnostics.hydrated = true
}
window.__wakebReady = true
if (options.hydrate !== 'manual') await window.__wakebHydrate()

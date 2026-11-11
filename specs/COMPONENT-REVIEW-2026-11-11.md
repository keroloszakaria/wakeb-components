# Component review — 2026-11-11

Reviewed the local **0.8.0-alpha.0 working tree**: all 39 public component facades
on Vuetify, PrimeVue and shadcn-vue. Existing local implementation work was preserved.
This record describes local verification, not an npm release or docs deployment.

## Corrections

- Removed the package's circular dependency on its own local documentation tarball;
  installed consumers previously failed with ENOENT outside the checkout.
- Bound ordinary PrimeVue/shadcn WPopover attributes explicitly to the activator
  anchor. PrimeVue's fragment root previously dropped theme/DOM attributes and warned.
- Restored shadcn WPopover focus to the actual opener after inside dismissal.
- Added forwarded HTML/ARIA attributes and native listeners to the public facade
  type. Kept a separate renderer contract so exact prop/event/slot conformance and
  negative type fixtures still detect drift.
- Fixed incomplete documentation examples, including missing component imports,
  undeclared variables, unsafe rule assumptions and model/event union types.
- Fixed the CSS isolation check's selector-list parsing for Vite 8's nested RTL
  `:where(:lang(...), ...)` fallbacks. Tests still reject leaked global selectors.

## Verification

| Check | Result |
| --- | --- |
| `npm run check` | Passed: typecheck, builds, contracts, installed package, browser matrix, agent integration and bilingual docs. |
| Final `npm test` | 1,348 passed; 149 existing skips unchanged from the initial baseline. |
| Final `npm run typecheck` | Passed, including renderer conformance and its intentional invalid-contract fixtures. |
| Strict installed examples | 78 complete Vue SFCs, with `strictTemplates`, compiled/built on each provider outside the repository. |
| Browser contracts | 552 passed, no skips or retries: 23 scenarios × 3 providers × 2 modes × 2 directions × 2 viewports. All 39 components hydrate in the fixture. |
| Documentation UI | 24 passed: Accordion, DataTable and agent guide × English/Arabic × light/dark × wide/small. Downloads resolve; code remains LTR and pages have no viewport overflow. Representative screenshots inspected. |
| Locked peers | All six minimum/current installations passed, including typed examples, SSR/browser builds, provider isolation and tree shaking. |
| MCP | Official SDK client verified all 39 contracts, 79 resources, 3 tools, prompt, bilingual guides and errors over stdio; repeated against a tarball installed outside the checkout. |
| Skill | Validated with the skill-creator validator and installed in the personal Codex skill directory. |

The peer matrix uses Vue 3.5.40/3.5.45 and Vite 6.0.0/8.3.6;
Vuetify 3.13.2/3.13.7; PrimeVue 4.5.5 with @primeuix/themes 2.0.3;
and Reka UI 2.10.5/2.11.0. The committed locks and
[`results.json`](../tests/fixtures/peers/results.json) are the precise version record.

Local evidence: `.audit/final-check.log`, `.audit/final-unit.log`,
`.audit/strict-types.log`, `.audit/strict-examples.log`, `.audit/peers-review.log`,
`.audit/browser/results.json`, `.audit/docs/results.json` and `.audit/mcp-package.log`.

## Documentation and agent artifacts

The bilingual reference covers **353 component props**, typed events and slots,
CSS variables, attribute targets, keyboard behavior and provider limits. Each
component has a live Vuetify preview and two copyable examples. The layout method
uses the user-supplied shadcn-vue Accordion and PrimeVue AutoComplete references;
the examples describe Wakeb's own API.

- [Arabic agent setup](../docs/ar/guide/agents.md) / [English](../docs/guide/agents.md)
- [Arabic coverage and limits](../docs/ar/guide/verification.md) / [English](../docs/guide/verification.md)
- [Skill source](../.agents/skills/wakeb-components/SKILL.md)
- [MCP server](../packages/mcp/server.mjs)

`npm run agents:build` regenerates the shared catalog/references. `npm run docs:build`
also creates the skill ZIP, standalone MCP tarball and library tarball under
`docs/public/downloads`, then inventories the built site's hashes.

Browser evidence is Chromium-only. Manual screen-reader testing, Firefox/WebKit
and physical touch-device testing were not performed. Documentation previews use
Vuetify; independent consumer/browser tests cover the other two providers.

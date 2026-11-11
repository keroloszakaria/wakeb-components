---
name: wakeb-components
description: Build Vue 3 interfaces with Wakeb Components on Vuetify, PrimeVue or shadcn-vue, using verified props, events, slots, provider setup and accessibility contracts. Use when consuming wakeb-components or migrating an existing Wakeb interface.
---

# Wakeb Components

This skill describes the local **0.8.0-alpha.0 candidate**, not the public 0.7 API.
Match the installed package version before applying its provider integration.

For discovery, read [the component index](references/index.md). Read only the
reference files for the components needed by the task. Each contains complete
Vue SFC examples, defaults, typed events/slots, CSS variables and provider limits.
If the Wakeb MCP is connected, `list_components`, `get_component` and
`get_guide` provide the same versioned data with English/Arabic descriptions.

For setup or provider changes read [providers](references/providers.md).
Select exactly one literal `framework: 'vuetify' | 'primevue' | 'shadcn'` in
`plugins/wakeb-components.js`, enable `wakebComponents()` from
`wakeb-components/vite`, install the runtime plugin and import
`wakeb-components/style.css` once. Existing hosts install their provider first.
Install only the selected provider's peers; shadcn uses Reka UI and precompiled
Wakeb CSS. Keep Vue and provider packages as peers when building a library.

Use named component and type imports from `wakeb-components`. Do not import
renderers or `_internal` entries. Public Wakeb contracts take precedence over
native provider APIs: `WButton` uses `title`, `type` for visual style and `action`
for native button behavior; `WTabs` uses `selectedTab`/`updateTab`, not v-model;
`WTree` emits `toggle` and the caller owns `expandedKeys`; `WDataTable` emits
`update:options` and the caller sorts/pages/fetches the rows. Check each reference
before choosing model bindings, slots or event payloads. Do not invent components
such as WSelect or WAutocomplete.

Prefer typed props, slots, ordinary attributes and `--wakeb-*` variables.
Use [customization](references/customization.md) for defaults, tokens and the
explicitly nonportable `providerProps` escape hatch. App data, callbacks and
controlled state belong on component instances, not plugin defaults. Keep stores,
routing, i18n instances, app aliases and Aware compatibility adapters in the app.
Use root named imports from `wakeb-utils` when needed.

Give icon-only controls and overlays accessible names. Bind activator/trigger
slot props to native controls. Preserve keyboard access, focus return and logical
start/end placement. Read [SSR](references/ssr.md) for hydration and multiple-app
ID scoping, and [data models](references/data-models.md) for structured values.

Validate changes with the consuming app's typecheck and relevant interaction
checks on its chosen provider. When editing this library, follow its AGENTS.md
and run `npm run check`; it compiles the documentation examples and verifies
packed, isolated consumers on all three providers. Documentation builds and local
archives do not establish npm publication or authorize publishing.

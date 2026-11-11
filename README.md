# wakeb-components

39 typed Vue 3 components, with one API across Vuetify, PrimeVue and shadcn-vue in the local 0.8.0-alpha.0 candidate:
WTruncatedText, WSegmentedProgress, WSemiCircleGauge, WAvatarStack, WLoading, WPageSkeleton, WVerticalSteps, WButton, WBadge, WAccordion, WBadgeStack, WUserBadge, WTooltipBtn, WTabs, WTree, WDropdown, WCarousel, WExportDropdown, WBaseSidebar, WModal, WDrawer, WTextField, WPopover, WSwitch, WCheckbox, WSkeleton, WRow, WCol, WProgressLinear, WTextarea, WButtonToggle, WCard, WDivider, WList, WIcon, WImage, WAvatar, WCountBadge and WDataTable.

[Documentation](https://wakeb-components.surge.sh) · [العربية](https://wakeb-components.surge.sh/ar/)

## Installation

Install the public npm package in your Vue application:

```sh
npm install wakeb-components@0.7.0
```

Use Vue 3.5+ and Vuetify 3.13.2+, and keep your existing Vuetify plugin setup.
Import styles once in the application entry:

```ts
import 'vuetify/styles'
import 'wakeb-components/style.css'
```

```vue
<script setup lang="ts">
import { WTruncatedText, WSegmentedProgress, WSemiCircleGauge } from 'wakeb-components'
</script>
<template>
  <WTruncatedText label="A shared foundation for every team" :length="20" />
  <WSegmentedProgress :value="65" label="65%" />
  <WSemiCircleGauge :value="75" label="75%" sub-label="Quality" />
</template>
```

Named exports support normal Vite tree shaking. Vue and Vuetify are external
peer dependencies. Wakeb Utils 0.1.1 is the only runtime dependency.
Customize with props, slots, DOM attributes and namespaced CSS variables.
No store, router, application alias, application tokens or global service is required.

Vuetify icon values use your existing icon set/font. Icon slots let you supply your own SVG or company icon component. No icon dependency is bundled.

## Verification

Use Node 22.14+, run `npm ci`, install Chromium with `npx playwright install chromium`,
then run `npm run check`. The check builds the
ESM library and declarations, runs actual Vuetify/SSR tests, installs a packed
archive in an isolated Vite consumer, checks types, builds browser and server
consumers, executes real Chromium interaction and SSR hydration tests for all three
providers across light/dark, LTR/RTL and small/wide viewports, and builds bilingual
VitePress documentation. `npm run test:browser` runs the browser suite alone;
reports, screenshots and diagnostics are saved in `.audit/browser`.

This is an ESM library for Vue bundlers. Vite SSR consumers bundle this package
and Vuetify using `ssr.noExternal`; see the SSR guide. It is not a plain Node
CommonJS library.

Automated verification and documentation publication use Jervis DevOps.
The production output is `docs/.vitepress/dist` at `wakeb-components.surge.sh`.

## Scope

Version 0.7.0 covers twenty-one display, action and disclosure components. Tables, forms, routing and permissions remain in their current packages/application
until their separate contracts are reviewed.

## License

MIT. See LICENSE.

WModal and WDrawer provide dialog and temporary drawer shells with typed models, explicit loading slots and no form, router or permission dependency. WDrawer is a modal dialog drawer that needs no VApp or layout host. See the bilingual overlay examples and native behavior limits in the docs.

## Coding agents

See [the agent guide](docs/guide/agents.md) and [verification scope](docs/guide/verification.md). `npm run agents:build` generates the skill under `.agents/skills/wakeb-components` and the independent MCP catalog under `packages/mcp`. `npm run test:agents` verifies stdio discovery and contracts. The MCP is read-only and has no workspace, shell or network tools. Its candidate archive is not published to npm.

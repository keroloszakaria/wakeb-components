# WAccordion

Disclosure panels with preserved content, scoped headers and keyboard-ready default triggers.

## Usage

```vue
<script setup lang="ts">
import { WAccordion } from 'wakeb-components'
</script>

<template>
  <WAccordion title="Details" after-icon :model-value="true"><p>Persistent panel content</p></WAccordion>
</template>
```

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `title` | `string` | `""` | Default title and accessible toggle name. |
| `modelValue` | `boolean` | `false` | Initial/external open state; internal clicks remain usable without parent updates. |
| `classList` | `ComponentClass` | `""` | Classes on the accordion root. |
| `icon` | `SharedIcon` | `"$expand"` | Indicator icon supplied to WButton or toggleIcon. |
| `noBorder` | `boolean` | `false` | Remove outer border and radius. |
| `beforeIcon` | `boolean` | `false` | Show a toggle before the title. |
| `afterIcon` | `boolean` | `false` | Show a toggle after the title. |
| `iconColor` | `WakebColor` | `undefined` | Indicator color override. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color. |
| `iconSize` | `string \| number` | `"sm"` | Indicator icon size. |
| `maxIconWidth` | `string \| number` | `"100%"` | Indicator maximum width. |
| `headerTitleClassList` | `ComponentClass` | `""` | Classes on the default title trigger. |
| `headerClassList` | `ComponentClass` | `""` | Classes on the clickable header. |
| `bodyClassList` | `ComponentClass` | `""` | Classes on the retained body. |
| `transparent` | `boolean` | `false` | Transparent outer background. |
| `toggleLabel` | `string` | `""` | Localized toggle name; fallback is title, then Toggle section. |
| `contentId` | `string` | `""` | Explicit panel ID; otherwise a stable Vue useId-based ID. |

## Events

`update:modelValue(value: boolean)` — emitted only by local toggle actions.

```ts
"update:modelValue": [value: boolean];
```

## Slots

`header`: `{ open, toggle, triggerProps }`; bind triggerProps to a native button for keyboard/ARIA behavior. `actions`: `{ open, toggle }`, isolated from header clicks. `default`: `{ open }`, retained with v-show. `toggleIcon`: `{ icon, size, color, maxWidth }`. Indicators inherit the documented WButton CSS variables.

```ts
header(props: { open: boolean; toggle: () => void; triggerProps: AccordionTriggerProps }): unknown;
actions(props: { open: boolean; toggle: () => void }): unknown;
default(props: { open: boolean }): unknown;
toggleIcon(props: IconSlotProps): unknown;
```

## Attributes

The root `div.accordion`. The toggle button keeps Wakeb's aria-expanded and aria-controls. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## CSS variables

- `--wakeb-accordion-background`: #fff
- `--wakeb-accordion-body-background`: #fff
- `--wakeb-accordion-border`: #d0d5dd
- `--wakeb-accordion-fallback`: not defined (normal per-token defaults)
- `--wakeb-accordion-focus`: #087f8c
- `--wakeb-accordion-hover-rgb`: 249, 250, 251
- `--wakeb-accordion-radius`: 12px
- `--wakeb-accordion-title`: #101828

## Accessibility and limits

The default title is a native button with aria-expanded/aria-controls; pointer clicks elsewhere on the header also toggle. Icon toggles stop propagation so one activation emits one update. Actions never toggle the panel. Custom headers must supply their own accessible control via triggerProps; stop unrelated interactive header controls from bubbling. The body uses v-show, retaining nested form state. Parent modelValue changes synchronize local state without echoing an update event; local clicks also work when a parent supplies a constant value. Vue useId is stable per application/SSR request; use unique app.config.idPrefix values for multiple independent Vue apps. Motion respects reduced-motion preferences. Indicator rotation preserves 180deg when closed and 0deg when open. The compatibility --wakeb-accordion-fallback switch is reserved for adapters. When a title is set, the panel is a region named by it. PrimeVue renders the same Wakeb disclosure markup and uses the PrimeVue WButton for the icon toggles; it does not use PrimeVue's Accordion component, so there is no PrimeVue panel model or header DOM. Under shadcn-vue the same Wakeb disclosure renders; the indicators are WButton (the shadcn-vue Button, data-slot="button") and the closed panel stays mounted with v-show. reka-ui Collapsible is not used because it unmounts a closed panel. Default surfaces and text use the scoped Wakeb surface/on-surface tokens, including dark mode; component-specific CSS variables still win.

## Controlled disclosure

The model receives local toggles. Closing retains the input value.

```vue
<script setup lang="ts">
import { WAccordion } from 'wakeb-components'
import { ref } from 'vue'
const expanded = ref(false)
const address = ref('Cairo')
</script>

<template>
  <WAccordion v-model="expanded" title="Shipping"><input v-model="address" aria-label="Address" /></WAccordion>
  <p>Open: {{ expanded }}; address: {{ address }}</p>
</template>
```

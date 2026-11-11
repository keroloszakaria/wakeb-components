<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WPopover

A non-modal panel anchored to an activator, for filters and small forms that stay open while you work in them.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<FormsPlayground initial="popover" />

## Usage

```vue
<script setup lang="ts">
import { WPopover } from 'wakeb-components'
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <WPopover v-model="open" aria-label="Filters">
    <template #activator="{ props }"><button type="button" v-bind="props">Filters</button></template>
    <template #default="{ close }"><button type="button" @click="close">Done</button></template>
  </WPopover>
</template>
```

## Examples

### Close explicitly

Bind activator props; close through the scoped slot callback.

```vue
<script setup lang="ts">
import { WPopover } from 'wakeb-components'
</script>

<template>
  <WPopover aria-label="Help" :close-on-content-click="false"><template #activator="{ props }"><button type="button" v-bind="props">Help</button></template><template #default="{ close }"><p>Helpful details</p><button type="button" @click="close">Done</button></template></WPopover>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `undefined` | Open state. Without it the popover keeps its own state; each local change emits once. |
| `location` | `WakebPopoverLocation` | `"bottom start"` | Side and logical alignment relative to the activator; start and end follow the direction. |
| `offset` | `number` | `0` | Gap in pixels between the activator and the panel. |
| `disabled` | `boolean` | `false` | Never opens; disabling an open popover closes it. |
| `closeOnContentClick` | `boolean` | `false` | Close after any click inside the panel. |
| `ariaLabel` | `string` | `undefined` | Already translated accessible name of the dialog panel. |
| `contentClass` | `ComponentClass` | `undefined` | Classes on the panel. |
| `contentStyle` | `CSSProperties` | `undefined` | Inline styles on the panel, applied last. |

## Events

`update:modelValue(value: boolean)` when the activator, the `close` callback, Escape, an outside click or `disabled` changes the open state. Parent model changes do not emit.

```ts
"update:modelValue": [value: boolean];
```

## Slots

`activator {props,isActive}`: bind `props` on your button; they toggle the panel and carry aria-haspopup="dialog", aria-expanded and aria-controls. `default {close}`: the panel content; call `close()` to dismiss it.

```ts
activator?(props: { props: Record<string, unknown>; isActive: boolean }): unknown;
default?(props: { close: () => void }): unknown;
```

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-popover-background` | `var(--wakeb-ui-surface, rgb(var(--v-theme-surface, 255, 255, 255)))` |
| `--wakeb-popover-border` | `0` |
| `--wakeb-popover-radius` | `4px` |
| `--wakeb-popover-shadow` | `Vuetify menu elevation` |

## Attribute target

Vuetify attributes fall through to VMenu. On PrimeVue and shadcn-vue they bind to the inline activator anchor span, including class, style, id, data-* and DOM listeners; they do not reach the panel or the slotted button. Use contentClass and contentStyle for the panel and the activator slot props for the button. The panel (.wakeb-popover) is teleported to the body with the Wakeb theme scope and zIndexOverlay.

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Enter / Space` | Activate a native button bound to activator props. |
| `Escape` | Close the popup. |

## Accessibility and limits

The panel is a non-modal role=dialog with aria-modal=false and the ariaLabel name. Focus moves into the panel when it opens, Tab is not trapped, Escape and outside clicks close it, and focus returns to the activator when it closes from inside. Content clicks keep it open unless closeOnContentClick is set. Vuetify: rendered with VMenu. PrimeVue: rendered with Popover, which positions the panel below the activator and flips it above when there is no room, so location and offset only partly apply; the activator is wrapped in an inline-block span. shadcn-vue: rendered with reka-ui Popover and the shadcn-vue PopoverContent; the activator is wrapped in an inline-block span. Hover opening, arrows and nested modal behavior are not part of the contract.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

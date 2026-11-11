<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WSkeleton

A loading placeholder drawn from the portable skeleton grammar; when loading ends it renders its default slot.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ElementsPlayground initial="skeleton" />

## Usage

```vue
<script setup lang="ts">
import { WSkeleton } from 'wakeb-components'
</script>

<template>
  <WSkeleton type="list-item-avatar-two-line@3" width="320" />
</template>
```

## Examples

### Reveal content

Set loading to false to show the default slot.

```vue
<script setup lang="ts">
import { WSkeleton } from 'wakeb-components'
</script>

<template>
  <WSkeleton :loading="false" type="paragraph"><p>Loaded content</p></WSkeleton>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `"text"` | Comma-separated portable skeleton names (text, paragraph, heading, avatar, image, button, chip, list-item, list-item-avatar, list-item-two-line, list-item-three-line, list-item-avatar-two-line, list-item-avatar-three-line, table, table-row, card), each optionally followed by @N (capped at 100). |
| `width` | `string \| number` | `undefined` | Box width; numbers and numeric strings are px. |
| `height` | `string \| number` | `undefined` | Box height; numbers and numeric strings are px. |
| `loading` | `boolean` | `true` | While true the bones render; false renders the default slot instead (nothing without one). |
| `label` | `string` | `"Loading..."` | Accessible name of the status; the default follows the plugin locale (Arabic: جارٍ التحميل...). |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

`default` (no payload) is the loaded content, rendered while `loading` is false.

```ts
default?(): unknown;
```

## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Attributes and listeners reach the skeleton root while loading. Wakeb binds role, aria-busy and aria-label after them, so those stay Wakeb-owned. When loading is false nothing of the skeleton renders and attrs are not applied to the slot content.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

The root is role=status with aria-busy=true and an aria-label; the bones are decorative. Unknown names are skipped with WAKEB_UNKNOWN_VALUE, and an empty result draws `text`. Vuetify: rendered with VSkeletonLoader, which also accepts Vuetify-only names (divider, article, sentences...) with WAKEB_DEPRECATED_VALUE; its own role=alert is replaced by the Wakeb status. PrimeVue: the shared Wakeb bone shapes drawn with PrimeVue Skeleton in unstyled mode and the Wakeb wave; Vuetify-only names are skipped. shadcn-vue: the same shapes with the shadcn-vue Skeleton look (accent color, radius, pulse); Vuetify-only names are skipped. Shapes approximate the Vuetify layouts; sizes are close, not pixel-identical.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

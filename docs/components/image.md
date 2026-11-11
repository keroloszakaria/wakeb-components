<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WImage

A responsive image with an aspect ratio, cover fitting, lazy loading and a placeholder slot.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ElementsPlayground initial="image" />

## Usage

```vue
<script setup lang="ts">
import { WImage } from 'wakeb-components'
</script>

<template>
  <WImage src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%23087f8c'/%3E%3C/svg%3E" alt="Camera placeholder" aspect-ratio="16/9" cover />
</template>
```

## Examples

### Placeholder slot

Supply useful alternative text and a placeholder while loading.

```vue
<script setup lang="ts">
import { WImage } from 'wakeb-components'
</script>

<template>
  <WImage src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E" alt="Camera placeholder" :width="240"><template #placeholder>Loading image</template></WImage>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | `undefined` | Image URL: http(s), relative, blob or data:image; other schemes are not rendered. |
| `alt` | `string` | `""` | Already translated alternative text; empty makes the image decorative. |
| `width` | `number \| string` | `undefined` | Box width; numbers are px. |
| `height` | `number \| string` | `undefined` | Box height; numbers are px. |
| `aspectRatio` | `number \| string` | `undefined` | Width / height as a number (1.5) or a ratio (16/9). |
| `cover` | `boolean` | `false` | Fills the box and crops (object-fit cover) instead of fitting inside it. |
| `lazy` | `boolean` | `true` | Loads when near the viewport; false loads at once. |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

`placeholder` (no payload) shows while the image loads and when it fails.

```ts
placeholder?(): unknown;
```

## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Ordinary attrs and listeners reach the image box (`.wakeb-image`), not the img element.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

No srcset, gradient or zoom preview. Vuetify: VImg, which names the box role=img with the alt text and lazy-loads with IntersectionObserver unless lazy is false. PrimeVue and shadcn-vue: Wakeb markup, a box around a native img with loading=lazy|eager and decoding=async.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

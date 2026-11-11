# WImage

A responsive image with an aspect ratio, cover fitting, lazy loading and a placeholder slot.

## Usage

```vue
<script setup lang="ts">
import { WImage } from 'wakeb-components'
</script>

<template>
  <WImage src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%23087f8c'/%3E%3C/svg%3E" alt="Camera placeholder" aspect-ratio="16/9" cover />
</template>
```

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `src` | `string` | `undefined` | Image URL: http(s), relative, blob or data:image; other schemes are not rendered. |
| `alt` | `string` | `""` | Already translated alternative text; empty makes the image decorative. |
| `width` | `number \| string` | `undefined` | Box width; numbers are px. |
| `height` | `number \| string` | `undefined` | Box height; numbers are px. |
| `aspectRatio` | `number \| string` | `undefined` | Width / height as a number (1.5) or a ratio (16/9). |
| `cover` | `boolean` | `false` | Fills the box and crops (object-fit cover) instead of fitting inside it. |
| `lazy` | `boolean` | `true` | Loads when near the viewport; false loads at once. |

## Events

No declared component events.

```ts

```

## Slots

`placeholder` (no payload) shows while the image loads and when it fails.

```ts
placeholder?(): unknown;
```

## Attributes

Ordinary attrs and listeners reach the image box (`.wakeb-image`), not the img element.

## CSS variables

No component-specific CSS variables.

## Accessibility and limits

No srcset, gradient or zoom preview. Vuetify: VImg, which names the box role=img with the alt text and lazy-loads with IntersectionObserver unless lazy is false. PrimeVue and shadcn-vue: Wakeb markup, a box around a native img with loading=lazy|eager and decoding=async.

## Placeholder slot

Supply useful alternative text and a placeholder while loading.

```vue
<script setup lang="ts">
import { WImage } from 'wakeb-components'
</script>

<template>
  <WImage src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E" alt="Camera placeholder" :width="240"><template #placeholder>Loading image</template></WImage>
</template>
```

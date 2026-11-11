<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WAvatar

One person's avatar: a photo, or initials on a color.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ElementsPlayground initial="avatar" />

## Usage

```vue
<script setup lang="ts">
import { WAvatar } from 'wakeb-components'
</script>

<template>
  <WAvatar name="Grace Hopper" size="32" />
</template>
```

## Examples

### Custom content

Override the initials through the default slot.

```vue
<script setup lang="ts">
import { WAvatar } from 'wakeb-components'
</script>

<template>
  <WAvatar name="Engineering" :size="40">ENG</WAvatar>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `image` | `string` | `undefined` | Photo URL (http(s), relative, blob or data:image). |
| `name` | `string` | `undefined` | The person's name: the accessible name and the source of the initials (first letter of the first two words). |
| `size` | `number \| string` | `40` | Size in px, or x-small, small, default, large or x-large (24–56px). |
| `color` | `WakebColor` | `"primary"` | Background behind the initials: a Wakeb intent or a CSS color. |
| `rounded` | `boolean` | `true` | Circle; false gives a rounded square. |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

`default` (no payload) replaces the initials when there is no image.

```ts
default?(): unknown;
```

## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Ordinary attrs and listeners reach the avatar root.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

With a name the avatar is role=img named by it and the photo and initials are hidden from assistive technology; without a name it is aria-hidden. Initials text is white over the color. Vuetify: VAvatar with VImg. PrimeVue: Avatar sized and colored by Wakeb. shadcn-vue: the reka-ui Avatar with the shadcn-vue styles; initials show until the photo has loaded and when it fails.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

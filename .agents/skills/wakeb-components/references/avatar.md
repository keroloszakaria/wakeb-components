# WAvatar

One person's avatar: a photo, or initials on a color.

## Usage

```vue
<script setup lang="ts">
import { WAvatar } from 'wakeb-components'
</script>

<template>
  <WAvatar name="Grace Hopper" size="32" />
</template>
```

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `image` | `string` | `undefined` | Photo URL (http(s), relative, blob or data:image). |
| `name` | `string` | `undefined` | The person's name: the accessible name and the source of the initials (first letter of the first two words). |
| `size` | `number \| string` | `40` | Size in px, or x-small, small, default, large or x-large (24–56px). |
| `color` | `WakebColor` | `"primary"` | Background behind the initials: a Wakeb intent or a CSS color. |
| `rounded` | `boolean` | `true` | Circle; false gives a rounded square. |

## Events

No declared component events.

```ts

```

## Slots

`default` (no payload) replaces the initials when there is no image.

```ts
default?(): unknown;
```

## Attributes

Ordinary attrs and listeners reach the avatar root.

## CSS variables

No component-specific CSS variables.

## Accessibility and limits

With a name the avatar is role=img named by it and the photo and initials are hidden from assistive technology; without a name it is aria-hidden. Initials text is white over the color. Vuetify: VAvatar with VImg. PrimeVue: Avatar sized and colored by Wakeb. shadcn-vue: the reka-ui Avatar with the shadcn-vue styles; initials show until the photo has loaded and when it fails.

## Custom content

Override the initials through the default slot.

```vue
<script setup lang="ts">
import { WAvatar } from 'wakeb-components'
</script>

<template>
  <WAvatar name="Engineering" :size="40">ENG</WAvatar>
</template>
```

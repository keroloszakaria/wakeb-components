# WCard

A surface with an optional title, subtitle and actions row.

## Usage

```vue
<script setup lang="ts">
import { WCard } from 'wakeb-components'
</script>

<template>
  <WCard title="Camera" subtitle="Gate 3" variant="outlined">Online</WCard>
</template>
```

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | Already translated title. |
| `subtitle` | `string` | `undefined` | Already translated subtitle under the title. |
| `variant` | `"elevated" \| "flat" \| "outlined"` | `"elevated"` | Shadow, no shadow or a border without a shadow. |
| `padded` | `boolean` | `true` | Pads the default slot; false lets the content reach the edges (images, tables). |

## Events

No declared component events.

```ts

```

## Slots

`default` (no payload): the content. `title` (no payload) replaces the title text. `actions` (no payload) is a row at the bottom.

```ts
default?(): unknown;
title?(): unknown;
actions?(): unknown;
```

## Attributes

Ordinary attrs and listeners reach the card root (`.wakeb-card`) on every provider.

## CSS variables

No component-specific CSS variables.

## Accessibility and limits

The title is a styled text block, not a heading; put a heading element in the title slot when the page outline needs one. There is no image, loading or link mode. Vuetify: rendered with VCard (VCardTitle, VCardSubtitle, VCardText, VCardActions) and its elevation, flat and outlined variants. PrimeVue: rendered with Card; flat removes the shadow and outlined draws a border. shadcn-vue: the shadcn-vue Card markup and styles.

## Card actions

Compose actions through a slot.

```vue
<script setup lang="ts">
import { WCard, WButton } from 'wakeb-components'
</script>

<template>
  <WCard title="Report" variant="outlined"><p>Ready to review</p><template #actions><WButton title="Review" /></template></WCard>
</template>
```

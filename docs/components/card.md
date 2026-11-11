<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WCard

A surface with an optional title, subtitle and actions row.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ElementsPlayground initial="card" />

## Usage

```vue
<script setup lang="ts">
import { WCard } from 'wakeb-components'
</script>

<template>
  <WCard title="Camera" subtitle="Gate 3" variant="outlined">Online</WCard>
</template>
```

## Examples

### Card actions

Compose actions through a slot.

```vue
<script setup lang="ts">
import { WCard, WButton } from 'wakeb-components'
</script>

<template>
  <WCard title="Report" variant="outlined"><p>Ready to review</p><template #actions><WButton title="Review" /></template></WCard>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | Already translated title. |
| `subtitle` | `string` | `undefined` | Already translated subtitle under the title. |
| `variant` | `"elevated" \| "flat" \| "outlined"` | `"elevated"` | Shadow, no shadow or a border without a shadow. |
| `padded` | `boolean` | `true` | Pads the default slot; false lets the content reach the edges (images, tables). |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

`default` (no payload): the content. `title` (no payload) replaces the title text. `actions` (no payload) is a row at the bottom.

```ts
default?(): unknown;
title?(): unknown;
actions?(): unknown;
```

## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Ordinary attrs and listeners reach the card root (`.wakeb-card`) on every provider.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

The title is a styled text block, not a heading; put a heading element in the title slot when the page outline needs one. There is no image, loading or link mode. Vuetify: rendered with VCard (VCardTitle, VCardSubtitle, VCardText, VCardActions) and its elevation, flat and outlined variants. PrimeVue: rendered with Card; flat removes the shadow and outlined draws a border. shadcn-vue: the shadcn-vue Card markup and styles.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

# WRow

A row of the Wakeb 12-column grid; place WCol children inside it.

## Usage

```vue
<script setup lang="ts">
import { WRow, WCol } from 'wakeb-components'
</script>

<template>
  <WRow dense align="center">
  <WCol cols="12" md="6">Start</WCol>
  <WCol cols="12" md="6">End</WCol>
</WRow>
</template>
```

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `dense` | `boolean` | `false` | 4px gutters instead of 12px. |
| `noGutters` | `boolean` | `false` | No gutters; wins over dense. |
| `align` | `"start" \| "center" \| "end" \| "baseline" \| "stretch"` | `undefined` | Cross-axis alignment of the columns (align-items). |
| `justify` | `"start" \| "center" \| "end" \| "space-between" \| "space-around" \| "space-evenly"` | `undefined` | Main-axis distribution of the columns (justify-content); start and end follow the direction. |

## Events

No declared component events.

```ts

```

## Slots

`default` (no payload): the WCol columns.

```ts
default?(): unknown;
```

## Attributes

Ordinary attrs and listeners reach the row element (`.wakeb-grid-row`) on every provider.

## CSS variables

No component-specific CSS variables.

## Accessibility and limits

The grid is Wakeb markup on every provider, so a provider's breakpoint or grid settings never change it. The row is a wrapping flex container with a negative margin equal to the column padding (12px, dense 4px). Unknown align or justify values are ignored with WAKEB_UNKNOWN_VALUE. There is no tag prop, no xl/xxl breakpoint and no per-breakpoint alignment.

## Dense layout

Use only Wakeb grid props for portable spacing.

```vue
<script setup lang="ts">
import { WRow, WCol } from 'wakeb-components'
</script>

<template>
  <WRow dense justify="center"><WCol cols="12" md="6">Centered column</WCol></WRow>
</template>
```

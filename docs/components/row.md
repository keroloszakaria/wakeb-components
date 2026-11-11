<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WRow

A row of the Wakeb 12-column grid; place WCol children inside it.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ElementsPlayground initial="row" />

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

## Examples

### Dense layout

Use only Wakeb grid props for portable spacing.

```vue
<script setup lang="ts">
import { WRow, WCol } from 'wakeb-components'
</script>

<template>
  <WRow dense justify="center"><WCol cols="12" md="6">Centered column</WCol></WRow>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dense` | `boolean` | `false` | 4px gutters instead of 12px. |
| `noGutters` | `boolean` | `false` | No gutters; wins over dense. |
| `align` | `"start" \| "center" \| "end" \| "baseline" \| "stretch"` | `undefined` | Cross-axis alignment of the columns (align-items). |
| `justify` | `"start" \| "center" \| "end" \| "space-between" \| "space-around" \| "space-evenly"` | `undefined` | Main-axis distribution of the columns (justify-content); start and end follow the direction. |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

`default` (no payload): the WCol columns.

```ts
default?(): unknown;
```

## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Ordinary attrs and listeners reach the row element (`.wakeb-grid-row`) on every provider.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

The grid is Wakeb markup on every provider, so a provider's breakpoint or grid settings never change it. The row is a wrapping flex container with a negative margin equal to the column padding (12px, dense 4px). Unknown align or justify values are ignored with WAKEB_UNKNOWN_VALUE. There is no tag prop, no xl/xxl breakpoint and no per-breakpoint alignment.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

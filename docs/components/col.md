<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WCol

A column of the Wakeb 12-column grid with responsive spans.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ElementsPlayground initial="col" />

## Usage

```vue
<script setup lang="ts">
import { WRow, WCol } from 'wakeb-components'
</script>

<template>
  <WRow>
  <WCol cols="12" sm="6" lg="4">Card</WCol>
</WRow>
</template>
```

## Examples

### Breakpoint widths

Columns share a 12-unit grid at fixed breakpoints.

```vue
<script setup lang="ts">
import { WRow, WCol } from 'wakeb-components'
</script>

<template>
  <WRow><WCol cols="12" sm="6" lg="4">A</WCol><WCol cols="12" sm="6" lg="8">B</WCol></WRow>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `cols` | `string \| number \| boolean` | `undefined` | Span below 600px and up, as a span from 1 to 12, 'auto' (content width) or true (grow). Unset grows to share the row, like VCol. |
| `sm` | `string \| number \| boolean` | `undefined` | Span from 600px: a span from 1 to 12, 'auto' (content width) or true (grow). |
| `md` | `string \| number \| boolean` | `undefined` | Span from 960px: a span from 1 to 12, 'auto' (content width) or true (grow). |
| `lg` | `string \| number \| boolean` | `undefined` | Span from 1280px: a span from 1 to 12, 'auto' (content width) or true (grow). |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

`default` (no payload): the column content.

```ts
default?(): unknown;
```

## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Ordinary attrs and listeners reach the column element (`.wakeb-grid-col`) on every provider.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

Breakpoints are fixed at sm 600px, md 960px and lg 1280px, the Vuetify 3 defaults, on every provider. Columns use border-box sizing and 12px padding (4px or 0 from the row). false or an empty string adds nothing; other invalid spans are ignored with WAKEB_UNKNOWN_VALUE (an invalid cols grows). There are no offset, order or xl props.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WDivider

A horizontal or vertical separator line.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ElementsPlayground initial="divider" />

## Usage

```vue
<script setup lang="ts">
import { WDivider } from 'wakeb-components'
</script>

<template>
  <WDivider class="my-2" />
</template>
```

## Examples

### Vertical separator

A vertical divider needs a parent with a defined height.

```vue
<script setup lang="ts">
import { WDivider } from 'wakeb-components'
</script>

<template>
  <div style="display:flex;height:48px;align-items:stretch"><span>Start</span><WDivider vertical /><span>End</span></div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `vertical` | `boolean` | `false` | Vertical line that stretches to the row height. |
| `thickness` | `number \| string` | `1` | Line thickness; numbers are px. |
| `color` | `WakebColor` | `undefined` | Line color: a Wakeb intent or a CSS color. Unset keeps the provider border color. |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

None.



## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Ordinary attrs and listeners reach the separator element.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

The element is role=separator (an hr on Vuetify) with aria-orientation=vertical when vertical. It has no margin; add spacing with classes. There is no inset or label text. Vuetify: VDivider; a color also sets full opacity. PrimeVue: Divider, with its margins removed. shadcn-vue: the reka-ui Separator with the shadcn-vue styles.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

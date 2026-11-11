<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WIcon

One icon from the Wakeb icon resolver, decorative or named.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ElementsPlayground initial="icon" />

## Usage

```vue
<script setup lang="ts">
import { WIcon } from 'wakeb-components'
</script>

<template>
  <WIcon icon="$close" size="16" label="Close" />
</template>
```

## Examples

### Decorative icon

Omit label for a decorative icon next to visible text.

```vue
<script setup lang="ts">
import { WIcon } from 'wakeb-components'
</script>

<template>
  <span><WIcon icon="$complete" size="16" /> Complete</span>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `SharedIcon` | `required` | An icon name (icons option, Wakeb built-ins, then the provider set), SVG path data or a Vue component. |
| `size` | `number \| string` | `24` | Icon size; numbers are px. |
| `color` | `WakebColor` | `undefined` | Icon color: a Wakeb intent or a CSS color. Unset inherits the text color. |
| `label` | `string` | `undefined` | Accessible name; the icon becomes role=img. Unset marks it aria-hidden. |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

None.



## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Ordinary attrs and listeners reach the icon root (the VIcon element on Vuetify, a span on the other providers).

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

Vuetify: VIcon; names the Wakeb resolver does not know go to the host Vuetify icon set (for example mdi- names with the MDI font). PrimeVue and shadcn-vue: the Wakeb renderer; PrimeIcons class names also work on PrimeVue, and an unknown name draws the Wakeb fallback box with WAKEB_ICON_UNRESOLVED. An icon is not a button; wrap it in WButton for actions.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

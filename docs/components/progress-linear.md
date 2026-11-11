<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WProgressLinear

A horizontal progress bar, determinate or indeterminate, that can sit absolutely on the top or bottom edge of its container.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ElementsPlayground initial="progress-linear" />

## Usage

```vue
<script setup lang="ts">
import { WProgressLinear } from 'wakeb-components'
import { ref } from 'vue'
const saving = ref(true)
</script>

<template>
  <WProgressLinear :active="saving" indeterminate absolute location="bottom" />
</template>
```

## Examples

### Determinate progress

Supply a value and accessible label for measurable work.

```vue
<script setup lang="ts">
import { WProgressLinear } from 'wakeb-components'
</script>

<template>
  <WProgressLinear :model-value="45" aria-label="Upload 45 percent" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| string` | `0` | Progress from 0 to 100; values outside are clamped and non-numbers become 0. |
| `indeterminate` | `boolean` | `false` | Animated bar without a value; aria-valuenow is removed. |
| `active` | `boolean` | `true` | false hides the bar (opacity 0) and sets aria-hidden=true; the element stays in place. |
| `color` | `WakebColor` | `"primary"` | Bar color: a Wakeb intent or a CSS color. |
| `height` | `number \| string` | `4` | Bar height; numbers and numeric strings are px, other strings are CSS lengths. |
| `absolute` | `boolean` | `false` | Positions the bar absolutely across the nearest positioned ancestor. |
| `location` | `"top" \| "bottom"` | `"top"` | Edge used with absolute. |
| `label` | `string` | `undefined` | Accessible name. Unset uses "Loading..." while indeterminate and "Progress" otherwise, following the plugin locale. |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

None.



## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Attributes and listeners reach the progressbar element. Wakeb binds role, aria-label, aria-valuemin, aria-valuemax, aria-valuenow and aria-hidden after them, so those stay Wakeb-owned.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

The root is role=progressbar with min 0 and max 100 on every provider. There is no buffer, stream, striped, reverse or clickable mode. Vuetify: rendered with VProgressLinear; non-numeric heights are applied as an inline style. PrimeVue: rendered with ProgressBar (showValue off); the color and height set its value-background and height tokens. shadcn-vue: the shadcn-vue Progress styles on the reka-ui ProgressRoot, with a Wakeb sliding animation for indeterminate (still under prefers-reduced-motion) that follows the direction.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

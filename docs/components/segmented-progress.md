<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WSegmentedProgress

A striped progress display with numeric accessibility semantics.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ComponentPlayground initial="segmented-progress" />

## Usage

```vue
<script setup lang="ts">
import { WSegmentedProgress } from 'wakeb-components'
</script>

<template>
  <WSegmentedProgress :value="65" label="65%" color="#0050ff" />
</template>
```

## Examples

### Empty progress

Zero renders the track with a numeric value of zero.

```vue
<script setup lang="ts">
import { WSegmentedProgress } from 'wakeb-components'
</script>

<template>
  <WSegmentedProgress :value="0" aria-label="Upload progress" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Percentage, normalized to 0–100; NaN becomes 0. |
| `label` | `string` | `""` | Visible label within the filled segment. |
| `color` | `WakebColor` | `var(--wakeb-progress-color, #12b76a)` | Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color. Other values fall back to the default. |
| `ariaLabel` | `string` | `""` | Accessible name; defaults to label, then the percentage. |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

`default`: `{ value, label }`, inside the filled segment.

```ts
default?(props: { value: number; label: string }): unknown;
```

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-progress-color` | `#12b76a` |
| `--wakeb-progress-height` | `34px` |
| `--wakeb-progress-surface` | `#fff` |
| `--wakeb-progress-track-background` | `#f2f4f7` |
| `--wakeb-progress-track-border` | `#d0d5dd` |

## Attribute target

The root `div.segmented-progress` with `role="progressbar"` on every provider. `role` and `aria-value*` are Wakeb-owned and win over caller attributes; a caller `aria-label` is the typed `ariaLabel` prop. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

Uses role=progressbar and aria-valuemin/aria-valuemax/aria-valuenow. A zero value has no fill or visible label, but retains its accessible name. At 100 there is no empty track. Segments size from a zero flex basis, so the fill is value% of the track width minus the 2px gap whatever the label length. Layout follows inherited direction; animations respect reduced motion. The component has no network or state-store side effects. PrimeVue renders the same Wakeb markup and CSS as Vuetify (no PrimeVue ProgressBar), so the DOM, slot payload and tokens are identical on both providers. Under shadcn-vue the same Wakeb markup and CSS render (the shadcn-vue Progress has no segmented track or label slot), so the DOM, slot payload and tokens are identical.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

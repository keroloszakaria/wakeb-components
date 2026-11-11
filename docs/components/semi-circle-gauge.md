<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WSemiCircleGauge

A responsive SVG gauge with isolated gradient IDs and a value slot.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ComponentPlayground initial="semi-circle-gauge" />

## Usage

```vue
<script setup lang="ts">
import { WSemiCircleGauge } from 'wakeb-components'
</script>

<template>
  <WSemiCircleGauge :value="75" label="75%" sub-label="Quality" aria-label="Quality: 75 percent" />
</template>
```

## Examples

### Custom center

Use the default slot without removing the accessible value.

```vue
<script setup lang="ts">
import { WSemiCircleGauge } from 'wakeb-components'
</script>

<template>
  <WSemiCircleGauge :value="90" aria-label="Quality 90 percent"><template #default>Excellent</template></WSemiCircleGauge>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Percentage normalized to 0–100; NaN becomes 0. |
| `size` | `number` | `154` | Positive finite size in pixels; invalid sizes fall back to 154. |
| `thickness` | `number` | `0` | 0 means 23.6% of size; positive values are capped at half the size. |
| `label` | `string` | `""` | Main visual label. |
| `subLabel` | `string` | `""` | Small text above the main label. |
| `ariaLabel` | `string` | `""` | Accessible description; defaults to the normalized percentage. |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

`default`: `{ value, label, subLabel }`, replacing visual center text.

```ts
default?(props: { value: number; label: string; subLabel: string }): unknown;
```

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-gauge-color` | `#12b76a` |
| `--wakeb-gauge-highlight` | `gauge color` |
| `--wakeb-gauge-track-background` | `#f2f4f7` |
| `--wakeb-gauge-track-border` | `#d0d5dd` |
| `--wakeb-gauge-needle-color` | `#fff` |
| `--wakeb-gauge-text-color` | `currentColor` |
| `--wakeb-gauge-muted-color` | `#667085` |

## Attribute target

The root `div.semi-circle-gauge`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

SVG role=img exposes the percentage or ariaLabel; decorative center text is aria-hidden. Vue useId keeps SVG references distinct and stable across SSR requests. RTL mirrors geometry only; text remains readable. Invalid geometry is normalized; animations honor reduced motion. Size is the full gauge width; the arc is half-height. PrimeVue renders the same Wakeb SVG and CSS as Vuetify (PrimeVue Knob is an input, so it is not used); the DOM, IDs and tokens are identical on both providers. Under shadcn-vue the same Wakeb SVG and geometry render; shadcn-vue and reka-ui have no read-only gauge.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

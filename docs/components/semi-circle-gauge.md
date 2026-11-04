<!-- Generated from docs/reference-data.mjs -->
# WSemiCircleGauge

A responsive SVG gauge with isolated gradient IDs and a value slot.

## Usage

```vue
<script setup lang="ts">
import { WSemiCircleGauge } from 'wakeb-components'
</script>
<template>
  <WSemiCircleGauge :value="75" label="75%" sub-label="Quality" aria-label="Quality: 75 percent" />
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

## Slots

`default`: `{ value, label, subLabel }`, replacing visual center text.

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

## Accessibility and limits

SVG role=img exposes the percentage or ariaLabel; decorative center text is aria-hidden. Vue useId keeps SVG references distinct and stable across SSR requests. RTL mirrors geometry only; text remains readable. Invalid geometry is normalized; animations honor reduced motion. Size is the full gauge width; the arc is half-height. PrimeVue renders the same Wakeb SVG and CSS as Vuetify (PrimeVue Knob is an input, so it is not used); the DOM, IDs and tokens are identical on both providers. Under shadcn-vue the same Wakeb SVG and geometry render; shadcn-vue and reka-ui have no read-only gauge.

## Try it

<ComponentPlayground initial="semi-circle-gauge" />

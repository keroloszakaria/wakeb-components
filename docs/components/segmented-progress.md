<!-- Generated from docs/reference-data.mjs -->
# WSegmentedProgress

A striped progress display with numeric accessibility semantics.

## Usage

```vue
<script setup lang="ts">
import { WSegmentedProgress } from 'wakeb-components'
</script>
<template>
  <WSegmentedProgress :value="65" label="65%" color="#0050ff" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Percentage, normalized to 0–100; NaN becomes 0. |
| `label` | `string` | `""` | Visible label within the filled segment. |
| `color` | `string` | `var(--wakeb-progress-color, #12b76a)` | Any CSS color, including a CSS variable. |
| `ariaLabel` | `string` | `""` | Accessible name; defaults to label, then the percentage. |

## Slots

`default`: `{ value, label }`, inside the filled segment.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-progress-color` | `#12b76a` |
| `--wakeb-progress-height` | `34px` |
| `--wakeb-progress-surface` | `#fff` |
| `--wakeb-progress-track-background` | `#f2f4f7` |
| `--wakeb-progress-track-border` | `#d0d5dd` |

## Accessibility and limits

Uses role=progressbar and aria-valuemin/aria-valuemax/aria-valuenow. A zero value has no fill or visible label, but retains its accessible name. At 100 there is no empty track. Layout follows inherited direction; animations respect reduced motion. The component has no network or state-store side effects.

## Try it

<ComponentPlayground initial="segmented-progress" />

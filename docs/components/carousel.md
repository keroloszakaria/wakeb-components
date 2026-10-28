<!-- Generated from docs/reference-data.mjs -->
# WCarousel

A Vuetify carousel with scoped slides, host-owned playback and accessible custom indicators.

## Usage

```vue
<script setup lang="ts">
import { WCarousel } from 'wakeb-components'
</script>
<template>
  <div style="position:relative;height:240px"><WCarousel :slides="['First', 'Second']" :cycle="false" show-indicators><template #slide="{slide}">{{slide}}</template></WCarousel></div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `slides` | `readonly unknown[]` | `[]` | Records passed unchanged to the slide slot. |
| `modelValue` | `number` | `undefined` | Optional external index; local selection starts at zero. |
| `interval` | `number` | `5000` | Vuetify autoplay delay in milliseconds. |
| `cycle` | `boolean` | `true` | Enable Vuetify cycling; offer a visible pause control when autoplay is used. |
| `showArrows` | `boolean \| "hover"` | `false` | Native previous/next controls. |
| `showIndicators` | `boolean` | `false` | Show custom clickable indicators; this name has normal positive semantics. |
| `height` | `string \| number` | `"100%"` | Native carousel height. |
| `ariaLabel` | `string` | `"Carousel"` | Accessible carousel region name. |
| `indicatorLabel` | `(index: number) => string` | ``index => `Go to slide ${index + 1}` `` | Host-localized indicator names; index is zero-based. |
| `indicatorAttrs` | `Record<string, unknown>` | `undefined` | Extra DOM attrs/style on each indicator; may override its native type. |
| `keyboardIndicators` | `boolean` | `true` | Enable enhanced indicator arrow/Home/End keys and focus styling; false keeps native button behavior. |

## Events

`update:modelValue(index: number)` once for an actual local index change; syncing the same valid parent value is silent.

## Slots

`slide`: `{slide,index}`; `prev`/`next`: `{props}` from Vuetify; bind those props to your native arrow controls.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-carousel-indicator-bg` | `#98a2b3` |
| `--wakeb-carousel-indicator-active-bg` | `#087f8c` |
| `--wakeb-carousel-focus` | `#087f8c` |
| `--wakeb-carousel-fallback` | `undefined (legacy adapter switch)` |

## Accessibility and limits

The component keeps two root nodes, without a layout wrapper. Put it in a positioned parent because custom indicators are absolutely positioned 2rem above its bottom. Ordinary attrs target VCarousel. Native delimiters stay hidden; showIndicators controls the custom dots. Custom indicators are type=button, have accessible names/current state, and support Arrow Left/Right (reversed in RTL), Home/End and normal Enter/Space. Arrow slots retain Vuetify keyboard behavior. Slides render through Vuetify lazy items. Use finite indices in range and positive intervals. Autoplay uses Vuetify scheduling; it does not automatically pause on pointer hover or keyboard focus. The demo starts paused and exposes a cycle control. Use cycle=false for static/reduced-motion experiences; the indicator animation respects reduced motion, while slide transitions are Vuetify attrs. Labels and URLs/content come from the host. Aware keeps the original inverted hideDelimiters=true meaning through its adapter and retains the legacy missing indicator type. Aware disables the enhanced indicator keys/focus styling to retain its original behavior.

## Try it

<CompositionPlayground initial="carousel" />

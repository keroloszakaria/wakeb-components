# WCarousel

A carousel with scoped slides, host-owned playback and accessible custom indicators.

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

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `slides` | `readonly unknown[]` | `[]` | Records passed unchanged to the slide slot. |
| `modelValue` | `number` | `undefined` | Optional external index; local selection starts at zero. |
| `interval` | `number` | `5000` | Autoplay delay in milliseconds; values that are not positive use 6000. |
| `cycle` | `boolean` | `true` | Enable automatic cycling; offer a visible pause control when autoplay is used. |
| `showArrows` | `boolean \| "hover"` | `false` | Native previous/next controls. |
| `showIndicators` | `boolean` | `false` | Show custom clickable indicators; this name has normal positive semantics. |
| `height` | `string \| number` | `"100%"` | Native carousel height. |
| `ariaLabel` | `string` | `"Carousel"` | Accessible carousel region name. |
| `indicatorLabel` | `(index: number) => string` | `index => 'Go to slide ' + (index + 1)` | Host-localized indicator names; index is zero-based. |
| `indicatorAttrs` | `Record<string, unknown>` | `undefined` | Extra DOM attrs/style on each indicator; may override its native type. |
| `keyboardIndicators` | `boolean` | `true` | Enable enhanced indicator arrow/Home/End keys and focus styling; false keeps native button behavior. |

## Events

`update:modelValue(index: number)` once for an actual local index change; syncing the same valid parent value is silent.

```ts
"update:modelValue": [index: number];
```

## Slots

`slide`: `{slide,index}`; `prev`/`next`: `{props}` with `icon`, `class`, `onClick` and `aria-label` (Vuetify passes its own window values); bind those props to your native arrow controls.

```ts
slide?(props: { slide: unknown; index: number }): unknown;
prev?(props: { props: Record<string, unknown> }): unknown;
next?(props: { props: Record<string, unknown> }): unknown;
```

## Attributes

The carousel root (VCarousel, `role="region"`). The indicator container is a second root node and does not receive them; each indicator receives `indicatorAttrs`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## CSS variables

- `--wakeb-carousel-indicator-bg`: #98a2b3
- `--wakeb-carousel-indicator-active-bg`: #087f8c
- `--wakeb-carousel-focus`: #087f8c
- `--wakeb-carousel-fallback`: undefined (legacy adapter switch)

## Accessibility and limits

The component keeps two root nodes, without a layout wrapper. Put it in a positioned parent because custom indicators are absolutely positioned 2rem above its bottom. Ordinary attrs target VCarousel. Native delimiters stay hidden; showIndicators controls the custom dots. Custom indicators are type=button, have accessible names/current state, and support Arrow Left/Right (reversed in RTL), Home/End and normal Enter/Space. Arrow slots retain Vuetify keyboard behavior. Slides render through Vuetify lazy items. Use finite indices in range and positive intervals. Wakeb owns the autoplay timer on every provider (VCarousel's own cycle stays off): it advances once per interval and wraps, restarts the interval after every index change, and pauses while the pointer is over the carousel or its indicators, while focus is inside either, while the document is hidden, and whenever the user prefers reduced motion. The timer starts only after mount and is cleared, with its listeners, on unmount. The demo starts paused and exposes a cycle control. Use cycle=false for static/reduced-motion experiences; the indicator animation respects reduced motion, while slide transitions are Vuetify attrs. Labels and URLs/content come from the host. Aware keeps the original inverted hideDelimiters=true meaning through its adapter and retains the legacy missing indicator type. Aware disables the enhanced indicator keys/focus styling to retain its original behavior. PrimeVue: Wakeb renders the region, slides and arrows itself, because PrimeVue Carousel pages through several visible items with its own autoplay. Slides mount on first visit, stay mounted and switch without a transition or swipe gestures. Default arrows are native buttons with the built-in $prev/$next icons and the labels Previous visual/Next visual (Arabic under locale ar); Left/Right arrow keys on them move and keep focus, as in Vuetify. Attrs target the Wakeb region div. shadcn-vue: the same Wakeb region, slides, arrows, indicators and autoplay pause rules as PrimeVue, because the shadcn-vue Carousel needs Embla and has no autoplay or indicators.

## Manual slides

Disable autoplay and bind the zero-based index.

```vue
<script setup lang="ts">
import { WCarousel } from 'wakeb-components'
import { ref } from 'vue'
const slide = ref(0)
</script>

<template>
  <div style="position:relative;height:160px"><WCarousel v-model="slide" :slides="['One', 'Two']" :cycle="false" show-indicators><template #slide="{ slide }">{{ slide }}</template></WCarousel></div>
  <p>Slide: {{ slide }}</p>
</template>
```

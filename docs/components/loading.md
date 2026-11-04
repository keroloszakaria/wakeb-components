<!-- Generated from docs/reference-data.mjs -->
# WLoading

A named loading status with a Vuetify circular indicator.

## Usage

```vue
<script setup lang="ts">
import { WLoading } from 'wakeb-components'
</script>
<template>
  <WLoading label="Loading report" :size="50" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `string \| number` | `50` | Vuetify spinner size. |
| `color` | `WakebColor` | `"primary"` | Spinner color. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color. |
| `label` | `string` | `"Loading"` | Accessible loading status; supply translated text. |
| `providerProps` | `WakebProviderProps` | `undefined` | Nonportable. Native props for the indicator primitive (Vuetify `VProgressCircular`, PrimeVue `ProgressSpinner`). `color`, `size`, the indeterminate state and PrimeVue `strokeWidth`/`pt` stay Wakeb-owned. Has no effect when the default slot replaces the indicator. |

## Slots

`default`: replaces the spinner; the named status container stays.

## CSS variables

| Variable | Default |
| --- | --- |


## Attribute target

The root `div.loading` with `role="status"`, on every provider. Wakeb's role and aria-label win. `providerProps` goes to the indicator primitive instead. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Accessibility and limits

The root is role=status; the default spinner is decorative and aria-hidden to avoid duplicate announcements. Centering works without utility CSS. The component has no timer, request or loading state of its own; mount/unmount it from the host. Vue/Vuetify owns indicator animation.

## Try it

<ComponentPlayground initial="loading" />

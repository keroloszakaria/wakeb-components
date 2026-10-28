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
| `color` | `string` | `"primary"` | Vuetify theme key or CSS color. |
| `label` | `string` | `"Loading"` | Accessible loading status; supply translated text. |

## Slots

`default`: replaces the spinner; the named status container stays.

## CSS variables

| Variable | Default |
| --- | --- |


## Accessibility and limits

The root is role=status; the default spinner is decorative and aria-hidden to avoid duplicate announcements. Centering works without utility CSS. The component has no timer, request or loading state of its own; mount/unmount it from the host. Vue/Vuetify owns indicator animation.

## Try it

<ComponentPlayground initial="loading" />

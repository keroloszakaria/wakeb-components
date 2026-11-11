# WDivider

A horizontal or vertical separator line.

## Usage

```vue
<script setup lang="ts">
import { WDivider } from 'wakeb-components'
</script>

<template>
  <WDivider class="my-2" />
</template>
```

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `vertical` | `boolean` | `false` | Vertical line that stretches to the row height. |
| `thickness` | `number \| string` | `1` | Line thickness; numbers are px. |
| `color` | `WakebColor` | `undefined` | Line color: a Wakeb intent or a CSS color. Unset keeps the provider border color. |

## Events

No declared component events.

```ts

```

## Slots

None.

```ts

```

## Attributes

Ordinary attrs and listeners reach the separator element.

## CSS variables

No component-specific CSS variables.

## Accessibility and limits

The element is role=separator (an hr on Vuetify) with aria-orientation=vertical when vertical. It has no margin; add spacing with classes. There is no inset or label text. Vuetify: VDivider; a color also sets full opacity. PrimeVue: Divider, with its margins removed. shadcn-vue: the reka-ui Separator with the shadcn-vue styles.

## Vertical separator

A vertical divider needs a parent with a defined height.

```vue
<script setup lang="ts">
import { WDivider } from 'wakeb-components'
</script>

<template>
  <div style="display:flex;height:48px;align-items:stretch"><span>Start</span><WDivider vertical /><span>End</span></div>
</template>
```

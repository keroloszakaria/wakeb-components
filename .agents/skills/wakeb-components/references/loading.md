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

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `size` | `string \| number` | `50` | Vuetify spinner size. |
| `color` | `WakebColor \| WakebDeprecatedColor` | `"primary"` | Spinner color. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color. Deprecated Vuetify color names (WakebDeprecatedColor, such as error or red-darken-2) still type-check and render under Vuetify with WAKEB_DEPRECATED_VALUE; other providers fall back with WAKEB_UNKNOWN_VALUE. |
| `label` | `string` | `"Loading"` | Accessible loading status; supply translated text. |
| `providerProps` | `WakebProviderProps` | `undefined` | Nonportable. Native props for the indicator primitive (Vuetify `VProgressCircular`, PrimeVue `ProgressSpinner`). `color`, `size`, the indeterminate state and PrimeVue `strokeWidth`/`pt` stay Wakeb-owned. Has no effect when the default slot replaces the indicator. |

## Events

No declared component events.

```ts

```

## Slots

`default`: replaces the spinner; the named status container stays.

```ts
default?(props: {}): unknown;
```

## Attributes

The root `div.loading` with `role="status"`, on every provider. Wakeb's role and aria-label win. `providerProps` goes to the indicator primitive instead. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## CSS variables

No component-specific CSS variables.

## Accessibility and limits

The root is role=status; the default spinner is decorative and aria-hidden to avoid duplicate announcements. Centering works without utility CSS. The component has no timer, request or loading state of its own; mount/unmount it from the host. Vue/Vuetify owns indicator animation.

## Custom indicator

The status label remains available with a custom visual indicator.

```vue
<script setup lang="ts">
import { WLoading } from 'wakeb-components'
</script>

<template>
  <WLoading label="Loading results"><span aria-hidden="true">•••</span></WLoading>
</template>
```

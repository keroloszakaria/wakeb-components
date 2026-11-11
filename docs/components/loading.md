<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WLoading

A named loading status with a Vuetify circular indicator.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ComponentPlayground initial="loading" />

## Usage

```vue
<script setup lang="ts">
import { WLoading } from 'wakeb-components'
</script>

<template>
  <WLoading label="Loading report" :size="50" />
</template>
```

## Examples

### Custom indicator

The status label remains available with a custom visual indicator.

```vue
<script setup lang="ts">
import { WLoading } from 'wakeb-components'
</script>

<template>
  <WLoading label="Loading results"><span aria-hidden="true">•••</span></WLoading>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `string \| number` | `50` | Vuetify spinner size. |
| `color` | `WakebColor \| WakebDeprecatedColor` | `"primary"` | Spinner color. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color. Deprecated Vuetify color names (WakebDeprecatedColor, such as error or red-darken-2) still type-check and render under Vuetify with WAKEB_DEPRECATED_VALUE; other providers fall back with WAKEB_UNKNOWN_VALUE. |
| `label` | `string` | `"Loading"` | Accessible loading status; supply translated text. |
| `providerProps` | `WakebProviderProps` | `undefined` | Nonportable. Native props for the indicator primitive (Vuetify `VProgressCircular`, PrimeVue `ProgressSpinner`). `color`, `size`, the indeterminate state and PrimeVue `strokeWidth`/`pt` stay Wakeb-owned. Has no effect when the default slot replaces the indicator. |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

`default`: replaces the spinner; the named status container stays.

```ts
default?(props: {}): unknown;
```

## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

The root `div.loading` with `role="status"`, on every provider. Wakeb's role and aria-label win. `providerProps` goes to the indicator primitive instead. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

The root is role=status; the default spinner is decorative and aria-hidden to avoid duplicate announcements. Centering works without utility CSS. The component has no timer, request or loading state of its own; mount/unmount it from the host. Vue/Vuetify owns indicator animation.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

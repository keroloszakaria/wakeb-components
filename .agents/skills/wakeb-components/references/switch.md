# WSwitch

An on/off switch with a boolean model and a linked label.

## Usage

```vue
<script setup lang="ts">
import { WSwitch } from 'wakeb-components'
import { ref } from 'vue'
const notify = ref(true)
</script>

<template>
  <WSwitch v-model="notify" label="Notifications" />
</template>
```

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | On state; a toggle emits update:modelValue with the new boolean. |
| `label` | `string` | `undefined` | Already translated visible label, linked to the control. |
| `disabled` | `boolean` | `false` | Native disabled control; clicks do not change the model. |
| `color` | `WakebColor` | `"primary"` | Checked color: a Wakeb intent or a CSS color. |
| `density` | `"default" \| "comfortable" \| "compact"` | `undefined` | Control spacing. Unset keeps the provider default; Vuetify uses its configured density. |
| `inset` | `boolean` | `false` | Vuetify inset style: a wide track with the thumb inside. PrimeVue and shadcn-vue switches already look this way. |
| `loading` | `boolean` | `false` | Marks the control aria-busy=true while work is pending. It stays operable; disable it yourself to block changes. |

## Events

`update:modelValue(value: boolean)` when the user toggles the switch.

```ts
"update:modelValue": [value: boolean];
```

## Slots

`label` (no payload) replaces the label text and stays linked to the control.

```ts
label?(): unknown;
```

## Attributes

Like Vuetify's selection controls on every provider: `class`, `style`, `id`, `inert`, `dir`, `data-*` and all listeners reach the root (`.wakeb-switch` / `.wakeb-checkbox`); every other attribute (`name`, `aria-label`, `aria-describedby`) reaches the control element, with the focus and blur listeners.

## CSS variables

No component-specific CSS variables.

## Accessibility and limits

The control has role=switch and its checked state, and the label is a `<label for>` linked to it. Without a visible label, pass `aria-label`. Space toggles it; there is no message row, rules or indeterminate state. Vuetify: rendered with VSwitch (hide-details), its native checkbox gets role=switch, and loading also shows the Vuetify thumb spinner. PrimeVue: rendered with ToggleSwitch; the color sets its checked track tokens, density and inset change nothing and loading dims the switch. shadcn-vue: the shadcn-vue Switch styles on the reka-ui SwitchRoot button; density and inset change nothing and loading dims the switch.

## Disabled setting

The disabled control preserves its checked value.

```vue
<script setup lang="ts">
import { WSwitch } from 'wakeb-components'
</script>

<template>
  <WSwitch :model-value="true" label="Managed setting" disabled />
</template>
```

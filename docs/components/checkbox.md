<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WCheckbox

A checkbox with a boolean model, or with an array model that holds the checked values.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<FormsPlayground initial="checkbox" />

## Usage

```vue
<script setup lang="ts">
import { WCheckbox } from 'wakeb-components'
import { ref } from 'vue'
const permissions = ref<boolean | unknown[]>(['read'])
</script>

<template>
  <WCheckbox v-for="name in ['read', 'write']" :key="name" v-model="permissions" :value="name" :label="name" />
</template>
```

## Examples

### Boolean model

Omit value for a boolean checkbox.

```vue
<script setup lang="ts">
import { WCheckbox } from 'wakeb-components'
import { ref } from 'vue'
const accepted = ref<boolean | unknown[]>(false)
</script>

<template>
  <WCheckbox v-model="accepted" label="Accept terms" />
  <p>Accepted: {{ accepted }}</p>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean \| readonly unknown[]` | `false` | Checked state. With an array, the box is checked while it includes `value`, and toggling emits a new array with `value` added or removed. |
| `value` | `unknown` | `undefined` | The item this box adds to or removes from an array model; compared with ===. |
| `label` | `string` | `undefined` | Already translated visible label, linked to the control. |
| `disabled` | `boolean` | `false` | Native disabled control; clicks do not change the model. |
| `color` | `WakebColor` | `"primary"` | Checked color: a Wakeb intent or a CSS color. |
| `density` | `"default" \| "comfortable" \| "compact"` | `undefined` | Control spacing. Unset keeps the provider default; Vuetify uses its configured density. |

## Events

`update:modelValue(value: boolean | unknown[])` when the user toggles the box: a boolean, or a new array for an array model.

```ts
"update:modelValue": [value: boolean | unknown[]];
```

## Slots

`label` (no payload) replaces the label text and stays linked to the control.

```ts
label?(): unknown;
```

## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Like Vuetify's selection controls on every provider: `class`, `style`, `id`, `inert`, `dir`, `data-*` and all listeners reach the root (`.wakeb-switch` / `.wakeb-checkbox`); every other attribute (`name`, `aria-label`, `aria-describedby`) reaches the control element, with the focus and blur listeners.

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Focus the enabled control. |
| `Space` | Toggle the checked state. |

## Accessibility and limits

The control is a checkbox with its checked state, and the label is a `<label for>` linked to it. Space toggles it. Wakeb owns the array model on every provider, so the providers' own group and true/false value options are not used. There is no message row, rules or indeterminate state. Vuetify: rendered with VCheckbox (hide-details). PrimeVue: rendered with the binary Checkbox; the color sets its checked tokens and density changes nothing. shadcn-vue: the shadcn-vue Checkbox styles on the reka-ui CheckboxRoot button (role=checkbox); density changes nothing.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

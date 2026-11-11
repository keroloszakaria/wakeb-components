<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WButtonToggle

A segmented group of toggle buttons with single or multiple selection.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ElementsPlayground initial="button-toggle" />

## Usage

```vue
<script setup lang="ts">
import { WButtonToggle } from 'wakeb-components'
import { ref } from 'vue'
const position = ref<string | number | (string | number)[] | null>('top')
</script>

<template>
  <WButtonToggle v-model="position" mandatory block aria-label="Legend position" :items="[{ label: 'Top', value: 'top' }, { label: 'Bottom', value: 'bottom' }]" />
</template>
```

## Examples

### Multiple selection

Use an array model with multiple.

```vue
<script setup lang="ts">
import { WButtonToggle } from 'wakeb-components'
import { ref } from 'vue'
const selected = ref<string | number | (string | number)[] | null>(['bold'])
</script>

<template>
  <WButtonToggle v-model="selected" multiple aria-label="Text style" :items="[{ label: 'Bold', value: 'bold' }, { label: 'Italic', value: 'italic' }]" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| readonly (string \| number)[] \| null` | `null` | Selected value, or an array of values with multiple. |
| `items` | `readonly ButtonToggleItem[]` | `[]` | Buttons: `{ label, value, disabled? }`; labels are already translated. |
| `multiple` | `boolean` | `false` | Allows several selected items; the model is an array in item order. |
| `mandatory` | `boolean` | `false` | Keeps the last selection: pressing it again does nothing. It never selects an item by itself. |
| `color` | `WakebColor` | `"primary"` | Selected button color: a Wakeb intent or a CSS color. |
| `density` | `"default" \| "comfortable" \| "compact"` | `undefined` | Button spacing. Unset keeps the provider default. |
| `disabled` | `boolean` | `false` | Disables every button. |
| `block` | `boolean` | `false` | Fills the width; buttons share it equally. |
| `ariaLabel` | `string` | `undefined` | Accessible name of the group. |

## Events

`update:modelValue(value)` with the new value, null when cleared, or a new array with multiple.

```ts
"update:modelValue": [value: string | number | (string | number)[] | null];
```

## Slots

`item` `{ item, selected }` replaces a button's label.

```ts
item?(props: { item: ButtonToggleItem; selected: boolean }): unknown;
```

## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Ordinary attrs and listeners reach the group element (role=group).

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Focus enabled actions. |
| `Enter / Space` | Activate the focused native button. |

## Accessibility and limits

Every provider renders a role=group of native buttons with aria-pressed, and Wakeb owns the model, so mandatory, multiple and disabled behave the same everywhere. Arrow keys do not move between buttons; Tab does. Item values are compared with ===. Vuetify: VBtnGroup (outlined, divided) of VBtn; the selected button is active and takes the color. PrimeVue: one ToggleButton per item, joined into a group; the color sets the checked ToggleButton tokens. shadcn-vue: native buttons with the shadcn-vue ToggleGroup look; the selected button is filled with the color.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

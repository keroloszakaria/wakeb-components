<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WTextField

A labelled single-line text input with portable validation rules and start/end adornments.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<FormsPlayground initial="text-field" />

## Usage

```vue
<script setup lang="ts">
import { WTextField } from 'wakeb-components'
import { ref } from 'vue'
const email = ref('')
</script>

<template>
  <WTextField v-model="email" type="email" label="Email" :rules="[v => !!v || 'Required']" hide-details="auto" />
</template>
```

## Examples

### Read-only value

Readonly allows reading and focus while blocking edits.

```vue
<script setup lang="ts">
import { WTextField } from 'wakeb-components'
</script>

<template>
  <WTextField model-value="TEAM-001" label="Reference" readonly />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | `undefined` | Current value; typing emits update:modelValue with the input string. |
| `type` | `"text" \| "search" \| "email" \| "tel" \| "url" \| "password" \| "number"` | `"text"` | Native input type. |
| `label` | `string` | `undefined` | Already translated visible label, linked to the input. |
| `placeholder` | `string` | `undefined` | Already translated placeholder. |
| `variant` | `"outline" \| "filled"` | `"outline"` | Outlined or filled field surface. |
| `disabled` | `boolean` | `false` | Native disabled input; no events. |
| `readonly` | `boolean` | `false` | Native readonly input; it stays focusable. |
| `required` | `boolean` | `false` | Adds the native required attribute; pair it with a rule for a message. |
| `rules` | `readonly WakebFieldRule[]` | `[]` | Rules run on every value; the first one that does not return true shows its message. |
| `hideDetails` | `boolean \| "auto"` | `false` | true hides the message row; "auto" shows it only while there is a message. |
| `density` | `"default" \| "comfortable" \| "compact"` | `undefined` | Field height. Unset keeps the provider default: Vuetify uses its configured VTextField density; PrimeVue and shadcn-vue use their normal size. |
| `errorMessages` | `string \| readonly string[]` | `undefined` | Messages from outside the field, such as server errors. While one is set the field is invalid at once and the first message shows before any rule message. |

## Events

`update:modelValue(value: string)` on every input. Number fields also emit the input string.

```ts
"update:modelValue": [value: string];
```

## Slots

`start` and `end` (no payload) render inside the field before and after the input, for icons or buttons.

```ts
start?(): unknown;
end?(): unknown;
```

## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Like Vuetify's VTextField on every provider: `class`, `style`, `id`, `inert`, `dir`, `data-*` and all listeners reach the field root (`.wakeb-text-field`); every other attribute (`name`, `autocomplete`, `aria-*`, `maxlength`, `inputmode`) reaches the native input, with the focus and blur listeners.

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab / Shift+Tab` | Enter or leave the enabled field. |
| `Native editing keys` | Edit text; readonly blocks edits. |

## Accessibility and limits

The label is a real `<label for>`, so the input has an accessible name. Validation messages appear after the first input or blur, sit in a role=alert element and are linked through aria-describedby with aria-invalid=true. A rule that returns false marks the field invalid without a message. errorMessages show without waiting for input and only the first one is displayed. density: Vuetify maps it to VTextField density (56, 48 and 40px); PrimeVue renders compact as the small InputText and the other values at the normal size; shadcn-vue renders compact at 2rem and the other values at 2.25rem. Vuetify: rendered with VTextField (outlined or filled) and its own validation, so it also registers with a surrounding VForm. PrimeVue: rendered with InputText (outlined or filled) and the Wakeb label and message markup; it does not register with any form. shadcn-vue: the shadcn-vue Input styles on a native input with the Wakeb label and message markup. Floating labels, counters, clearable, prefix/suffix text and multi-line input are not part of the contract.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

# WTextarea

A labelled multi-line text field with the WTextField validation rules.

## Usage

```vue
<script setup lang="ts">
import { WTextarea } from 'wakeb-components'
import { ref } from 'vue'
const notes = ref('')
</script>

<template>
  <WTextarea v-model="notes" label="Notes" rows="3" density="compact" />
</template>
```

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | `undefined` | Field value; typing emits update:modelValue with the string. |
| `label` | `string` | `undefined` | Already translated label, linked to the textarea. |
| `placeholder` | `string` | `undefined` | Placeholder text. |
| `variant` | `"outline" \| "filled"` | `"outline"` | Field style. |
| `disabled` | `boolean` | `false` | Native disabled textarea. |
| `readonly` | `boolean` | `false` | Native read-only textarea. |
| `required` | `boolean` | `false` | Native required attribute; add a rule for a message. |
| `rules` | `readonly WakebFieldRule[]` | `[]` | Rules run on every value; the first failure is shown once the field was typed in or left. |
| `hideDetails` | `boolean \| "auto"` | `false` | true hides the message row; auto shows it only with a message. |
| `density` | `"default" \| "comfortable" \| "compact"` | `undefined` | Field spacing. Unset keeps the provider default. |
| `errorMessages` | `string \| readonly string[]` | `undefined` | External messages (for example from the server); they show at once and mark the field invalid. |
| `rows` | `number \| string` | `5` | Visible rows. |
| `autoGrow` | `boolean` | `false` | Grows with the content instead of scrolling. |
| `noResize` | `boolean` | `false` | Removes the resize handle. |

## Events

`update:modelValue(value: string)` while the user types.

```ts
"update:modelValue": [value: string];
```

## Slots

None.

```ts

```

## Attributes

Like WTextField on every provider: `class`, `style`, `id`, `inert`, `dir`, `data-*` and all listeners reach the field root (`.wakeb-textarea`); every other attribute (`name`, `maxlength`, `autocomplete`, `aria-*`) reaches the native textarea, with the focus and blur listeners.

## CSS variables

No component-specific CSS variables.

## Accessibility and limits

The label is a `<label for>` linked to the textarea; invalid fields set aria-invalid=true and the message row is role=alert (aria-describedby on PrimeVue and shadcn-vue). There is no counter, clearable or prepend/append slot. Vuetify: rendered with VTextarea; Vuetify draws its floating label and message row. PrimeVue: rendered with Textarea (autoResize for autoGrow) under a Wakeb label and message row. shadcn-vue: the shadcn-vue Textarea styles on a native textarea; autoGrow uses CSS field-sizing, so browsers without it keep the rows height.

## Validation

Validation messages are local UI; submit logic remains application-owned.

```vue
<script setup lang="ts">
import { WTextarea } from 'wakeb-components'
import { ref } from 'vue'
const notes = ref('')
</script>

<template>
  <WTextarea v-model="notes" label="Notes" :rules="[value => String(value ?? '').length >= 3 || 'Use at least 3 characters']" hide-details="auto" />
</template>
```

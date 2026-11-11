<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WList

A list of titled rows, optionally clickable.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ElementsPlayground initial="list" />

## Usage

```vue
<script setup lang="ts">
import { WList } from 'wakeb-components'
import { ref } from 'vue'
import type { ListItem } from 'wakeb-components'
const selected = ref<ListItem | null>(null)
const open = (item: ListItem) => { selected.value = item }
</script>

<template>
  <WList interactive aria-label="Account" :items="[{ title: 'Profile', value: 'profile' }]" @select="open" />
</template>
```

## Examples

### Custom item content

Use the item slot for noninteractive content; keep the list semantics.

```vue
<script setup lang="ts">
import { WList } from 'wakeb-components'
</script>

<template>
  <WList :items="[{ title: 'Profile', value: 'profile' }]" aria-label="Account"><template #item="{ item }"><strong>{{ item.title }}</strong></template></WList>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `readonly ListItem[]` | `[]` | Rows: `{ title, subtitle?, value?, icon?, disabled? }`; texts are already translated. |
| `density` | `"default" \| "comfortable" \| "compact"` | `undefined` | Row height. Unset keeps the provider default. |
| `interactive` | `boolean` | `false` | Makes enabled rows clickable; they emit select. |
| `ariaLabel` | `string` | `undefined` | Accessible name of the list. |

## Events

`select(item: ListItem)` when an enabled row of an interactive list is activated.

```ts
select: [item: ListItem];
```

## Slots

`item` `{ item, index }` replaces a row's text. `prepend` `{ item, index }` replaces its leading icon.

```ts
item?(props: { item: ListItem; index: number }): unknown;
prepend?(props: { item: ListItem; index: number }): unknown;
```

## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Ordinary attrs and listeners reach the list element (role=list).

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab / Enter / Space` | Focus and activate an enabled row. Vuetify uses a focusable listitem; PrimeVue and shadcn-vue use native buttons inside listitems. |

## Accessibility and limits

The list is role=list with listitem rows; it is not a selection control (no active or selected state) and not a menu. Rows are keyed by value, else by index. Vuetify: VList and VListItem; interactive rows are clickable list items that Vuetify moves focus between with the arrow keys. PrimeVue and shadcn-vue: Wakeb markup, a ul of li rows; interactive rows are native buttons reached with Tab, and disabled rows are disabled buttons. Item icons resolve like other Wakeb icons.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

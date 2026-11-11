<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WCountBadge

A count or dot pinned to a corner of the element it wraps, such as unread notifications on a bell.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ElementsPlayground initial="count-badge" />

## Usage

```vue
<script setup lang="ts">
import { WCountBadge, WButton } from 'wakeb-components'
</script>

<template>
  <WCountBadge content="5" label="5 unread notifications"><WButton type="outline" aria-label="Notifications">🔔</WButton></WCountBadge>
</template>
```

## Examples

### Dot indicator

Give the dot an accessible label that explains its meaning.

```vue
<script setup lang="ts">
import { WCountBadge, WButton } from 'wakeb-components'
</script>

<template>
  <WCountBadge dot label="Unread notifications"><WButton title="Inbox" /></WCountBadge>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `number \| string` | `undefined` | The count or short text. Whole numbers above max show as max+; an empty value hides the indicator unless dot is set. |
| `max` | `number` | `99` | Largest count shown as is. |
| `dot` | `boolean` | `false` | Shows a small dot without text instead of the count. |
| `color` | `WakebColor` | `"danger"` | Indicator color: a Wakeb intent or a CSS color. |
| `visible` | `boolean` | `true` | false hides the indicator and keeps the wrapped element. |
| `label` | `string` | `undefined` | Accessible name of the indicator, for example "5 unread notifications". Without it the name is the shown text. |
| `location` | `CountBadgeLocation` | `"top end"` | Corner: top end, top start, bottom end or bottom start. end and start follow the text direction; unknown values fall back to top end. |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

`default` (no payload) is the wrapped element, such as an icon button.

```ts
default?(): unknown;
```

## CSS variables

No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.

## Attribute target

Ordinary attrs and listeners reach the wrapper root.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

The indicator is role=status with aria-live=polite, so screen readers announce count changes; it does not name the wrapped element, which still needs its own name. Vuetify: VBadge; an unlabelled dot keeps Vuetify's default "Badge" name and a hidden indicator stays in the DOM with display none. PrimeVue: the PrimeVue Badge positioned by Wakeb. shadcn-vue: a shadcn-vue style badge positioned by Wakeb. On PrimeVue and shadcn-vue an unlabelled dot is aria-hidden and a hidden indicator is not rendered.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

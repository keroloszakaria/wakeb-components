<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WDropdown

A selection/action menu with native button integration and host-owned labels, colors and links.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<NavigationPlayground initial="dropdown" />

## Usage

```vue
<script setup lang="ts">
import { WDropdown } from 'wakeb-components'
</script>

<template>
  <WDropdown title="Status" :menu-items="[{ label: 'Pending', value: 0 }, { label: 'Approved', value: 1 }]" show-selected />
</template>
```

## Examples

### Numeric selection

Zero is a valid selected value; disabled options cannot be selected.

```vue
<script setup lang="ts">
import { WDropdown } from 'wakeb-components'
import { ref } from 'vue'
import type { NavigationKey } from 'wakeb-components'
const status = ref<NavigationKey>(0)
</script>

<template>
  <WDropdown v-model="status" title="Status" show-selected :menu-items="[{ label: 'Pending', value: 0 }, { label: 'Approved', value: 1 }, { label: 'Locked', value: 2, disabled: true }]" />
  <p>Value: {{ status }}</p>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `menuItems` | `readonly DropdownItem[]` | `[]` | Option records; original objects are emitted. |
| `title` | `string` | `undefined` | Activator title before formatting. |
| `icon` | `SharedIcon` | `""` | Explicit leading activator icon. |
| `iconColor` | `string` | `""` | Activator semantic color override. |
| `showSelected` | `boolean` | `false` | Show selection label; takes precedence over showBoth. |
| `showBoth` | `boolean` | `false` | Format title: selected label as one string. |
| `iconPosition` | `"start" \| "end"` | `undefined` | Activator icon placement; fallback start. |
| `type` | `string` | `undefined` | WButton visual type; fallback primary. |
| `classList` | `ComponentClass` | `""` | Classes on the activator button. |
| `size` | `string` | `"lg"` | Activator size. |
| `isLinks` | `boolean` | `false` | Native anchors for href/string to; router links belong in item-label. |
| `isLoading` | `boolean` | `false` | Disable activator/menu and show button loading. |
| `disabled` | `boolean` | `false` | Disable menu and activator. |
| `showChevron` | `boolean` | `true` | Append a chevron when a leading icon exists. |
| `modelValue` | `NavigationKey \| null` | `undefined` | External selection; zero is valid, null retains prior selection. |
| `expandIcon` | `SharedIcon` | `"$expand"` | Collapsed fallback icon. |
| `collapseIcon` | `SharedIcon` | `"$collapse"` | Open fallback icon. |
| `labelFormatter` | `(label: string \| undefined) => string` | `label => label ?? ""` | Host formatter/translator for activator and items. |
| `colorMap` | `Record<string, string>` | `undefined` | Override semantic success/danger/warning/primary/info colors. |
| `menuStyle` | `CSSProperties` | `undefined` | Styles/variables directly on the teleported list. |
| `providerProps` | `WakebProviderProps` | `undefined` | Nonportable. Native props and listeners for the menu primitive (Vuetify `VMenu`, PrimeVue `Menu`). Open state, `disabled`, stacking and the activator stay Wakeb-owned; on PrimeVue also `model`, `popup` and `pt`. Ignored keys produce a development warning. |

## Events

`selectedItem(item: DropdownItem)` then `update:modelValue(value: NavigationKey)` on an enabled option click, once each; selection updates afterwards.

```ts
selectedItem: [item: DropdownItem];
"update:modelValue": [value: NavigationKey];
```

## Slots

`activator`: `{props,isActive,buttonProps}`; bind both props and buttonProps to your button. `item-icon`: `{item,color}`; `item-label`: `{item,text}` for router-link or custom labels.

```ts
activator?(props: { props: Record<string, unknown>; isActive: boolean; buttonProps: ButtonProps }): unknown;
"item-icon"?(props: { item: DropdownItem; color: string }): unknown;
"item-label"?(props: { item: DropdownItem; text: string }): unknown;
```

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-dropdown-color-success` | `#12b76a` |
| `--wakeb-dropdown-color-danger` | `#f04438` |
| `--wakeb-dropdown-color-warning` | `#f79009` |
| `--wakeb-dropdown-color-primary` | `#087f8c` |
| `--wakeb-dropdown-color-info` | `#2e90fa` |
| `--wakeb-dropdown-activator-color` | `computed inline from selected color` |

## Attribute target

The root `div` on every provider: not the activator button and not the teleported menu. Style the menu with `menuStyle`; the activator slot receives its own props. `providerProps` goes to the menu primitive. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Enter / Space` | Open from the activator or select a focused enabled item. |
| `Up / Down` | Move focus between menu items. |
| `Escape` | Close the menu. |

## Accessibility and limits

Attrs target the outer div. VMenu/VList own click-away, Escape and keyboard movement; the WButton activator uses action=button. No i18n/router instance is imported. Format title: label through labelFormatter as one string, matching the legacy composite-label contract. modelValue synchronization runs when the value or menuItems change, so replaced records refresh the label; null clears the selection and undefined leaves an uncontrolled selection unchanged. Initial showSelected falls back to title or the first label without marking it active. An exact value match always wins; label matching is only a fallback; zero is supported. Raw CSS colors work on option icons/text; activator text accepts semantic keys and var()/hex values, preserving the old contract. Semantic WButton icon colors have their own WButton variables. Bind colors to menuStyle or colorMap for teleported lists. Rows use role=menuitem inside a role=menu list. With isLinks each enabled row is itself an anchor using href or a string to; disabled or loading rows have no href and set aria-disabled. Route objects require an item-label slot. Clicking an enabled row emits selection. Disabled/loading suppress normal menu interaction. On shadcn-vue, the popup anchors to the actual activator before its first mount, including on scrolled pages; keyboard and mouse selection use the same event contract.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

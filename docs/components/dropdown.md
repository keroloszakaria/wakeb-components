<!-- Generated from docs/reference-data.mjs -->
# WDropdown

A selection/action menu with native button integration and host-owned labels, colors and links.

## Usage

```vue
<script setup lang="ts">
import { WDropdown } from 'wakeb-components'
</script>
<template>
  <WDropdown title="Status" :menu-items="[{ label: 'Pending', value: 0 }, { label: 'Approved', value: 1 }]" show-selected />
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

## Events

`selectedItem(item: DropdownItem)` then `update:modelValue(value: NavigationKey)` on an enabled option click, once each; selection updates afterwards.

## Slots

`activator`: `{props,isActive,buttonProps}`; bind both props and buttonProps to your button. `item-icon`: `{item,color}`; `item-label`: `{item,text}` for router-link or custom labels.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-dropdown-color-success` | `#12b76a` |
| `--wakeb-dropdown-color-danger` | `#f04438` |
| `--wakeb-dropdown-color-warning` | `#f79009` |
| `--wakeb-dropdown-color-primary` | `#087f8c` |
| `--wakeb-dropdown-color-info` | `#2e90fa` |
| `--wakeb-dropdown-activator-color` | `computed inline from selected color` |

## Accessibility and limits

Attrs target the outer div. VMenu/VList own click-away, Escape and keyboard movement; the WButton activator uses action=button. No i18n/router instance is imported. Format title: label through labelFormatter as one string, matching the legacy composite-label contract. modelValue synchronization runs when the value changes, not when menuItems changes; null keeps the last selection. Initial showSelected falls back to title or the first label without marking it active. Value matching is strict, with label matching as fallback; zero is supported. Raw CSS colors work on option icons/text; activator text accepts semantic keys and var()/hex values, preserving the old contract. Semantic WButton icon colors have their own WButton variables. Bind colors to menuStyle or colorMap for teleported lists. Native links use href/string to; route objects require an item-label slot. Clicking a row emits selection; navigation belongs to the nested link. Disabled/loading suppress normal menu interaction.

## Try it

<NavigationPlayground initial="dropdown" />

<!-- Generated from docs/reference-data.mjs -->
# WBadge

Semantic chips with independent colors, dot styles and ordered icon/action slots.

## Usage

```vue
<script setup lang="ts">
import { WBadge } from 'wakeb-components'
</script>
<template>
  <WBadge label="Approved" type="success" is-dot />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `""` | Escaped fallback content. |
| `classList` | `ComponentClass` | `""` | Classes on the chip. |
| `type` | `string` | `"primary"` | primary/success/danger/warning/info/outline/outline-secondary/transparent/dark/tertiary/success-transparent/danger-transparent; custom classes are allowed. |
| `icon` | `SharedIcon` | `""` | Vuetify icon value or icon-slot value. |
| `isDot` | `boolean` | `false` | Show the decorative dot before content. |
| `borderRadius` | `string` | `"md"` | sm selects 8px; md/default preserves the 24px chip radius. |
| `customBorderRadius` | `string` | `""` | Explicit CSS border radius. |
| `customPadding` | `string` | `""` | Explicit padding, auto height and tighter content gap. |
| `dotColor` | `string` | `""` | Explicit CSS dot color. |
| `variant` | `"default" \| "flat" \| "text" \| "elevated" \| "tonal" \| "outlined" \| "plain"` | `"default"` | default maps to Vuetify tonal. |
| `iconSize` | `string \| number` | `"xs"` | xs/sm/md/lg/xl map to 16/20/24/32/40px. |
| `iconPosition` | `"before" \| "after"` | `"before"` | Place icon and actions before or after the content. |
| `chipAttrs` | `Record<string, unknown>` | `{}` | Explicit attrs for VChip; normal attrs belong to the wrapper. |

## Slots

`default`: replaces label. `icon`: `{ icon, size }`, with VIcon fallback. `actions`: follows the icon. Before order: icon/actions/dot/content. After order: dot/content/icon/actions.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-badge-check-color` | `#667085` |
| `--wakeb-badge-danger-bg` | `#fef3f2` |
| `--wakeb-badge-danger-bg-rgb` | `254, 243, 242` |
| `--wakeb-badge-danger-dot` | `#f04438` |
| `--wakeb-badge-danger-text` | `#b42318` |
| `--wakeb-badge-dark-bg` | `#fff` |
| `--wakeb-badge-dark-text` | `#667085` |
| `--wakeb-badge-fallback` | `not defined (normal per-token defaults)` |
| `--wakeb-badge-info-bg` | `#f0f9ff` |
| `--wakeb-badge-info-dot` | `#0ba5ec` |
| `--wakeb-badge-info-text` | `#026aa2` |
| `--wakeb-badge-neutral-bg` | `#f2f4f7` |
| `--wakeb-badge-neutral-text` | `#667085` |
| `--wakeb-badge-outline-border` | `#d0d5dd` |
| `--wakeb-badge-outline-secondary-border` | `#d0d5dd` |
| `--wakeb-badge-outline-secondary-text` | `#667085` |
| `--wakeb-badge-primary-bg` | `#eff8ff` |
| `--wakeb-badge-primary-button-bg` | `#087f8c` |
| `--wakeb-badge-primary-dot` | `#2e90fa` |
| `--wakeb-badge-primary-text` | `#175cd3` |
| `--wakeb-badge-success-bg` | `#ecfdf3` |
| `--wakeb-badge-success-bg-rgb` | `236, 253, 243` |
| `--wakeb-badge-success-dot` | `#12b76a` |
| `--wakeb-badge-success-text` | `#027a48` |
| `--wakeb-badge-tertiary-bg-rgb` | `242, 244, 247` |
| `--wakeb-badge-tertiary-text` | `#667085` |
| `--wakeb-badge-warning-bg` | `#fffaeb` |
| `--wakeb-badge-warning-dot` | `#f79009` |
| `--wakeb-badge-warning-text` | `#b54708` |

## Accessibility and limits

A badge is presentational unless explicit chipAttrs make it interactive. Supply visible status text; color and dot alone are not an accessible label. Native wrapper listeners receive bubbling DOM events; there are no custom emits. Chip styles preserve the extracted outline descendant backgrounds and specialized class hooks. Custom icons belong in the icon slot. Semantic variables customize colors without app tokens. Current-color variables are implementation details; use dotColor or documented semantic tokens. The compatibility-only --wakeb-badge-fallback switch stays undefined in normal use.

## Try it

<FoundationPlayground initial="badge" />

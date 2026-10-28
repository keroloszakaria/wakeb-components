<!-- Generated from docs/reference-data.mjs -->
# WBadgeStack

Badges with per-item styling, image slots and an optional overflow menu.

## Usage

```vue
<script setup lang="ts">
import { WBadgeStack } from 'wakeb-components'
</script>
<template>
  <WBadgeStack :items="[{ id: 1, label: 'Administrator' }, { id: 2, label: 'Reviewer' }]" show-overflow-menu overflow-label="More roles" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `readonly BadgeStackItem[]` | `[]` | Records with label, image URL, color and per-badge overrides. |
| `max` | `number` | `1` | Visible item slice limit; use a finite nonnegative integer. |
| `truncateLength` | `number` | `12` | Visible label length including the three-dot suffix. Overflow labels stay full. |
| `showOverflowMenu` | `boolean` | `false` | Enable a real hover/click/keyboard Vuetify menu on +N. |
| `badgeType` | `string` | `"transparent"` | Default WBadge semantic type. |
| `badgeVariant` | `BadgeProps["variant"]` | `"default"` | Default chip variant; default maps to tonal. |
| `badgeBorderRadius` | `string` | `"md"` | Default preset radius. |
| `customBorderRadius` | `string` | `"sm"` | Legacy custom radius passed verbatim; use a CSS length for new code. |
| `badgePadding` | `string` | `""` | Default custom chip padding. |
| `dotColor` | `string` | `""` | Default dot color. |
| `badgeClassList` | `ComponentClass` | `""` | Classes applied to each chip. |
| `isDot` | `boolean` | `false` | Default status dot visibility. |
| `iconSize` | `string \| number` | `"xs"` | Default badge glyph size; image dimensions use the stack stylesheet. |
| `iconPosition` | `"before" \| "after"` | `"before"` | Image/glyph placement in each badge. |
| `iconVariant` | `"default" \| "circle"` | `"default"` | Flat images or a circular image wrapper. |
| `iconBackgroundOpacity` | `number` | `1` | Circle background mix, clamped to 0–1. |
| `customOverflowBorderRadius` | `string` | `"999px"` | Custom radius of +N when it opens a menu. |
| `overflowLabel` | `string` | `""` | Accessible menu button name; fallback +N. |
| `overflowTag` | `"button" \| "div"` | `"button"` | Native button by default; div is reserved for legacy adapters. |
| `menuStyle` | `CSSProperties` | `undefined` | Styles/variables placed directly on the teleported list. |
| `badgeAttrs` | `Record<string, unknown>` | `undefined` | Wrapper attributes on every WBadge, including teleported rows. Avoid overriding its content props. |

## Events

No custom events. Native wrapper listeners bubble normally; menu state belongs to Vuetify.

## Slots

`icon`: `{ item, index, overflow, variant, style }`, replacing the complete image wrapper. `badgeIcon`: `{ item, icon, size }` for glyph-only rows. `label`: `{ item, text, overflow }`. Index is local to the visible/overflow slice.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-badge-stack-overflow-background` | `#fff` |
| `--wakeb-badge-stack-overflow-color` | `#101828` |
| `--wakeb-badge-stack-menu-surface` | `Vuetify surface` |
| `--wakeb-badge-stack-icon-background` | `#087f8c` |
| `--wakeb-badge-stack-focus` | `#087f8c` |
| `--wakeb-badge-stack-fallback` | `not defined (legacy menu adapter switch)` |

## Accessibility and limits

Ordinary attrs target the flex wrapper. No business/theme/icon registry is imported. WBadge variables also apply. Set menu colors through menuStyle and badgeAttrs styles/classes because Vuetify teleports the list outside the stack. Image URLs render as decorative img elements; no fetch proxy or detection tint is built in. Nullish per-item overrides preserve false/empty values. max keeps Array.slice and count arithmetic for compatibility; negative, fractional or nonfinite values are unsupported configurations. Visible labels use Wakeb Utils UTF-16 truncation; the menu shows full labels. Only the menu overflow uses customOverflowBorderRadius; the static +N uses customBorderRadius. The inherited 58px overflow selector and the legacy circle sizing rules are retained; replace through CSS as needed. Native menu button supports focus, Enter/Space and Escape via Vuetify. The legacy div tag does not provide a native tab stop.

## Try it

<IdentityPlayground initial="badge-stack" />

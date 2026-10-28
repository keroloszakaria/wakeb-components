<!-- Generated from docs/reference-data.mjs -->
# WAvatarStack

Overlapping avatars with nested data fields and an accessible overflow menu.

## Usage

```vue
<script setup lang="ts">
import { WAvatarStack } from 'wakeb-components'
</script>
<template>
  <WAvatarStack :items="[{ id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'Grace Hopper' }]" :max="1" show-overflow-menu overflow-label="More people" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `readonly unknown[]` | `[]` | Entries; null or malformed entries use fallback labels. |
| `max` | `number` | `3` | Visible count; finite values are floored and clamped to zero, NaN/infinity use 3. |
| `size` | `string \| number` | `32` | Vuetify avatar size. |
| `avatarColor` | `string` | `"primary"` | Initials and overflow background; image avatars retain primary. |
| `showOverflowMenu` | `boolean` | `false` | Show remaining users in a Vuetify menu. |
| `showTooltip` | `boolean` | `true` | Enable focus/hover tooltips for visible users. |
| `itemKey` | `string` | `"id"` | Dot path for a string/number key; index fallback. |
| `nameKey` | `string` | `"name"` | Dot path for a display name. |
| `avatarKey` | `string` | `"avatar"` | Dot path for the image URL. |
| `unknownLabel` | `string` | `"Unknown user"` | Localize missing names; missing initials render ?. |
| `overflowLabel` | `string` | `""` | Accessible name of overflow; defaults to +count. |
| `menuStyle` | `CSSProperties` | `{}` | Styles on the teleported menu, including its CSS variables. |
| `tooltipStyle` | `CSSProperties` | `{}` | Styles on the teleported tooltip content. |

## Slots

`avatar`: `{ item, index, label, avatar, initials }`; replaces each visible avatar. `overflow`: `{ count }`; replaces the +count text.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-avatar-border` | `Vuetify surface / white` |
| `--wakeb-avatar-overlap` | `-10px` |
| `--wakeb-avatar-focus` | `Vuetify primary / #087f8c` |
| `--wakeb-avatar-menu-surface` | `Vuetify surface / white` |
| `--wakeb-avatar-menu-text` | `Vuetify on-surface / #101828` |

## Accessibility and limits

Visible avatars have full accessible names and gain a tab stop only when tooltips are enabled. Overflow is a real button when the menu is enabled; click, keyboard activation and hover use Vuetify. Without a menu it is a static named image. Duplicate item keys are the caller’s responsibility. Only own-property dot paths are read; names are escaped text. Image paths accept http-prefixed, slash-relative or data URLs; image fetching follows the browser and Vuetify. Fallback initials use the first Unicode code point of two words. No i18n/store instance is needed. Teleported menu variables belong in menuStyle; tooltip styling belongs in tooltipStyle.

## Try it

<ComponentPlayground initial="avatar-stack" />

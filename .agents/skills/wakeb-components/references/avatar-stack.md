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

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `items` | `readonly unknown[]` | `[]` | Entries; null or malformed entries use fallback labels. |
| `max` | `number` | `3` | Visible count; finite values are floored and clamped to zero, NaN/infinity use 3. |
| `size` | `string \| number` | `32` | Avatar size: a number or numeric string in pixels, another CSS length, or a Vuetify size name (x-small 24px, small 32px, default 40px, large 48px, x-large 56px). |
| `avatarColor` | `WakebColor \| WakebDeprecatedColor` | `"primary"` | Initials, overflow and image-avatar background. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color. Initials use --wakeb-avatar-text. Deprecated Vuetify color names (WakebDeprecatedColor, such as error or red-darken-2) still type-check and render under Vuetify with WAKEB_DEPRECATED_VALUE; other providers fall back with WAKEB_UNKNOWN_VALUE. |
| `showOverflowMenu` | `boolean` | `false` | Show remaining users in an overflow list (a Vuetify menu or a PrimeVue Popover). |
| `showTooltip` | `boolean` | `true` | Enable focus/hover tooltips for visible users. |
| `itemKey` | `string` | `"id"` | Dot path for a string/number key; index fallback. |
| `nameKey` | `string` | `"name"` | Dot path for a display name. |
| `avatarKey` | `string` | `"avatar"` | Dot path for the image URL. |
| `unknownLabel` | `string` | `"Unknown user"` | Localize missing names; missing initials render ?. |
| `overflowLabel` | `string` | `""` | Accessible name of overflow; defaults to +count. |
| `menuStyle` | `CSSProperties` | `{}` | Styles on the teleported menu, including its CSS variables. |
| `tooltipStyle` | `CSSProperties` | `{}` | Styles on the teleported tooltip content. |

## Events

No declared component events.

```ts

```

## Slots

`avatar`: `{ item, index, label, avatar, initials }`; replaces each visible avatar. `overflow`: `{ count }`; replaces the +count text.

```ts
avatar(props: { item: unknown; index: number; label: string; avatar: string; initials: string }): unknown;
overflow(props: { count: number }): unknown;
```

## Attributes

The root `div.avatars-stack`. The overflow menu is teleported and does not receive them; style it with `menuStyle`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## CSS variables

- `--wakeb-avatar-border`: Vuetify surface / white
- `--wakeb-avatar-overlap`: -10px
- `--wakeb-avatar-focus`: Vuetify primary / #087f8c
- `--wakeb-avatar-menu-surface`: Vuetify surface / white
- `--wakeb-avatar-menu-text`: Vuetify on-surface / #101828
- `--wakeb-avatar-text`: --wakeb-ui-on-primary / #fff

## Accessibility and limits

Visible avatars have full accessible names and gain a tab stop only when tooltips are enabled. Overflow is a real button when the menu is enabled. It exposes aria-expanded but not aria-haspopup, because the list is informational. Click, keyboard activation and hover use Vuetify. Without a menu it is a static named image. Duplicate item keys are the caller’s responsibility. Only own-property dot paths are read; names are escaped text. Image paths accept http-prefixed, slash-relative or data URLs; image fetching follows the browser and Vuetify. Fallback initials use the first Unicode code point of two words. No i18n/store instance is needed. Teleported menu variables belong in menuStyle; tooltip styling belongs in tooltipStyle. The menu and tooltips carry only the plugin theme scope (data-wakeb-theme, dir, --wakeb-ui-* variables and zIndexOverlay); menuStyle and tooltipStyle win over it. PrimeVue: avatars use PrimeVue Avatar, sized and colored by Wakeb CSS. The overflow is a native button that opens a Popover on hover, focus or click; Escape or an outside click closes it, and aria-controls names it only while it is open. The Popover is a non-modal dialog (aria-modal="false") named by overflowLabel; PrimeVue places it below or above the button and adds its focus-trap sentinels. Tooltips use PrimeVue's tooltip directive; Wakeb also opens them on keyboard focus and closes them on blur and Escape. Tooltips carry the theme scope, zIndexOverlay in place of PrimeVue's tooltip z-index, and tooltipStyle, which wins (including its zIndex); a global PrimeVue pt.directives.tooltip.root style stays under them. The Popover takes zIndexOverlay. Provider color names in avatarColor are not portable on PrimeVue: they fall back to primary with WAKEB_UNKNOWN_VALUE. Under shadcn-vue: each avatar uses reka-ui Tooltip (focus and hover; Escape closes it; aria-describedby while open). Avatars are Wakeb markup with decorative images. The overflow list renders in reka-ui Popover with the Vuetify opening rules (hover, focus, click keeps it open); Escape and an outside press close it. The popover never takes focus, has aria-modal=false and an aria-label, and the button's aria-controls points to the list. The popover root carries the theme scope and zIndexOverlay; without the direction option reka-ui writes dir=ltr on it. Provider color names fall back to primary with WAKEB_UNKNOWN_VALUE.

## Overflow count

Limit visible people; the default overflow stays a text count.

```vue
<script setup lang="ts">
import { WAvatarStack } from 'wakeb-components'
</script>

<template>
  <WAvatarStack :items="[{ name: 'Ada' }, { name: 'Grace' }, { name: 'Linus' }]" :max="1" />
</template>
```

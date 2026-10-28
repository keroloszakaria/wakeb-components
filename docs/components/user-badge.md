<!-- Generated from docs/reference-data.mjs -->
# WUserBadge

A compact user badge with avatar/initials and an actions slot.

## Usage

```vue
<script setup lang="ts">
import { WUserBadge } from 'wakeb-components'
</script>
<template>
  <WUserBadge :user="{ name: 'Ada Lovelace', avatar: '/avatars/ada.png' }"><template #actions><button type="button">Remove</button></template></WUserBadge>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `user` | `BadgeUser` | `{}` | Presentational name/avatar record; data is escaped text. |
| `type` | `string` | `"outline"` | WBadge semantic type. |
| `borderRadius` | `string` | `"md"` | Badge radius preset. |
| `icon` | `SharedIcon` | `""` | Legacy WBadge icon prop; avatar slot replaces the glyph. |
| `iconSize` | `string \| number` | `"xs"` | Legacy WBadge glyph size; avatarSize controls the actual avatar. |
| `iconPosition` | `"before" \| "after"` | `"before"` | Avatar position relative to content. |
| `avatarSize` | `string \| number` | `16` | Vuetify avatar size. |
| `avatarColor` | `string` | `"primary"` | Vuetify initials avatar color. |

## Events

No custom events. Native listeners target the outer badge wrapper.

## Slots

`avatar`: `{ user, avatar, initials, size }`. `default`: `{ user }`, replacing the name only. `actions`: `{ user }`, rendered after the name.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-user-badge-initials-size` | `8px` |

## Accessibility and limits

Ordinary attrs/listeners target the WBadge wrapper. WBadge variables control the chip. HTTP-prefixed, root-relative and data URLs use VImg; other values use initials. There is no network-error initials fallback, matching the original component. Missing/empty name or an em dash uses ?, whitespace-only uses an empty initial; initials preserve charAt(0) UTF-16 behavior and use the first two words. Supply a user object with string fields; null is not supported. Avatars are decorative because the adjacent name identifies the user. Actions bubble naturally; stop propagation in the action if its parent has a click handler. No Tailwind dependency is required for the 8px initials.

## Try it

<IdentityPlayground initial="user-badge" />

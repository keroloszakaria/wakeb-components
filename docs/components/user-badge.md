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
| `type` | `WakebBadgeType` | `"outline"` | WBadge style key. |
| `borderRadius` | `string` | `"md"` | Badge radius preset. |
| `icon` | `SharedIcon` | `""` | Legacy WBadge icon prop; avatar slot replaces the glyph. |
| `iconSize` | `string \| number` | `"xs"` | Legacy WBadge glyph size; avatarSize controls the actual avatar. |
| `iconPosition` | `"before" \| "after"` | `"before"` | Avatar position relative to content. |
| `avatarSize` | `string \| number` | `16` | Avatar size: a number of pixels or a CSS length. Vuetify size names work only under Vuetify. |
| `avatarColor` | `WakebColor` | `"primary"` | Initials avatar background. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color. |

## Events

No custom events. Native listeners target the outer badge wrapper.

## Slots

`avatar`: `{ user, avatar, initials, size }`. `default`: `{ user }`, replacing the name only. `actions`: `{ user }`, rendered after the name.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-user-badge-initials-size` | `8px` |
| `--wakeb-avatar-text` | `--wakeb-ui-on-primary / #fff` |

## Attribute target

The root `div.wakeb-user-badge`, which is the WBadge wrapper. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Accessibility and limits

Ordinary attrs/listeners target the WBadge wrapper. WBadge variables control the chip. HTTP-prefixed, root-relative and data URLs use VImg; other values use initials. There is no network-error initials fallback, matching the original component. Missing/empty name or an em dash uses ?, whitespace-only uses an empty initial; initials preserve charAt(0) UTF-16 behavior and use the first two words. Supply a user object with string fields; null is not supported. Avatars are decorative because the adjacent name identifies the user. Actions bubble naturally; stop propagation in the action if its parent has a click handler. No Tailwind dependency is required for the 8px initials. Under PrimeVue: the badge is the PrimeVue WBadge renderer and the avatar is a PrimeVue Avatar (.wakeb-avatar) with a decorative img (alt="") or the initials; Wakeb CSS gives it the round VAvatar box, so it looks the same in PrimeVue styled or unstyled mode. avatarColor resolves Wakeb intents through --wakeb-ui-* and then the PrimeVue primary color for primary; provider color names fall back to primary with WAKEB_UNKNOWN_VALUE.

## Try it

<IdentityPlayground initial="user-badge" />

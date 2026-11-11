<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WUserBadge

A compact user badge with avatar/initials and an actions slot.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<IdentityPlayground initial="user-badge" />

## Usage

```vue
<script setup lang="ts">
import { WUserBadge } from 'wakeb-components'
</script>

<template>
  <WUserBadge :user="{ name: 'Ada Lovelace' }"><template #actions><button type="button">Remove</button></template></WUserBadge>
</template>
```

## Examples

### Initials fallback

Without an avatar URL, the name supplies the initials.

```vue
<script setup lang="ts">
import { WUserBadge } from 'wakeb-components'
</script>

<template>
  <WUserBadge :user="{ name: 'Grace Hopper' }" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `user` | `BadgeUser` | `{}` | Presentational name/avatar record; data is escaped text. |
| `type` | `WakebBadgeType \| WakebDeprecatedBadgeType` | `"outline"` | WBadge style key. |
| `borderRadius` | `string` | `"md"` | Badge radius preset. |
| `icon` | `SharedIcon` | `""` | Legacy WBadge icon prop; avatar slot replaces the glyph. |
| `iconSize` | `string \| number` | `"xs"` | Legacy WBadge glyph size; avatarSize controls the actual avatar. |
| `iconPosition` | `"before" \| "after"` | `"before"` | Avatar position relative to content. |
| `avatarSize` | `string \| number` | `16` | Avatar size: a number of pixels or a CSS length. Vuetify size names work only under Vuetify. |
| `avatarColor` | `WakebColor \| WakebDeprecatedColor` | `"primary"` | Initials avatar background. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color. Deprecated Vuetify color names (WakebDeprecatedColor, such as error or red-darken-2) still type-check and render under Vuetify with WAKEB_DEPRECATED_VALUE; other providers fall back with WAKEB_UNKNOWN_VALUE. |

## Events

No custom events. Native listeners target the outer badge wrapper.



## Slots

`avatar`: `{ user, avatar, initials, size }`. `default`: `{ user }`, replacing the name only. `actions`: `{ user }`, rendered after the name.

```ts
avatar?(props: { user: BadgeUser; avatar: string; initials: string; size: string | number }): unknown;
default?(props: { user: BadgeUser }): unknown;
actions?(props: { user: BadgeUser }): unknown;
```

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-user-badge-initials-size` | `8px` |
| `--wakeb-avatar-text` | `--wakeb-ui-on-primary / #fff` |

## Attribute target

The root `div.wakeb-user-badge`, which is the WBadge wrapper. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

Ordinary attrs/listeners target the WBadge wrapper. WBadge variables control the chip. HTTP-prefixed, root-relative and data URLs use VImg; other values use initials. There is no network-error initials fallback, matching the original component. Missing/empty name or an em dash uses ?, whitespace-only uses an empty initial; initials preserve charAt(0) UTF-16 behavior and use the first two words. Supply a user object with string fields; null is not supported. Avatars are decorative because the adjacent name identifies the user. Actions bubble naturally; stop propagation in the action if its parent has a click handler. No Tailwind dependency is required for the 8px initials. Under PrimeVue: the badge is the PrimeVue WBadge renderer and the avatar is a PrimeVue Avatar (.wakeb-avatar) with a decorative img (alt="") or the initials; Wakeb CSS gives it the round VAvatar box, so it looks the same in PrimeVue styled or unstyled mode. avatarColor resolves Wakeb intents through --wakeb-ui-* and then the PrimeVue primary color for primary; provider color names fall back to primary with WAKEB_UNKNOWN_VALUE. Under shadcn-vue: the avatar is Wakeb markup (data-slot=avatar) with a plain decorative image, so it renders at once and on the server; reka-ui's AvatarImage is not used because it waits for the image to load. avatarSize numbers and Vuetify size names become pixels. Provider color names fall back to primary with WAKEB_UNKNOWN_VALUE.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).

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
| `type` | `WakebBadgeType` | `"primary"` | Wakeb style key painted by Wakeb CSS: primary, primarybtn, success, danger, warning, info, outline, outline-secondary, transparent, dark, tertiary, success-transparent, danger-transparent, check, uncheck. It is no longer sent to Vuetify as a color. Other values are deprecated Vuetify color names: they still render under Vuetify with WAKEB_DEPRECATED_VALUE. Under PrimeVue they fall back to primary with WAKEB_UNKNOWN_VALUE. |
| `icon` | `SharedIcon` | `""` | Icon name, SVG path data or component (Providers > Icons), or the icon-slot value. |
| `isDot` | `boolean` | `false` | Show the decorative dot before content. |
| `borderRadius` | `string` | `"md"` | sm selects 8px; md/default preserves the 24px chip radius. |
| `customBorderRadius` | `string` | `""` | Explicit CSS border radius. |
| `customPadding` | `string` | `""` | Explicit padding, auto height and tighter content gap. |
| `dotColor` | `WakebColor` | `undefined` | Dot color override. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color. |
| `variant` | `WakebVariant \| WakebDeprecatedVariant` | `"soft"` | Portable style: soft, solid, outline or ghost. Baseline names (default, tonal, flat, elevated, outlined, text, plain) still work and warn in development. |
| `iconSize` | `string \| number` | `"xs"` | xs/sm/md/lg/xl map to 16/20/24/32/40px. |
| `iconPosition` | `"before" \| "after"` | `"before"` | Place icon and actions before or after the content. |
| `chipAttrs` | `Record<string, unknown>` | `{}` | Explicit attrs for the chip element (VChip on Vuetify, the unstyled PrimeVue Tag on PrimeVue); normal attrs belong to the wrapper. |

## Slots

`default`: replaces label. `icon`: `{ icon, size }`, with a provider icon fallback. `actions`: follows the icon. Before order: icon/actions/dot/content. After order: dot/content/icon/actions.

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
| `--wakeb-badge-solid-bg` | `type dot color / --wakeb-ui-primary` |
| `--wakeb-badge-solid-text` | `--wakeb-ui-on-primary / #fff` |
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

## Attribute target

The root wrapper `div`. The chip inside receives only `chipAttrs`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Accessibility and limits

A badge is presentational unless explicit chipAttrs make it interactive. Supply visible status text; color and dot alone are not an accessible label. Native wrapper listeners receive bubbling DOM events; there are no custom emits. Chip styles preserve the extracted outline descendant backgrounds and specialized class hooks. Custom icons belong in the icon slot. Semantic variables customize colors without app tokens. Current-color variables are implementation details; use dotColor or documented semantic tokens. The compatibility-only --wakeb-badge-fallback switch stays undefined in normal use. Every renderer marks the chip with .wakeb-badge, its Wakeb type class and one of .wakeb-badge--soft, --solid, --outline or --ghost. Under PrimeVue: the chip is an unstyled PrimeVue Tag (a span) whose content sits in span.wakeb-badge__content; the same Wakeb stylesheet as on Vuetify paints types, the solid variant, radius, padding and the dot, and Wakeb CSS adds the VChip looks for soft (12% currentColor underlay) and outline (1px currentColor border). chipAttrs reach the Tag element as DOM attributes, so VChip props in it have no effect. Non-Wakeb types are not colors: primary is used with WAKEB_UNKNOWN_VALUE. Icons render through the Wakeb icon renderer; MDI names need an icons alias. providerProps is not accepted on either provider. Under shadcn-vue: the badge is Wakeb markup (a span with data-slot=badge) painted by the shared Wakeb badge CSS, as on PrimeVue; provider color names fall back to primary with WAKEB_UNKNOWN_VALUE.

## Try it

<FoundationPlayground initial="badge" />

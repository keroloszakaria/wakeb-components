<!-- Generated from docs/reference-data.mjs -->
# WTooltipBtn

An icon button with host-translated tooltip text and native button attributes.

## Usage

```vue
<script setup lang="ts">
import { WTooltipBtn } from 'wakeb-components'
</script>
<template>
  <WTooltipBtn text="Save changes" icon="$complete" btn-icon aria-label="Save changes" @click="() => {}" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `SharedIcon` | `undefined` | Icon name, SVG path data or component (Providers > Icons); the icon slot can replace it. |
| `text` | `string` | `""` | Already translated tooltip text; empty disables the tooltip. |
| `ariaLabel` | `string \| null` | `undefined` | Explicit accessible button name; fallback text. |
| `btnIcon` | `boolean` | `false` | Enable the round icon-button layout (VBtn icon on Vuetify, a 48px circle on PrimeVue). |
| `variant` | `WakebVariant \| WakebDeprecatedVariant` | `"ghost"` | Portable style: soft, solid, outline or ghost. Baseline names (text, flat, elevated, tonal, outlined, plain) still work and warn in development. |
| `location` | `"top" \| "bottom" \| "start" \| "end"` | `"bottom"` | Tooltip placement. |
| `openDelay` | `string \| number` | `200` | Tooltip opening delay in milliseconds. |
| `contentClass` | `string` | `"v-app-tooltip-btn__content"` | Class on the tooltip overlay. |
| `tooltipStyle` | `CSSProperties` | `undefined` | Styles directly on the teleported tooltip content. |
| `wrapperAttrs` | `Record<string, unknown>` | `undefined` | Explicit attributes for the layout span; ordinary attrs target the native button. |

## Events

No custom events. Native click/keyboard/form attrs are forwarded to the native button without an extra wrapper listener.

## Slots

`icon`: `{ icon }`, replacing the default icon. There is no default content slot; use WButton for text actions.

## CSS variables

| Variable | Default |
| --- | --- |


## Attribute target

The native `<button>` (VBtn on Vuetify, an unstyled PrimeVue Button on PrimeVue), not the outer span; use `wrapperAttrs` for the span. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Accessibility and limits

VBtn receives ordinary attrs and native listeners once; use wrapperAttrs for the outer span. Defaults keep the original look: the ghost variant (Vuetify text), bottom placement and 200ms opening delay. Pass text=t(key) from the host; the package has no i18n dependency or path prop. VTooltip uses activator=parent, preserving Vuetify focus, hover, Escape and aria-describedby. Provide ariaLabel or meaningful text for icon-only controls. Disabled native buttons retain their disabled behavior and do not offer a keyboard tooltip target; use a deliberate separate help element if needed. Icon names resolve through the icons plugin option and the Wakeb built-ins first; other names need your Vuetify icon configuration. The icon slot can supply an inline SVG. Tooltip styles belong in tooltipStyle, not inherited variables, because of teleport; the tooltip carries only the plugin theme scope and zIndexOverlay, and tooltipStyle wins over it. VBtn styling uses your existing Vuetify theme; there are no additional package-specific CSS variables. Under PrimeVue: the button is an unstyled PrimeVue Button with type=button by default; caller attrs such as type, form, disabled and aria-label win, and native listeners fire once. Wakeb CSS paints the four variants with currentColor (solid uses --wakeb-ui-primary and --wakeb-ui-on-primary) in the VBtn box: 36px high with a 64px minimum width, or a 48px circle with btnIcon; there are no PrimeVue severities or sizes. The PrimeVue tooltip directive opens on hover and keyboard focus after openDelay, closes on blur, click and Escape, and is linked through aria-describedby with a useId id. start and end follow the plugin direction option. tooltipStyle styles the tooltip text bubble and contentClass the tooltip root, which carries the plugin theme scope; PrimeVue keeps its own tooltip z-index, so zIndexOverlay does not apply. Without an icon nothing renders inside the button; Vuetify renders an empty VIcon.

## Try it

<IdentityPlayground initial="tooltip-btn" />

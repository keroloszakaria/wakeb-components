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
| `icon` | `SharedIcon` | `undefined` | Vuetify icon; replace with the icon slot for custom SVGs. |
| `text` | `string` | `""` | Already translated tooltip text; empty disables the tooltip. |
| `ariaLabel` | `string \| null` | `undefined` | Explicit accessible button name; fallback text. |
| `btnIcon` | `boolean` | `false` | Enable the native Vuetify icon-button layout. |
| `variant` | `"text" \| "flat" \| "elevated" \| "tonal" \| "outlined" \| "plain"` | `"text"` | Vuetify button variant. |
| `location` | `"top" \| "bottom" \| "start" \| "end"` | `"bottom"` | Tooltip placement. |
| `openDelay` | `string \| number` | `200` | Tooltip opening delay in milliseconds. |
| `contentClass` | `string` | `"v-app-tooltip-btn__content"` | Class on the tooltip overlay. |
| `tooltipStyle` | `CSSProperties` | `undefined` | Styles directly on the teleported tooltip content. |
| `wrapperAttrs` | `Record<string, unknown>` | `undefined` | Explicit attributes for the layout span; ordinary attrs target VBtn. |

## Events

No custom events. Native click/keyboard/form attrs are forwarded to VBtn without an extra wrapper listener.

## Slots

`icon`: `{ icon }`, replacing VIcon. There is no default content slot; use WButton for text actions.

## CSS variables

| Variable | Default |
| --- | --- |


## Accessibility and limits

VBtn receives ordinary attrs and native listeners once; use wrapperAttrs for the outer span. Defaults match the original text variant, bottom placement and 200ms opening delay. Pass text=t(key) from the host; the package has no i18n dependency or path prop. VTooltip uses activator=parent, preserving Vuetify focus, hover, Escape and aria-describedby. Provide ariaLabel or meaningful text for icon-only controls. Disabled native buttons retain their disabled behavior and do not offer a keyboard tooltip target; use a deliberate separate help element if needed. VIcon requires your Vuetify icon configuration; the icon slot can supply an inline SVG. Tooltip styles belong in tooltipStyle, not inherited variables, because of teleport. VBtn styling uses your existing Vuetify theme; there are no additional package-specific CSS variables.

## Try it

<IdentityPlayground initial="tooltip-btn" />

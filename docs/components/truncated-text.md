<!-- Generated from docs/reference-data.mjs -->
# WTruncatedText

Readable shortened text with a tooltip that opens on hover and keyboard focus.

## Usage

```vue
<script setup lang="ts">
import { WTruncatedText } from 'wakeb-components'
</script>
<template>
  <WTruncatedText label="A shared foundation for every team" :length="20" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `""` | The full label; HTML is escaped. |
| `length` | `number` | `12` | Maximum UTF-16 length including the three-dot suffix. |
| `tooltipLocation` | `"top" \| "bottom" \| "start" \| "end"` | `"top"` | Tooltip placement; start and end are logical sides. |
| `tooltipMaxWidth` | `string \| number` | `280` | Tooltip maximum width. |
| `contentClass` | `string` | `"wakeb-truncated-tooltip"` | Class on the teleported tooltip content. |
| `tooltipStyle` | `CSSProperties` | `undefined` | Inline styles on the actual tooltip content, including its colors. |

## Slots

`default`: `{ text, label, truncated }`. The fallback renders shortened text.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-text-focus-color` | `Vuetify primary or --wakeb-ui-focus / PrimeVue primary / #087f5b` |

## Attribute target

The text `<span>` that activates the tooltip. Caller focus and hover listeners are composed with the tooltip's own. Wakeb owns tabindex and aria-label: it sets them for truncated text and removes them otherwise, so caller values are ignored. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Accessibility and limits

The span receives DOM attributes and listeners. Focus/hover handlers are composed with Vuetify. Truncated labels get tabindex=0 and the full aria-label; short labels add no tab stop. Text truncation preserves Wakeb Utils behavior, including limits below 3 and UTF-16 emoji splitting. Tooltip location and delays follow Vuetify. Under PrimeVue: the PrimeVue tooltip directive renders the tooltip on document.body; Wakeb opens it on hover and keyboard focus, and it closes on blur, click and Escape. The span references it through aria-describedby with a useId id, and a caller aria-describedby wins, as on Vuetify. start and end follow the plugin direction option. tooltipStyle styles the tooltip text bubble, contentClass and tooltipMaxWidth the tooltip root, which also carries the plugin theme scope; PrimeVue keeps its own tooltip z-index, so zIndexOverlay does not apply. The focus outline falls back to --wakeb-ui-focus, then the PrimeVue primary color. Under shadcn-vue: reka-ui Tooltip opens on keyboard focus and hover (mouseenter as well as pointer events), stays open while the pointer is over it, and closes on blur and Escape. While it is open the span's aria-describedby points to it; a caller aria-describedby wins. Server output has no aria-describedby because the tooltip is closed. tooltipStyle styles the text inside the tooltip; the tooltip root carries the theme scope, contentClass, tooltipMaxWidth and zIndexOverlay. Without the plugin direction option, reka-ui writes dir=ltr on the tooltip. The focus outline falls back to --wakeb-ui-focus, then the shadcn-vue --ring variable.

## Try it

<ComponentPlayground initial="truncated-text" />

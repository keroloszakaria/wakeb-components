<!-- Generated from docs/reference-data.mjs -->
# WTruncatedText

Readable shortened text with a keyboard-accessible Vuetify tooltip.

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
| `tooltipLocation` | `"top" \| "bottom" \| "start" \| "end"` | `"top"` | Tooltip placement through Vuetify. |
| `tooltipMaxWidth` | `string \| number` | `280` | Tooltip maximum width. |
| `contentClass` | `string` | `"wakeb-truncated-tooltip"` | Class on the teleported tooltip content. |
| `tooltipStyle` | `CSSProperties` | `undefined` | Inline styles on the actual tooltip content, including its colors. |

## Slots

`default`: `{ text, label, truncated }`. The fallback renders shortened text.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-text-focus-color` | `Vuetify primary / #087f5b` |

## Accessibility and limits

The span receives DOM attributes and listeners. Focus/hover handlers are composed with Vuetify. Truncated labels get tabindex=0 and the full aria-label; short labels add no tab stop. Text truncation preserves Wakeb Utils behavior, including limits below 3 and UTF-16 emoji splitting. Tooltip location and delays follow Vuetify.

## Try it

<ComponentPlayground initial="truncated-text" />

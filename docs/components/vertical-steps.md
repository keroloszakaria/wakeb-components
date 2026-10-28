<!-- Generated from docs/reference-data.mjs -->
# WVerticalSteps

Presentational steps with replaceable icons, title slots and a plain data contract.

## Usage

```vue
<script setup lang="ts">
import { WVerticalSteps } from 'wakeb-components'
</script>
<template>
  <WVerticalSteps :steps="[{ title: 'Review', is_active: true, time: '09:00', date: '2026-10-28' }, { title: 'Ship' }]" label="Release steps" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `readonly VerticalStep[]` | `[]` | title/time/date/is_active descriptors. See Data models. |
| `label` | `string` | `"Steps"` | Accessible list name; localize in the host. |

## Slots

`indicator` replaces the complete marker; `icon` replaces the default marker content. `title`, `timeIcon`, `dateIcon`: each receives `{ step, index }`. Fallback icons are simple text symbols; no icon font is required.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-steps-accent` | `#087f8c` |
| `--wakeb-steps-surface` | `#f9fafb` |
| `--wakeb-steps-text` | `currentColor` |
| `--wakeb-steps-active-text` | `#fff` |
| `--wakeb-steps-muted` | `#667085` |

## Accessibility and limits

Uses list/listitem roles. is_active is a visual completion flag, not interactive navigation or aria-current. The host supplies formatted date/time strings and translations. Text is escaped. Steps use positional keys and do not own selection state. Layout uses logical directions and needs no utility framework. This preserves the horizontal row layout; long content should be tested in the host’s available width.

## Try it

<ComponentPlayground initial="vertical-steps" />

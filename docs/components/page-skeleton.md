<!-- Generated from docs/reference-data.mjs -->
# WPageSkeleton

Responsive Vuetify skeleton rows driven by typed descriptors.

## Usage

```vue
<script setup lang="ts">
import { WPageSkeleton } from 'wakeb-components'
</script>
<template>
  <WPageSkeleton :config="[{ repeat: 2, cols: 12, md: 6, variant: 'card', items: [{ type: 'text' }, { type: 'paragraph' }] }]" label="Loading report" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `config` | `readonly SkeletonRow[]` | `required` | Row descriptors; empty arrays render an empty status. See Data models. |
| `direction` | `"row" \| "column"` | `"column"` | Root flex direction, independent of Tailwind. |
| `label` | `string` | `"Loading content"` | Accessible status name; localize in the host. |

## Slots

No slots; compose rows with config, header/items, classes and Vuetify grid breakpoints.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-skeleton-surface` | `#fff` |
| `--wakeb-skeleton-border` | `#eaecf0` |

## Accessibility and limits

Uses one named role=status and aria-busy=true; skeleton rows are aria-hidden to prevent duplicate announcements. Render this component only while content is loading. Row repeat is floored; missing, nonfinite, zero or negative repeats render one column. cols defaults to 12 when falsy, preserving the app contract; sm/md/lg follow Vuetify. Skeleton type strings are Vuetify types, including its comma/multiplier syntax. No application CSS is required. Current specialized card bone styling targets Vuetify 3 structure.

## Try it

<ComponentPlayground initial="page-skeleton" />

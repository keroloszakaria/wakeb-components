<!-- Generated from docs/reference-data.mjs -->
# WPageSkeleton

Responsive skeleton rows on the Wakeb grid, driven by typed descriptors.

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

## Attribute target

The root `div.page-skeleton` with `role="status"`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Accessibility and limits

Uses one named role=status and aria-busy=true; skeleton rows are aria-hidden to prevent duplicate announcements. Render this component only while content is loading. Row repeat is floored; missing, nonfinite, zero or negative repeats render one column. cols defaults to 12 when falsy, preserving the app contract. cols, sm, md and lg take 1–12, 'auto' or true (grow) on the Wakeb 12-column grid with fixed breakpoints sm 600px, md 960px and lg 1280px; provider breakpoint settings do not change it. Other spans are ignored (cols uses 12) with WAKEB_UNKNOWN_VALUE. Rows and columns are wakeb-grid-row and wakeb-grid-col elements, not Vuetify VRow/VCol. Item and header types use the Wakeb skeleton grammar: portable names, comma sequences and @N repetitions capped at 100. Unknown names are skipped with WAKEB_UNKNOWN_VALUE; Vuetify-only names still render under Vuetify with WAKEB_DEPRECATED_VALUE. No application CSS is required. Current specialized card bone styling targets Vuetify 3 structure.

## Try it

<ComponentPlayground initial="page-skeleton" />

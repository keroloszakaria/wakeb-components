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

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `config` | `readonly SkeletonRow[]` | `required` | Row descriptors; empty arrays render an empty status. See Data models. |
| `direction` | `"row" \| "column"` | `"column"` | Root flex direction, independent of Tailwind. |
| `label` | `string` | `"Loading content"` | Accessible status name; localize in the host. |

## Events

No declared component events.

```ts

```

## Slots

No slots; compose rows with config, header/items, classes and Vuetify grid breakpoints.

```ts

```

## Attributes

The root `div.page-skeleton` with `role="status"` on every provider. `role` and `aria-busy` are Wakeb-owned and win over caller attributes; name the status with `label`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## CSS variables

- `--wakeb-skeleton-surface`: #fff
- `--wakeb-skeleton-border`: #eaecf0

## Accessibility and limits

Uses one named role=status and aria-busy=true; skeleton rows are aria-hidden to prevent duplicate announcements. Render this component only while content is loading. Row repeat is floored; missing, nonfinite, zero or negative repeats render one column. cols defaults to 12 when falsy, preserving the app contract. cols, sm, md and lg take 1–12, 'auto' or true (grow) on the Wakeb 12-column grid with fixed breakpoints sm 600px, md 960px and lg 1280px; provider breakpoint settings do not change it. Other spans are ignored (cols uses 12) with WAKEB_UNKNOWN_VALUE. Rows and columns are wakeb-grid-row and wakeb-grid-col elements, not Vuetify VRow/VCol. Item and header types use the Wakeb skeleton grammar: portable names, comma sequences and @N repetitions capped at 100. Unknown names are skipped with WAKEB_UNKNOWN_VALUE; Vuetify-only names still render under Vuetify with WAKEB_DEPRECATED_VALUE. No application CSS is required. The card variant moves avatar list-item bones to the end and makes them 155px high on both providers.

**PrimeVue rendering.** Same grid, grammar, variants and semantics as Vuetify. Vuetify-only names are skipped with WAKEB_UNKNOWN_VALUE instead of rendering. Each item is a `div.wakeb-skeleton` box sized by `width`/`height` (numbers are px) that holds one `.wakeb-skeleton__part--<name>` per parsed name, drawn with PrimeVue `Skeleton` in unstyled mode. Wakeb CSS paints the bones with `--wakeb-ui-border` and a wave animation that stops under reduced motion and reverses in RTL. Sizes approximate Vuetify 3 and are not pixel-identical.

| Name | PrimeVue bones |
| --- | --- |
| `text` | One full-width line |
| `paragraph` | Three lines, the last at 60% |
| `heading` | One 50% bar, 1.5rem high |
| `avatar` | One 48px circle |
| `image` | One full-width block, 200px high |
| `button` | One 64×36px block |
| `chip` | One 96×32px pill |
| `list-item` | One line in a 48px row |
| `list-item-avatar` | 40px circle and one line |
| `list-item-two-line` | Two lines |
| `list-item-three-line` | Three lines |
| `list-item-avatar-two-line` | 40px circle and two lines |
| `list-item-avatar-three-line` | 40px circle and three lines |
| `table` | Heading, five rows of six cells and a footer line |
| `table-row` | Six cells |
| `card` | 150px image block and a heading | Under shadcn-vue the grammar, grid and bone shapes match PrimeVue; each bone is the shadcn-vue Skeleton (data-slot="skeleton", aria-hidden), which pulses with --accent and --radius instead of the Wakeb wave and stops under reduced motion.

## Responsive columns

Two half-width columns at md, stacked on smaller screens.

```vue
<script setup lang="ts">
import { WPageSkeleton } from 'wakeb-components'
</script>

<template>
  <WPageSkeleton :config="[{ repeat: 2, cols: 12, md: 6, items: [{ type: 'heading, paragraph' }] }]" label="Loading cards" />
</template>
```

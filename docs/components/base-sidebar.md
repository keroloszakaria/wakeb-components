<!-- Generated from docs/reference-data.mjs -->
# WBaseSidebar

A gradient sidebar shell with search/content slots, filter actions and loading/empty/list states.

## Usage

```vue
<script setup lang="ts">
import { WBaseSidebar } from 'wakeb-components'
</script>
<template>
  <WBaseSidebar title="People" :items="[{id:1,name:'Ada'}]" :has-filter="false"><template #item="{item}">{{item.name}}</template></WBaseSidebar>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `required` | Already translated heading. |
| `loading` | `boolean` | `false` | Loading state takes precedence over empty/items. |
| `items` | `readonly SidebarItem[]` | `[]` | Presentational item records. |
| `skeletonType` | `string` | `"list-item-two-line, list-item-two-line, list-item-two-line"` | Vuetify skeleton type. |
| `hasFilter` | `boolean` | `true` | Render default filter controls. |
| `isFiltered` | `boolean` | `false` | Render the default cancel control. |
| `skeletonWidth` | `string \| number` | `"360px"` | Vuetify skeleton width. |
| `itemKey` | `string` | `"id"` | Direct key field, falling back to row index. |
| `filterLabel` | `string` | `"Filter"` | Default filter button text. |
| `cancelLabel` | `string` | `"Cancel"` | Default cancel button text. |
| `emptyLabel` | `string` | `"No data"` | Already translated empty-state text. |

## Events

`search(payload: unknown)` only when a search/content slot calls its search callback; `filterClick()` and `filterCancel()` for controls. No records or schemas are mutated.

## Slots

`header-actions`: `{isFiltered,filterClick,filterCancel}`; `content` / `search`: `{search(payload)}`; `item`: `{item,index}`; `loading`: `{type,width}`; `empty`: `{label}`; `filter-modal`: no props. The content slot replaces search and the list entirely.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-sidebar-outer-bg` | `120deg conic gradient` |
| `--wakeb-sidebar-inner-bg` | `240deg linear gradient` |
| `--wakeb-sidebar-body` | `#fff` |
| `--wakeb-sidebar-body-rgb` | `255,255,255` |
| `--wakeb-sidebar-title` | `#fff` |
| `--wakeb-sidebar-empty-color` | `#667085` |
| `--wakeb-sidebar-fallback` | `undefined (legacy adapter switch)` |

## Accessibility and limits

Attrs target the outer div. The package owns no form/schema, store, translations or filter modal. Supply a native input or your form library through search and call search(payload). Aware retains GenericForm and updateSchema in its adapter. Without a search slot, the public component renders no search control. The header remains while content is replaced. Loading wins over empty/list. The default list keeps min-height 400px and max-height 60dvh, with a 340px minimum shell width; override root min-width for narrower responsive layouts. The bottom 72px fade is decorative and does not intercept pointers. Use namespaced CSS variables for gradients/body/title colors and loading/empty slots for custom states. Legacy global card-gradient/sidebar rules remain in Aware only; package styles are scoped. List item identity uses a direct field or index, and slots own item interactions.

## Try it

<CompositionPlayground initial="base-sidebar" />

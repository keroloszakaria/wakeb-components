# WDataTable

A server-driven data table: column headers, rows as given, single-column sorting, row selection, row clicks and loading and empty views. Paging and sorting the data are the caller's job.

## Usage

```vue
<script setup lang="ts">
import { WDataTable } from 'wakeb-components'
import { ref } from 'vue'
import type { DataTableOptions } from 'wakeb-components'
const selected = ref<(string | number)[]>([])
const rows = ref([{ id: 1, name: 'Gate 3' }])
const load = (options: DataTableOptions) => console.log(options)
</script>

<template>
  <WDataTable v-model="selected" :headers="[{ key: 'id', title: 'ID' }, { key: 'name', title: 'Name' }]" :items="rows" selectable aria-label="Cameras" @update:options="load" />
</template>
```

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `headers` | `readonly DataTableHeader[]` | `[]` | Columns: key (item field, dot paths such as owner.name read nested values), title, align (start, center or end), sortable (true unless false) and width (px number or CSS length). |
| `items` | `readonly DataTableItem[]` | `[]` | Rows of the current page, shown in the given order. The table neither sorts nor slices them. |
| `itemValue` | `string` | `"id"` | Item field (or dot path) that identifies a row for selection. |
| `modelValue` | `readonly (string \| number)[]` | `[]` | Selected row values (v-model). The table also keeps its own selection when v-model is not bound. |
| `selectable` | `boolean` | `false` | Adds a checkbox column with a select-all checkbox for the current rows. |
| `loading` | `boolean` | `false` | Replaces the rows with the loading view and sets aria-busy=true. |
| `sortBy` | `readonly DataTableSortItem[]` | `[]` | Current sort as [{ key, order }] (v-model:sort-by). Only one column sorts at a time. |
| `page` | `number` | `1` | Current page, echoed in update:options. The table has no footer; render your own pagination. |
| `itemsPerPage` | `number` | `10` | Page size, echoed in update:options. |
| `noDataText` | `string` | `undefined` | Text of the empty view; defaults to "No data available" or "لا توجد بيانات" by locale. |
| `selectAllLabel` | `string` | `undefined` | Accessible name of the select-all checkbox; defaults to "Select all rows" or "تحديد كل الصفوف". |
| `selectRowLabel` | `string` | `undefined` | Accessible name of each row checkbox; defaults to "Select row" or "تحديد الصف". |
| `ariaLabel` | `string` | `undefined` | Accessible name of the table element. |

## Events

`update:modelValue` sends the selected row values. `update:sortBy` sends the new sort. `update:options` sends { page, itemsPerPage, sortBy } once on mount and after every change, so you can load the first page from it; a sort change returns page to 1. `click:row` sends (item, event) for a row click; clicks on the selection checkboxes do not emit it.

```ts
"update:modelValue": [value: (string | number)[]];
"update:sortBy": [value: DataTableSortItem[]];
"update:options": [value: DataTableOptions];
"click:row": [item: DataTableItem, event: MouseEvent];
```

## Slots

`item.<key>` ({ item, value, index }) replaces one column's cell, for example `#item.status="{ value }"`. `loading` (no payload) replaces the default skeleton rows (WSkeleton table-row@5). `no-data` (no payload) replaces the empty text.

```ts
[key: `item.${string}`]: ((props: { item: DataTableItem; value: unknown; index: number }) => unknown) | undefined;
loading?(): unknown;
"no-data"?(): unknown;
```

## Attributes

Ordinary attrs and listeners reach the table root: VDataTableServer on Vuetify, DataTable on PrimeVue and the wrapper div on shadcn-vue.

## CSS variables

No component-specific CSS variables.

## Accessibility and limits

Sortable headers are keyboard operable and expose aria-sort (ascending or descending) on the sorted column. Rows are not focusable, so a row click needs another keyboard path, such as a link or button in a cell. No expandable rows, grouping, multi-column sort, column resizing, virtual scrolling or built-in footer. Vuetify: VDataTableServer with hide-default-footer; it also shows its loader line under the header while loading. PrimeVue: a lazy DataTable with removable sort; selection uses Wakeb checkbox columns, and the loading and no-data views use PrimeVue's empty row. shadcn-vue: the shadcn-vue Table markup with Wakeb sort buttons and native checkboxes.

## Custom cells and empty view

Cell slots receive the original item and resolved field value.

```vue
<script setup lang="ts">
import { WDataTable, WBadge } from 'wakeb-components'
</script>

<template>
  <WDataTable :headers="[{ key: 'name', title: 'Name' }, { key: 'status', title: 'Status', sortable: false }]" :items="[{ id: 1, name: 'Gate 3', status: 'Online' }]" aria-label="Cameras"><template #item.status="{ value }"><WBadge :label="String(value)" type="success" /></template><template #no-data>No cameras found.</template></WDataTable>
</template>
```

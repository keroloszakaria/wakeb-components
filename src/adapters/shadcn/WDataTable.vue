<script setup lang="ts">
import { computed } from "vue";
import WSkeleton from "./WSkeleton.vue";
import { cellSlotName, cellText, cellValue, dataTableDefaults, dataTableLabels, emitOptions, isSortable, useDataTableSelection, useDataTableSort } from "../../composables/data-table";
import { toUnit } from "../../composables/elements";
import { useWakebContext } from "../../core/runtime";
import type { DataTableHeader, DataTableItem, DataTableOptions, DataTableProps, DataTableSortItem } from "../../types";
defineOptions({ name: "WDataTable" });
const props = withDefaults(defineProps<DataTableProps>(), dataTableDefaults);
const emit = defineEmits<{
  "update:modelValue": [value: (string | number)[]];
  "update:sortBy": [value: DataTableSortItem[]];
  "update:options": [value: DataTableOptions];
  "click:row": [item: DataTableItem, event: MouseEvent];
}>();
defineSlots<{
  [key: `item.${string}`]: ((props: { item: DataTableItem; value: unknown; index: number }) => unknown) | undefined;
  loading?(): unknown;
  "no-data"?(): unknown;
}>();
const context = useWakebContext("WDataTable");
const labels = computed(() => dataTableLabels(props, context.locale));
const sorting = useDataTableSort(props, emit);
emitOptions(sorting.options, emit);
const selection = useDataTableSelection(props, emit);
const span = computed(() => props.headers.length + (props.selectable ? 1 : 0) || 1);
const cellStyle = (header: DataTableHeader) => ({
  textAlign: header.align === "center" ? ("center" as const) : header.align === "end" ? ("end" as const) : ("start" as const),
  width: toUnit(header.width),
});
const arrow = (key: string) => (sorting.order(key) === "asc" ? "↑" : sorting.order(key) === "desc" ? "↓" : "↕");
</script>
<template>
  <!-- shadcn-vue Table markup (native table elements); Wakeb owns sorting buttons and selection checkboxes. -->
  <div class="wakeb-data-table wakeb-sc-data-table" :aria-busy="loading ? 'true' : 'false'">
    <table class="wakeb-sc-table" :aria-label="ariaLabel">
      <thead class="wakeb-sc-table-header">
        <tr class="wakeb-sc-table-row">
          <th v-if="selectable" class="wakeb-sc-table-head wakeb-data-table__select" scope="col">
            <input
              type="checkbox"
              class="wakeb-sc-table-checkbox"
              :checked="selection.all.value"
              :indeterminate="selection.some.value && !selection.all.value"
              :aria-label="labels.selectAll"
              :disabled="loading || !items.length"
              @change="selection.toggleAll"
            />
          </th>
          <th
            v-for="header in headers"
            :key="header.key"
            class="wakeb-sc-table-head"
            scope="col"
            :aria-sort="isSortable(header) ? sorting.ariaSort(header.key) : undefined"
            :style="cellStyle(header)"
          >
            <button v-if="isSortable(header)" type="button" class="wakeb-sc-table-sort" @click="sorting.toggle(header.key)">
              <span>{{ header.title }}</span><span class="wakeb-sc-table-sort-icon" aria-hidden="true">{{ arrow(header.key) }}</span>
            </button>
            <template v-else>{{ header.title }}</template>
          </th>
        </tr>
      </thead>
      <tbody class="wakeb-sc-table-body">
        <tr v-if="loading" class="wakeb-sc-table-row">
          <td class="wakeb-sc-table-cell wakeb-sc-table-state" :colspan="span"><slot name="loading"><WSkeleton type="table-row@5" /></slot></td>
        </tr>
        <tr v-else-if="!items.length" class="wakeb-sc-table-row">
          <td class="wakeb-sc-table-cell wakeb-sc-table-state" :colspan="span"><slot name="no-data">{{ labels.noData }}</slot></td>
        </tr>
        <template v-else>
          <tr
            v-for="(item, index) in items"
            :key="String(selection.keyOf(item) ?? index)"
            class="wakeb-sc-table-row wakeb-sc-table-row--clickable"
            :data-state="selectable && selection.isSelected(item) ? 'selected' : undefined"
            @click="emit('click:row', item, $event)"
          >
            <td v-if="selectable" class="wakeb-sc-table-cell wakeb-data-table__select">
              <input
                type="checkbox"
                class="wakeb-sc-table-checkbox"
                :checked="selection.isSelected(item)"
                :aria-label="labels.selectRow"
                @click.stop
                @change="selection.toggle(item)"
              />
            </td>
            <td v-for="header in headers" :key="header.key" class="wakeb-sc-table-cell" :style="cellStyle(header)">
              <slot :name="cellSlotName(header)" :item="item" :value="cellValue(item, header.key)" :index="index">{{ cellText(item, header.key) }}</slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<style>
/* shadcn-vue Table styles over the --border, --muted and --foreground theme variables. */
.wakeb-sc-data-table {
  position: relative;
  width: 100%;
  overflow: auto;
  font-family: var(--wakeb-ui-font-family, inherit);
  color: var(--wakeb-ui-on-surface, var(--foreground, inherit));
}
.wakeb-sc-table {
  width: 100%;
  caption-side: bottom;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.wakeb-sc-table-header .wakeb-sc-table-row,
.wakeb-sc-table-body .wakeb-sc-table-row {
  border-block-end: 1px solid var(--wakeb-ui-border, var(--border, #eaecf0));
}
.wakeb-sc-table-row--clickable {
  cursor: pointer;
}
.wakeb-sc-table-row--clickable:hover,
.wakeb-sc-table-row--clickable[data-state="selected"] {
  background: color-mix(in srgb, var(--muted, #f2f4f7) 50%, transparent);
}
.wakeb-sc-table-head {
  height: 2.5rem;
  padding: 0 0.5rem;
  vertical-align: middle;
  font-weight: 500;
  white-space: nowrap;
  color: var(--wakeb-ui-muted, var(--muted-foreground, inherit));
}
.wakeb-sc-table-cell {
  padding: 0.5rem;
  vertical-align: middle;
}
.wakeb-sc-table-state {
  padding: 1rem 0.5rem;
  text-align: center;
}
.wakeb-sc-table-sort {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.wakeb-sc-table-sort:focus-visible,
.wakeb-sc-table-checkbox:focus-visible {
  outline: 2px solid var(--wakeb-ui-focus, var(--ring, currentColor));
  outline-offset: 2px;
}
.wakeb-sc-table-sort-icon {
  font-size: 0.75rem;
  opacity: 0.6;
}
.wakeb-sc-table-checkbox {
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: var(--primary, #087f8c);
}
.wakeb-sc-data-table .wakeb-data-table__select {
  width: 2.5rem;
}
</style>

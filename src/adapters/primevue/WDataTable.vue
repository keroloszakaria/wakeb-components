<script setup lang="ts">
import { computed } from "vue";
import DataTable, { type DataTableSortEvent } from "primevue/datatable";
import Column from "primevue/column";
import Checkbox from "primevue/checkbox";
import WSkeleton from "./WSkeleton.vue";
import { cellSlotName, cellValue, dataTableDefaults, dataTableLabels, emitOptions, isSortable, useDataTableSelection, useDataTableSort } from "../../composables/data-table";
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
const first = computed(() => sorting.sort.value[0]);
/* Lazy DataTable: PrimeVue reports the sort, the caller sorts. removableSort gives the asc, desc, none cycle. */
const onSort = (event: DataTableSortEvent) =>
  sorting.set(typeof event.sortField === "string" && event.sortOrder ? [{ key: event.sortField, order: event.sortOrder === 1 ? "asc" : "desc" }] : []);
const textAlign = (header: DataTableHeader) => (header.align === "center" ? "center" : header.align === "end" ? "end" : "start");
const cellStyle = (header: DataTableHeader) => ({ textAlign: textAlign(header), width: toUnit(header.width) });
/* The loading and no-data views use PrimeVue's empty row, so both replace the rows the same way. */
const rows = computed(() => (props.loading ? [] : (props.items as DataTableItem[])));
</script>
<template>
  <DataTable
    class="wakeb-data-table wakeb-pv-data-table"
    :value="rows"
    :data-key="itemValue"
    lazy
    removable-sort
    :sort-field="first?.key"
    :sort-order="first ? (first.order === 'asc' ? 1 : -1) : undefined"
    :table-props="ariaLabel ? { 'aria-label': ariaLabel } : undefined"
    :aria-busy="loading ? 'true' : 'false'"
    @sort="onSort"
    @row-click="(event) => emit('click:row', event.data, event.originalEvent as MouseEvent)"
  >
    <Column v-if="selectable" column-key="data-table-select" class="wakeb-data-table__select" :header-style="{ width: '3rem' }">
      <template #header>
        <span class="wakeb-data-table__check" @click.stop
          ><Checkbox
            binary
            :model-value="selection.all.value"
            :indeterminate="selection.some.value && !selection.all.value"
            :aria-label="labels.selectAll"
            :disabled="loading || !items.length"
            @update:model-value="selection.toggleAll"
        /></span>
      </template>
      <template #body="{ data }">
        <span class="wakeb-data-table__check" @click.stop
          ><Checkbox binary :model-value="selection.isSelected(data)" :aria-label="labels.selectRow" @update:model-value="selection.toggle(data)"
        /></span>
      </template>
    </Column>
    <Column
      v-for="header in headers"
      :key="header.key"
      :field="header.key"
      :header="header.title"
      :sortable="isSortable(header)"
      :header-style="cellStyle(header)"
      :body-style="cellStyle(header)"
    >
      <template v-if="$slots[cellSlotName(header)]" #body="{ data, index }">
        <slot :name="cellSlotName(header)" :item="data" :value="cellValue(data, header.key)" :index="index" />
      </template>
    </Column>
    <template #empty>
      <slot v-if="loading" name="loading"><WSkeleton type="table-row@5" /></slot>
      <slot v-else name="no-data">{{ labels.noData }}</slot>
    </template>
  </DataTable>
</template>
<style>
.wakeb-pv-data-table {
  font-family: var(--wakeb-ui-font-family, inherit);
}
.wakeb-pv-data-table .p-datatable-table {
  width: 100%;
  border-collapse: collapse;
}
.wakeb-pv-data-table .p-datatable-header-cell,
.wakeb-pv-data-table .p-datatable-tbody > tr > td {
  padding: 0.75rem 1rem;
  border-block-end: 1px solid var(--wakeb-ui-border, var(--p-datatable-body-cell-border-color, #eaecf0));
}
.wakeb-pv-data-table .p-datatable-header-cell {
  font-weight: 600;
  font-size: 0.875rem;
}
.wakeb-pv-data-table .p-datatable-sortable-column {
  cursor: pointer;
}
.wakeb-pv-data-table .p-datatable-tbody > tr:has(> td) {
  cursor: pointer;
}
.wakeb-pv-data-table .wakeb-data-table__check {
  display: inline-flex;
}
</style>

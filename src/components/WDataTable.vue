<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { VDataTableServer } from "vuetify/components/VDataTable";
import WSkeleton from "./WSkeleton.vue";
import { cellSlotName, dataTableDefaults, dataTableLabels, isSortable, useDataTableSelection, useDataTableSort } from "../composables/data-table";
import { useWakebContext } from "../core/runtime";
import type { DataTableItem, DataTableOptions, DataTableProps, DataTableSortItem } from "../types";
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
const selection = useDataTableSelection(props, emit);
const columns = computed(() =>
  props.headers.map((header) => ({ key: header.key, title: header.title, align: header.align, width: header.width, sortable: isSortable(header) })),
);
/* Paging is the caller's: a length that covers the current page stops VDataTableServer clamping `page`. */
const itemsLength = computed(() => Math.max(props.items.length, props.page * Math.max(props.itemsPerPage, 1)));
const cellSlots = computed(() => props.headers.map(cellSlotName));
/* VDataTableServer emits update:options immediately and on every change; Wakeb forwards the portable fields. */
const onOptions = (options: { page: number; itemsPerPage: number; sortBy: readonly DataTableSortItem[] }) =>
  emit("update:options", { page: options.page, itemsPerPage: options.itemsPerPage, sortBy: options.sortBy.map(({ key, order }) => ({ key, order })) });
const onSort = (value: readonly DataTableSortItem[]) => sorting.set(value.map(({ key, order }) => ({ key, order: order === "desc" ? "desc" : "asc" })));
const onSelect = (value: readonly unknown[]) => selection.set(value as (string | number)[]);
/* VDataTable has no table attrs; the accessible name goes on its table element. */
const root = ref<{ $el?: Element }>();
const nameTable = () => {
  const table = root.value?.$el?.querySelector?.("table");
  if (!table) return;
  if (props.ariaLabel) table.setAttribute("aria-label", props.ariaLabel);
  else table.removeAttribute("aria-label");
};
onMounted(nameTable);
watch(() => props.ariaLabel, nameTable);
</script>
<template>
  <VDataTableServer
    ref="root"
    class="wakeb-data-table"
    :headers="columns"
    :items="items as DataTableItem[]"
    :item-value="itemValue"
    :items-length="itemsLength"
    :page="page"
    :items-per-page="itemsPerPage"
    :model-value="selection.selected.value"
    :sort-by="sorting.sort.value"
    :show-select="selectable"
    :loading="loading"
    :aria-busy="loading ? 'true' : 'false'"
    :select-all-label="labels.selectAll"
    :select-row-label="labels.selectRow"
    hide-default-footer
    @update:model-value="onSelect"
    @update:sort-by="onSort"
    @update:options="onOptions"
    @click:row="(event: MouseEvent, row: { item: DataTableItem }) => emit('click:row', row.item, event)"
  >
    <template #loading
      ><slot name="loading"><WSkeleton type="table-row@5" /></slot
    ></template>
    <template #no-data
      ><slot name="no-data">{{ labels.noData }}</slot></template
    >
    <template v-for="name in cellSlots.filter((slot) => $slots[slot])" :key="name" #[name]="cell">
      <slot :name="name" :item="cell.item" :value="cell.value" :index="cell.index" />
    </template>
  </VDataTableServer>
</template>
<style scoped>
.wakeb-data-table {
  font-family: var(--wakeb-ui-font-family, inherit);
}
.wakeb-data-table :deep(.v-data-table__tr--clickable) {
  cursor: pointer;
}
</style>

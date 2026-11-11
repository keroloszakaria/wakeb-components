import { computed, ref, watch } from "vue";
import type { DataTableHeader, DataTableItem, DataTableOptions, DataTableProps, DataTableSortItem } from "../types";

/** Shared WDataTable behavior. Every renderer shows `items` as given: sorting and paging are the caller's (server) job. */
export const dataTableDefaults = {
  headers: () => [],
  items: () => [],
  itemValue: "id",
  modelValue: () => [],
  selectable: false,
  loading: false,
  sortBy: () => [],
  page: 1,
  itemsPerPage: 10,
} as const;

type Value = string | number;
export interface DataTableEmit {
  (event: "update:modelValue", value: Value[]): void;
  (event: "update:sortBy", value: DataTableSortItem[]): void;
  (event: "update:options", value: DataTableOptions): void;
}

/** Reads a dot path such as `owner.name`; a missing step gives `undefined`. */
export function cellValue(item: DataTableItem, key: string): unknown {
  return key.split(".").reduce<unknown>((value, part) => (value === null || value === undefined ? undefined : (value as Record<string, unknown>)[part]), item);
}

/** Default cell text: empty for null or undefined, otherwise the string form. */
export function cellText(item: DataTableItem, key: string): string {
  const value = cellValue(item, key);
  return value === null || value === undefined ? "" : String(value);
}

export const isSortable = (header: DataTableHeader) => header.sortable !== false;
export const cellSlotName = (header: DataTableHeader) => `item.${header.key}` as const;

export function dataTableLabels(props: DataTableProps, locale: "en" | "ar") {
  const ar = locale === "ar";
  return {
    noData: props.noDataText ?? (ar ? "لا توجد بيانات" : "No data available"),
    selectAll: props.selectAllLabel ?? (ar ? "تحديد كل الصفوف" : "Select all rows"),
    selectRow: props.selectRowLabel ?? (ar ? "تحديد الصف" : "Select row"),
  };
}

const copySort = (items: readonly DataTableSortItem[]) => items.map(({ key, order }) => ({ key, order }));

/**
 * Single-column sort that cycles ascending, descending, none. A sort change returns the options to
 * page 1, as VDataTableServer does. `update:options` is emitted immediately and on every change of
 * page, itemsPerPage or sort, so a caller can load its first page from that event.
 */
export function useDataTableSort(props: DataTableProps, emit: DataTableEmit) {
  const sort = ref<DataTableSortItem[]>(copySort(props.sortBy ?? []));
  watch(
    () => props.sortBy,
    (value) => (sort.value = copySort(value ?? [])),
    { deep: true },
  );
  const page = ref(props.page ?? 1);
  watch(
    () => props.page,
    (value) => (page.value = value ?? 1),
  );
  const options = computed<DataTableOptions>(() => ({ page: page.value, itemsPerPage: props.itemsPerPage ?? 10, sortBy: copySort(sort.value) }));
  const set = (value: DataTableSortItem[]) => {
    sort.value = copySort(value);
    page.value = 1;
    emit("update:sortBy", copySort(value));
  };
  const order = (key: string) => sort.value.find((item) => item.key === key)?.order;
  const toggle = (key: string) => {
    const current = order(key);
    set(current === undefined ? [{ key, order: "asc" }] : current === "asc" ? [{ key, order: "desc" }] : []);
  };
  const ariaSort = (key: string) => (order(key) === "asc" ? "ascending" : order(key) === "desc" ? "descending" : undefined);
  return { sort, options, set, order, toggle, ariaSort };
}

/** Emits `update:options` now and whenever the options change (renderers without a native equivalent). */
export function emitOptions(options: { value: DataTableOptions }, emit: DataTableEmit) {
  watch(
    () => JSON.stringify(options.value),
    () => emit("update:options", { ...options.value, sortBy: copySort(options.value.sortBy) }),
    { immediate: true },
  );
}

/** Selection by `itemValue`, kept locally so the table works with or without v-model. */
export function useDataTableSelection(props: DataTableProps, emit: DataTableEmit) {
  const selected = ref<Value[]>([...(props.modelValue ?? [])]);
  watch(
    () => props.modelValue,
    (value) => (selected.value = [...(value ?? [])]),
    { deep: true },
  );
  const keyOf = (item: DataTableItem) => cellValue(item, props.itemValue ?? "id") as Value;
  const set = (value: Value[]) => {
    selected.value = [...value];
    emit("update:modelValue", [...value]);
  };
  const isSelected = (item: DataTableItem) => selected.value.includes(keyOf(item));
  const keys = computed(() => (props.items ?? []).map(keyOf));
  const all = computed(() => keys.value.length > 0 && keys.value.every((key) => selected.value.includes(key)));
  const some = computed(() => keys.value.some((key) => selected.value.includes(key)));
  const toggle = (item: DataTableItem) => {
    const key = keyOf(item);
    set(isSelected(item) ? selected.value.filter((value) => value !== key) : [...selected.value, key]);
  };
  const toggleAll = () =>
    set(all.value ? selected.value.filter((value) => !keys.value.includes(value)) : [...selected.value, ...keys.value.filter((key) => !selected.value.includes(key))]);
  return { selected, set, keyOf, isSelected, all, some, toggle, toggleAll };
}

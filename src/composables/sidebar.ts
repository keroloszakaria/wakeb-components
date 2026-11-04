import { computed } from "vue";
import { useSkeleton } from "../core/vocabulary";
import type { BaseSidebarProps, NavigationKey, SidebarItem } from "../types";

/** Defaults shared by every WBaseSidebar renderer; providers must not change them. */
export const sidebarDefaults = {
  loading: false,
  items: () => [],
  skeletonType: "list-item-two-line, list-item-two-line, list-item-two-line",
  hasFilter: true,
  isFiltered: false,
  skeletonWidth: "360px",
  itemKey: "id",
  filterLabel: "Filter",
  cancelLabel: "Cancel",
  emptyLabel: "No data",
} as const;

type Emit = {
  (event: "search", payload: unknown): void;
  (event: "filterClick"): void;
  (event: "filterCancel"): void;
};

/**
 * Provider-neutral WBaseSidebar behavior: the normalized skeleton sequence (SPEC R16), the scoped
 * search callback, filter events and item keys. `nativeSkeletons` keeps Vuetify-only names.
 */
export function useSidebar(props: Required<Pick<BaseSidebarProps, "skeletonType" | "itemKey">>, emit: Emit, nativeSkeletons = false) {
  const toSkeleton = useSkeleton("WBaseSidebar", nativeSkeletons);
  const skeleton = computed(() => toSkeleton(props.skeletonType, "skeletonType"));
  const search = (payload: unknown) => emit("search", payload),
    filterClick = () => emit("filterClick"),
    filterCancel = () => emit("filterCancel");
  const keyOf = (item: SidebarItem, index: number) => (item[props.itemKey] as NavigationKey | undefined) ?? index;
  return { skeleton, search, filterClick, filterCancel, keyOf };
}

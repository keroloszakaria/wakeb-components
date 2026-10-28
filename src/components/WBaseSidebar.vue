<script setup lang="ts">
import { VSkeletonLoader } from "vuetify/components/VSkeletonLoader";
import WButton from "./WButton.vue";
import type { BaseSidebarProps, SidebarItem, NavigationKey } from "../types";
const props = withDefaults(defineProps<BaseSidebarProps>(), {
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
});
const emit = defineEmits<{
  search: [payload: unknown];
  filterClick: [];
  filterCancel: [];
}>();
const search = (payload: unknown) => emit("search", payload),
  filterClick = () => emit("filterClick"),
  filterCancel = () => emit("filterCancel");
defineSlots<{
  "header-actions"?(props: {
    isFiltered: boolean;
    filterClick: () => void;
    filterCancel: () => void;
  }): unknown;
  content?(props: { search: (payload: unknown) => void }): unknown;
  search?(props: { search: (payload: unknown) => void }): unknown;
  item?(props: { item: SidebarItem; index: number }): unknown;
  loading?(props: { type: string; width: string | number }): unknown;
  empty?(props: { label: string }): unknown;
  "filter-modal"(): unknown;
}>();
const keyOf = (item: SidebarItem, index: number) =>
  (item[props.itemKey] as NavigationKey | undefined) ?? index;
</script>
<template>
  <div class="wakeb-base-sidebar base-sidebar card-gradient flex flex-col">
    <div class="wakeb-base-sidebar__frame flex flex-col h-full">
      <div
        class="wakeb-base-sidebar__header flex items-center justify-between gap-2 px-4 py-3"
      >
        <h2 class="flex-1 font-semibold! text-xl">{{ title }}</h2>
        <slot
          name="header-actions"
          :is-filtered="isFiltered"
          :filter-click="filterClick"
          :filter-cancel="filterCancel"
        >
          <div
            v-if="hasFilter"
            class="wakeb-base-sidebar__filters flex items-center gap-2"
          >
            <WButton
              v-if="isFiltered"
              :title="cancelLabel"
              class-list="font-semibold!"
              type="outline"
              size="md"
              @click="filterCancel"
            />
            <WButton
              :title="filterLabel"
              class-list="font-semibold!"
              type="primary"
              size="md"
              @click="filterClick"
            />
          </div>
        </slot>
      </div>
      <div class="sidebar__inner flex flex-col flex-1 min-h-0">
        <slot name="content" :search="search">
          <slot name="search" :search="search" />
          <div
            class="sidebar__list flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-4 pb-4"
          >
            <slot
              v-if="loading"
              name="loading"
              :type="skeletonType"
              :width="skeletonWidth"
              ><VSkeletonLoader :type="skeletonType" :width="skeletonWidth"
            /></slot>
            <slot v-else-if="!items.length" name="empty" :label="emptyLabel"
              ><p
                class="wakeb-base-sidebar__empty m-0 px-2 py-6 text-center text-sm"
              >
                {{ emptyLabel }}
              </p></slot
            >
            <ul v-else class="flex flex-col gap-3 py-2">
              <li v-for="(item, index) in items" :key="keyOf(item, index)">
                <slot name="item" :item="item" :index="index" />
              </li>
            </ul>
          </div>
        </slot>
      </div>
    </div>
    <slot name="filter-modal" />
  </div>
</template>
<style scoped lang="scss">
.wakeb-base-sidebar {
  display: flex;
  flex-direction: column;
  min-width: 340px;
  position: relative;
  padding: 2px;
  border-radius: 16px;
  background: var(
    --wakeb-sidebar-outer-bg,
    var(
      --wakeb-sidebar-fallback,
      conic-gradient(
        from 120deg at 50% 50%,
        #111827 0deg,
        #111827 90deg,
        #087f8c 200deg,
        #ec4899 205deg,
        #087f8c 230deg,
        #111827 280deg,
        #111827 360deg
      )
    )
  );
  > .wakeb-base-sidebar__frame {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 8px;
    border-radius: 16px;
    background: var(
      --wakeb-sidebar-inner-bg,
      var(
        --wakeb-sidebar-fallback,
        linear-gradient(240deg, #087f8c, #4c1d95, #111827)
      )
    );
  }
  &::before {
    content: "";
    position: absolute;
    bottom: 2px;
    inset-inline-start: 2px;
    width: calc(100% - 4px);
    height: 72px;
    border-radius: 16px;
    background: linear-gradient(
      140deg,
      rgba(
          var(
            --wakeb-sidebar-body-rgb,
            var(--wakeb-sidebar-fallback, 255, 255, 255)
          ),
          0.1
        )
        0,
      var(--wakeb-sidebar-body, var(--wakeb-sidebar-fallback, #fff)) 94.23%
    );
    z-index: 2;
    pointer-events: none;
  }
}
.wakeb-base-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 16px;
}
.wakeb-base-sidebar__header h2 {
  flex: 1;
  margin: 0;
  padding: 0;
  border: 0 solid;
  font-weight: 600 !important;
  font-size: 20px;
  line-height: 28px;
  color: var(--wakeb-sidebar-title, var(--wakeb-sidebar-fallback, #fff));
}
.wakeb-base-sidebar__filters {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sidebar__inner {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background-color: var(
    --wakeb-sidebar-body,
    var(--wakeb-sidebar-fallback, #fff)
  );
  border-radius: 16px;
}
.sidebar__list {
  flex: 1;
  min-height: 400px;
  max-height: 60dvh;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 16px 16px;
}
.sidebar__list::-webkit-scrollbar {
  display: none;
}
.sidebar__list ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 8px 0;
  list-style: none;
}
.sidebar__list li {
  margin: 0;
}
.wakeb-base-sidebar__empty {
  margin: 0;
  padding: 24px 8px;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  color: var(
    --wakeb-sidebar-empty-color,
    var(--wakeb-sidebar-fallback, #667085)
  );
}
</style>

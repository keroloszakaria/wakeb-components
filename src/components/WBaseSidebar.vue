<script setup lang="ts">
import { VSkeletonLoader } from "vuetify/components/VSkeletonLoader";
import WButton from "./WButton.vue";
import type { BaseSidebarProps, SidebarItem } from "../types";
import { sidebarDefaults, useSidebar } from "../composables/sidebar";
const props = withDefaults(defineProps<BaseSidebarProps>(), sidebarDefaults);
const emit = defineEmits<{
  search: [payload: unknown];
  filterClick: [];
  filterCancel: [];
}>();
const { skeleton, search, filterClick, filterCancel, keyOf } = useSidebar(props, emit, true);
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
              :type="skeleton"
              :width="skeletonWidth"
              ><VSkeletonLoader :type="skeleton" :width="skeletonWidth"
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
@use "../styles/sidebar";
</style>

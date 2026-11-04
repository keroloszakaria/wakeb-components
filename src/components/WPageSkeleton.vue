<template>
  <div v-bind="$attrs" class="page-skeleton" :class="`flex-${direction}`" :style="{ flexDirection: direction }" role="status" :aria-label="label" aria-busy="true">
    <!-- Rows -->
    <template v-for="(row, rowIndex) in config" :key="rowIndex">
      <div class="wakeb-grid-row" :class="row.rowClass" aria-hidden="true">
        <div
          v-for="(col, colIndex) in repeatCount(row.repeat)"
          :class="[gridClasses(row), row.colClass]"
          :key="colIndex"
        >
          <div
            :class="[
              'skeleton-block',
              row.classList,
              `skeleton-block--${row.variant || 'default'}`
            ]"
          >
            <!-- Header inside block (e.g. chart header) -->
            <div v-if="row.header" class="skeleton-block__header">
              <VSkeletonLoader
                v-for="(h, hIdx) in row.header"
                :key="hIdx"
                :type="toSkeleton(h.type, 'config[].header[].type')"
                :width="h.width"
                :height="h.height"
              />
            </div>
            <!-- Body items -->
            <VSkeletonLoader
              v-for="(item, itemIdx) in row.items"
              :key="itemIdx"
              :type="toSkeleton(item.type, 'config[].items[].type')"
              :width="item.width"
              :height="item.height"
              :class="item.class"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { VSkeletonLoader } from "vuetify/components/VSkeletonLoader";
import type { PageSkeletonProps } from "../types";
import { useSkeleton } from "../core/vocabulary";
import { useSkeletonGrid } from "../core/grid";
import { pageSkeletonDefaults, repeatCount } from "../composables/skeleton";
import "../styles/grid.css";
/* Caller attrs bind first, so the status role, name and busy state stay Wakeb-owned (SPEC R14). */
defineOptions({ inheritAttrs: false });
/* Vuetify keeps its own skeleton names during the deprecation window (WAKEB_DEPRECATED_VALUE). */
const toSkeleton = useSkeleton("WPageSkeleton", true);
const gridClasses = useSkeletonGrid("WPageSkeleton");
withDefaults(defineProps<PageSkeletonProps>(), pageSkeletonDefaults);
</script>
<style lang="scss" scoped>
@use "../styles/page-skeleton";

.skeleton-block--card {
  :deep(.v-skeleton-loader__bone.v-skeleton-loader__list-item-avatar-two-line) {
    height: 155px;
    flex-direction: row-reverse;
    padding-inline-start: 20px;
  }

  :deep(.v-skeleton-loader__bone.v-skeleton-loader__list-item-avatar-three-line) {
    height: 155px;
    flex-direction: row-reverse;
    padding-inline-start: 20px;
  }
}

:deep(.v-skeleton-loader) {
  background: transparent !important;
  box-shadow: none !important;
}
:deep(.v-skeleton-loader__chip) {
  margin: 0;
  max-width: unset;
}
</style>

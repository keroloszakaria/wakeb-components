<template>
  <div class="page-skeleton" :class="`flex-${direction}`" :style="{ flexDirection: direction }" role="status" :aria-label="label" aria-busy="true">
    <!-- Rows -->
    <template v-for="(row, rowIndex) in config" :key="rowIndex">
      <VRow :class="row.rowClass" aria-hidden="true">
        <VCol
          v-for="(col, colIndex) in repeatCount(row.repeat)"
          :class="row.colClass"
          :key="colIndex"
          :cols="row.cols || 12"
          :sm="row.sm"
          :md="row.md"
          :lg="row.lg"
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
                :type="h.type"
                :width="h.width"
                :height="h.height"
              />
            </div>
            <!-- Body items -->
            <VSkeletonLoader
              v-for="(item, itemIdx) in row.items"
              :key="itemIdx"
              :type="item.type"
              :width="item.width"
              :height="item.height"
              :class="item.class"
            />
          </div>
        </VCol>
      </VRow>
    </template>
  </div>
</template>

<script setup lang="ts">
import { VRow, VCol } from "vuetify/components/VGrid";
import { VSkeletonLoader } from "vuetify/components/VSkeletonLoader";
import type { PageSkeletonProps } from "../types";
withDefaults(defineProps<PageSkeletonProps>(), { direction: "column", label: "Loading content" });
const repeatCount = (value?: number) => value != null && Number.isFinite(value) && value > 0 ? Math.floor(value) || 1 : 1;
</script>
<style lang="scss" scoped>
.page-skeleton {
  display: flex;
}

.skeleton-block {
  overflow: hidden;
  border-radius: 12px;

  &--card {
    background: var(--wakeb-skeleton-surface, #fff);
    border: 1px solid var(--wakeb-skeleton-border, #eaecf0);
    padding: 12px;

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

  &--chart {
    background: var(--wakeb-skeleton-surface, #fff);
    border: 1px solid var(--wakeb-skeleton-border, #eaecf0);
    padding: 24px;
    border-radius: 16px;
  }

  &--form {
    background: var(--wakeb-skeleton-surface, #fff);
    border: 1px solid var(--wakeb-skeleton-border, #eaecf0);
    padding: 24px;
    border-radius: 20px;
  }

  &--tabs {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
  }

  &--table {
    background: var(--wakeb-skeleton-surface, #fff);
    border: 1px solid var(--wakeb-skeleton-border, #eaecf0);
    border-radius: 16px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
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

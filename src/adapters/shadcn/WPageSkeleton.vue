<template>
  <div v-bind="$attrs" class="page-skeleton" :class="`flex-${direction}`" :style="{ flexDirection: direction }" role="status" :aria-label="label" aria-busy="true">
    <template v-for="(row, rowIndex) in config" :key="rowIndex">
      <div class="wakeb-grid-row" :class="row.rowClass" aria-hidden="true">
        <div v-for="(col, colIndex) in repeatCount(row.repeat)" :key="colIndex" :class="[gridClasses(row), row.colClass]">
          <div :class="['skeleton-block', row.classList, `skeleton-block--${row.variant || 'default'}`]">
            <!-- Header inside block (e.g. chart header) -->
            <div v-if="row.header" class="skeleton-block__header">
              <SkeletonItemView v-for="(h, hIdx) in row.header" :key="hIdx" :item="h" prop="config[].header[].type" />
            </div>
            <!-- Body items -->
            <SkeletonItemView v-for="(item, itemIdx) in row.items" :key="itemIdx" :item="item" prop="config[].items[].type" :class="item.class" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { h, type FunctionalComponent } from "vue";
import Skeleton from "./ui/Skeleton.vue";
import type { PageSkeletonProps, SkeletonItem } from "../../types";
import { useSkeleton } from "../../core/vocabulary";
import { useSkeletonGrid } from "../../core/grid";
import { pageSkeletonDefaults, renderSkeleton, repeatCount, type SkeletonBone } from "../../composables/skeleton";
import "../../styles/grid.css";
/*
 * Same R16 grammar, Wakeb grid and bone shapes as the PrimeVue renderer. Vuetify-only names are
 * skipped with WAKEB_UNKNOWN_VALUE. Each bone is Wakeb's copy of the shadcn-vue Skeleton, so it pulses
 * with the shadcn-vue look (`--accent`, `--radius`) instead of the Wakeb wave.
 */
/* Caller attrs bind first, so the status role, name and busy state stay Wakeb-owned (SPEC R14). */
defineOptions({ name: "WPageSkeleton", inheritAttrs: false });
withDefaults(defineProps<PageSkeletonProps>(), pageSkeletonDefaults);
const toSkeleton = useSkeleton("WPageSkeleton", false);
const gridClasses = useSkeletonGrid("WPageSkeleton");

const bone = (b: SkeletonBone) =>
  h(Skeleton, {
    class: ["wakeb-skeleton__bone", "wakeb-sc-skeleton-bone", { "wakeb-skeleton__bone--circle": b.circle }],
    style: { width: b.width, height: b.height, borderRadius: b.circle ? "50%" : b.radius },
  });
/* One item: the shared Wakeb bones for its parsed names, sized by its width and height. */
const SkeletonItemView: FunctionalComponent<{ item: SkeletonItem; prop: string }> = ({ item, prop }) =>
  renderSkeleton(bone, toSkeleton(item.type, prop), item.width, item.height);
SkeletonItemView.props = ["item", "prop"];
</script>
<style lang="scss" scoped>
@use "../../styles/page-skeleton";
</style>
<!-- Not scoped: the item view is a render function, so its inner nodes carry no scope id. Names are wakeb-prefixed. -->
<style lang="scss">
@use "../../styles/skeleton-bones";

/* The shadcn-vue Skeleton look wins over the shared Wakeb bone: accent color, radius and pulse, no wave. */
.wakeb-sc-skeleton-bone.wakeb-skeleton__bone {
  border-radius: calc(var(--wakeb-ui-radius, var(--radius, 0.625rem)) - 2px);
  background: var(--wakeb-ui-border, var(--accent, #eaecf0));
}
.wakeb-sc-skeleton-bone.wakeb-skeleton__bone--circle {
  border-radius: 50%;
}
.wakeb-sc-skeleton-bone.wakeb-skeleton__bone::after {
  content: none;
}
</style>

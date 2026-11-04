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
import Skeleton from "primevue/skeleton";
import type { PageSkeletonProps, SkeletonItem } from "../../types";
import { useSkeleton } from "../../core/vocabulary";
import { useSkeletonGrid } from "../../core/grid";
import { SKELETON_SHAPES, pageSkeletonDefaults, repeatCount, skeletonParts, toUnit, type SkeletonBone } from "../../composables/skeleton";
import "../../styles/grid.css";
/*
 * Same R16 grammar and Wakeb grid as the Vuetify renderer. Vuetify-only names are skipped with
 * WAKEB_UNKNOWN_VALUE. Each portable name draws the shared Wakeb bone shapes (composables/skeleton.ts)
 * with PrimeVue Skeleton in unstyled mode, so Wakeb CSS owns the look in styled and unstyled hosts.
 */
/* Caller attrs bind first, so the status role, name and busy state stay Wakeb-owned (SPEC R14). */
defineOptions({ name: "WPageSkeleton", inheritAttrs: false });
withDefaults(defineProps<PageSkeletonProps>(), pageSkeletonDefaults);
const toSkeleton = useSkeleton("WPageSkeleton", false);
const gridClasses = useSkeletonGrid("WPageSkeleton");

const bone = (b: SkeletonBone) =>
  h(Skeleton, {
    unstyled: true,
    shape: b.circle ? "circle" : "rectangle",
    width: b.width,
    height: b.height,
    borderRadius: b.circle ? "50%" : b.radius,
    class: ["wakeb-skeleton__bone", { "wakeb-skeleton__bone--circle": b.circle }],
  });
/*
 * One item: a box sized by width and height (numbers are px, as with VSkeletonLoader) holding one
 * part per parsed name. A part is an optional avatar followed by rows of bones.
 */
const SkeletonItemView: FunctionalComponent<{ item: SkeletonItem; prop: string }> = ({ item, prop }) =>
  h(
    "div",
    { class: "wakeb-skeleton", style: { width: toUnit(item.width), height: toUnit(item.height) } },
    skeletonParts(toSkeleton(item.type, prop)).map((name) => {
      const shape = SKELETON_SHAPES[name];
      return h("div", { class: ["wakeb-skeleton__part", `wakeb-skeleton__part--${name}`] }, [
        shape.avatar && bone(shape.avatar),
        h("div", { class: "wakeb-skeleton__lines" }, shape.rows.map((bones) => h("div", { class: "wakeb-skeleton__row" }, bones.map(bone)))),
      ]);
    }),
  );
SkeletonItemView.props = ["item", "prop"];
</script>
<style lang="scss" scoped>
@use "../../styles/page-skeleton";
</style>
<!-- Not scoped: the item view is a render function, so its inner nodes carry no scope id. Names are wakeb-skeleton-prefixed. -->
<style lang="scss">
.wakeb-skeleton {
  overflow: hidden;
}

.wakeb-skeleton__part {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;

  &--list-item,
  &--list-item-avatar,
  &--list-item-two-line,
  &--list-item-three-line,
  &--list-item-avatar-two-line,
  &--list-item-avatar-three-line {
    min-height: 48px;
    padding: 8px 16px;
  }

  &--button,
  &--chip {
    display: inline-flex;
    padding: 0;
  }
}

.wakeb-skeleton__lines {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.wakeb-skeleton__part--button .wakeb-skeleton__lines,
.wakeb-skeleton__part--chip .wakeb-skeleton__lines,
.wakeb-skeleton__part--avatar .wakeb-skeleton__lines {
  flex: 0 0 auto;
}

.wakeb-skeleton__part--table .wakeb-skeleton__lines,
.wakeb-skeleton__part--table-row .wakeb-skeleton__lines {
  gap: 16px;
}

.wakeb-skeleton__row {
  display: flex;
  gap: 16px;
}

/* Mirrors the Vuetify card tweak for avatar list items: avatar at the end, taller box. */
.skeleton-block--card {
  .wakeb-skeleton__part--list-item-avatar-two-line,
  .wakeb-skeleton__part--list-item-avatar-three-line {
    height: 155px;
    flex-direction: row-reverse;
    padding-inline-start: 20px;
  }
}

.wakeb-skeleton__bone {
  position: relative;
  flex: 0 1 auto;
  overflow: hidden;
  max-width: 100%;
  border-radius: 6px;
  background: var(--wakeb-ui-border, #eaecf0);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.4), transparent);
    transform: translateX(-100%);
    animation: wakeb-skeleton-wave 1.2s infinite;
  }

  &--circle {
    flex-shrink: 0;
    border-radius: 50%;
  }
}

[dir="rtl"] .wakeb-skeleton__bone::after {
  animation-direction: reverse;
}

@keyframes wakeb-skeleton-wave {
  to {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wakeb-skeleton__bone::after {
    animation: none;
  }
}
</style>

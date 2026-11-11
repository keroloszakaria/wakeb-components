<script setup lang="ts">
import { h, useAttrs, useSlots } from "vue";
import Skeleton from "./ui/Skeleton.vue";
import { useSkeleton } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import { renderSkeleton, skeletonDefaults, skeletonLabel, type SkeletonBone } from "../../composables/skeleton";
import type { SkeletonProps } from "../../types";
/*
 * The portable skeleton grammar drawn as shadcn-vue Skeleton bones (the WPageSkeleton look: accent color, radius and pulse).
 * Vuetify-only names are skipped with WAKEB_UNKNOWN_VALUE.
 */
defineOptions({ name: "WSkeleton", inheritAttrs: false });
const props = withDefaults(defineProps<SkeletonProps>(), skeletonDefaults);
defineSlots<{ default?(): unknown }>();
const context = useWakebContext("WSkeleton");
const toSkeleton = useSkeleton("WSkeleton", false);
const attrs = useAttrs();
const slots = useSlots();
const bone = (b: SkeletonBone) =>
  h(Skeleton, {
    class: ["wakeb-skeleton__bone", "wakeb-sc-skeleton-bone", { "wakeb-skeleton__bone--circle": b.circle }],
    style: { width: b.width, height: b.height, borderRadius: b.circle ? "50%" : b.radius },
  });
/* Caller attrs bind first, so the status role, name and busy state stay Wakeb-owned. */
const render = () =>
  props.loading
    ? renderSkeleton(bone, toSkeleton(props.type, "type"), props.width, props.height, {
        ...attrs,
        class: ["wakeb-skeleton-loader", attrs.class],
        role: "status",
        "aria-busy": "true",
        "aria-label": skeletonLabel(props.label, context.locale),
      })
    : slots.default?.();
</script>
<template>
  <component :is="render" />
</template>
<!-- Not scoped: the bones are render-function nodes without a scope id. Names are wakeb-prefixed. -->
<style lang="scss">
@use "../../styles/skeleton-bones";
/* The shadcn-vue Skeleton look wins over the shared Wakeb bone; WPageSkeleton ships the same rules. */
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

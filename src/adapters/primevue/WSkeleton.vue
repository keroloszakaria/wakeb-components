<script setup lang="ts">
import { h, useAttrs, useSlots } from "vue";
import Skeleton from "primevue/skeleton";
import { useSkeleton } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import { renderSkeleton, skeletonDefaults, skeletonLabel, type SkeletonBone } from "../../composables/skeleton";
import type { SkeletonProps } from "../../types";
/*
 * The portable skeleton grammar drawn as PrimeVue Skeleton bones in unstyled mode, so Wakeb CSS owns the look.
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
    unstyled: true,
    shape: b.circle ? "circle" : "rectangle",
    width: b.width,
    height: b.height,
    borderRadius: b.circle ? "50%" : b.radius,
    class: ["wakeb-skeleton__bone", { "wakeb-skeleton__bone--circle": b.circle }],
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
</style>

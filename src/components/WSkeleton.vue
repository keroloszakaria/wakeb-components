<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { VSkeletonLoader } from "vuetify/components/VSkeletonLoader";
import { useSkeleton } from "../core/vocabulary";
import { useWakebContext } from "../core/runtime";
import { skeletonDefaults, skeletonLabel } from "../composables/skeleton";
import type { SkeletonProps } from "../types";
/* Caller attrs bind first, so the status role, name and busy state stay Wakeb-owned. */
defineOptions({ name: "WSkeleton", inheritAttrs: false });
const props = withDefaults(defineProps<SkeletonProps>(), skeletonDefaults);
defineSlots<{ default?(): unknown }>();
const context = useWakebContext("WSkeleton");
/* Vuetify keeps its own skeleton names during the deprecation window (WAKEB_DEPRECATED_VALUE). */
const toSkeleton = useSkeleton("WSkeleton", true);
const attrs = useAttrs();
const bindings = computed(() => ({ ...attrs, role: "status", "aria-busy": "true", "aria-live": undefined, "aria-label": skeletonLabel(props.label, context.locale) }));
</script>
<template>
  <slot v-if="!loading" />
  <VSkeletonLoader v-else v-bind="bindings" class="wakeb-skeleton-loader" :type="toSkeleton(type, 'type')" :width="width" :height="height" />
</template>

<!--
  Adapted from shadcn-vue 2.9.0, apps/v4/registry/new-york-v4/ui/spinner (MIT License,
  Copyright (c) 2023 unovue), which renders the Lucide `loader-circle` icon (Loader2Icon, ISC License,
  Copyright (c) 2026 Lucide Icons and Contributors). See THIRD-PARTY-NOTICES.txt.
  Wakeb changes: the icon is inlined, so no icon package is needed; its Lucide props (`size`,
  `color`, `strokeWidth`, `absoluteStrokeWidth`) are declared here; the `animate-spin` utility is a
  precompiled rule; and the indicator is decorative, because WLoading owns the status role and name.
-->
<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{ size?: string | number; color?: string; strokeWidth?: string | number; absoluteStrokeWidth?: boolean }>(),
  { size: 24, color: "currentColor", strokeWidth: 2, absoluteStrokeWidth: false },
);
const dimension = computed(() => (typeof props.size === "number" ? `${props.size}px` : props.size));
/* Lucide keeps the visual stroke width constant across sizes when absoluteStrokeWidth is set. */
const stroke = computed(() =>
  props.absoluteStrokeWidth && typeof props.size === "number" ? (Number(props.strokeWidth) * 24) / props.size : props.strokeWidth,
);
</script>

<template>
  <svg
    data-slot="spinner"
    class="wakeb-sc-spinner"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    :style="{ width: dimension, height: dimension }"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
</template>

<style>
.wakeb-sc-spinner {
  flex-shrink: 0;
  animation: wakeb-sc-spin 1s linear infinite;
}
@keyframes wakeb-sc-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .wakeb-sc-spinner {
    animation-duration: 3s;
  }
}
</style>

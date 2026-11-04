<!--
  Adapted from shadcn-vue 2.9.0, apps/v4/registry/new-york-v4/ui/skeleton (MIT License,
  Copyright (c) 2023 unovue). See THIRD-PARTY-NOTICES.txt.
  Wakeb changes: the `animate-pulse rounded-md bg-accent` utilities are the precompiled
  `wakeb-sc-skeleton` rules below, so no cn() or Tailwind runtime is needed; caller classes and
  styles fall through as attributes; and the bone is decorative (`aria-hidden`), because
  WPageSkeleton owns the status role and name.
-->
<script setup lang="ts">
defineOptions({ name: "WakebScSkeleton" });
</script>

<template>
  <div data-slot="skeleton" class="wakeb-sc-skeleton" aria-hidden="true" />
</template>

<style>
.wakeb-sc-skeleton {
  border-radius: calc(var(--wakeb-ui-radius, var(--radius, 0.625rem)) - 2px);
  background: var(--wakeb-ui-border, var(--accent, #eaecf0));
  animation: wakeb-sc-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes wakeb-sc-pulse {
  50% {
    opacity: 0.5;
  }
}
@media (prefers-reduced-motion: reduce) {
  .wakeb-sc-skeleton {
    animation: none;
  }
}
</style>

<script setup lang="ts">
import { VProgressCircular } from "vuetify/components/VProgressCircular";
import type { LoadingProps } from "../types";
withDefaults(defineProps<LoadingProps>(), { size: 50, color: "primary", label: "Loading" });
</script>
<template>
  <div class="loading" role="status" :aria-label="label">
    <slot><VProgressCircular indeterminate :color="color" :size="size" aria-hidden="true" /></slot>
  </div>
</template>
<style scoped>
.loading { width:100%; height:100%; display:flex; justify-content:center; align-items:center; }
</style>

<script setup lang="ts">
import { computed } from "vue";
import ProgressSpinner from "primevue/progressspinner";
import type { LoadingProps } from "../../types";
defineOptions({ name: "WLoading" });
const props = withDefaults(defineProps<LoadingProps>(), { size: 50, color: "primary", label: "Loading" });
/* "primary" is the 0.7 theme-name default; any other value is used as a CSS color (SPEC R23 draft). */
const stroke = computed(() => (props.color === "primary" ? "var(--p-primary-color)" : props.color));
const dimension = computed(() => (typeof props.size === "number" ? `${props.size}px` : props.size));
</script>
<template>
  <div class="loading" role="status" :aria-label="label">
    <slot
      ><ProgressSpinner
        aria-hidden="true"
        stroke-width="4"
        :style="{ width: dimension, height: dimension, '--p-progressspinner-color-one': stroke, '--p-progressspinner-color-two': stroke, '--p-progressspinner-color-three': stroke, '--p-progressspinner-color-four': stroke }"
    /></slot>
  </div>
</template>
<style scoped>
.loading { width:100%; height:100%; display:flex; justify-content:center; align-items:center; }
</style>

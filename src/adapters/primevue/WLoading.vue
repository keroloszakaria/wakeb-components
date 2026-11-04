<script setup lang="ts">
import { computed } from "vue";
import ProgressSpinner from "primevue/progressspinner";
import type { LoadingProps } from "../../types";
import { PRIMEVUE_INTENTS, useColor } from "../../core/vocabulary";
defineOptions({ name: "WLoading" });
const props = withDefaults(defineProps<LoadingProps>(), { size: 50, color: "primary", label: "Loading" });
const toColor = useColor("WLoading", PRIMEVUE_INTENTS);
const stroke = computed(() => toColor(props.color, "color", "primary").css);
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

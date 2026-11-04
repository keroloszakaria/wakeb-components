<script setup lang="ts">
import { VProgressCircular } from "vuetify/components/VProgressCircular";
import { computed } from "vue";
import type { LoadingProps } from "../types";
import { VUETIFY_INTENTS, useColor } from "../core/vocabulary";
const props = withDefaults(defineProps<LoadingProps>(), { size: 50, color: "primary", label: "Loading" });
const toColor = useColor("WLoading", VUETIFY_INTENTS, true);
const spinnerColor = computed(() => toColor(props.color, "color", "primary").css);
</script>
<template>
  <div class="loading" role="status" :aria-label="label">
    <slot><VProgressCircular indeterminate :color="spinnerColor" :size="size" aria-hidden="true" /></slot>
  </div>
</template>
<style scoped>
.loading { width:100%; height:100%; display:flex; justify-content:center; align-items:center; }
</style>

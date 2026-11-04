<script setup lang="ts">
import { computed, inject } from "vue";
import ProgressSpinner from "primevue/progressspinner";
import type { LoadingProps } from "../../types";
import { PRIMEVUE_INTENTS, useColor } from "../../core/vocabulary";
import { WAKEB_CONTEXT } from "../../core/runtime";
import { useProviderProps } from "../../core/provider-props";
/* Caller attrs bind before role and aria-label, so the status semantics stay Wakeb-owned (SPEC R14). */
defineOptions({ name: "WLoading", inheritAttrs: false });
const props = withDefaults(defineProps<LoadingProps>(), { size: 50, color: "primary", label: "Loading" });
const toColor = useColor("WLoading", PRIMEVUE_INTENTS);
const stroke = computed(() => toColor(props.color, "color", "primary").css);
const dimension = computed(() => (typeof props.size === "number" ? `${props.size}px` : props.size));
/* The indicator is decorative; its color and size are portable props and pt could carry ARIA. */
const native = useProviderProps(inject(WAKEB_CONTEXT, null), () => props.providerProps, {
  component: "WLoading",
  primitive: ProgressSpinner,
  label: "ProgressSpinner",
  owned: ["strokeWidth", "pt", "ptOptions"],
});
</script>
<template>
  <div v-bind="$attrs" class="loading" role="status" :aria-label="label">
    <slot
      ><ProgressSpinner
        v-bind="native"
        aria-hidden="true"
        stroke-width="4"
        :style="{ width: dimension, height: dimension, '--p-progressspinner-color-one': stroke, '--p-progressspinner-color-two': stroke, '--p-progressspinner-color-three': stroke, '--p-progressspinner-color-four': stroke }"
    /></slot>
  </div>
</template>
<style scoped>
.loading { width:100%; height:100%; display:flex; justify-content:center; align-items:center; }
</style>

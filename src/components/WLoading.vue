<script setup lang="ts">
import { VProgressCircular } from "vuetify/components/VProgressCircular";
import { computed, inject } from "vue";
import type { LoadingProps } from "../types";
import { VUETIFY_INTENTS, useColor } from "../core/vocabulary";
import { WAKEB_CONTEXT } from "../core/runtime";
import { useProviderProps } from "../core/provider-props";
/* Caller attrs bind before role and aria-label, so the status semantics stay Wakeb-owned (SPEC R14). */
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<LoadingProps>(), { size: 50, color: "primary", label: "Loading" });
const toColor = useColor("WLoading", VUETIFY_INTENTS, true);
const spinnerColor = computed(() => toColor(props.color, "color", "primary").css);
/* The indicator is decorative and indeterminate; its color and size are portable props. */
const native = useProviderProps(inject(WAKEB_CONTEXT, null), () => props.providerProps, {
  component: "WLoading",
  primitive: VProgressCircular,
  label: "VProgressCircular",
  owned: ["indeterminate", "modelValue", "color", "size"],
});
</script>
<template>
  <div v-bind="$attrs" class="loading" role="status" :aria-label="label">
    <slot><VProgressCircular v-bind="native" indeterminate :color="spinnerColor" :size="size" aria-hidden="true" /></slot>
  </div>
</template>
<style scoped>
.loading { width:100%; height:100%; display:flex; justify-content:center; align-items:center; }
</style>

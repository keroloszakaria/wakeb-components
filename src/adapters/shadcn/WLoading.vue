<script setup lang="ts">
import { computed, inject } from "vue";
import Spinner from "./ui/Spinner.vue";
import type { LoadingProps } from "../../types";
import { SHADCN_INTENTS, useColor } from "../../core/vocabulary";
import { WAKEB_CONTEXT } from "../../core/runtime";
import { useProviderProps } from "../../core/provider-props";
/* Caller attrs bind before role and aria-label, so the status semantics stay Wakeb-owned (SPEC R14). */
defineOptions({ name: "WLoading", inheritAttrs: false });
const props = withDefaults(defineProps<LoadingProps>(), { size: 50, color: "primary", label: "Loading" });
const toColor = useColor("WLoading", SHADCN_INTENTS);
const stroke = computed(() => toColor(props.color, "color", "primary").css);
/* The indicator is decorative; its size and color are portable props. Lucide's stroke props pass. */
const native = useProviderProps(inject(WAKEB_CONTEXT, null), () => props.providerProps, {
  component: "WLoading",
  primitive: Spinner,
  label: "Spinner",
  owned: ["size", "color"],
});
</script>
<template>
  <div v-bind="$attrs" class="loading" role="status" :aria-label="label">
    <slot><Spinner v-bind="native" :size="size" :style="{ color: stroke }" /></slot>
  </div>
</template>
<style scoped>
.loading { width:100%; height:100%; display:flex; justify-content:center; align-items:center; }
</style>

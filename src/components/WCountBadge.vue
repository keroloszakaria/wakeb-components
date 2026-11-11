<script setup lang="ts">
import { computed } from "vue";
import { VBadge } from "vuetify/components/VBadge";
import { countBadgeDefaults, countBadgeState } from "../composables/elements";
import { VUETIFY_INTENTS, useColor } from "../core/vocabulary";
import { useWakebContext } from "../core/runtime";
import type { CountBadgeProps } from "../types";
defineOptions({ name: "WCountBadge" });
const props = withDefaults(defineProps<CountBadgeProps>(), countBadgeDefaults);
defineSlots<{ default?(): unknown }>();
useWakebContext("WCountBadge");
const toColor = useColor("WCountBadge", VUETIFY_INTENTS);
const state = computed(() => countBadgeState(props));
</script>
<template>
  <!-- VBadge renders the indicator as role=status with aria-live=polite; its aria-label is `label`, else the shown count. -->
  <VBadge
    :class="['wakeb-count-badge', state.locationClass]"
    :model-value="state.shown"
    :content="state.text || undefined"
    :dot="dot"
    :color="toColor(color, 'color', 'danger').css"
    :location="state.location"
    :label="label ?? (state.text || undefined)"
  >
    <slot />
  </VBadge>
</template>

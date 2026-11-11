<script setup lang="ts">
import { computed } from "vue";
import Badge from "primevue/badge";
import { countBadgeDefaults, countBadgeState } from "../../composables/elements";
import { PRIMEVUE_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { CountBadgeProps } from "../../types";
defineOptions({ name: "WCountBadge" });
const props = withDefaults(defineProps<CountBadgeProps>(), countBadgeDefaults);
defineSlots<{ default?(): unknown }>();
useWakebContext("WCountBadge");
const toColor = useColor("WCountBadge", PRIMEVUE_INTENTS);
const state = computed(() => countBadgeState(props));
/* A labelled or counted indicator is a polite status; an unlabelled dot is decorative. */
const a11y = computed((): Record<string, string> =>
  props.dot && !props.label
    ? { "aria-hidden": "true" }
    : { role: "status", "aria-live": "polite", "aria-atomic": "true", "aria-label": props.label ?? state.value.text },
);
</script>
<template>
  <span :class="['wakeb-count-badge', 'wakeb-count-badge-native', state.locationClass]">
    <slot />
    <Badge
      v-if="state.shown"
      v-bind="a11y"
      :value="dot ? undefined : state.text"
      :class="['wakeb-count-badge__badge', { 'wakeb-count-badge__badge--dot': dot }]"
      :style="{ '--wakeb-count-badge-color': toColor(color, 'color', 'danger').css }"
    />
  </span>
</template>
<style lang="scss">
@use "../../styles/count-badge";
</style>

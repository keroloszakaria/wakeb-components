<script setup lang="ts">
import { computed } from "vue";
import { countBadgeDefaults, countBadgeState } from "../../composables/elements";
import { SHADCN_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { CountBadgeProps } from "../../types";
defineOptions({ name: "WCountBadge" });
const props = withDefaults(defineProps<CountBadgeProps>(), countBadgeDefaults);
defineSlots<{ default?(): unknown }>();
useWakebContext("WCountBadge");
const toColor = useColor("WCountBadge", SHADCN_INTENTS);
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
    <span
      v-if="state.shown"
      v-bind="a11y"
      :class="['wakeb-count-badge__badge', 'wakeb-sc-count-badge', { 'wakeb-count-badge__badge--dot': dot }]"
      :style="{ '--wakeb-count-badge-color': toColor(color, 'color', 'danger').css }"
      >{{ state.text }}</span
    >
  </span>
</template>
<style lang="scss">
@use "../../styles/count-badge";

/* shadcn-vue Badge look: the destructive token is the default indicator color. */
.wakeb-sc-count-badge {
  border: 2px solid var(--background, #fff);
}
</style>

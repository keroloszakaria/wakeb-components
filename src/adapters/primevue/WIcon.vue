<script setup lang="ts">
import { computed } from "vue";
import WakebIcon from "../../icons/WakebIcon";
import { iconDefaults, toUnit } from "../../composables/elements";
import { PRIMEVUE_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { IconProps } from "../../types";
defineOptions({ name: "WIcon" });
const props = withDefaults(defineProps<IconProps>(), iconDefaults);
useWakebContext("WIcon");
const toColor = useColor("WIcon", PRIMEVUE_INTENTS);
/* A label makes the icon an image with that name; otherwise it is decorative. */
const a11y = computed((): Record<string, string> => (props.label ? { role: "img", "aria-label": props.label } : { "aria-hidden": "true" }));
const dimension = computed(() => toUnit(props.size) ?? "24px");
</script>
<template>
  <span v-bind="a11y" class="wakeb-icon-root" :style="{ width: dimension, height: dimension, color: color ? toColor(color, 'color', 'neutral').css : undefined }">
    <WakebIcon :icon="icon" :size="dimension" />
  </span>
</template>
<style>
.wakeb-icon-root {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>

<script setup lang="ts">
import { computed } from "vue";
import { VIcon } from "vuetify/components/VIcon";
import { iconDefaults } from "../composables/elements";
import { useVuetifyIcon } from "../core/icons";
import { VUETIFY_INTENTS, useColor } from "../core/vocabulary";
import { useWakebContext } from "../core/runtime";
import type { IconProps } from "../types";
defineOptions({ name: "WIcon" });
const props = withDefaults(defineProps<IconProps>(), iconDefaults);
useWakebContext("WIcon");
const toIcon = useVuetifyIcon();
const toColor = useColor("WIcon", VUETIFY_INTENTS);
/* A label makes the icon an image with that name; otherwise it is decorative. */
const a11y = computed(() => (props.label ? { role: "img", "aria-label": props.label, "aria-hidden": "false" } : { "aria-hidden": "true" }));
</script>
<template>
  <VIcon v-bind="a11y" class="wakeb-icon-root" :icon="toIcon(icon)" :size="size" :color="color ? toColor(color, 'color', 'neutral').css : undefined" />
</template>

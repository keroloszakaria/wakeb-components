<script setup lang="ts">
import { VDivider } from "vuetify/components/VDivider";
import { dividerDefaults } from "../composables/elements";
import { VUETIFY_INTENTS, useColor } from "../core/vocabulary";
import { useWakebContext } from "../core/runtime";
import type { DividerProps } from "../types";
defineOptions({ name: "WDivider" });
withDefaults(defineProps<DividerProps>(), dividerDefaults);
useWakebContext("WDivider");
const toColor = useColor("WDivider", VUETIFY_INTENTS);
</script>
<template>
  <!-- VDivider is an hr with role=separator and aria-orientation; a color also drops its default opacity. -->
  <VDivider
    class="wakeb-divider"
    :vertical="vertical"
    :thickness="thickness"
    :color="color ? toColor(color, 'color', 'neutral').css : undefined"
    :opacity="color ? 1 : undefined"
  />
</template>

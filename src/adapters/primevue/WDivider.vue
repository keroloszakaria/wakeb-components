<script setup lang="ts">
import { computed } from "vue";
import Divider from "primevue/divider";
import { dividerDefaults, toUnit } from "../../composables/elements";
import { PRIMEVUE_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { DividerProps } from "../../types";
defineOptions({ name: "WDivider" });
const props = withDefaults(defineProps<DividerProps>(), dividerDefaults);
useWakebContext("WDivider");
const toColor = useColor("WDivider", PRIMEVUE_INTENTS);
const style = computed(() => ({
  "--wakeb-divider-thickness": toUnit(props.thickness) ?? "1px",
  ...(props.color ? { "--p-divider-border-color": toColor(props.color, "color", "neutral").css } : {}),
}));
</script>
<template>
  <!-- PrimeVue Divider is role=separator with aria-orientation; Wakeb drops its margins like VDivider. -->
  <Divider class="wakeb-divider wakeb-pv-divider" :layout="vertical ? 'vertical' : 'horizontal'" :style="style" />
</template>
<style>
.wakeb-pv-divider.p-divider {
  margin: 0;
  padding: 0;
}
.wakeb-pv-divider.p-divider-horizontal::before {
  border-block-start-width: var(--wakeb-divider-thickness, 1px);
}
.wakeb-pv-divider.p-divider-vertical {
  align-self: stretch;
  min-height: 1rem;
}
.wakeb-pv-divider.p-divider-vertical::before {
  border-inline-start-width: var(--wakeb-divider-thickness, 1px);
}
</style>

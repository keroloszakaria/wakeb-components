<script setup lang="ts">
import { computed } from "vue";
import { Separator } from "reka-ui";
import { dividerDefaults, toUnit } from "../../composables/elements";
import { SHADCN_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { DividerProps } from "../../types";
defineOptions({ name: "WDivider" });
const props = withDefaults(defineProps<DividerProps>(), dividerDefaults);
useWakebContext("WDivider");
const toColor = useColor("WDivider", SHADCN_INTENTS);
const style = computed(() => ({
  "--wakeb-divider-thickness": toUnit(props.thickness) ?? "1px",
  ...(props.color ? { "--wakeb-divider-color": toColor(props.color, "color", "neutral").css } : {}),
}));
</script>
<template>
  <!-- A non-decorative reka-ui Separator: role=separator, with aria-orientation when vertical. -->
  <Separator data-slot="separator" class="wakeb-divider wakeb-sc-divider" :orientation="vertical ? 'vertical' : 'horizontal'" :style="style" />
</template>
<style>
/* Adapted from the shadcn-vue 2.9.0 Separator (new-york-v4 registry, MIT License); see THIRD-PARTY-NOTICES.txt. */
.wakeb-sc-divider {
  flex-shrink: 0;
  background: var(--wakeb-divider-color, var(--wakeb-ui-border, var(--border, #e5e5e5)));
}
.wakeb-sc-divider[data-orientation="horizontal"] {
  width: 100%;
  height: var(--wakeb-divider-thickness, 1px);
}
.wakeb-sc-divider[data-orientation="vertical"] {
  align-self: stretch;
  width: var(--wakeb-divider-thickness, 1px);
  min-height: 1rem;
}
</style>

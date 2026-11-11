<script setup lang="ts">
import { computed, useAttrs } from "vue";
import ProgressBar from "primevue/progressbar";
import { progressLinearDefaults, useProgressLinear } from "../../composables/progress";
import { PRIMEVUE_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { ProgressLinearProps } from "../../types";
/* Caller attrs bind first, so the progressbar semantics stay Wakeb-owned. */
defineOptions({ name: "WProgressLinear", inheritAttrs: false });
const props = withDefaults(defineProps<ProgressLinearProps>(), progressLinearDefaults);
const context = useWakebContext("WProgressLinear");
const toColor = useColor("WProgressLinear", PRIMEVUE_INTENTS);
const { value, height, aria, classes } = useProgressLinear(props, () => context.locale);
const attrs = useAttrs();
/* The PrimeVue theme tokens carry the height and the bar color, so styled and themed hosts agree. */
const style = computed(() => [
  attrs.style as never,
  { height: height.value, "--p-progressbar-height": height.value, "--p-progressbar-value-background": toColor(props.color, "color", "primary").css },
]);
const bindings = computed(() => ({ ...attrs, style: style.value, ...aria.value }));
</script>
<template>
  <ProgressBar
    v-bind="bindings"
    :class="classes"
    class="wakeb-pv-progress-linear"
    :mode="indeterminate ? 'indeterminate' : 'determinate'"
    :value="value ?? 0"
    :show-value="false"
  />
</template>
<style lang="scss">
@use "../../styles/progress-linear";
</style>

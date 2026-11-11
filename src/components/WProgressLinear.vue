<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { VProgressLinear } from "vuetify/components/VProgressLinear";
import { progressLinearDefaults, useProgressLinear } from "../composables/progress";
import { VUETIFY_INTENTS, useColor } from "../core/vocabulary";
import { useWakebContext } from "../core/runtime";
import type { ProgressLinearProps } from "../types";
/* Caller attrs bind first, so the progressbar semantics stay Wakeb-owned. */
defineOptions({ name: "WProgressLinear", inheritAttrs: false });
const props = withDefaults(defineProps<ProgressLinearProps>(), progressLinearDefaults);
const context = useWakebContext("WProgressLinear");
const toColor = useColor("WProgressLinear", VUETIFY_INTENTS);
const { value, height, aria, classes } = useProgressLinear(props, () => context.locale);
const attrs = useAttrs();
const bindings = computed(() => ({ ...attrs, ...aria.value }));
</script>
<template>
  <!-- VProgressLinear reads height as a number of px; the inline style keeps other CSS lengths. -->
  <VProgressLinear
    v-bind="bindings"
    :class="classes"
    :model-value="value ?? 0"
    :indeterminate="indeterminate"
    :active="active"
    :color="toColor(color, 'color', 'primary').css"
    :height="Number.parseFloat(height) || 0"
    :style="{ height }"
    :absolute="absolute"
    :location="location === 'bottom' ? 'bottom' : 'top'"
  />
</template>
<style lang="scss">
@use "../styles/progress-linear";
</style>

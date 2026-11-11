<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { ProgressIndicator, ProgressRoot } from "reka-ui";
import { progressLinearDefaults, useProgressLinear } from "../../composables/progress";
import { SHADCN_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { ProgressLinearProps } from "../../types";
/* Caller attrs bind first, so the progressbar semantics stay Wakeb-owned. */
defineOptions({ name: "WProgressLinear", inheritAttrs: false });
const props = withDefaults(defineProps<ProgressLinearProps>(), progressLinearDefaults);
const context = useWakebContext("WProgressLinear");
const toColor = useColor("WProgressLinear", SHADCN_INTENTS);
const { value, height, aria, classes } = useProgressLinear(props, () => context.locale);
const attrs = useAttrs();
const style = computed(() => [attrs.style as never, { height: height.value, "--wakeb-progress-linear-color": toColor(props.color, "color", "primary").css }]);
/* reka-ui writes its own ARIA and data-state; the Wakeb ARIA comes last and wins. */
const bindings = computed(() => ({ ...attrs, style: style.value, ...aria.value }));
const transform = computed(() => (value.value === undefined ? undefined : `translateX(-${100 - value.value}%)`));
</script>
<template>
  <ProgressRoot v-bind="bindings" data-slot="progress" :class="classes" class="wakeb-sc-progress" :model-value="value ?? null" :max="100">
    <ProgressIndicator data-slot="progress-indicator" class="wakeb-sc-progress__indicator" :style="{ transform }" />
  </ProgressRoot>
</template>
<style lang="scss">
@use "../../styles/progress-linear";
/* Adapted from the shadcn-vue 2.9.0 Progress (new-york-v4 registry, MIT License); see THIRD-PARTY-NOTICES.txt. */
.wakeb-sc-progress {
  position: relative;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--wakeb-progress-linear-color) 20%, transparent);
}
.wakeb-sc-progress__indicator {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: var(--wakeb-progress-linear-color);
  transition: transform 0.3s;
}
.wakeb-sc-progress.wakeb-progress-linear--indeterminate .wakeb-sc-progress__indicator {
  width: 40%;
  animation: wakeb-sc-progress-slide 1.4s ease-in-out infinite;
}
.wakeb-sc-progress.wakeb-progress-linear--indeterminate:dir(rtl) .wakeb-sc-progress__indicator {
  animation-direction: reverse;
}
@keyframes wakeb-sc-progress-slide {
  from {
    margin-inline-start: -40%;
  }
  to {
    margin-inline-start: 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .wakeb-sc-progress.wakeb-progress-linear--indeterminate .wakeb-sc-progress__indicator {
    width: 100%;
    opacity: 0.6;
    animation: none;
  }
}
</style>

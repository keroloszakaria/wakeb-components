<template>
  <div
    v-bind="$attrs"
    class="segmented-progress"
    role="progressbar"
    :aria-valuenow="percent"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="name"
  >
    <div
      v-if="percent > 0"
      class="segmented-progress__fill"
      :style="{ flex: `${percent} 1 0%`, backgroundColor: fillColor }"
    >
      <span v-if="label || $slots.default"><slot :value="percent" :label="label">{{ label }}</slot></span>
    </div>
    <div
      v-if="percent < 100"
      class="segmented-progress__track"
      :style="{ flex: `${100 - percent} 1 0%` }"
    />
  </div>
</template>

<script setup lang="ts">
import type { SegmentedProgressProps } from "../../types";
import { segmentedProgressDefaults, useSegmentedProgress } from "../../composables/progress";
/* Wakeb-owned markup and CSS: PrimeVue ProgressBar has no segmented track or label slot payload. */
/* Caller attrs bind first, so the progressbar role, value and name stay Wakeb-owned (SPEC R14). */
defineOptions({ name: "WSegmentedProgress", inheritAttrs: false });
const props = withDefaults(defineProps<SegmentedProgressProps>(), segmentedProgressDefaults);
defineSlots<{ default?(props: { value: number; label: string }): unknown }>();
const { value: percent, fillColor, name } = useSegmentedProgress(props);
</script>

<style scoped lang="scss">
@use "../../styles/segmented-progress";
</style>

<template>
  <div
    class="segmented-progress"
    role="progressbar"
    :aria-valuenow="normalizedValue"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="ariaLabel || label || `${normalizedValue}%`"
  >
    <div
      v-if="normalizedValue > 0"
      class="segmented-progress__fill"
      :style="{ flexGrow: normalizedValue, backgroundColor: color }"
    >
      <span v-if="label || $slots.default"><slot :value="normalizedValue" :label="label">{{ label }}</slot></span>
    </div>
    <div
      v-if="normalizedValue < 100"
      class="segmented-progress__track"
      :style="{ flexGrow: 100 - normalizedValue }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SegmentedProgressProps } from "../types";
const props = withDefaults(defineProps<SegmentedProgressProps>(), { value: 0, label: "", color: "var(--wakeb-progress-color, #12b76a)", ariaLabel: "" });
defineSlots<{ default?(props: { value: number; label: string }): unknown }>();
const normalizedValue = computed(() => Math.min(100, Math.max(0, Number(props.value) || 0)));
</script>

<style scoped lang="scss">
.segmented-progress {
  display: flex;
  gap: 2px;
  align-items: stretch;
  block-size: var(--wakeb-progress-height, 34px);
  padding: 4px;
  border-radius: 12px;
  background: var(--wakeb-progress-surface, #fff);
  box-shadow: inset 0 0 16px rgb(0 0 0 / 0.05);

  &__fill,
  &__track {
    min-inline-size: 0;
    border-radius: 4px;
  }

  &__fill {
    display: flex;
    align-items: center;
    justify-content: center;
    border-start-start-radius: 8px;
    border-end-start-radius: 8px;
    border-start-end-radius: 4px;
    border-end-end-radius: 4px;
    // striped texture layered over the inline background-color (color prop)
    background-image: repeating-linear-gradient(
      -45deg,
      rgb(255 255 255 / 0.15),
      rgb(255 255 255 / 0.15) 4px,
      transparent 4px,
      transparent 8px
    );
    box-shadow: inset 0 0 16px rgb(0 0 0 / 0.35);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1.125rem;
    transition: flex-grow 0.3s ease;

    &:only-child {
      border-radius: 8px;
    }

    span {
      overflow: hidden;
      padding-inline: 0.375rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__track {
    border-start-start-radius: 4px;
    border-end-start-radius: 4px;
    border-start-end-radius: 8px;
    border-end-end-radius: 8px;
    background: repeating-linear-gradient(
      -45deg,
      var(--wakeb-progress-track-background, #f2f4f7),
      rgba(255, 255, 255, 0.06) 10px,
      var(--wakeb-progress-track-background, #f2f4f7),
      8px,
      var(--wakeb-progress-track-border, #d0d5dd) 20px
    );
    box-shadow: inset 0 0 16px rgb(0 0 0 / 0.05);
    transition: flex-grow 0.3s ease;

    &:only-child {
      border-radius: 8px;
    }
  }
}
@media (prefers-reduced-motion: reduce) { .segmented-progress__fill, .segmented-progress__track { transition: none; } }
</style>

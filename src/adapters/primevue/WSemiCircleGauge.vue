<template>
  <div class="semi-circle-gauge" :style="{ '--gauge-size': `${gaugeSize}px` }">
    <svg
      class="semi-circle-gauge__svg"
      :viewBox="`0 0 ${gaugeSize} ${gaugeSize / 2}`"
      role="img"
      :aria-label="name"
    >
      <defs>
        <!-- Gray striped background -->
        <pattern
          :id="ids.pattern"
          width="6"
          height="6"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="6" height="6" fill="var(--wakeb-gauge-track-background, #f2f4f7)" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--wakeb-gauge-track-border, #d0d5dd)" stroke-width="2" />
        </pattern>

        <!-- Green gradient -->
        <linearGradient :id="ids.gradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="var(--wakeb-gauge-color, #12b76a)" />
          <stop offset="100%" stop-color="var(--wakeb-gauge-highlight, var(--wakeb-gauge-color, #12b76a))" />
        </linearGradient>

        <!-- Green striped overlay -->
        <pattern
          :id="ids.progressPattern"
          width="6"
          height="6"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="6" height="6" fill="transparent" />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="var(--wakeb-gauge-highlight, var(--wakeb-gauge-color, #12b76a))"
            stroke-width="2"
            opacity="0.18"
          />
        </pattern>
      </defs>

      <!-- Gray track -->
      <path
        class="semi-circle-gauge__track"
        :d="arcPath"
        :stroke="`url(#${ids.pattern})`"
        :stroke-width="band"
      />

      <!-- Green progress -->
      <path
        class="semi-circle-gauge__value"
        :d="arcPath"
        :stroke="`url(#${ids.gradient})`"
        :stroke-width="band"
        :stroke-dasharray="arcLength"
        :stroke-dashoffset="dashOffset"
      />

      <!-- Green striped overlay -->
      <path
        class="semi-circle-gauge__progress-pattern"
        :d="arcPath"
        :stroke="`url(#${ids.progressPattern})`"
        :stroke-width="band"
        :stroke-dasharray="arcLength"
        :stroke-dashoffset="dashOffset"
      />

      <!-- Needle -->
      <rect
        class="semi-circle-gauge__needle"
        :x="center - needleWidth / 2"
        y="0"
        :width="needleWidth"
        :height="band"
        :rx="needleWidth / 2"
        :transform="`rotate(${needleAngle} ${center} ${center})`"
      />
    </svg>

    <div class="semi-circle-gauge__content" aria-hidden="true">
      <slot :value="percent" :label="label" :sub-label="subLabel">
      <span v-if="subLabel" class="semi-circle-gauge__sub">
        {{ subLabel }}
      </span>

      <strong>{{ label }}</strong>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SemiCircleGaugeProps } from "../../types";
import { semiCircleGaugeDefaults, useSemiCircleGauge } from "../../composables/progress";
/* Wakeb-owned SVG with the shared geometry: PrimeVue Knob is an input, not a read-only gauge. */
defineOptions({ name: "WSemiCircleGauge" });
const props = withDefaults(defineProps<SemiCircleGaugeProps>(), semiCircleGaugeDefaults);
defineSlots<{ default?(props: { value: number; label: string; subLabel: string }): unknown }>();
const { ids, value: percent, size: gaugeSize, band, center, needleWidth, arcLength, arcPath, dashOffset, needleAngle, name } = useSemiCircleGauge(props);
</script>

<style scoped lang="scss">
@use "../../styles/semi-circle-gauge";
</style>

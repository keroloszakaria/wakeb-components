<template>
  <div class="semi-circle-gauge" :style="{ '--gauge-size': `${safeSize}px` }">
    <svg
      class="semi-circle-gauge__svg"
      :viewBox="`0 0 ${safeSize} ${safeSize / 2}`"
      role="img"
      :aria-label="accessibleLabel"
    >
      <defs>
        <!-- Gray striped background -->
        <pattern
          :id="patternId"
          width="6"
          height="6"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="6" height="6" fill="var(--wakeb-gauge-track-background, #f2f4f7)" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--wakeb-gauge-track-border, #d0d5dd)" stroke-width="2" />
        </pattern>

        <!-- Green gradient -->
        <linearGradient :id="gradientId" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="var(--wakeb-gauge-color, #12b76a)" />
          <stop offset="100%" stop-color="var(--wakeb-gauge-highlight, var(--wakeb-gauge-color, #12b76a))" />
        </linearGradient>

        <!-- Green striped overlay -->
        <pattern
          :id="progressPatternId"
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
        :stroke="`url(#${patternId})`"
        :stroke-width="bandWidth"
      />

      <!-- Green progress -->
      <path
        class="semi-circle-gauge__value"
        :d="arcPath"
        :stroke="`url(#${gradientId})`"
        :stroke-width="bandWidth"
        :stroke-dasharray="arcLength"
        :stroke-dashoffset="dashOffset"
      />

      <!-- Green striped overlay -->
      <path
        class="semi-circle-gauge__progress-pattern"
        :d="arcPath"
        :stroke="`url(#${progressPatternId})`"
        :stroke-width="bandWidth"
        :stroke-dasharray="arcLength"
        :stroke-dashoffset="dashOffset"
      />

      <!-- Needle -->
      <rect
        class="semi-circle-gauge__needle"
        :x="center - needleWidth / 2"
        y="0"
        :width="needleWidth"
        :height="bandWidth"
        :rx="needleWidth / 2"
        :transform="`rotate(${needleAngle} ${center} ${center})`"
      />
    </svg>

    <div class="semi-circle-gauge__content" aria-hidden="true">
      <slot :value="normalizedValue" :label="label" :sub-label="subLabel">
      <span v-if="subLabel" class="semi-circle-gauge__sub">
        {{ subLabel }}
      </span>

      <strong>{{ label }}</strong>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from "vue";
import type { SemiCircleGaugeProps } from "../types";
const props = withDefaults(defineProps<SemiCircleGaugeProps>(), { value: 0, size: 154, thickness: 0, label: "", subLabel: "", ariaLabel: "" });
defineSlots<{ default?(props: { value: number; label: string; subLabel: string }): unknown }>();
const uid = useId();
const patternId = `wakeb-gauge-hatch-${uid}`;
const gradientId = `wakeb-gauge-gradient-${uid}`;
const progressPatternId = `wakeb-gauge-progress-hatch-${uid}`;
const normalizedValue = computed(() => Math.min(100, Math.max(0, Number(props.value) || 0)));
const safeSize = computed(() => Number.isFinite(props.size) && props.size > 0 ? props.size : 154);
const bandWidth = computed(() => Number.isFinite(props.thickness) && props.thickness > 0 ? Math.min(props.thickness, safeSize.value / 2) : safeSize.value * 0.236);
const center = computed(() => safeSize.value / 2);
const radius = computed(() => center.value - bandWidth.value / 2);
const needleWidth = computed(() => Math.max(3, safeSize.value * 0.0256));
const arcLength = computed(() => Math.PI * radius.value);
const arcPath = computed(() => `M ${bandWidth.value / 2} ${center.value} A ${radius.value} ${radius.value} 0 0 1 ${safeSize.value - bandWidth.value / 2} ${center.value}`);
const dashOffset = computed(() => arcLength.value * (1 - normalizedValue.value / 100));
const needleAngle = computed(() => -90 + (normalizedValue.value / 100) * 180);
const accessibleLabel = computed(() => props.ariaLabel || `${normalizedValue.value}%`);
</script>

<style scoped lang="scss">
.semi-circle-gauge {
  position: relative;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  inline-size: var(--gauge-size);
  padding-block-end: calc(var(--gauge-size) * 0.046);

  &__svg {
    display: block;
    inline-size: 100%;
    // The arc fills from the reading start, so mirror the geometry in RTL.
    [dir='rtl'] & {
      transform: scaleX(-1);
    }
  }

  path {
    fill: none;
    stroke-linecap: butt;
  }

  &__value,
  &__progress-pattern {
    transition: stroke-dashoffset 0.3s ease;
  }

  &__needle {
    fill: var(--wakeb-gauge-needle-color, #fff);
    transition: transform 0.3s ease;
  }

  &__content {
    position: absolute;
    inset: auto 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--wakeb-gauge-text-color, currentColor);
    text-align: center;
    pointer-events: none;
  }

  &__sub {
    color: var(--wakeb-gauge-muted-color, #667085);
    font-size: max(0.6875rem, calc(var(--gauge-size) * 0.0615));
    font-weight: 400;
    line-height: 1.5;
  }

  strong {
    font-size: calc(var(--gauge-size) * 0.1538);
    font-weight: 700;
    line-height: 1.26;
  }
}
@media (prefers-reduced-motion: reduce) { .semi-circle-gauge__value, .semi-circle-gauge__progress-pattern, .semi-circle-gauge__needle { transition: none; } }
</style>

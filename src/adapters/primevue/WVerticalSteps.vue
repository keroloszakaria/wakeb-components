<script setup lang="ts">
import type { VerticalStep, VerticalStepsProps } from "../../types";
import { stepNumber, verticalStepsDefaults } from "../../composables/steps";
/* Wakeb-owned list markup: PrimeVue Stepper is an interactive wizard, these steps are read-only. */
/* Caller attrs bind first, so the list role and name stay Wakeb-owned (SPEC R14). */
defineOptions({ name: "WVerticalSteps", inheritAttrs: false });
withDefaults(defineProps<VerticalStepsProps>(), verticalStepsDefaults);
defineSlots<{
  indicator(props: { step: VerticalStep; index: number }): unknown;
  icon(props: { step: VerticalStep; index: number }): unknown;
  title(props: { step: VerticalStep; index: number }): unknown;
  timeIcon(props: { step: VerticalStep; index: number }): unknown;
  dateIcon(props: { step: VerticalStep; index: number }): unknown;
}>();
</script>
<template>
  <div v-bind="$attrs" class="steps" role="list" :aria-label="label">
    <div v-for="(step, index) in steps" :key="index" class="steps__row" role="listitem">
      <slot name="indicator" :step="step" :index="index"><div class="icon" :class="{ active: step.is_active }">
        <slot name="icon" :step="step" :index="index"><span v-if="step.is_active" aria-hidden="true">✓</span><span v-else>{{ stepNumber(index) }}</span></slot>
      </div></slot>
      <h2><slot name="title" :step="step" :index="index">{{ step.title }}</slot></h2>
      <div class="steps__details">
        <div class="detail"><slot name="timeIcon" :step="step" :index="index"><span aria-hidden="true">◷</span></slot><p>{{ step.time }}</p></div>
        <div class="detail"><slot name="dateIcon" :step="step" :index="index"><span aria-hidden="true">▦</span></slot><p>{{ step.date }}</p></div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use "../../styles/vertical-steps";
</style>

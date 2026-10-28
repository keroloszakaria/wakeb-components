<script setup lang="ts">
import type { VerticalStep, VerticalStepsProps } from "../types";
withDefaults(defineProps<VerticalStepsProps>(), { steps: () => [], label: "Steps" });
defineSlots<{
  indicator(props: { step: VerticalStep; index: number }): unknown;
  icon(props: { step: VerticalStep; index: number }): unknown;
  title(props: { step: VerticalStep; index: number }): unknown;
  timeIcon(props: { step: VerticalStep; index: number }): unknown;
  dateIcon(props: { step: VerticalStep; index: number }): unknown;
}>();
</script>
<template>
  <div class="steps" role="list" :aria-label="label">
    <div v-for="(step, index) in steps" :key="index" class="steps__row" role="listitem">
      <slot name="indicator" :step="step" :index="index"><div class="icon" :class="{ active: step.is_active }">
        <slot name="icon" :step="step" :index="index"><span v-if="step.is_active" aria-hidden="true">✓</span><span v-else>{{ index >= 9 ? index + 1 : `0${index + 1}` }}</span></slot>
      </div></slot>
      <h2><slot name="title" :step="step" :index="index">{{ step.title }}</slot></h2>
      <div class="steps__details">
        <div class="detail"><slot name="timeIcon" :step="step" :index="index"><span aria-hidden="true">◷</span></slot><p>{{ step.time }}</p></div>
        <div class="detail"><slot name="dateIcon" :step="step" :index="index"><span aria-hidden="true">▦</span></slot><p>{{ step.date }}</p></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.steps { display:flex; flex-direction:column; gap:50px; align-items:flex-start; }
.steps__row { display:flex; align-items:center; gap:8px; }
.steps__row:not(:first-child) :deep(.icon) { position:relative; }
.steps__row:not(:first-child) :deep(.icon)::before { content:''; position:absolute; inset-inline-start:50%; top:-52px; width:1px; height:60px; background:var(--wakeb-steps-accent, #087f8c); z-index:-1; }
.steps :deep(.icon) { flex-shrink:0; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid var(--wakeb-steps-accent, #087f8c); background:var(--wakeb-steps-surface, #f9fafb); font-weight:500; font-size:14px; color:var(--wakeb-steps-text, currentColor); }
.steps :deep(.icon.active) { background:var(--wakeb-steps-accent, #087f8c); color:var(--wakeb-steps-active-text, #fff); }
h2 { font-weight:500; font-size:1rem; color:var(--wakeb-steps-text, currentColor); }
.steps__details { display:flex; align-items:center; gap:20px; }
.detail { display:flex; align-items:center; gap:8px; }
.detail :deep(svg), .detail > span { color:var(--wakeb-steps-muted, #667085); }
.detail p { font-size:14px; color:var(--wakeb-steps-text, currentColor); }
</style>

<script setup lang="ts">
import { cardDefaults } from "../../composables/elements";
import { useWakebContext } from "../../core/runtime";
import type { CardProps } from "../../types";
defineOptions({ name: "WCard" });
withDefaults(defineProps<CardProps>(), cardDefaults);
defineSlots<{ default?(): unknown; title?(): unknown; actions?(): unknown }>();
useWakebContext("WCard");
</script>
<template>
  <div data-slot="card" class="wakeb-card wakeb-sc-card" :class="[`wakeb-card--${variant}`, { 'wakeb-card--padded': padded }]">
    <div v-if="title || $slots.title || subtitle" data-slot="card-header" class="wakeb-sc-card__header">
      <div v-if="title || $slots.title" data-slot="card-title" class="wakeb-card__title"><slot name="title">{{ title }}</slot></div>
      <div v-if="subtitle" data-slot="card-description" class="wakeb-card__subtitle">{{ subtitle }}</div>
    </div>
    <div data-slot="card-content" class="wakeb-card__content"><slot /></div>
    <div v-if="$slots.actions" data-slot="card-footer" class="wakeb-card__actions"><slot name="actions" /></div>
  </div>
</template>
<style>
/* Adapted from the shadcn-vue 2.9.0 Card (new-york-v4 registry, MIT License); see THIRD-PARTY-NOTICES.txt. */
.wakeb-sc-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-block: 1.5rem;
  border: 1px solid var(--wakeb-ui-border, var(--border, #e5e5e5));
  border-radius: calc(var(--wakeb-ui-radius, var(--radius, 0.625rem)) + 4px);
  background: var(--wakeb-ui-surface, var(--card, #fff));
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  color: var(--wakeb-ui-on-surface, var(--card-foreground, #0a0a0a));
  font-family: var(--wakeb-ui-font-family, inherit);
}
.wakeb-sc-card.wakeb-card--flat {
  border-color: transparent;
  box-shadow: none;
}
.wakeb-sc-card.wakeb-card--outlined {
  box-shadow: none;
}
.wakeb-sc-card:not(.wakeb-card--padded) {
  padding-block: 0;
}
.wakeb-sc-card .wakeb-sc-card__header,
.wakeb-sc-card.wakeb-card--padded .wakeb-card__content,
.wakeb-sc-card .wakeb-card__actions {
  padding-inline: 1.5rem;
}
.wakeb-sc-card .wakeb-sc-card__header {
  display: grid;
  gap: 0.375rem;
}
.wakeb-sc-card .wakeb-card__title {
  font-weight: 600;
  line-height: 1;
}
.wakeb-sc-card .wakeb-card__subtitle {
  color: var(--wakeb-ui-muted, var(--muted-foreground, #737373));
  font-size: 0.875rem;
}
.wakeb-sc-card .wakeb-card__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>

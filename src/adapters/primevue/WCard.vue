<script setup lang="ts">
import { computed } from "vue";
import Card from "primevue/card";
import { cardDefaults } from "../../composables/elements";
import { useWakebContext } from "../../core/runtime";
import type { CardProps } from "../../types";
defineOptions({ name: "WCard" });
const props = withDefaults(defineProps<CardProps>(), cardDefaults);
defineSlots<{ default?(): unknown; title?(): unknown; actions?(): unknown }>();
useWakebContext("WCard");
/* Card's body carries the padding; an unpadded card drops it so the content reaches the edges. */
const pt = computed(() => (props.padded ? undefined : { body: { style: { padding: 0 } } }));
</script>
<template>
  <Card class="wakeb-card wakeb-pv-card" :class="[`wakeb-card--${variant}`, { 'wakeb-card--padded': padded }]" :pt="pt">
    <template v-if="title || $slots.title" #title><span class="wakeb-card__title"><slot name="title">{{ title }}</slot></span></template>
    <template v-if="subtitle" #subtitle><span class="wakeb-card__subtitle">{{ subtitle }}</span></template>
    <template #content><slot /></template>
    <template v-if="$slots.actions" #footer><div class="wakeb-card__actions"><slot name="actions" /></div></template>
  </Card>
</template>
<style>
.wakeb-pv-card.wakeb-card--flat {
  box-shadow: none;
}
.wakeb-pv-card.wakeb-card--outlined {
  border: 1px solid var(--wakeb-ui-border, var(--p-content-border-color, #e5e7eb));
  box-shadow: none;
}
.wakeb-pv-card .wakeb-card__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>

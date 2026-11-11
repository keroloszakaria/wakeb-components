<script setup lang="ts">
import { VCard, VCardActions, VCardSubtitle, VCardText, VCardTitle } from "vuetify/components/VCard";
import { cardDefaults } from "../composables/elements";
import { useWakebContext } from "../core/runtime";
import type { CardProps } from "../types";
defineOptions({ name: "WCard" });
withDefaults(defineProps<CardProps>(), cardDefaults);
defineSlots<{ default?(): unknown; title?(): unknown; actions?(): unknown }>();
useWakebContext("WCard");
</script>
<template>
  <VCard class="wakeb-card" :class="[`wakeb-card--${variant}`, { 'wakeb-card--padded': padded }]" :variant="variant" :border="variant === 'outlined' || undefined">
    <VCardTitle v-if="title || $slots.title" class="wakeb-card__title"><slot name="title">{{ title }}</slot></VCardTitle>
    <VCardSubtitle v-if="subtitle" class="wakeb-card__subtitle">{{ subtitle }}</VCardSubtitle>
    <VCardText v-if="padded" class="wakeb-card__content"><slot /></VCardText>
    <slot v-else />
    <VCardActions v-if="$slots.actions" class="wakeb-card__actions"><slot name="actions" /></VCardActions>
  </VCard>
</template>

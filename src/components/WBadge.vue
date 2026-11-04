<template>
  <div>
    <VChip
      v-bind="chipAttrs"
      :color="nativeColor"
      :class="classes"
      :style="chipStyle"
      label
      small
      :variant="VUETIFY_VARIANTS[variant]"
    >
      <template v-if="iconPosition === 'before'">
        <slot name="icon" :icon="icon" :size="iconSize">
          <VIcon v-if="icon" class="icon" :icon="toIcon(icon)" :size="pixelSize" />
        </slot>
        <slot name="actions"></slot>
      </template>
      <span v-if="isDot" class="dot" :style="dotStyle"></span>
      <slot>
        <span>{{ label }}</span>
      </slot>
      <template v-if="iconPosition === 'after'">
        <slot name="icon" :icon="icon" :size="iconSize">
          <VIcon v-if="icon" class="icon" :icon="toIcon(icon)" :size="pixelSize" />
        </slot>
        <slot name="actions"></slot>
      </template>
    </VChip>
  </div>
</template>
<script setup lang="ts">
import { VChip } from "vuetify/components/VChip";
import { VIcon } from "vuetify/components/VIcon";
import { useVuetifyIcon } from "../core/icons";
import type { BadgeProps, SharedIcon } from "../types";
import { VUETIFY_VARIANTS } from "../core/vocabulary";
import { badgeDefaults, useBadge } from "../composables/badge";
const props = withDefaults(defineProps<BadgeProps>(), badgeDefaults);
/*
 * Wakeb types are painted by Wakeb CSS only. Any other type is a Vuetify theme or palette name from
 * the 0.7 contract, still forwarded as the chip color during the deprecation window (SPEC R23).
 */
const { variant, nativeColor, classes, pixelSize, chipStyle, dotStyle } = useBadge(props, { nativeTypes: true });
defineSlots<{
  icon(props: { icon: SharedIcon; size: string | number }): unknown;
  actions(): unknown;
  default(): unknown;
}>();
const toIcon = useVuetifyIcon();
</script>
<style lang="scss" scoped>
@use "../styles/badge";

:deep() {
  .v-chip {
    @include badge.badge(".v-chip__content", ".v-avatar");
  }
}
</style>

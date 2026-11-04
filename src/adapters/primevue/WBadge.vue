<template>
  <div>
    <!-- Unstyled PrimeVue Tag: the shared Wakeb badge CSS paints types and variants (SPEC R23). -->
    <Tag unstyled v-bind="chipAttrs" :class="classes" :style="chipStyle">
      <span class="wakeb-badge__content">
        <template v-if="iconPosition === 'before'">
          <slot name="icon" :icon="icon" :size="iconSize">
            <WakebIcon v-if="icon" class="icon" :icon="icon" :size="pixelSize" />
          </slot>
          <slot name="actions"></slot>
        </template>
        <span v-if="isDot" class="dot" :style="dotStyle"></span>
        <slot>
          <span>{{ label }}</span>
        </slot>
        <template v-if="iconPosition === 'after'">
          <slot name="icon" :icon="icon" :size="iconSize">
            <WakebIcon v-if="icon" class="icon" :icon="icon" :size="pixelSize" />
          </slot>
          <slot name="actions"></slot>
        </template>
      </span>
    </Tag>
  </div>
</template>
<script setup lang="ts">
import Tag from "primevue/tag";
import WakebIcon from "../../icons/WakebIcon";
import { badgeDefaults, useBadge } from "../../composables/badge";
import type { BadgeProps, SharedIcon } from "../../types";
defineOptions({ name: "WBadge" });
const props = withDefaults(defineProps<BadgeProps>(), badgeDefaults);
/* Wakeb types only: a provider color name falls back to `primary` with WAKEB_UNKNOWN_VALUE (SPEC R23). */
const { classes, pixelSize, chipStyle, dotStyle } = useBadge(props, { nativeTypes: false });
defineSlots<{
  icon(props: { icon: SharedIcon; size: string | number }): unknown;
  actions(): unknown;
  default(): unknown;
}>();
</script>
<style lang="scss" scoped>
@use "../../styles/badge";

:deep() {
  .wakeb-badge {
    /* The chip box that VChip provides in the Vuetify renderer. */
    position: relative;
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    vertical-align: middle;
    white-space: nowrap;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 400;
    border: 0 solid currentColor;

    /* PrimeVue Avatar roots keep their fill in the outline type, styled or unstyled. */
    @include badge.badge(".wakeb-badge__content", ".p-avatar, .wakeb-avatar");

    /* Variant looks that VChip adds under the Wakeb colors: tonal underlay and outlined border. */
    &.wakeb-badge--soft::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: currentColor;
      opacity: 0.12;
      pointer-events: none;
    }
    &.wakeb-badge--outline {
      border-width: 1px;
    }
    .icon {
      flex: none;
    }
  }
}
</style>

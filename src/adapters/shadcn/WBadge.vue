<template>
  <div class="wakeb-sc-badge-host">
    <!-- Wakeb-owned badge markup (shadcn-vue's Badge is a styled span): the shared Wakeb badge CSS paints types and variants (SPEC R23). -->
    <span data-slot="badge" v-bind="chipAttrs" :class="classes" :style="chipStyle">
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
    </span>
  </div>
</template>
<script setup lang="ts">
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

/* Slot content (icons, avatars, labels) belongs to the caller's scope, so the badge rules reach it through :deep(). */
.wakeb-sc-badge-host :deep() {
  .wakeb-badge {
    /* The chip box that VChip provides in the Vuetify renderer. */
    position: relative;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    vertical-align: middle;
    white-space: nowrap;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 400;
    border: 0 solid currentColor;

    /* Wakeb avatar boxes keep their fill in the outline type. */
    @include badge.badge(".wakeb-badge__content", ".wakeb-sc-avatar");

    /* Variant looks under the Wakeb colors: tonal underlay and outlined border. */
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

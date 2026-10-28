<template>
  <div>
    <VChip
      v-bind="chipAttrs"
      :color="type"
      :class="[
        type,
        classList,
        `border-radius-${borderRadius}`,
        { 'badge--custom-padding': customPadding },
      ]"
      :style="chipStyle"
      label
      small
      :variant="variant === 'default' ? 'tonal' : variant"
    >
      <template v-if="iconPosition === 'before'">
        <slot name="icon" :icon="icon" :size="iconSize">
          <VIcon v-if="icon" class="icon" :icon="icon" :size="pixelSize" />
        </slot>
        <slot name="actions"></slot>
      </template>
      <span v-if="isDot" class="dot" :style="dotStyle"></span>
      <slot>
        <span>{{ label }}</span>
      </slot>
      <template v-if="iconPosition === 'after'">
        <slot name="icon" :icon="icon" :size="iconSize">
          <VIcon v-if="icon" class="icon" :icon="icon" :size="pixelSize" />
        </slot>
        <slot name="actions"></slot>
      </template>
    </VChip>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { VChip } from "vuetify/components/VChip";
import { VIcon } from "vuetify/components/VIcon";
import type { CSSProperties } from "vue";
import type { BadgeProps, SharedIcon } from "../types";
const props = withDefaults(defineProps<BadgeProps>(), {
  label: "",
  classList: "",
  type: "primary",
  icon: "",
  isDot: false,
  borderRadius: "md",
  customBorderRadius: "",
  customPadding: "",
  dotColor: "",
  variant: "default",
  iconSize: "xs",
  iconPosition: "before",
  chipAttrs: () => ({}),
});
defineSlots<{
  icon(props: { icon: SharedIcon; size: string | number }): unknown;
  actions(): unknown;
  default(): unknown;
}>();
const pixelSize = computed(
  () =>
    (({ xs: 16, sm: 20, md: 24, lg: 32, xl: 40 }) as Record<string, number>)[
      String(props.iconSize)
    ] ?? props.iconSize,
);
const chipStyle = computed<CSSProperties>(() => ({
  ...(props.customBorderRadius
    ? { borderRadius: props.customBorderRadius }
    : {}),
  ...(props.customPadding
    ? { padding: props.customPadding, height: "auto" }
    : {}),
  ...(props.dotColor ? { "--wakeb-badge-current-dot": props.dotColor } : {}),
}));
const dotStyle = computed(() =>
  props.dotColor ? { backgroundColor: props.dotColor } : undefined,
);
</script>
<style lang="scss" scoped>
:deep() {
  .v-chip {
    &.success {
      --wakeb-badge-current-bg: var(
        --wakeb-badge-success-bg,
        var(--wakeb-badge-fallback, #ecfdf3)
      );
      --wakeb-badge-current-text: var(
        --wakeb-badge-success-text,
        var(--wakeb-badge-fallback, #027a48)
      );
      --wakeb-badge-current-dot: var(
        --wakeb-badge-success-dot,
        var(--wakeb-badge-fallback, #12b76a)
      );
    }
    &.success-transparent {
      --wakeb-badge-current-bg: rgba(
        var(
          --wakeb-badge-success-bg-rgb,
          var(--wakeb-badge-fallback, 236, 253, 243)
        ),
        0.5
      );
      --wakeb-badge-current-text: var(
        --wakeb-badge-success-text,
        var(--wakeb-badge-fallback, #027a48)
      );
      --wakeb-badge-current-dot: var(
        --wakeb-badge-success-dot,
        var(--wakeb-badge-fallback, #12b76a)
      );
      color: var(
        --wakeb-badge-success-text,
        var(--wakeb-badge-fallback, #027a48)
      );
      border: 1px solid
        var(--wakeb-badge-success-bg, var(--wakeb-badge-fallback, #ecfdf3));
    }
    &.primary {
      --wakeb-badge-current-bg: var(
        --wakeb-badge-primary-bg,
        var(--wakeb-badge-fallback, #eff8ff)
      );
      --wakeb-badge-current-text: var(
        --wakeb-badge-primary-text,
        var(--wakeb-badge-fallback, #175cd3)
      );
      --wakeb-badge-current-dot: var(
        --wakeb-badge-primary-dot,
        var(--wakeb-badge-fallback, #2e90fa)
      );
    }
    &.primarybtn {
      --wakeb-badge-current-bg: var(
        --wakeb-badge-primary-button-bg,
        var(--wakeb-badge-fallback, #087f8c)
      );
      --wakeb-badge-current-text: var(
        --wakeb-badge-dark-bg,
        var(--wakeb-badge-fallback, #fff)
      );
      --wakeb-badge-current-dot: var(
        --wakeb-badge-dark-bg,
        var(--wakeb-badge-fallback, #fff)
      );
    }

    &.danger {
      --wakeb-badge-current-bg: var(
        --wakeb-badge-danger-bg,
        var(--wakeb-badge-fallback, #fef3f2)
      );
      --wakeb-badge-current-text: var(
        --wakeb-badge-danger-text,
        var(--wakeb-badge-fallback, #b42318)
      );
      --wakeb-badge-current-dot: var(
        --wakeb-badge-danger-dot,
        var(--wakeb-badge-fallback, #f04438)
      );
      color: var(
        --wakeb-badge-danger-text,
        var(--wakeb-badge-fallback, #b42318)
      );
    }
    &.danger-transparent {
      --wakeb-badge-current-bg: rgba(
        var(
          --wakeb-badge-danger-bg-rgb,
          var(--wakeb-badge-fallback, 254, 243, 242)
        ),
        0.3
      );
      --wakeb-badge-current-text: var(
        --wakeb-badge-danger-text,
        var(--wakeb-badge-fallback, #b42318)
      );
      --wakeb-badge-current-dot: var(
        --wakeb-badge-danger-dot,
        var(--wakeb-badge-fallback, #f04438)
      );
      color: var(
        --wakeb-badge-danger-text,
        var(--wakeb-badge-fallback, #b42318)
      );
      border: 1px solid
        var(--wakeb-badge-danger-bg, var(--wakeb-badge-fallback, #fef3f2));
    }
    &.warning {
      --wakeb-badge-current-bg: var(
        --wakeb-badge-warning-bg,
        var(--wakeb-badge-fallback, #fffaeb)
      );
      --wakeb-badge-current-text: var(
        --wakeb-badge-warning-text,
        var(--wakeb-badge-fallback, #b54708)
      );
      --wakeb-badge-current-dot: var(
        --wakeb-badge-warning-dot,
        var(--wakeb-badge-fallback, #f79009)
      );
    }
    &.info {
      --wakeb-badge-current-bg: var(
        --wakeb-badge-info-bg,
        var(--wakeb-badge-fallback, #f0f9ff)
      );
      --wakeb-badge-current-text: var(
        --wakeb-badge-info-text,
        var(--wakeb-badge-fallback, #026aa2)
      );
      --wakeb-badge-current-dot: var(
        --wakeb-badge-info-dot,
        var(--wakeb-badge-fallback, #0ba5ec)
      );
    }
    &.transparent {
      --wakeb-badge-current-bg: var(
        --wakeb-badge-neutral-bg,
        var(--wakeb-badge-fallback, #f2f4f7)
      );
      --wakeb-badge-current-text: var(
        --wakeb-badge-neutral-text,
        var(--wakeb-badge-fallback, #667085)
      );
      --wakeb-badge-current-dot: var(
        --wakeb-badge-neutral-text,
        var(--wakeb-badge-fallback, #667085)
      );
    }
    &.dark {
      --wakeb-badge-current-bg: var(
        --wakeb-badge-dark-bg,
        var(--wakeb-badge-fallback, #fff)
      );
      --wakeb-badge-current-text: var(
        --wakeb-badge-dark-text,
        var(--wakeb-badge-fallback, #667085)
      );
      --wakeb-badge-current-dot: var(
        --wakeb-badge-dark-text,
        var(--wakeb-badge-fallback, #667085)
      );
    }
    &.tertiary {
      --wakeb-badge-current-bg: rgba(
        var(
          --wakeb-badge-tertiary-bg-rgb,
          var(--wakeb-badge-fallback, 242, 244, 247)
        ),
        1
      );
      --wakeb-badge-current-text: var(
        --wakeb-badge-tertiary-text,
        var(--wakeb-badge-fallback, #667085)
      );
      --wakeb-badge-current-dot: var(
        --wakeb-badge-tertiary-text,
        var(--wakeb-badge-fallback, #667085)
      );
    }
    &.outline-secondary {
      --wakeb-badge-current-bg: transparent;
      --wakeb-badge-current-text: var(
        --wakeb-badge-outline-secondary-text,
        var(--wakeb-badge-fallback, #667085)
      );
      --wakeb-badge-current-dot: var(
        --wakeb-badge-outline-secondary-text,
        var(--wakeb-badge-fallback, #667085)
      );
    }
    &.check {
      .icon {
        color: var(
          --wakeb-badge-check-color,
          var(--wakeb-badge-fallback, #667085)
        );
      }
    }
    &.uncheck {
      .icon {
        color: var(
          --wakeb-badge-danger-text,
          var(--wakeb-badge-fallback, #b42318)
        );
      }
    }
    &.outline {
      outline: 1px solid
        var(--wakeb-badge-outline-border, var(--wakeb-badge-fallback, #d0d5dd)) !important;
      --wakeb-badge-current-dot: var(
        --wakeb-badge-success-dot,
        var(--wakeb-badge-fallback, #12b76a)
      );

      *:not(.v-avatar):not(.badge-stack__icon-wrap):not(.dot) {
        background-color: transparent !important;
      }
      .dot {
        width: 6px;
        height: 6px;
        background-color: var(--wakeb-badge-current-dot) !important;
        border-radius: 50%;
      }
    }
    &.outline-secondary {
      border: 1px solid
        var(
          --wakeb-badge-outline-secondary-border,
          var(--wakeb-badge-fallback, #d0d5dd)
        ) !important;
      --wakeb-badge-current-dot: var(
        --wakeb-badge-outline-secondary-border,
        var(--wakeb-badge-fallback, #d0d5dd)
      );
    }
    --wakeb-badge-current-bg: var(
      --wakeb-badge-neutral-bg,
      var(--wakeb-badge-fallback, #f2f4f7)
    );
    border-radius: 24px;
    background-color: var(--wakeb-badge-current-bg);
    padding: 0;
    height: 24px;

    &.badge--custom-padding {
      .v-chip__content {
        padding: 0 !important;
        gap: 4px;
      }
    }

    &.border-radius-sm {
      border-radius: 8px;
    }
    &__content {
      padding: 0 12px;
      font-size: 12px;
      font-weight: 400;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 7px;

      span {
        color: var(--wakeb-badge-current-text);
      }

      .dot {
        width: 6px;
        height: 6px;
        background-color: var(--wakeb-badge-current-dot) !important;
        border-radius: 50%;
      }
    }
  }
}
</style>

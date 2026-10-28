<script setup lang="ts">
import { computed, mergeProps, useAttrs } from "vue";
import { VBtn } from "vuetify/components/VBtn";
import { VTooltip } from "vuetify/components/VTooltip";
import { VIcon } from "vuetify/components/VIcon";
import type { ButtonProps, IconSlotProps } from "../types";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ButtonProps>(), {
  isTooltip: false,
  location: "top",
  title: "",
  classList: "",
  iconPosition: "start",
  type: "primary",
  size: "lg",
  isLoading: false,
  isDropdown: false,
  action: "button",
  disabled: false,
  icon: "",
  iconSize: "sm",
  maxIconWidth: "100%",
  iconColorType: "currentColor",
  customIconColor: "",
  wrapperAttrs: () => ({}),
});
const emit = defineEmits<{ click: [event: MouseEvent] }>();
defineSlots<{
  icon(props: IconSlotProps): unknown;
  dropdown(props: IconSlotProps): unknown;
  content(): unknown;
  default(): unknown;
}>();
const attrs = useAttrs();
const classes = computed(() => [
  "btn",
  `btn--${props.type}`,
  `btn--${props.size}`,
  props.classList,
  { "btn--disabled": props.disabled, "btn--loading": props.isLoading },
]);
const iconColor = computed(
  () =>
    props.customIconColor ||
    {
      danger:
        "var(--wakeb-button-danger-background, var(--wakeb-button-fallback, #d92d20))",
      primary:
        "var(--wakeb-button-icon-primary, var(--wakeb-button-fallback, #087f8c))",
      success:
        "var(--wakeb-button-icon-success, var(--wakeb-button-fallback, #12b76a))",
      warning:
        "var(--wakeb-button-icon-warning, var(--wakeb-button-fallback, #f79009))",
      currentColor: "currentColor",
    }[props.iconColorType],
);
const iconProps = computed<IconSlotProps>(() => ({
  icon: props.icon,
  size: props.iconSize,
  color: iconColor.value,
  maxWidth: props.maxIconWidth,
}));
const pixelSize = computed(() =>
  props.iconSize === "free"
    ? undefined
    : (({ xs: 16, sm: 20, md: 24, lg: 32, xl: 40 } as Record<string, number>)[
        String(props.iconSize)
      ] ?? props.iconSize),
);
const actualAttrs = (tooltip: Record<string, unknown> = {}) =>
  mergeProps(
    tooltip,
    props.isTooltip && !attrs["aria-label"]
      ? { "aria-label": props.title || undefined }
      : {},
    attrs,
  );
</script>
<template>
  <div v-bind="wrapperAttrs">
    <VTooltip v-if="isTooltip" :location="location" :text="title">
      <template #activator="{ props: tooltipProps }">
        <VBtn
          v-bind="actualAttrs(tooltipProps)"
          :class="classes"
          :disabled="disabled"
          :loading="isLoading"
          :type="action"
          @click="emit('click', $event)"
        >
          <slot name="icon" v-bind="iconProps"
            ><VIcon
              v-if="icon"
              :icon="icon"
              :size="pixelSize"
              :color="iconColor"
              :style="{
                maxWidth:
                  typeof maxIconWidth === 'number'
                    ? `${maxIconWidth}px`
                    : maxIconWidth,
              }"
          /></slot>
        </VBtn>
      </template>
    </VTooltip>
    <VBtn
      v-else
      :key="title !== '' ? 'text' : 'icon'"
      :class="classes"
      :disabled="disabled"
      :loading="isLoading"
      :type="action"
      v-bind="actualAttrs()"
      @click="emit('click', $event)"
    >
      <template v-if="title !== ''">
        <slot
          v-if="icon && iconPosition === 'start'"
          name="icon"
          v-bind="iconProps"
          ><VIcon
            :icon="icon"
            :size="pixelSize"
            :color="iconColor"
            :style="{
              maxWidth:
                typeof maxIconWidth === 'number'
                  ? `${maxIconWidth}px`
                  : maxIconWidth,
            }"
        /></slot>
        <p class="mx-1">{{ title }}</p>
        <slot
          v-if="icon && iconPosition === 'end'"
          name="icon"
          v-bind="iconProps"
          ><VIcon
            :icon="icon"
            :size="pixelSize"
            :color="iconColor"
            :style="{
              maxWidth:
                typeof maxIconWidth === 'number'
                  ? `${maxIconWidth}px`
                  : maxIconWidth,
            }"
        /></slot>
      </template>
      <template v-else>
        <slot name="icon" v-bind="iconProps"
          ><VIcon
            v-if="icon"
            :icon="icon"
            :size="pixelSize"
            :color="iconColor"
            :style="{
              maxWidth:
                typeof maxIconWidth === 'number'
                  ? `${maxIconWidth}px`
                  : maxIconWidth,
            }"
        /></slot>
        <slot name="content"><slot /></slot>
      </template>
      <slot
        v-if="isDropdown"
        name="dropdown"
        v-bind="{ ...iconProps, icon: '$expand' }"
        ><VIcon icon="$expand" :size="pixelSize" :color="iconColor"
      /></slot>
    </VBtn>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-ripple__container) {
  display: none;
}

.btn {
  display: inline-flex;
  height: fit-content;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  line-height: 24px;
  min-width: unset;
  border-radius: var(--wakeb-button-radius, 12px);
  box-shadow: none;
  text-transform: none;
  transition: 0.2s ease;
  :deep(svg) {
    width: 100%;
    height: 100%;
    cursor: pointer !important;
  }
  p {
    font-weight: 500 !important;
  }

  :deep(.v-btn__content) {
    display: flex;
    align-items: center;
    gap: inherit;
  }

  &--xl {
    padding: var(
      --wakeb-button-size-xl-padding,
      var(--wakeb-button-fallback, 12px 18px)
    );
    gap: var(--wakeb-button-size-xl-gap, var(--wakeb-button-fallback, 6px));
    font-size: var(
      --wakeb-button-size-xl-font-size,
      var(--wakeb-button-fallback, 1.125rem)
    );
  }
  &--lg {
    padding: var(
      --wakeb-button-size-lg-padding,
      var(--wakeb-button-fallback, 10px 16px)
    );
    gap: var(--wakeb-button-size-lg-gap, var(--wakeb-button-fallback, 6px));
    font-size: var(
      --wakeb-button-size-lg-font-size,
      var(--wakeb-button-fallback, 1rem)
    );
  }
  &--md {
    padding: var(
      --wakeb-button-size-md-padding,
      var(--wakeb-button-fallback, 10px 14px)
    );
    gap: var(--wakeb-button-size-md-gap, var(--wakeb-button-fallback, 4px));
    font-size: var(
      --wakeb-button-size-md-font-size,
      var(--wakeb-button-fallback, 0.875rem)
    );
  }
  &--sm {
    padding: var(
      --wakeb-button-size-sm-padding,
      var(--wakeb-button-fallback, 8px 12px)
    );
    gap: var(--wakeb-button-size-sm-gap, var(--wakeb-button-fallback, 4px));
    font-size: var(
      --wakeb-button-size-sm-font-size,
      var(--wakeb-button-fallback, 0.75rem)
    );
  }

  &--primary {
    border: 1px solid
      var(
        --wakeb-button-primary-border,
        var(--wakeb-button-fallback, transparent)
      );
    background: var(
      --wakeb-button-primary-background,
      var(--wakeb-button-fallback, #087f8c)
    );
    color: var(
      --wakeb-button-primary-color,
      var(--wakeb-button-fallback, #fff)
    );

    :deep(svg) {
      color: var(
        --wakeb-button-primary-svg,
        var(--wakeb-button-fallback, currentColor)
      );
    }

    &:hover:not(.btn--disabled):not(.btn--loading) {
      border-color: var(
        --wakeb-button-primary-hover-border,
        var(--wakeb-button-fallback, transparent)
      );
      background: var(
        --wakeb-button-primary-hover-background,
        var(--wakeb-button-fallback, #066b75)
      );
    }

    &:focus-visible {
      outline: 1px solid
        var(
          --wakeb-button-primary-focus-outline,
          var(--wakeb-button-fallback, #087f8c)
        );
      outline-offset: 2px;
    }

    &.btn--disabled {
      border: 1px solid
        var(
          --wakeb-button-primary-disabled-border,
          var(--wakeb-button-fallback, #eaecf0)
        );
      background: var(
        --wakeb-button-primary-disabled-background,
        var(--wakeb-button-fallback, #eaecf0)
      );
      color: var(
        --wakeb-button-primary-disabled-color,
        var(--wakeb-button-fallback, #98a2b3)
      );
    }

    &.btn--loading {
      border: 1px solid
        var(
          --wakeb-button-primary-loading-border,
          var(--wakeb-button-fallback, transparent)
        );
      background: var(
        --wakeb-button-primary-loading-background,
        var(--wakeb-button-fallback, #087f8c)
      );
    }
  }

  &--secondary {
    border: 1px solid
      var(
        --wakeb-button-secondary-border,
        var(--wakeb-button-fallback, transparent)
      );

    background-color: var(
      --wakeb-button-secondary-surface,
      var(--wakeb-button-fallback, #f2f4f7)
    ) !important;
    color: var(
      --wakeb-button-secondary-text,
      var(--wakeb-button-fallback, #344054)
    ) !important;

    :deep(svg) {
      color: var(
        --wakeb-button-secondary-svg,
        var(--wakeb-button-fallback, currentColor)
      );
    }

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: var(
        --wakeb-button-secondary-hover-background,
        var(--wakeb-button-fallback, #f2f4f7)
      );
      border-color: var(
        --wakeb-button-secondary-hover-border,
        var(--wakeb-button-fallback, transparent)
      );
    }

    &:focus-visible {
      outline: 1px solid
        var(
          --wakeb-button-secondary-focus-outline,
          var(--wakeb-button-fallback, #087f8c)
        );
      outline-offset: 2px;
    }

    &.btn--disabled {
      border: 1px solid
        var(
          --wakeb-button-secondary-disabled-border,
          var(--wakeb-button-fallback, #eaecf0)
        );
      background: var(
        --wakeb-button-secondary-disabled-background,
        var(--wakeb-button-fallback, #eaecf0)
      );
      color: var(
        --wakeb-button-secondary-disabled-color,
        var(--wakeb-button-fallback, #98a2b3)
      );
    }

    &.btn--loading {
      background: var(
        --wakeb-button-secondary-loading-background,
        var(--wakeb-button-fallback, #f2f4f7)
      );
    }
  }
  &--outline {
    border: 1px solid
      var(
        --wakeb-button-outline-border,
        var(--wakeb-button-fallback, transparent)
      );
    background: var(
      --wakeb-button-outline-background,
      var(--wakeb-button-fallback, transparent)
    );
    color: var(
      --wakeb-button-outline-color,
      var(--wakeb-button-fallback, #344054)
    );
    p {
      font-weight: 600 !important;
    }

    :deep(svg) {
      color: var(
        --wakeb-button-outline-svg,
        var(--wakeb-button-fallback, currentColor)
      );
    }

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: var(
        --wakeb-button-outline-hover-background,
        var(--wakeb-button-fallback, transparent)
      );
      border-color: var(
        --wakeb-button-outline-hover-border,
        var(--wakeb-button-fallback, transparent)
      );
    }

    &:focus-visible {
      outline: 1px solid
        var(
          --wakeb-button-outline-focus-outline,
          var(--wakeb-button-fallback, #087f8c)
        );
      outline-offset: 2px;
    }

    &.btn--disabled {
      border: 1px solid
        var(
          --wakeb-button-outline-disabled-border,
          var(--wakeb-button-fallback, #eaecf0)
        );
      background: var(
        --wakeb-button-outline-disabled-background,
        var(--wakeb-button-fallback, #eaecf0)
      );
      color: var(
        --wakeb-button-outline-disabled-color,
        var(--wakeb-button-fallback, #98a2b3)
      );
    }

    &.btn--loading {
      background: var(
        --wakeb-button-outline-loading-background,
        var(--wakeb-button-fallback, transparent)
      );
    }
    &.outline--danger {
      border: 1px solid
        var(
          --wakeb-button-danger-border,
          var(--wakeb-button-fallback, transparent)
        );
      color: var(
        --wakeb-button-outline-danger-text,
        var(--wakeb-button-fallback, #b42318)
      );
    }
  }

  &--danger {
    border: 1px solid
      var(
        --wakeb-button-danger-border,
        var(--wakeb-button-fallback, transparent)
      );
    background: var(
      --wakeb-button-danger-background,
      var(--wakeb-button-fallback, #d92d20)
    );
    color: var(--wakeb-button-danger-color, var(--wakeb-button-fallback, #fff));

    :deep(svg) {
      color: var(
        --wakeb-button-danger-svg,
        var(--wakeb-button-fallback, currentColor)
      );
    }

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: var(
        --wakeb-button-danger-hover-background,
        var(--wakeb-button-fallback, #b42318)
      );
      border-color: var(
        --wakeb-button-danger-hover-border,
        var(--wakeb-button-fallback, transparent)
      );
    }

    &:focus-visible {
      outline: 1px solid
        var(
          --wakeb-button-danger-focus-outline,
          var(--wakeb-button-fallback, #087f8c)
        );
      outline-offset: 2px;
    }

    &.btn--disabled {
      border: 1px solid
        var(
          --wakeb-button-danger-disabled-border,
          var(--wakeb-button-fallback, #eaecf0)
        );
      background: var(
        --wakeb-button-danger-disabled-background,
        var(--wakeb-button-fallback, #eaecf0)
      );
      color: var(
        --wakeb-button-danger-disabled-color,
        var(--wakeb-button-fallback, #98a2b3)
      );
      opacity: var(
        --wakeb-button-danger-disabled-opacity,
        var(--wakeb-button-fallback, 0.5)
      );
    }

    &.btn--loading {
      background: var(
        --wakeb-button-danger-loading-background,
        var(--wakeb-button-fallback, #d92d20)
      );
    }
  }

  &--tertiary {
    border: 1px solid
      var(
        --wakeb-button-tertiary-border,
        var(--wakeb-button-fallback, transparent)
      );
    background: var(
      --wakeb-button-tertiary-background,
      var(--wakeb-button-fallback, transparent)
    );
    color: var(
      --wakeb-button-tertiary-color,
      var(--wakeb-button-fallback, #344054)
    );

    :deep(svg) {
      color: var(
        --wakeb-button-tertiary-svg,
        var(--wakeb-button-fallback, currentColor)
      );
    }

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: var(
        --wakeb-button-tertiary-hover-background,
        var(--wakeb-button-fallback, transparent)
      );
    }

    &:focus-visible {
      outline: 1px solid
        var(
          --wakeb-button-tertiary-focus-outline,
          var(--wakeb-button-fallback, #087f8c)
        );
      outline-offset: 2px;
    }

    &.btn--disabled {
      border: 1px solid
        var(
          --wakeb-button-tertiary-disabled-border,
          var(--wakeb-button-fallback, #eaecf0)
        );
      background: var(
        --wakeb-button-tertiary-disabled-background,
        var(--wakeb-button-fallback, #eaecf0)
      );
      color: var(
        --wakeb-button-tertiary-disabled-color,
        var(--wakeb-button-fallback, #98a2b3)
      );
    }

    &.btn--loading {
      background: var(
        --wakeb-button-tertiary-loading-background,
        var(--wakeb-button-fallback, transparent)
      );
    }
  }

  &--link {
    border: none;
    background: transparent;
    color: var(
      --wakeb-button-link-color,
      var(--wakeb-button-fallback, #344054)
    );
    text-decoration: underline;

    :deep(.v-btn__overlay) {
      display: none;
    }
    :deep(svg) {
      color: var(
        --wakeb-button-link-svg,
        var(--wakeb-button-fallback, currentColor)
      );
      background: transparent;
    }

    &:hover:not(.btn--disabled):not(.btn--loading) {
      color: var(
        --wakeb-button-link-hover-color,
        var(--wakeb-button-fallback, #344054)
      );
      text-decoration: none;
      background: transparent !important;
    }

    &:focus-visible {
      outline: 1px solid
        var(
          --wakeb-button-link-focus-outline,
          var(--wakeb-button-fallback, #087f8c)
        );
      outline-offset: 2px;
    }

    &.btn--disabled {
      opacity: var(
        --wakeb-button-link-disabled-opacity,
        var(--wakeb-button-fallback, 0.5)
      );
      pointer-events: none;
      text-decoration: none;
    }
  }

  &--icon {
    padding: 0 !important;
    height: fit-content;
    min-width: unset;

    color: var(
      --wakeb-button-icon-color,
      var(--wakeb-button-fallback, #344054)
    );
    background: var(
      --wakeb-button-icon-background,
      var(--wakeb-button-fallback, transparent)
    );

    &:hover {
      color: var(
        --wakeb-button-icon-hover-color,
        var(--wakeb-button-fallback, #344054)
      );
      background: var(
        --wakeb-button-icon-hover-background,
        var(--wakeb-button-fallback, transparent)
      );
    }
  }

  &--table-icon {
    padding: 0 !important;
    min-width: 2rem !important;
    height: 2rem !important;
    background: var(
      --wakeb-button-table-icon-background,
      var(--wakeb-button-fallback, transparent)
    );
    color: var(
      --wakeb-button-table-icon-color,
      var(--wakeb-button-fallback, #344054)
    );
    border-radius: var(
      --wakeb-button-table-icon-radius,
      var(--wakeb-button-fallback, 8px)
    );

    &.edit {
      background: var(
        --wakeb-button-table-icon-edit-background,
        var(--wakeb-button-fallback, transparent)
      );
      color: var(
        --wakeb-button-table-icon-edit-color,
        var(--wakeb-button-fallback, #344054)
      );
      border: 1px solid
        var(
          --wakeb-button-table-icon-edit-border,
          var(--wakeb-button-fallback, transparent)
        );
    }
    &.view {
      background: var(
        --wakeb-button-table-icon-view-background,
        var(--wakeb-button-fallback, transparent)
      );
      color: var(
        --wakeb-button-table-icon-view-color,
        var(--wakeb-button-fallback, #344054)
      );
      border: 1px solid
        var(
          --wakeb-button-table-icon-view-border,
          var(--wakeb-button-fallback, transparent)
        );
    }
    &.delete {
      background: var(
        --wakeb-button-table-icon-delete-background,
        var(--wakeb-button-fallback, transparent)
      );
      color: var(
        --wakeb-button-table-icon-delete-color,
        var(--wakeb-button-fallback, #344054)
      );
      border: 1px solid
        var(
          --wakeb-button-table-icon-delete-border,
          var(--wakeb-button-fallback, transparent)
        );
    }
    &.restore {
      background: var(
        --wakeb-button-table-icon-restore-background,
        var(--wakeb-button-fallback, transparent)
      );
      color: var(
        --wakeb-button-table-icon-restore-color,
        var(--wakeb-button-fallback, #344054)
      );
      border: 1px solid
        var(
          --wakeb-button-table-icon-restore-border,
          var(--wakeb-button-fallback, transparent)
        );
    }
    &.unlock {
      background: var(
        --wakeb-button-table-icon-unlock-background,
        var(--wakeb-button-fallback, transparent)
      );
      color: var(
        --wakeb-button-table-icon-unlock-color,
        var(--wakeb-button-fallback, #344054)
      );
      border: 1px solid
        var(
          --wakeb-button-table-icon-unlock-border,
          var(--wakeb-button-fallback, transparent)
        );
    }
  }
  &--text {
    border: none;
    background: transparent;
    color: var(
      --wakeb-button-text-color,
      var(--wakeb-button-fallback, #344054)
    );
    text-decoration: none;
    &:hover:not(.btn--disabled):not(.btn--loading) {
      color: var(
        --wakeb-button-text-hover-color,
        var(--wakeb-button-fallback, #344054)
      );
      text-decoration: none;
      background: transparent !important;
    }
    &:focus-visible {
      outline: 1px solid
        var(
          --wakeb-button-text-focus-outline,
          var(--wakeb-button-fallback, #087f8c)
        );
      outline-offset: 2px;
    }
    &.btn--disabled {
      :deep(.v-btn__overlay) {
        opacity: 0;
      }
      background: transparent !important;
      pointer-events: none;
      text-decoration: none;
      :deep(.v-btn__content) {
        color: var(
          --wakeb-button-disabled-text,
          var(--wakeb-button-fallback, #667085)
        ) !important;
      }
    }
    &.btn--loading {
      opacity: 0.8;
      pointer-events: none;
    }
  }

  &--disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  &--loading {
    opacity: 0.8;
  }
}

.btn p.mx-1 {
  margin-inline: 4px;
}
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
</style>

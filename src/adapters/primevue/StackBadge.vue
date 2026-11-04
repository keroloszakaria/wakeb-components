<script setup lang="ts">
/*
 * Internal badge used by the PrimeVue WBadgeStack. It takes WBadge's public props (BadgeProps) and
 * renders the Wakeb badge look with Wakeb CSS only, so the stack works before the PrimeVue WBadge
 * renderer lands. Once it does, the stack imports `./WBadge.vue` instead and this file is removed.
 */
import { computed, inject, type CSSProperties } from "vue";
import WakebIcon from "../../icons/WakebIcon";
import { BADGE_TYPES, useColor, useVariant } from "../../core/vocabulary";
import { WAKEB_CONTEXT, warnOnce } from "../../core/runtime";
import type { BadgeProps, SharedIcon } from "../../types";
const props = withDefaults(defineProps<BadgeProps>(), {
  label: "",
  classList: "",
  type: "primary",
  icon: "",
  isDot: false,
  borderRadius: "md",
  customBorderRadius: "",
  customPadding: "",
  variant: "soft",
  iconSize: "xs",
  iconPosition: "before",
  chipAttrs: () => ({}),
});
defineSlots<{
  icon(props: { icon: SharedIcon; size: string | number }): unknown;
  actions(): unknown;
  default(): unknown;
}>();
const toVariant = useVariant("WBadge");
const variant = computed(() => toVariant(props.variant, "variant", "soft"));
const toColor = useColor("WBadge");
const dot = computed(() => toColor(props.dotColor, "dotColor", "").css);
const context = inject(WAKEB_CONTEXT, null);
/* Only Wakeb badge types are portable; a provider color name falls back to `primary` (SPEC R23). */
const type = computed(() => {
  if ((BADGE_TYPES as readonly string[]).includes(props.type)) return props.type;
  if (process.env.NODE_ENV !== "production")
    warnOnce(context, "WAKEB_UNKNOWN_VALUE", `WBadge.type.${props.type}`, `WBadge type '${props.type}' is not a Wakeb badge type; using 'primary'. Use one of: ${BADGE_TYPES.join(", ")}.`);
  return "primary";
});
const pixelSize = computed(() => (({ xs: 16, sm: 20, md: 24, lg: 32, xl: 40 }) as Record<string, number>)[String(props.iconSize)] ?? props.iconSize);
const badgeStyle = computed<CSSProperties>(() => ({
  ...(props.customBorderRadius ? { borderRadius: props.customBorderRadius } : {}),
  ...(props.customPadding ? { padding: props.customPadding, height: "auto" } : {}),
  ...(dot.value ? { "--wakeb-badge-current-dot": dot.value } : {}),
}));
const dotStyle = computed(() => (dot.value ? { backgroundColor: dot.value } : undefined));
</script>
<template>
  <div>
    <span
      v-bind="chipAttrs"
      class="wakeb-pv-badge"
      :class="[type, `wakeb-badge--${variant}`, classList, `border-radius-${borderRadius}`, { 'badge--custom-padding': customPadding }]"
      :style="badgeStyle"
    >
      <template v-if="iconPosition === 'before'">
        <slot name="icon" :icon="icon" :size="iconSize"><WakebIcon v-if="icon" class="icon" :icon="icon" :size="pixelSize" /></slot>
        <slot name="actions"></slot>
      </template>
      <span v-if="isDot" class="dot" :style="dotStyle"></span>
      <slot
        ><span>{{ label }}</span></slot
      >
      <template v-if="iconPosition === 'after'">
        <slot name="icon" :icon="icon" :size="iconSize"><WakebIcon v-if="icon" class="icon" :icon="icon" :size="pixelSize" /></slot>
        <slot name="actions"></slot>
      </template>
    </span>
  </div>
</template>
<style lang="scss" scoped>
@use "sass:list";
/* type: background, text, dot. Same token chains and fallbacks as the Vuetify WBadge. */
$types: (
  "success": (var(--wakeb-badge-success-bg, var(--wakeb-badge-fallback, #ecfdf3)), var(--wakeb-badge-success-text, var(--wakeb-badge-fallback, #027a48)), var(--wakeb-badge-success-dot, var(--wakeb-badge-fallback, #12b76a))),
  "success-transparent": (rgba(var(--wakeb-badge-success-bg-rgb, var(--wakeb-badge-fallback, 236, 253, 243)), 0.5), var(--wakeb-badge-success-text, var(--wakeb-badge-fallback, #027a48)), var(--wakeb-badge-success-dot, var(--wakeb-badge-fallback, #12b76a))),
  "primary": (var(--wakeb-badge-primary-bg, var(--wakeb-badge-fallback, #eff8ff)), var(--wakeb-badge-primary-text, var(--wakeb-badge-fallback, #175cd3)), var(--wakeb-badge-primary-dot, var(--wakeb-badge-fallback, #2e90fa))),
  "primarybtn": (var(--wakeb-badge-primary-button-bg, var(--wakeb-badge-fallback, #087f8c)), var(--wakeb-badge-dark-bg, var(--wakeb-badge-fallback, #fff)), var(--wakeb-badge-dark-bg, var(--wakeb-badge-fallback, #fff))),
  "danger": (var(--wakeb-badge-danger-bg, var(--wakeb-badge-fallback, #fef3f2)), var(--wakeb-badge-danger-text, var(--wakeb-badge-fallback, #b42318)), var(--wakeb-badge-danger-dot, var(--wakeb-badge-fallback, #f04438))),
  "danger-transparent": (rgba(var(--wakeb-badge-danger-bg-rgb, var(--wakeb-badge-fallback, 254, 243, 242)), 0.3), var(--wakeb-badge-danger-text, var(--wakeb-badge-fallback, #b42318)), var(--wakeb-badge-danger-dot, var(--wakeb-badge-fallback, #f04438))),
  "warning": (var(--wakeb-badge-warning-bg, var(--wakeb-badge-fallback, #fffaeb)), var(--wakeb-badge-warning-text, var(--wakeb-badge-fallback, #b54708)), var(--wakeb-badge-warning-dot, var(--wakeb-badge-fallback, #f79009))),
  "info": (var(--wakeb-badge-info-bg, var(--wakeb-badge-fallback, #f0f9ff)), var(--wakeb-badge-info-text, var(--wakeb-badge-fallback, #026aa2)), var(--wakeb-badge-info-dot, var(--wakeb-badge-fallback, #0ba5ec))),
  "transparent": (var(--wakeb-badge-neutral-bg, var(--wakeb-badge-fallback, #f2f4f7)), var(--wakeb-badge-neutral-text, var(--wakeb-badge-fallback, #667085)), var(--wakeb-badge-neutral-text, var(--wakeb-badge-fallback, #667085))),
  "dark": (var(--wakeb-badge-dark-bg, var(--wakeb-badge-fallback, #fff)), var(--wakeb-badge-dark-text, var(--wakeb-badge-fallback, #667085)), var(--wakeb-badge-dark-text, var(--wakeb-badge-fallback, #667085))),
  "tertiary": (rgba(var(--wakeb-badge-tertiary-bg-rgb, var(--wakeb-badge-fallback, 242, 244, 247)), 1), var(--wakeb-badge-tertiary-text, var(--wakeb-badge-fallback, #667085)), var(--wakeb-badge-tertiary-text, var(--wakeb-badge-fallback, #667085))),
  "outline-secondary": (transparent, var(--wakeb-badge-outline-secondary-text, var(--wakeb-badge-fallback, #667085)), var(--wakeb-badge-outline-secondary-border, var(--wakeb-badge-fallback, #d0d5dd))),
);
.wakeb-pv-badge {
  --wakeb-badge-current-bg: var(--wakeb-badge-neutral-bg, var(--wakeb-badge-fallback, #f2f4f7));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  box-sizing: border-box;
  height: 24px;
  padding: 0 12px;
  border-radius: 24px;
  background-color: var(--wakeb-badge-current-bg);
  color: var(--wakeb-badge-current-text, currentColor);
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
  @each $name, $values in $types {
    &.#{$name} {
      --wakeb-badge-current-bg: #{list.nth($values, 1)};
      --wakeb-badge-current-text: #{list.nth($values, 2)};
      --wakeb-badge-current-dot: #{list.nth($values, 3)};
    }
  }
  &.success-transparent {
    border: 1px solid var(--wakeb-badge-success-bg, var(--wakeb-badge-fallback, #ecfdf3));
  }
  &.danger-transparent {
    border: 1px solid var(--wakeb-badge-danger-bg, var(--wakeb-badge-fallback, #fef3f2));
  }
  &.outline {
    outline: 1px solid var(--wakeb-badge-outline-border, var(--wakeb-badge-fallback, #d0d5dd));
    --wakeb-badge-current-dot: var(--wakeb-badge-success-dot, var(--wakeb-badge-fallback, #12b76a));
  }
  &.outline-secondary {
    border: 1px solid var(--wakeb-badge-outline-secondary-border, var(--wakeb-badge-fallback, #d0d5dd));
  }
  &.check :deep(.icon) {
    color: var(--wakeb-badge-check-color, var(--wakeb-badge-fallback, #667085));
  }
  &.uncheck :deep(.icon) {
    color: var(--wakeb-badge-danger-text, var(--wakeb-badge-fallback, #b42318));
  }
  /* Portable variants (SPEC R23): soft is the tinted default above. */
  &.wakeb-badge--solid {
    background-color: var(--wakeb-badge-solid-bg, var(--wakeb-badge-current-dot, var(--wakeb-ui-primary, #087f8c)));
    color: var(--wakeb-badge-solid-text, var(--wakeb-ui-on-primary, #fff));
    :deep(span) {
      color: inherit;
    }
  }
  &.wakeb-badge--outline {
    background-color: transparent;
    border: 1px solid currentColor;
  }
  &.wakeb-badge--ghost {
    background-color: transparent;
  }
  &.border-radius-sm {
    border-radius: 8px;
  }
  &.badge--custom-padding {
    gap: 4px;
  }
  :deep(span) {
    color: var(--wakeb-badge-current-text);
  }
  .dot {
    width: 6px;
    height: 6px;
    background-color: var(--wakeb-badge-current-dot) !important;
    border-radius: 50%;
  }
}
</style>

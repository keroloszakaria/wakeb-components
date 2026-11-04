<script setup lang="ts">
import { computed, mergeProps, useAttrs } from "vue";
import Button from "primevue/button";
import WakebIcon from "../../icons/WakebIcon";
import { useWakebContext } from "../../core/runtime";
import { tooltipBtnDefaults, useTooltipBtn } from "../../composables/tooltip-btn";
import { usePrimeTooltip, vPvTooltip, vTooltipFocus } from "./tooltip";
import type { TooltipBtnProps, SharedIcon } from "../../types";
defineOptions({ name: "WTooltipBtn", inheritAttrs: false });
const props = withDefaults(defineProps<TooltipBtnProps>(), tooltipBtnDefaults);
defineSlots<{ icon?(props: { icon: SharedIcon | undefined }): unknown }>();
const attrs = useAttrs();
const { variant, accessibleName } = useTooltipBtn(props);
const context = useWakebContext("WTooltipBtn");
const tooltip = usePrimeTooltip(context, () => ({
  text: props.text,
  location: props.location,
  showDelay: props.openDelay,
  contentClass: props.contentClass,
  contentStyle: props.tooltipStyle,
}));
/*
 * Same precedence as the Vuetify renderer: the Wakeb name and tooltip description first, then caller
 * attrs (type, disabled, form, aria-label, listeners), which reach the native button once.
 */
const owned = computed(() => ({
  "aria-label": accessibleName.value,
  ...(tooltip.describedBy.value ? { "aria-describedby": tooltip.describedBy.value } : {}),
}));
</script>
<template>
  <span class="v-app-tooltip-btn wakeb-tooltip-btn" v-bind="wrapperAttrs">
    <!-- Unstyled PrimeVue Button: Wakeb CSS paints the portable variants (SPEC R23). -->
    <Button
      v-pv-tooltip:[tooltip.arg.value]="tooltip.value.value"
      v-tooltip-focus
      unstyled
      v-bind="mergeProps(owned, attrs)"
      :class="['wakeb-tooltip-btn__button', `wakeb-tooltip-btn--${variant}`, { 'wakeb-tooltip-btn--icon': btnIcon }]"
    >
      <slot name="icon" :icon="icon"><WakebIcon v-if="icon" :icon="icon" :size="24" /></slot>
    </Button>
  </span>
</template>
<style scoped>
.wakeb-tooltip-btn {
  display: inline-block;
}
/* Native button reset and the VBtn box model, so both providers keep the same footprint. */
.wakeb-tooltip-btn__button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  height: 36px;
  padding: 0 16px;
  border: 0 solid currentColor;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  overflow: hidden;
  vertical-align: middle;
  appearance: none;
  transition: background-color 0.2s ease;
}
.wakeb-tooltip-btn__button::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: currentColor;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.wakeb-tooltip-btn__button:hover::before {
  opacity: 0.04;
}
.wakeb-tooltip-btn__button:focus-visible {
  outline: 2px solid var(--wakeb-ui-focus, var(--p-primary-color, #087f8c));
  outline-offset: 2px;
}
.wakeb-tooltip-btn__button:focus-visible::before {
  opacity: 0.12;
}
.wakeb-tooltip-btn__button:disabled {
  cursor: default;
  opacity: 0.38;
  pointer-events: none;
}
.wakeb-tooltip-btn--icon {
  min-width: 0;
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 50%;
}
.wakeb-tooltip-btn--soft::before {
  opacity: 0.12;
}
.wakeb-tooltip-btn--solid {
  background: var(--wakeb-ui-primary, var(--p-primary-color, #087f8c));
  color: var(--wakeb-ui-on-primary, #fff);
}
.wakeb-tooltip-btn--outline {
  border-width: 1px;
}
@media (prefers-reduced-motion: reduce) {
  .wakeb-tooltip-btn__button,
  .wakeb-tooltip-btn__button::before {
    transition: none;
  }
}
</style>

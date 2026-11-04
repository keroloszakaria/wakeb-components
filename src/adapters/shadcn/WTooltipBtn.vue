<script setup lang="ts">
import { computed, mergeProps, useAttrs } from "vue";
import { TooltipProvider, TooltipRoot, TooltipTrigger } from "reka-ui";
import Button from "./ui/Button.vue";
import TooltipContent from "./ui/TooltipContent.vue";
import WakebIcon from "../../icons/WakebIcon";
import { useWakebContext } from "../../core/runtime";
import { tooltipBtnDefaults, useTooltipBtn } from "../../composables/tooltip-btn";
import { overlayBindings, physicalSide, useHoverTooltip } from "./tooltip";
import type { TooltipBtnProps, SharedIcon } from "../../types";
defineOptions({ name: "WTooltipBtn", inheritAttrs: false });
const props = withDefaults(defineProps<TooltipBtnProps>(), tooltipBtnDefaults);
defineSlots<{ icon?(props: { icon: SharedIcon | undefined }): unknown }>();
const attrs = useAttrs();
const { variant, accessibleName } = useTooltipBtn(props);
const context = useWakebContext("WTooltipBtn");
const delay = computed(() => Math.max(Number(props.openDelay) || 0, 0));
const { open, hover } = useHoverTooltip(() => Boolean(props.text), () => delay.value);
const side = computed(() => physicalSide(context, props.location));
/*
 * Same precedence as the other renderers: a native type=button and the Wakeb name first, then caller
 * attrs (type, disabled, form, aria-label, listeners), which reach the native button once. reka-ui's
 * trigger adds aria-describedby while the tooltip is open; a caller value wins.
 */
const owned = computed(() => mergeProps({ type: "button", "aria-label": accessibleName.value }, hover));
</script>
<template>
  <span class="v-app-tooltip-btn wakeb-tooltip-btn" v-bind="wrapperAttrs">
    <TooltipProvider :delay-duration="delay">
      <TooltipRoot v-model:open="open" :disabled="!text">
        <TooltipTrigger as-child>
          <!-- shadcn-vue Button without a native variant: Wakeb CSS paints the portable variants (SPEC R23). -->
          <Button
            v-bind="mergeProps(owned, attrs)"
            :class="['wakeb-tooltip-btn__button', `wakeb-tooltip-btn--${variant}`, { 'wakeb-tooltip-btn--icon': btnIcon }]"
          >
            <slot name="icon" :icon="icon"><WakebIcon v-if="icon" :icon="icon" :size="24" /></slot>
          </Button>
        </TooltipTrigger>
        <TooltipContent v-if="text" :side="side" v-bind="overlayBindings(context)" :class="contentClass">
          <span class="wakeb-sc-tooltip-text" :style="tooltipStyle">{{ text }}</span>
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  </span>
</template>
<style scoped>
.wakeb-tooltip-btn {
  display: inline-block;
}
/* Native button reset and the VBtn box model, so every provider keeps the same footprint. */
.wakeb-tooltip-btn__button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;
  height: 36px;
  margin: 0;
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
  outline: 2px solid var(--wakeb-ui-focus, var(--ring, #087f8c));
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
  background: var(--wakeb-ui-primary, var(--primary, #087f8c));
  color: var(--wakeb-ui-on-primary, var(--primary-foreground, #fff));
}
.wakeb-tooltip-btn--outline {
  border-width: 1px;
}
.wakeb-sc-tooltip-text {
  overflow-wrap: anywhere;
}
@media (prefers-reduced-motion: reduce) {
  .wakeb-tooltip-btn__button,
  .wakeb-tooltip-btn__button::before {
    transition: none;
  }
}
</style>

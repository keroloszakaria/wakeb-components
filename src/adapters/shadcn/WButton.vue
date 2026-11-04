<script setup lang="ts">
import { computed, mergeProps } from "vue";
import { TooltipProvider, TooltipRoot, TooltipTrigger } from "reka-ui";
import Button from "./ui/Button.vue";
import TooltipContent from "./ui/TooltipContent.vue";
import Passthrough from "./ui/Passthrough";
import WakebIcon from "../../icons/WakebIcon";
import { buttonDefaults, useButton } from "../../composables/button";
import { useWakebContext } from "../../core/runtime";
import { useProviderProps } from "../../core/provider-props";
import type { ButtonProps, IconSlotProps } from "../../types";
defineOptions({ name: "WButton", inheritAttrs: false });
const props = withDefaults(defineProps<ButtonProps>(), buttonDefaults);
const emit = defineEmits<{ click: [event: MouseEvent] }>();
defineSlots<{
  icon(props: IconSlotProps): unknown;
  dropdown(props: IconSlotProps): unknown;
  content(): unknown;
  default(): unknown;
}>();
const context = useWakebContext("WButton");
const { classes, iconColor, iconProps, pixelSize, iconStyle, onClick, actualAttrs } = useButton(props, emit);
/*
 * The primitive is Wakeb's copy of the shadcn-vue Button. Its element type, loading/disabled safety,
 * the portable click and the accessible name stay Wakeb-owned; only shadcn-vue's `variant` and `size`
 * pass, and they are nonportable looks layered over the Wakeb type CSS.
 */
const native = useProviderProps(context, () => props.providerProps, {
  component: "WButton",
  primitive: Button,
  label: "Button",
  owned: ["as", "asChild", "disabled", "type", "onClick"],
});
/* reka-ui sides are physical; Wakeb locations are logical. */
const tooltipSide = computed(() => {
  const rtl = context.direction === "rtl";
  return ({ top: "top", bottom: "bottom", start: rtl ? "right" : "left", end: rtl ? "left" : "right" } as const)[props.location];
});
/* The tooltip is teleported, so it takes the theme scope and the configured overlay stacking. */
const tooltipBindings = computed(() =>
  mergeProps(context.scope, context.zIndexOverlay === undefined ? {} : { style: { zIndex: context.zIndexOverlay } }),
);
</script>
<template>
  <div v-bind="wrapperAttrs">
    <!-- Plain buttons render no tooltip parts; tooltip buttons use reka-ui's Tooltip, which opens on focus and hover. -->
    <component :is="isTooltip ? TooltipProvider : Passthrough">
      <component :is="isTooltip ? TooltipRoot : Passthrough">
        <component :is="isTooltip ? TooltipTrigger : Passthrough" v-bind="isTooltip ? { asChild: true } : {}">
          <!-- Wakeb token CSS owns the look so every WButton type matches across providers (SPEC R23). -->
          <Button
            v-bind="actualAttrs({}, native)"
            :class="[classes, 'wakeb-sc-wbutton']"
            :disabled="disabled"
            :type="action"
            @click="onClick"
          >
            <span class="wakeb-sc-wbutton__content">
              <template v-if="title !== '' && !isTooltip">
                <slot v-if="icon && iconPosition === 'start'" name="icon" v-bind="iconProps"
                  ><WakebIcon :icon="icon" :size="pixelSize" :color="iconColor" :style="iconStyle"
                /></slot>
                <p class="mx-1">{{ title }}</p>
                <slot v-if="icon && iconPosition === 'end'" name="icon" v-bind="iconProps"
                  ><WakebIcon :icon="icon" :size="pixelSize" :color="iconColor" :style="iconStyle"
                /></slot>
              </template>
              <template v-else>
                <slot name="icon" v-bind="iconProps"
                  ><WakebIcon v-if="icon" :icon="icon" :size="pixelSize" :color="iconColor" :style="iconStyle"
                /></slot>
                <slot v-if="!isTooltip" name="content"><slot /></slot>
              </template>
              <slot v-if="isDropdown && !isTooltip" name="dropdown" v-bind="{ ...iconProps, icon: '$expand' }"
                ><WakebIcon icon="$expand" :size="pixelSize" :color="iconColor"
              /></slot>
            </span>
            <span v-if="isLoading" class="wakeb-sc-wbutton__spinner" aria-hidden="true" />
          </Button>
        </component>
        <TooltipContent v-if="isTooltip" :side="tooltipSide" v-bind="tooltipBindings">{{ title }}</TooltipContent>
      </component>
    </component>
  </div>
</template>
<style lang="scss" scoped>
@use "../../styles/button";

/* Native button reset that VBtn provides in the Vuetify renderer. */
.wakeb-sc-wbutton {
  position: relative;
  margin: 0;
  font: inherit;
  cursor: pointer;
  user-select: none;
  appearance: none;
  &.btn--loading .wakeb-sc-wbutton__content {
    visibility: hidden;
  }
}
.wakeb-sc-wbutton__content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: inherit;
  p {
    margin: 0 4px;
  }
}
.wakeb-sc-wbutton__spinner {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 1.25em;
  height: 1.25em;
  border: 2px solid currentColor;
  border-inline-end-color: transparent;
  border-radius: 50%;
  animation: wakeb-sc-wbutton-spin 0.8s linear infinite;
}
@keyframes wakeb-sc-wbutton-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .wakeb-sc-wbutton__spinner {
    animation-duration: 2.4s;
  }
}
</style>

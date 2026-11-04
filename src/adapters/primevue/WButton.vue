<script setup lang="ts">
import { computed } from "vue";
import Button from "primevue/button";
import Tooltip from "primevue/tooltip";
import WakebIcon from "../../icons/WakebIcon";
import { buttonDefaults, useButton } from "../../composables/button";
import { useWakebContext } from "../../core/runtime";
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
/* Local name avoids the global Vuetify v-tooltip directive typing. */
const vPvTooltip = Tooltip;
const context = useWakebContext("WButton");
const { classes, iconColor, iconProps, pixelSize, iconStyle, onClick, actualAttrs } = useButton(props, emit);
/* PrimeVue tooltip sides are physical; Wakeb sides are logical. */
/* PrimeVue reads the side from an object argument: v-tooltip:[{ position }]. */
const tooltipSide = computed(() => {
  const rtl = context.direction === "rtl";
  const position = { top: "top", bottom: "bottom", start: rtl ? "right" : "left", end: rtl ? "left" : "right" }[props.location];
  return { position } as unknown as string;
});
</script>
<template>
  <div v-bind="wrapperAttrs">
    <!-- Unstyled: Wakeb token CSS owns the look so every WButton type matches across providers (SPEC R23). -->
    <Button
      v-pv-tooltip:[tooltipSide]="isTooltip ? title : undefined"
      unstyled
      v-bind="actualAttrs()"
      :class="[classes, 'wakeb-pv-button']"
      :disabled="disabled"
      :type="action"
      @click="onClick"
    >
      <span class="wakeb-pv-button__content">
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
      <span v-if="isLoading" class="wakeb-pv-button__spinner" aria-hidden="true" />
    </Button>
  </div>
</template>
<style lang="scss" scoped>
@use "../../styles/button";

/* Native button reset that VBtn provides in the Vuetify renderer. */
.wakeb-pv-button {
  position: relative;
  font: inherit;
  cursor: pointer;
  user-select: none;
  appearance: none;
  &.btn--loading .wakeb-pv-button__content {
    visibility: hidden;
  }
}
.wakeb-pv-button__content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: inherit;
}
.wakeb-pv-button__spinner {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 1.25em;
  height: 1.25em;
  border: 2px solid currentColor;
  border-inline-end-color: transparent;
  border-radius: 50%;
  animation: wakeb-pv-spin 0.8s linear infinite;
}
@keyframes wakeb-pv-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .wakeb-pv-button__spinner {
    animation-duration: 2.4s;
  }
}
</style>

<script setup lang="ts">
import { computed, mergeProps, useAttrs } from "vue";
import { TooltipProvider, TooltipRoot, TooltipTrigger } from "reka-ui";
import TooltipContent from "./ui/TooltipContent.vue";
import { useWakebContext } from "../../core/runtime";
import { truncatedTextDefaults, useTruncatedText } from "../../composables/truncated-text";
import { overlayBindings, physicalSide, useHoverTooltip } from "./tooltip";
import type { TruncatedTextProps } from "../../types";
defineOptions({ name: "WTruncatedText", inheritAttrs: false });
const props = withDefaults(defineProps<TruncatedTextProps>(), truncatedTextDefaults);
defineSlots<{ default?(props: { text: string; label: string; truncated: boolean }): unknown }>();
const attrs = useAttrs();
const context = useWakebContext("WTruncatedText");
const { displayLabel, isTruncated } = useTruncatedText(props);
/* reka-ui Tooltip opens on keyboard focus and hover, only for truncated text (SPEC R18). */
const { open, hover } = useHoverTooltip(() => isTruncated.value);
const side = computed(() => physicalSide(context, props.tooltipLocation));
const maxWidth = computed(() => {
  const value = props.tooltipMaxWidth;
  if (value === undefined || value === "") return undefined;
  return typeof value === "number" || /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
});
/* The teleported tooltip root takes the theme scope, the stacking and the max width; tooltipStyle styles the text inside. */
const contentBindings = computed(() => overlayBindings(context, maxWidth.value ? { style: { maxWidth: maxWidth.value } } : {}));
</script>
<template>
  <TooltipProvider :delay-duration="0">
    <TooltipRoot v-model:open="open" :disabled="!isTruncated">
      <!-- TooltipTrigger adds aria-describedby while open; a caller aria-describedby on the span wins, as on Vuetify. -->
      <TooltipTrigger as-child>
        <span
          v-bind="mergeProps(hover, attrs)"
          class="truncated-text wakeb-sc-truncated-text"
          :tabindex="isTruncated ? 0 : undefined"
          :aria-label="isTruncated ? label : undefined"
        >
          <slot :text="displayLabel" :label="label" :truncated="isTruncated">{{ displayLabel }}</slot>
        </span>
      </TooltipTrigger>
      <TooltipContent v-if="isTruncated" :side="side" v-bind="contentBindings" :class="contentClass">
        <span class="wakeb-sc-tooltip-text" :style="tooltipStyle">{{ label }}</span>
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
</template>
<style scoped>
.wakeb-sc-truncated-text {
  outline: none;
}
.wakeb-sc-truncated-text:focus-visible {
  outline: 2px solid var(--wakeb-text-focus-color, var(--wakeb-ui-focus, var(--ring, #087f5b)));
  outline-offset: 2px;
}
.wakeb-sc-tooltip-text {
  overflow-wrap: anywhere;
}
</style>

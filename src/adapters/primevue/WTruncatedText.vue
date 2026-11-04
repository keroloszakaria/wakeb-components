<script setup lang="ts">
import { computed, mergeProps, useAttrs } from "vue";
import { useWakebContext } from "../../core/runtime";
import { truncatedTextDefaults, useTruncatedText } from "../../composables/truncated-text";
import { usePrimeTooltip, vPvTooltip, vTooltipFocus } from "./tooltip";
import type { TruncatedTextProps } from "../../types";
defineOptions({ name: "WTruncatedText", inheritAttrs: false });
const props = withDefaults(defineProps<TruncatedTextProps>(), truncatedTextDefaults);
defineSlots<{ default?(props: { text: string; label: string; truncated: boolean }): unknown }>();
const attrs = useAttrs();
const context = useWakebContext("WTruncatedText");
const { displayLabel, isTruncated } = useTruncatedText(props);
/* The PrimeVue tooltip opens on hover and keyboard focus, only for truncated text (SPEC R18). */
const tooltip = usePrimeTooltip(context, () => ({
  text: isTruncated.value ? props.label : undefined,
  location: props.tooltipLocation,
  contentClass: props.contentClass,
  maxWidth: props.tooltipMaxWidth,
  contentStyle: props.tooltipStyle,
}));
/* As on Vuetify: tabindex and aria-label are Wakeb-owned; a caller aria-describedby wins over the tooltip id. */
const describedBy = computed(() => (tooltip.describedBy.value ? { "aria-describedby": tooltip.describedBy.value } : {}));
</script>
<template>
  <span
    v-pv-tooltip:[tooltip.arg.value]="tooltip.value.value"
    v-tooltip-focus
    v-bind="mergeProps(describedBy, attrs)"
    class="truncated-text"
    :tabindex="isTruncated ? 0 : undefined"
    :aria-label="isTruncated ? label : undefined"
  >
    <slot :text="displayLabel" :label="label" :truncated="isTruncated">{{ displayLabel }}</slot>
  </span>
</template>
<style scoped>
.truncated-text { outline: none; }
.truncated-text:focus-visible { outline: 2px solid var(--wakeb-text-focus-color, var(--wakeb-ui-focus, var(--p-primary-color, #087f5b))); outline-offset: 2px; }
</style>

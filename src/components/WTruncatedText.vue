<template>
  <VTooltip :disabled="!isTruncated" :location="tooltipLocation" :text="label"
    :max-width="tooltipMaxWidth" :content-class="contentClass" :content-props="{ style: tooltipStyle }">
    <template #activator="{ props: tooltipProps }">
      <span v-bind="mergeProps(tooltipProps, attrs)" class="truncated-text"
        :tabindex="isTruncated ? 0 : undefined" :aria-label="isTruncated ? label : undefined">
        <slot :text="displayLabel" :label="label" :truncated="isTruncated">{{ displayLabel }}</slot>
      </span>
    </template>
  </VTooltip>
</template>
<script setup lang="ts">
import { computed, mergeProps, useAttrs } from "vue";
import { VTooltip } from "vuetify/components/VTooltip";
import { truncateText } from "wakeb-utils";
import type { TruncatedTextProps } from "../types";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<TruncatedTextProps>(), {
  label: "", length: 12, tooltipLocation: "top", tooltipMaxWidth: 280, contentClass: "wakeb-truncated-tooltip",
});
defineSlots<{ default?(props: { text: string; label: string; truncated: boolean }): unknown }>();
const attrs = useAttrs();
const displayLabel = computed(() => truncateText(props.label || "", props.length));
const isTruncated = computed(() => (props.label || "").length > props.length);
</script>
<style scoped>
.truncated-text { outline: none; }
.truncated-text:focus-visible { outline: 2px solid var(--wakeb-text-focus-color, rgb(var(--v-theme-primary, 8, 127, 91))); outline-offset: 2px; }
</style>

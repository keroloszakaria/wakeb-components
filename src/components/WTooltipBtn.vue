<script setup lang="ts">
import { useAttrs } from "vue";
import { VBtn } from "vuetify/components/VBtn";
import { VIcon } from "vuetify/components/VIcon";
import { VTooltip } from "vuetify/components/VTooltip";
import type { TooltipBtnProps, SharedIcon } from "../types";
defineOptions({ inheritAttrs: false });
withDefaults(defineProps<TooltipBtnProps>(), {
  text: "",
  btnIcon: false,
  variant: "text",
  location: "bottom",
  openDelay: 200,
  contentClass: "v-app-tooltip-btn__content",
});
defineSlots<{ icon?(props: { icon: SharedIcon | undefined }): unknown }>();
const attrs = useAttrs();
</script>
<template>
  <span class="v-app-tooltip-btn d-inline-block" v-bind="wrapperAttrs">
    <VBtn
      :aria-label="ariaLabel === undefined ? text || undefined : ariaLabel"
      :variant="variant"
      v-bind="attrs"
      :icon="!!btnIcon"
    >
      <slot name="icon" :icon="icon"><VIcon :icon="icon" /></slot>
      <VTooltip
        v-if="text"
        activator="parent"
        :class="contentClass"
        :location="location"
        :open-delay="openDelay"
        :content-props="{ style: tooltipStyle }"
        >{{ text }}</VTooltip
      >
    </VBtn>
  </span>
</template>

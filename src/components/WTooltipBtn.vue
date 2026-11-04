<script setup lang="ts">
import { useAttrs } from "vue";
import { VBtn } from "vuetify/components/VBtn";
import { VIcon } from "vuetify/components/VIcon";
import { useVuetifyIcon } from "../core/icons";
import { VTooltip } from "vuetify/components/VTooltip";
import type { TooltipBtnProps, SharedIcon } from "../types";
import { VUETIFY_VARIANTS } from "../core/vocabulary";
import { useWakebContext } from "../core/runtime";
import { tooltipBtnDefaults, useTooltipBtn } from "../composables/tooltip-btn";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<TooltipBtnProps>(), tooltipBtnDefaults);
defineSlots<{ icon?(props: { icon: SharedIcon | undefined }): unknown }>();
const attrs = useAttrs();
const { variant, accessibleName } = useTooltipBtn(props);
const context = useWakebContext("WTooltipBtn");
const toIcon = useVuetifyIcon();
</script>
<template>
  <span class="v-app-tooltip-btn wakeb-tooltip-btn d-inline-block" v-bind="wrapperAttrs">
    <VBtn
      :aria-label="accessibleName"
      :variant="VUETIFY_VARIANTS[variant]"
      v-bind="attrs"
      :icon="!!btnIcon"
    >
      <slot name="icon" :icon="icon"><VIcon :icon="toIcon(icon)" /></slot>
      <VTooltip
        v-if="text"
        activator="parent"
        v-bind="context.scope" :z-index="context.zIndexOverlay"
        :class="contentClass"
        :location="location"
        :open-delay="openDelay"
        :content-props="{ style: tooltipStyle }"
        >{{ text }}</VTooltip
      >
    </VBtn>
  </span>
</template>

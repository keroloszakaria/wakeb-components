<script setup lang="ts">
import { VBtn } from "vuetify/components/VBtn";
import { VTooltip } from "vuetify/components/VTooltip";
import { VIcon } from "vuetify/components/VIcon";
import { useVuetifyIcon } from "../core/icons";
import { buttonDefaults, useButton } from "../composables/button";
import { useWakebContext } from "../core/runtime";
import type { ButtonProps, IconSlotProps } from "../types";
defineOptions({ inheritAttrs: false });
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
const toIcon = useVuetifyIcon();
</script>
<template>
  <div v-bind="wrapperAttrs">
    <VTooltip v-if="isTooltip" v-bind="context.scope" :z-index="context.zIndexOverlay" :location="location" :text="title">
      <template #activator="{ props: tooltipProps }">
        <VBtn
          v-bind="actualAttrs(tooltipProps)"
          :class="classes"
          :disabled="disabled"
          :loading="isLoading"
          :type="action"
          @click="onClick"
        >
          <slot name="icon" v-bind="iconProps"
            ><VIcon
              v-if="icon"
              :icon="toIcon(icon)"
              :size="pixelSize"
              :color="iconColor"
              :style="iconStyle"
          /></slot>
        </VBtn>
      </template>
    </VTooltip>
    <VBtn
      v-else
      :key="title !== '' ? 'text' : 'icon'"
      :class="classes"
      :disabled="disabled"
      :loading="isLoading"
      :type="action"
      v-bind="actualAttrs()"
      @click="onClick"
    >
      <template v-if="title !== ''">
        <slot
          v-if="icon && iconPosition === 'start'"
          name="icon"
          v-bind="iconProps"
          ><VIcon
            :icon="toIcon(icon)"
            :size="pixelSize"
            :color="iconColor"
            :style="iconStyle"
        /></slot>
        <p class="mx-1">{{ title }}</p>
        <slot
          v-if="icon && iconPosition === 'end'"
          name="icon"
          v-bind="iconProps"
          ><VIcon
            :icon="toIcon(icon)"
            :size="pixelSize"
            :color="iconColor"
            :style="iconStyle"
        /></slot>
      </template>
      <template v-else>
        <slot name="icon" v-bind="iconProps"
          ><VIcon
            v-if="icon"
            :icon="toIcon(icon)"
            :size="pixelSize"
            :color="iconColor"
            :style="iconStyle"
        /></slot>
        <slot name="content"><slot /></slot>
      </template>
      <slot
        v-if="isDropdown"
        name="dropdown"
        v-bind="{ ...iconProps, icon: '$expand' }"
        ><VIcon :icon="toIcon('$expand')" :size="pixelSize" :color="iconColor"
      /></slot>
    </VBtn>
  </div>
</template>
<style lang="scss" scoped>
@use "../styles/button";
</style>

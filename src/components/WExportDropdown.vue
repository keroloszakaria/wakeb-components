<script setup lang="ts">
import { VMenu } from "vuetify/components/VMenu";
import { VList, VListItem, VListItemTitle } from "vuetify/components/VList";
import { VIcon } from "vuetify/components/VIcon";
import { useVuetifyIcon } from "../core/icons";
import WButton from "./WButton.vue";
import { useWakebContext } from "../core/runtime";
import { exportDropdownDefaults, useExportDropdown, EXPORT_ICON_PATH, FORMAT_ICON_PATH } from "../composables/export-dropdown";
import type { ExportDropdownProps, ExportFormat, ButtonProps } from "../types";
const props = withDefaults(defineProps<ExportDropdownProps>(), exportDropdownDefaults);
const emit = defineEmits<{ select: [value: string] }>();
const context = useWakebContext("WExportDropdown");
defineSlots<{
  activator?(props: {
    props: Record<string, unknown>;
    buttonProps: ButtonProps;
  }): unknown;
  "format-icon"?(props: { format: ExportFormat; index: number }): unknown;
  "format-label"?(props: { format: ExportFormat; index: number }): unknown;
}>();
const { buttonProps, select } = useExportDropdown(props, emit);
const toIcon = useVuetifyIcon();
</script>
<template>
  <!-- The root VMenu already receives the theme scope as attrs; only its stacking is set here. -->
  <VMenu :disabled="disabled || isLoading" :z-index="context.zIndexOverlay">
    <template #activator="{ props: activatorProps }"
      ><slot
        name="activator"
        :props="activatorProps"
        :button-props="buttonProps()"
        ><WButton
          v-bind="{ ...activatorProps, ...buttonProps() }"
          :aria-label="title"
          :style="{ height: 'var(--wakeb-export-button-height, 44px)' }"
          ><template #icon
            ><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                :d="EXPORT_ICON_PATH"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              /></svg></template></WButton></slot
    ></template>
    <VList :style="menuStyle" role="menu">
      <VListItem
        v-for="(format, index) in formats"
        :key="format.value"
        role="menuitem"
        :disabled="isLoading || format.disabled"
        :aria-disabled="isLoading || format.disabled || undefined"
        @click="select(format)"
      >
        <template #prepend
          ><slot name="format-icon" :format="format" :index="index"
            ><VIcon v-if="format.icon" :icon="toIcon(format.icon)" :size="16" /><svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                :d="FORMAT_ICON_PATH"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              /></svg></slot
        ></template>
        <VListItemTitle class="wakeb-export-label ms-2 !text-sm"
          ><slot name="format-label" :format="format" :index="index">{{
            format.label
          }}</slot></VListItemTitle
        >
      </VListItem>
    </VList>
  </VMenu>
</template>
<style scoped>
.wakeb-export-label {
  margin-inline-start: 8px;
  font-size: 14px !important;
}
</style>

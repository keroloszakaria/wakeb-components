<script setup lang="ts">
import { VMenu } from "vuetify/components/VMenu";
import { VList, VListItem, VListItemTitle } from "vuetify/components/VList";
import { VIcon } from "vuetify/components/VIcon";
import WButton from "./WButton.vue";
import type { ExportDropdownProps, ExportFormat, ButtonProps } from "../types";
const props = withDefaults(defineProps<ExportDropdownProps>(), {
  isLoading: false,
  disabled: false,
  title: "Download",
  formats: () => [
    { label: "Export as PDF", value: "pdf" },
    { label: "Export as Excel", value: "xlsx" },
  ],
});
const emit = defineEmits<{ select: [value: string] }>();
defineSlots<{
  activator?(props: {
    props: Record<string, unknown>;
    buttonProps: ButtonProps;
  }): unknown;
  "format-icon"?(props: { format: ExportFormat; index: number }): unknown;
  "format-label"?(props: { format: ExportFormat; index: number }): unknown;
}>();
const buttonProps = (): ButtonProps => ({
  type: "outline",
  icon: "$file",
  iconPosition: "start",
  title: props.title,
  isLoading: props.isLoading,
  disabled: props.disabled || props.isLoading,
  iconSize: 20,
});
function select(format: ExportFormat) {
  if (props.disabled || props.isLoading || format.disabled) return;
  emit("select", format.value);
}
</script>
<template>
  <VMenu :disabled="disabled || isLoading">
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
                d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              /></svg></template></WButton></slot
    ></template>
    <VList :style="menuStyle">
      <VListItem
        v-for="(format, index) in formats"
        :key="format.value"
        :disabled="isLoading || format.disabled"
        @click="select(format)"
      >
        <template #prepend
          ><slot name="format-icon" :format="format" :index="index"
            ><VIcon v-if="format.icon" :icon="format.icon" :size="16" /><svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M5 2h9l5 5v15H5zM14 2v6h5M8 13h8m-8 4h8"
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

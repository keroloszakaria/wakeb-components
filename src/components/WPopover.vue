<script setup lang="ts">
import { computed, mergeProps, ref } from "vue";
import { VMenu } from "vuetify/components/VMenu";
import { popoverDefaults, usePopover } from "../composables/popover";
import { useWakebContext } from "../core/runtime";
import type { PopoverProps } from "../types";
defineOptions({ name: "WPopover" });
const props = withDefaults(defineProps<PopoverProps>(), popoverDefaults);
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
defineSlots<{
  activator?(props: { props: Record<string, unknown>; isActive: boolean }): unknown;
  default?(props: { close: () => void }): unknown;
}>();
const context = useWakebContext("WPopover");
const { isActive, id, close, activatorAria } = usePopover(props, emit);
const panel = ref<HTMLElement>();
/* VMenu reports `aria-haspopup="menu"`; a popover is a non-modal dialog. */
const withAria = (activatorProps: Record<string, unknown>) => mergeProps(activatorProps, activatorAria.value);
const menuBindings = computed(() => mergeProps(context.scope, context.zIndexOverlay === undefined ? {} : { zIndex: context.zIndexOverlay }));
/*
 * Focus moves into the panel once it is shown unless content already took it (SPEC R18). VMenu keeps
 * the panel hidden while it measures, so this waits for the enter transition to end.
 */
const focusPanel = () => {
  if (panel.value && !panel.value.contains(document.activeElement)) panel.value.focus({ preventScroll: true });
};
</script>
<template>
  <VMenu
    v-model="isActive"
    v-bind="menuBindings"
    :location="location"
    :offset="offset"
    :disabled="disabled"
    :close-on-content-click="closeOnContentClick"
    @after-enter="focusPanel"
  >
    <template #activator="{ props: activatorProps }">
      <slot name="activator" :props="withAria(activatorProps)" :is-active="isActive" />
    </template>
    <div
      :id="id"
      ref="panel"
      role="dialog"
      aria-modal="false"
      :aria-label="ariaLabel"
      tabindex="-1"
      class="wakeb-popover"
      :class="contentClass"
      :style="contentStyle"
    >
      <slot :close="close" />
    </div>
  </VMenu>
</template>
<style lang="scss">
@use "../styles/popover";
</style>

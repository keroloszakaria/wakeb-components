<script setup lang="ts">
import WButton from "./WButton.vue";
import type { AccordionProps, IconSlotProps } from "../../types";
import { accordionDefaults, useAccordion } from "../../composables/disclosure";
/*
 * A plain Wakeb disclosure with the shadcn-vue WButton as indicator. reka-ui Collapsible unmounts a closed
 * panel (losing nested state) unless force-mounted, and the shadcn-vue Accordion adds an item model and
 * heading semantics to a single section, so neither keeps the contract as is.
 */
defineOptions({ name: "WAccordion" });
const props = withDefaults(defineProps<AccordionProps>(), accordionDefaults);
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
const { open: isOpen, toggle, panelId, triggerProps, panelProps, iconCss } = useAccordion(props, emit);
defineSlots<{
  header(props: {
    open: boolean;
    toggle: () => void;
    triggerProps: typeof triggerProps.value;
  }): unknown;
  actions(props: { open: boolean; toggle: () => void }): unknown;
  default(props: { open: boolean }): unknown;
  toggleIcon(props: IconSlotProps): unknown;
}>();
</script>
<template>
  <div
    class="accordion"
    :class="[
      classList,
      {
        'accordion--no-border': noBorder,
        'accordion--transparent': transparent,
      },
    ]"
  >
    <div
      class="accordion__header"
      :class="[{ 'accordion__header--active': isOpen }, headerClassList]"
      @click="toggle"
    >
      <div class="accordion__header-content">
        <WButton
          v-if="beforeIcon"
          :icon="icon"
          type="icon"
          :icon-size="iconSize"
          :custom-icon-color="iconCss"
          :class-list="[
            'accordion__toggle',
            { 'accordion__toggle--open': isOpen },
          ]"
          :max-icon-width="maxIconWidth"
          :aria-label="toggleLabel || title || 'Toggle section'"
          :aria-expanded="isOpen"
          :aria-controls="panelId"
          @click.stop="toggle"
        >
          <template v-if="$slots.toggleIcon" #icon="slotProps"
            ><slot name="toggleIcon" v-bind="slotProps"
          /></template>
        </WButton>
        <slot
          name="header"
          :open="isOpen"
          :toggle="toggle"
          :trigger-props="triggerProps"
          ><button
            v-bind="triggerProps"
            class="accordion__title accordion__title-trigger"
            :class="headerTitleClassList"
          >
            {{ title }}
          </button></slot
        >
        <WButton
          v-if="afterIcon"
          :icon="icon"
          type="icon"
          :icon-size="iconSize"
          :custom-icon-color="iconCss"
          :class-list="[
            'accordion__toggle',
            { 'accordion__toggle--open': isOpen },
          ]"
          :max-icon-width="maxIconWidth"
          :aria-label="toggleLabel || title || 'Toggle section'"
          :aria-expanded="isOpen"
          :aria-controls="panelId"
          @click.stop="toggle"
        >
          <template v-if="$slots.toggleIcon" #icon="slotProps"
            ><slot name="toggleIcon" v-bind="slotProps"
          /></template>
        </WButton>
      </div>
      <div class="accordion__actions" @click.stop>
        <slot name="actions" :open="isOpen" :toggle="toggle" />
      </div>
    </div>
    <Transition name="accordion"
      ><div
        v-show="isOpen"
        v-bind="panelProps"
        class="accordion__body"
        :class="bodyClassList"
      >
        <slot :open="isOpen" /></div
    ></Transition>
  </div>
</template>
<style lang="scss" scoped>
@use "../../styles/accordion";
</style>

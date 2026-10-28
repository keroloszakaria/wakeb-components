<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import WButton from "./WButton.vue";
import type { AccordionProps, IconSlotProps } from "../types";
const props = withDefaults(defineProps<AccordionProps>(), {
  title: "",
  modelValue: false,
  classList: "",
  icon: "$expand",
  noBorder: false,
  beforeIcon: false,
  afterIcon: false,
  iconColor: "",
  iconSize: "sm",
  maxIconWidth: "100%",
  headerTitleClassList: "",
  headerClassList: "",
  bodyClassList: "",
  transparent: false,
  toggleLabel: "",
  contentId: "",
});
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
const isOpen = ref(props.modelValue);
watch(
  () => props.modelValue,
  (value) => {
    isOpen.value = value;
  },
);
const uid = useId();
const panelId = computed(() => props.contentId || `wakeb-accordion-${uid}`);
const toggle = () => {
  isOpen.value = !isOpen.value;
  emit("update:modelValue", isOpen.value);
};
const triggerProps = computed(() => ({
  type: "button" as const,
  "aria-expanded": isOpen.value,
  "aria-controls": panelId.value,
  "aria-label": props.toggleLabel || props.title || "Toggle section",
  onClick: (event: MouseEvent) => {
    event.stopPropagation();
    toggle();
  },
}));
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
          :custom-icon-color="iconColor"
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
          :custom-icon-color="iconColor"
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
        :id="panelId"
        class="accordion__body"
        :class="bodyClassList"
      >
        <slot :open="isOpen" /></div
    ></Transition>
  </div>
</template>
<style lang="scss" scoped>
.accordion {
  border: 1px solid
    var(--wakeb-accordion-border, var(--wakeb-accordion-fallback, #d0d5dd));
  border-radius: var(--wakeb-accordion-radius, 12px);
  overflow: hidden;
  background: var(
    --wakeb-accordion-background,
    var(--wakeb-accordion-fallback, #fff)
  );

  &--no-border {
    border: none;
    border-radius: 0;
  }

  &--transparent {
    background: transparent !important;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s;
    gap: 8px;

    &:hover {
      background: rgba(
        var(
          --wakeb-accordion-hover-rgb,
          var(--wakeb-accordion-fallback, 249, 250, 251)
        ),
        0.5
      );
    }

    &-content {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  &__title,
  :deep(.accordion__title) {
    font-weight: 600;
    font-size: 1rem;
    color: var(
      --wakeb-accordion-title,
      var(--wakeb-accordion-fallback, #101828)
    );
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__body {
    background-color: var(
      --wakeb-accordion-body-background,
      var(--wakeb-accordion-fallback, #fff)
    );
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 1rem;
  }
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 1000px;
}

:deep(.accordion__toggle) {
  cursor: pointer !important;
  transition: transform 0.3s ease !important;
  transform: rotate(180deg) !important;
}

:deep(.accordion__toggle--open) {
  transform: rotate(0deg) !important;
}

.accordion__title-trigger {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  text-align: inherit;
  cursor: pointer;
}
.accordion__title-trigger:focus-visible {
  outline: 2px solid var(--wakeb-accordion-focus, #087f8c);
  outline-offset: 3px;
  border-radius: 3px;
}
@media (prefers-reduced-motion: reduce) {
  .accordion-enter-active,
  .accordion-leave-active,
  .accordion__header {
    transition: none;
  }
  :deep(.accordion__toggle) {
    transition: none !important;
  }
}
</style>

<script setup lang="ts">
import { computed } from "vue";
import { buttonToggleDefaults, useButtonToggle } from "../../composables/selection";
import { SHADCN_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { ButtonToggleItem, ButtonToggleProps } from "../../types";
defineOptions({ name: "WButtonToggle" });
const props = withDefaults(defineProps<ButtonToggleProps>(), buttonToggleDefaults);
const emit = defineEmits<{ "update:modelValue": [value: string | number | (string | number)[] | null] }>();
defineSlots<{ item?(props: { item: ButtonToggleItem; selected: boolean }): unknown }>();
useWakebContext("WButtonToggle");
const toColor = useColor("WButtonToggle", SHADCN_INTENTS);
const style = computed(() => ({ "--wakeb-toggle-color": toColor(props.color, "color", "primary").css }));
/* Native toggle buttons (aria-pressed) with the shadcn-vue ToggleGroup look; Wakeb owns the model. */
const { isSelected, isDisabled, toggle } = useButtonToggle(props, emit);
</script>
<template>
  <div
    role="group"
    data-slot="toggle-group"
    :aria-label="ariaLabel"
    class="wakeb-button-toggle wakeb-sc-button-toggle"
    :class="[density && `wakeb-button-toggle--${density}`, { 'wakeb-button-toggle--block': block }]"
    :style="style"
  >
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      data-slot="toggle-group-item"
      class="wakeb-button-toggle__item"
      :data-state="isSelected(item) ? 'on' : 'off'"
      :aria-pressed="isSelected(item) ? 'true' : 'false'"
      :disabled="isDisabled(item)"
      @click="toggle(item)"
    >
      <slot name="item" :item="item" :selected="isSelected(item)">{{ item.label }}</slot>
    </button>
  </div>
</template>
<style>
/* Adapted from the shadcn-vue 2.9.0 ToggleGroup (new-york-v4 registry, MIT License); see THIRD-PARTY-NOTICES.txt. */
.wakeb-sc-button-toggle {
  display: inline-flex;
  align-items: center;
  border-radius: calc(var(--wakeb-ui-radius, var(--radius, 0.625rem)) - 2px);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  font-family: var(--wakeb-ui-font-family, inherit);
}
.wakeb-sc-button-toggle.wakeb-button-toggle--block {
  display: flex;
  width: 100%;
}
.wakeb-sc-button-toggle .wakeb-button-toggle__item {
  display: inline-flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 2.25rem;
  height: 2.25rem;
  padding-inline: 0.75rem;
  border: 1px solid var(--wakeb-ui-border, var(--input, #e5e5e5));
  border-inline-start-width: 0;
  background: transparent;
  color: var(--wakeb-ui-on-surface, var(--foreground, #0a0a0a));
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: color 150ms, background-color 150ms, box-shadow 150ms;
}
.wakeb-sc-button-toggle.wakeb-button-toggle--compact .wakeb-button-toggle__item {
  height: 2rem;
  padding-inline: 0.5rem;
}
.wakeb-sc-button-toggle .wakeb-button-toggle__item:first-child {
  border-inline-start-width: 1px;
  border-start-start-radius: inherit;
  border-end-start-radius: inherit;
}
.wakeb-sc-button-toggle .wakeb-button-toggle__item:last-child {
  border-start-end-radius: inherit;
  border-end-end-radius: inherit;
}
.wakeb-sc-button-toggle .wakeb-button-toggle__item:hover:not(:disabled) {
  background: var(--muted, #f5f5f5);
}
.wakeb-sc-button-toggle .wakeb-button-toggle__item[data-state="on"] {
  border-color: var(--wakeb-toggle-color);
  background: var(--wakeb-toggle-color);
  color: var(--primary-foreground, #fff);
}
.wakeb-sc-button-toggle .wakeb-button-toggle__item:focus-visible {
  position: relative;
  z-index: 1;
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wakeb-ui-focus, var(--ring, #087f8c)) 50%, transparent);
}
.wakeb-sc-button-toggle .wakeb-button-toggle__item:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>

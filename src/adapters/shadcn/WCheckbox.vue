<script setup lang="ts">
import { computed, useAttrs, useId } from "vue";
import { CheckboxIndicator, CheckboxRoot } from "reka-ui";
import { checkboxDefaults, useCheckboxModel } from "../../composables/selection";
import { splitFieldAttrs } from "../../composables/text-field";
import { SHADCN_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { CheckboxProps } from "../../types";
defineOptions({ name: "WCheckbox", inheritAttrs: false });
const props = withDefaults(defineProps<CheckboxProps>(), checkboxDefaults);
const emit = defineEmits<{ "update:modelValue": [value: boolean | unknown[]] }>();
defineSlots<{ label?(): unknown }>();
useWakebContext("WCheckbox");
const attrs = useAttrs();
const controlId = `wakeb-checkbox-${useId()}`;
const toColor = useColor("WCheckbox", SHADCN_INTENTS);
const split = computed(() => splitFieldAttrs(attrs));
const colorStyle = computed(() => ({ "--wakeb-selection-color": toColor(props.color, "color", "primary").css }));
/* Wakeb owns the array model, so the reka-ui root always holds a boolean. */
const { checked, setChecked } = useCheckboxModel(props, emit);
</script>
<template>
  <div
    v-bind="split.root"
    class="wakeb-checkbox wakeb-sc-checkbox"
    :class="[density && `wakeb-checkbox--${density}`, { 'wakeb-checkbox--disabled': disabled }]"
    :style="colorStyle"
  >
    <CheckboxRoot
      :id="controlId"
      v-bind="split.input"
      data-slot="checkbox"
      class="wakeb-sc-checkbox__root"
      :model-value="checked"
      :disabled="disabled"
      @update:model-value="(value: boolean | 'indeterminate') => setChecked(value === true)"
    >
      <CheckboxIndicator data-slot="checkbox-indicator" class="wakeb-sc-checkbox__indicator">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
      </CheckboxIndicator>
    </CheckboxRoot>
    <label v-if="label || $slots.label" :for="controlId" class="wakeb-checkbox__label"><slot name="label">{{ label }}</slot></label>
  </div>
</template>
<style>
/* Adapted from the shadcn-vue 2.9.0 Checkbox (new-york-v4 registry, MIT License); see THIRD-PARTY-NOTICES.txt. */
.wakeb-sc-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--wakeb-ui-font-family, inherit);
  color: var(--wakeb-ui-on-surface, var(--foreground, #0a0a0a));
}
.wakeb-sc-checkbox__root {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  padding: 0;
  border: 1px solid var(--wakeb-ui-border, var(--input, #e5e5e5));
  border-radius: 4px;
  background: transparent;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  outline: none;
  cursor: pointer;
  transition: box-shadow 150ms;
}
.wakeb-sc-checkbox__root[data-state="checked"] {
  border-color: var(--wakeb-selection-color);
  background: var(--wakeb-selection-color);
  color: var(--primary-foreground, #fff);
}
.wakeb-sc-checkbox__root:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wakeb-ui-focus, var(--ring, #087f8c)) 50%, transparent);
}
.wakeb-sc-checkbox__root:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.wakeb-sc-checkbox__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}
.wakeb-sc-checkbox__indicator svg {
  width: 0.875rem;
  height: 0.875rem;
}
.wakeb-sc-checkbox .wakeb-checkbox__label {
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}
.wakeb-sc-checkbox.wakeb-checkbox--disabled .wakeb-checkbox__label {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>

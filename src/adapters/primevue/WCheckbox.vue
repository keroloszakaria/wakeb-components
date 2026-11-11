<script setup lang="ts">
import { computed, useAttrs, useId } from "vue";
import Checkbox from "primevue/checkbox";
import { checkboxDefaults, useCheckboxModel } from "../../composables/selection";
import { splitFieldAttrs } from "../../composables/text-field";
import { PRIMEVUE_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { CheckboxProps } from "../../types";
defineOptions({ name: "WCheckbox", inheritAttrs: false });
const props = withDefaults(defineProps<CheckboxProps>(), checkboxDefaults);
const emit = defineEmits<{ "update:modelValue": [value: boolean | unknown[]] }>();
defineSlots<{ label?(): unknown }>();
useWakebContext("WCheckbox");
const attrs = useAttrs();
const inputId = `wakeb-checkbox-${useId()}`;
const toColor = useColor("WCheckbox", PRIMEVUE_INTENTS);
const split = computed(() => splitFieldAttrs(attrs));
/* Wakeb owns the array model, so PrimeVue always runs the box in binary mode. */
const { checked, setChecked } = useCheckboxModel(props, emit);
const colorStyle = computed(() => {
  const color = toColor(props.color, "color", "primary").css;
  return {
    "--p-checkbox-checked-background": color,
    "--p-checkbox-checked-border-color": color,
    "--p-checkbox-checked-hover-background": color,
    "--p-checkbox-checked-hover-border-color": color,
  };
});
</script>
<template>
  <div
    v-bind="split.root"
    class="wakeb-checkbox wakeb-pv-checkbox"
    :class="[density && `wakeb-checkbox--${density}`, { 'wakeb-checkbox--disabled': disabled }]"
    :style="colorStyle"
  >
    <Checkbox
      :input-id="inputId"
      :model-value="checked"
      binary
      :disabled="disabled"
      :pt="{ input: split.input }"
      @update:model-value="(value: boolean) => setChecked(Boolean(value))"
    />
    <label v-if="label || $slots.label" :for="inputId" class="wakeb-checkbox__label"><slot name="label">{{ label }}</slot></label>
  </div>
</template>
<style>
.wakeb-pv-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--wakeb-ui-font-family, inherit);
}
.wakeb-pv-checkbox .wakeb-checkbox__label {
  cursor: pointer;
  font-size: 0.875rem;
}
.wakeb-pv-checkbox.wakeb-checkbox--disabled .wakeb-checkbox__label {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>

<script setup lang="ts">
import { computed, mergeProps, useAttrs, useId } from "vue";
import ToggleSwitch from "primevue/toggleswitch";
import { switchDefaults } from "../../composables/selection";
import { splitFieldAttrs } from "../../composables/text-field";
import { PRIMEVUE_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { SwitchProps } from "../../types";
defineOptions({ name: "WSwitch", inheritAttrs: false });
const props = withDefaults(defineProps<SwitchProps>(), switchDefaults);
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
defineSlots<{ label?(): unknown }>();
useWakebContext("WSwitch");
const attrs = useAttrs();
const inputId = `wakeb-switch-${useId()}`;
const toColor = useColor("WSwitch", PRIMEVUE_INTENTS);
const split = computed(() => splitFieldAttrs(attrs));
/* The checked track takes the Wakeb color through the PrimeVue design tokens. */
const colorStyle = computed(() => {
  const color = toColor(props.color, "color", "primary").css;
  return { "--p-toggleswitch-checked-background": color, "--p-toggleswitch-checked-hover-background": color };
});
const inputPt = computed(() => ({
  input: mergeProps(split.value.input, { "aria-busy": props.loading ? "true" : undefined }),
}));
</script>
<template>
  <div
    v-bind="split.root"
    class="wakeb-switch wakeb-pv-switch"
    :class="[density && `wakeb-switch--${density}`, { 'wakeb-switch--disabled': disabled, 'wakeb-switch--loading': loading }]"
    :style="colorStyle"
  >
    <ToggleSwitch
      :input-id="inputId"
      :model-value="modelValue"
      :disabled="disabled"
      :pt="inputPt"
      @update:model-value="(value: boolean) => emit('update:modelValue', Boolean(value))"
    />
    <label v-if="label || $slots.label" :for="inputId" class="wakeb-switch__label"><slot name="label">{{ label }}</slot></label>
  </div>
</template>
<style>
.wakeb-pv-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--wakeb-ui-font-family, inherit);
}
.wakeb-pv-switch .wakeb-switch__label {
  cursor: pointer;
  font-size: 0.875rem;
}
.wakeb-pv-switch.wakeb-switch--disabled .wakeb-switch__label {
  cursor: not-allowed;
  opacity: 0.6;
}
.wakeb-pv-switch.wakeb-switch--loading .p-toggleswitch {
  opacity: 0.6;
  cursor: progress;
}
</style>

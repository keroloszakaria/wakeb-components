<script setup lang="ts">
import { computed, mergeProps, useAttrs, useId } from "vue";
import { SwitchRoot, SwitchThumb } from "reka-ui";
import { switchDefaults } from "../../composables/selection";
import { splitFieldAttrs } from "../../composables/text-field";
import { SHADCN_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { SwitchProps } from "../../types";
defineOptions({ name: "WSwitch", inheritAttrs: false });
const props = withDefaults(defineProps<SwitchProps>(), switchDefaults);
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
defineSlots<{ label?(): unknown }>();
useWakebContext("WSwitch");
const attrs = useAttrs();
const controlId = `wakeb-switch-${useId()}`;
const toColor = useColor("WSwitch", SHADCN_INTENTS);
const split = computed(() => splitFieldAttrs(attrs));
const colorStyle = computed(() => ({ "--wakeb-selection-color": toColor(props.color, "color", "primary").css }));
const controlBindings = computed(() => mergeProps(split.value.input, { "aria-busy": props.loading ? "true" : undefined }));
</script>
<template>
  <div
    v-bind="split.root"
    class="wakeb-switch wakeb-sc-switch"
    :class="[density && `wakeb-switch--${density}`, { 'wakeb-switch--disabled': disabled, 'wakeb-switch--loading': loading }]"
    :style="colorStyle"
  >
    <SwitchRoot
      :id="controlId"
      v-bind="controlBindings"
      data-slot="switch"
      class="wakeb-sc-switch__root"
      :model-value="modelValue"
      :disabled="disabled"
      @update:model-value="(value: boolean) => emit('update:modelValue', Boolean(value))"
    >
      <SwitchThumb data-slot="switch-thumb" class="wakeb-sc-switch__thumb" />
    </SwitchRoot>
    <label v-if="label || $slots.label" :for="controlId" class="wakeb-switch__label"><slot name="label">{{ label }}</slot></label>
  </div>
</template>
<style>
/* Adapted from the shadcn-vue 2.9.0 Switch (new-york-v4 registry, MIT License); see THIRD-PARTY-NOTICES.txt. */
.wakeb-sc-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--wakeb-ui-font-family, inherit);
  color: var(--wakeb-ui-on-surface, var(--foreground, #0a0a0a));
}
.wakeb-sc-switch__root {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  width: 2rem;
  height: 1.15rem;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 9999px;
  background: var(--input, #e5e5e5);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  outline: none;
  cursor: pointer;
  transition: background-color 150ms, box-shadow 150ms;
}
.wakeb-sc-switch__root[data-state="checked"] {
  background: var(--wakeb-selection-color);
}
.wakeb-sc-switch__root:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wakeb-ui-focus, var(--ring, #087f8c)) 50%, transparent);
}
.wakeb-sc-switch__root:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.wakeb-sc-switch__thumb {
  display: block;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background: var(--background, #fff);
  pointer-events: none;
  transition: transform 150ms;
}
.wakeb-sc-switch__thumb[data-state="checked"] {
  transform: translateX(calc(100% - 2px));
}
.wakeb-sc-switch__thumb[data-state="checked"]:dir(rtl) {
  transform: translateX(calc(-100% + 2px));
}
.wakeb-sc-switch .wakeb-switch__label {
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}
.wakeb-sc-switch.wakeb-switch--disabled .wakeb-switch__label {
  cursor: not-allowed;
  opacity: 0.5;
}
.wakeb-sc-switch.wakeb-switch--loading .wakeb-sc-switch__root {
  opacity: 0.6;
  cursor: progress;
}
</style>

<script setup lang="ts">
import { computed, mergeProps, useAttrs, useId } from "vue";
import { splitFieldAttrs, textFieldDefaults, useFieldValidation } from "../../composables/text-field";
import { useWakebContext } from "../../core/runtime";
import type { TextFieldProps } from "../../types";
defineOptions({ name: "WTextField", inheritAttrs: false });
const props = withDefaults(defineProps<TextFieldProps>(), textFieldDefaults);
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
defineSlots<{ start?(): unknown; end?(): unknown }>();
useWakebContext("WTextField");
const attrs = useAttrs();
const inputId = `wakeb-text-field-${useId()}`;
const messageId = `${inputId}-message`;
const { invalid, message, showDetails, touch } = useFieldValidation(props, () => props.modelValue);
const split = computed(() => splitFieldAttrs(attrs));
/* The shadcn-vue Input is a styled native input; Wakeb owns the value, validation and its description. */
const inputBindings = computed(() =>
  mergeProps(split.value.input, {
    onInput: (event: Event) => {
      touch();
      emit("update:modelValue", (event.target as HTMLInputElement).value);
    },
    onBlur: touch,
    "aria-invalid": invalid.value ? "true" : undefined,
    "aria-describedby": message.value && showDetails.value ? messageId : undefined,
  }),
);
</script>
<template>
  <div
    v-bind="split.root"
    class="wakeb-text-field wakeb-sc-text-field"
    :class="[`wakeb-text-field--${variant}`, density && `wakeb-text-field--${density}`, { 'wakeb-text-field--invalid': invalid, 'wakeb-text-field--disabled': disabled }]"
  >
    <label v-if="label" :for="inputId" class="wakeb-text-field__label">{{ label }}</label>
    <div class="wakeb-text-field__control">
      <span v-if="$slots.start" class="wakeb-text-field__start"><slot name="start" /></span>
      <input
        :id="inputId"
        data-slot="input"
        class="wakeb-text-field__input"
        v-bind="inputBindings"
        :type="type"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
      />
      <span v-if="$slots.end" class="wakeb-text-field__end"><slot name="end" /></span>
    </div>
    <div v-if="showDetails" class="wakeb-text-field__details">
      <p v-if="message" :id="messageId" class="wakeb-text-field__message" role="alert">{{ message }}</p>
    </div>
  </div>
</template>
<style>
/* Adapted from the shadcn-vue 2.9.0 Input (new-york-v4 registry, MIT License); see THIRD-PARTY-NOTICES.txt. */
.wakeb-sc-text-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
  font-family: var(--wakeb-ui-font-family, inherit);
  color: var(--wakeb-ui-on-surface, var(--foreground, #0a0a0a));
}
.wakeb-sc-text-field .wakeb-text-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
}
.wakeb-sc-text-field .wakeb-text-field__control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 2.25rem;
  box-sizing: border-box;
  padding-inline: 0.75rem;
  border: 1px solid var(--wakeb-ui-border, var(--input, #e5e5e5));
  border-radius: calc(var(--wakeb-ui-radius, var(--radius, 0.625rem)) - 2px);
  background: transparent;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: color 150ms, box-shadow 150ms, border-color 150ms;
}
.wakeb-sc-text-field.wakeb-text-field--compact .wakeb-text-field__control {
  height: 2rem;
}
.wakeb-sc-text-field.wakeb-text-field--filled .wakeb-text-field__control {
  border-color: transparent;
  background: var(--muted, #f5f5f5);
  box-shadow: none;
}
.wakeb-sc-text-field .wakeb-text-field__control:focus-within {
  border-color: var(--wakeb-ui-focus, var(--ring, #087f8c));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wakeb-ui-focus, var(--ring, #087f8c)) 50%, transparent);
}
.wakeb-sc-text-field.wakeb-text-field--invalid .wakeb-text-field__control {
  border-color: var(--wakeb-ui-danger, var(--destructive, #f04438));
}
.wakeb-sc-text-field.wakeb-text-field--disabled .wakeb-text-field__control {
  opacity: 0.5;
  cursor: not-allowed;
}
.wakeb-sc-text-field .wakeb-text-field__input {
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 0.875rem;
}
.wakeb-sc-text-field .wakeb-text-field__input::placeholder {
  color: var(--wakeb-ui-muted, var(--muted-foreground, #737373));
}
.wakeb-sc-text-field .wakeb-text-field__input:disabled {
  cursor: not-allowed;
}
.wakeb-sc-text-field .wakeb-text-field__start,
.wakeb-sc-text-field .wakeb-text-field__end {
  display: inline-flex;
  flex: none;
  align-items: center;
  color: var(--wakeb-ui-muted, var(--muted-foreground, #737373));
}
.wakeb-sc-text-field .wakeb-text-field__details {
  min-height: 1.25rem;
}
.wakeb-sc-text-field .wakeb-text-field__message {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: var(--wakeb-ui-danger, var(--destructive, #f04438));
}
</style>

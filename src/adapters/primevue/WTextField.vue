<script setup lang="ts">
import { computed, mergeProps, useAttrs, useId } from "vue";
import InputText from "primevue/inputtext";
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
/* PrimeVue InputText paints the input; Wakeb owns the label, the value, validation and its description. */
const inputBindings = computed(() =>
  mergeProps(split.value.input, {
    onBlur: touch,
    "aria-invalid": invalid.value ? "true" : undefined,
    "aria-describedby": message.value && showDetails.value ? messageId : undefined,
  }),
);
const onValue = (value: string | undefined) => {
  touch();
  emit("update:modelValue", value ?? "");
};
</script>
<template>
  <div
    v-bind="split.root"
    class="wakeb-text-field wakeb-pv-text-field"
    :class="[`wakeb-text-field--${variant}`, density && `wakeb-text-field--${density}`, { 'wakeb-text-field--invalid': invalid, 'wakeb-text-field--disabled': disabled }]"
  >
    <label v-if="label" :for="inputId" class="wakeb-text-field__label">{{ label }}</label>
    <div class="wakeb-text-field__control">
      <span v-if="$slots.start" class="wakeb-text-field__start"><slot name="start" /></span>
      <InputText
        :id="inputId"
        class="wakeb-text-field__input"
        v-bind="inputBindings"
        :type="type"
        :model-value="modelValue == null ? '' : String(modelValue)"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :invalid="invalid"
        :size="density === 'compact' ? 'small' : undefined"
        :variant="variant === 'filled' ? 'filled' : 'outlined'"
        fluid
        @update:model-value="onValue"
      />
      <span v-if="$slots.end" class="wakeb-text-field__end"><slot name="end" /></span>
    </div>
    <div v-if="showDetails" class="wakeb-text-field__details">
      <p v-if="message" :id="messageId" class="wakeb-text-field__message" role="alert">{{ message }}</p>
    </div>
  </div>
</template>
<style>
.wakeb-pv-text-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
  font-family: var(--wakeb-ui-font-family, inherit);
}
.wakeb-pv-text-field .wakeb-text-field__label {
  font-size: 0.875rem;
  font-weight: 500;
}
.wakeb-pv-text-field .wakeb-text-field__control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.wakeb-pv-text-field .wakeb-text-field__input {
  flex: 1 1 auto;
  min-width: 0;
}
.wakeb-pv-text-field .wakeb-text-field__start,
.wakeb-pv-text-field .wakeb-text-field__end {
  display: inline-flex;
  flex: none;
  align-items: center;
}
.wakeb-pv-text-field .wakeb-text-field__details {
  min-height: 1.25rem;
}
.wakeb-pv-text-field .wakeb-text-field__message {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: var(--wakeb-ui-danger, var(--p-red-500, #f04438));
}
</style>

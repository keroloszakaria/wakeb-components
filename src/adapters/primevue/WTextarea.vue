<script setup lang="ts">
import { computed, mergeProps, useAttrs, useId } from "vue";
import Textarea from "primevue/textarea";
import { splitFieldAttrs, textareaDefaults, useFieldValidation } from "../../composables/text-field";
import { useWakebContext } from "../../core/runtime";
import type { TextareaProps } from "../../types";
defineOptions({ name: "WTextarea", inheritAttrs: false });
const props = withDefaults(defineProps<TextareaProps>(), textareaDefaults);
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
useWakebContext("WTextarea");
const attrs = useAttrs();
const inputId = `wakeb-textarea-${useId()}`;
const messageId = `${inputId}-message`;
const { invalid, message, showDetails, touch } = useFieldValidation(props, () => props.modelValue);
const split = computed(() => splitFieldAttrs(attrs));
/* PrimeVue Textarea paints the control; Wakeb owns the label, the value, validation and its description. */
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
    class="wakeb-textarea wakeb-pv-textarea"
    :class="[`wakeb-textarea--${variant}`, density && `wakeb-textarea--${density}`, { 'wakeb-textarea--invalid': invalid, 'wakeb-textarea--disabled': disabled }]"
  >
    <label v-if="label" :for="inputId" class="wakeb-textarea__label">{{ label }}</label>
    <Textarea
      :id="inputId"
      class="wakeb-textarea__input"
      :class="{ 'wakeb-textarea__input--no-resize': noResize }"
      v-bind="inputBindings"
      :model-value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :invalid="invalid"
      :rows="Number(rows) || 5"
      :auto-resize="autoGrow"
      :size="density === 'compact' ? 'small' : undefined"
      :variant="variant === 'filled' ? 'filled' : 'outlined'"
      fluid
      @update:model-value="onValue"
    />
    <div v-if="showDetails" class="wakeb-textarea__details">
      <p v-if="message" :id="messageId" class="wakeb-textarea__message" role="alert">{{ message }}</p>
    </div>
  </div>
</template>
<style>
.wakeb-pv-textarea {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
  font-family: var(--wakeb-ui-font-family, inherit);
}
.wakeb-pv-textarea .wakeb-textarea__label {
  font-size: 0.875rem;
  font-weight: 500;
}
.wakeb-pv-textarea .wakeb-textarea__input {
  width: 100%;
}
.wakeb-pv-textarea .wakeb-textarea__input--no-resize {
  resize: none;
}
.wakeb-pv-textarea .wakeb-textarea__details {
  min-height: 1.25rem;
}
.wakeb-pv-textarea .wakeb-textarea__message {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: var(--wakeb-ui-danger, var(--p-red-500, #f04438));
}
</style>

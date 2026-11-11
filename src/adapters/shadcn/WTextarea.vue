<script setup lang="ts">
import { computed, mergeProps, useAttrs, useId } from "vue";
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
/* The shadcn-vue Textarea is a styled native textarea; Wakeb owns the value, validation and its description. */
const inputBindings = computed(() =>
  mergeProps(split.value.input, {
    onInput: (event: Event) => {
      touch();
      emit("update:modelValue", (event.target as HTMLTextAreaElement).value);
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
    class="wakeb-textarea wakeb-sc-textarea"
    :class="[`wakeb-textarea--${variant}`, density && `wakeb-textarea--${density}`, { 'wakeb-textarea--invalid': invalid, 'wakeb-textarea--disabled': disabled, 'wakeb-textarea--auto-grow': autoGrow, 'wakeb-textarea--no-resize': noResize }]"
  >
    <label v-if="label" :for="inputId" class="wakeb-textarea__label">{{ label }}</label>
    <textarea
      :id="inputId"
      data-slot="textarea"
      class="wakeb-textarea__input"
      v-bind="inputBindings"
      :value="modelValue ?? ''"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
    />
    <div v-if="showDetails" class="wakeb-textarea__details">
      <p v-if="message" :id="messageId" class="wakeb-textarea__message" role="alert">{{ message }}</p>
    </div>
  </div>
</template>
<style>
/* Adapted from the shadcn-vue 2.9.0 Textarea (new-york-v4 registry, MIT License); see THIRD-PARTY-NOTICES.txt. */
.wakeb-sc-textarea {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
  font-family: var(--wakeb-ui-font-family, inherit);
  color: var(--wakeb-ui-on-surface, var(--foreground, #0a0a0a));
}
.wakeb-sc-textarea .wakeb-textarea__label {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
}
.wakeb-sc-textarea .wakeb-textarea__input {
  box-sizing: border-box;
  width: 100%;
  min-height: 4rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--wakeb-ui-border, var(--input, #e5e5e5));
  border-radius: calc(var(--wakeb-ui-radius, var(--radius, 0.625rem)) - 2px);
  outline: none;
  background: transparent;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  color: inherit;
  font: inherit;
  font-size: 0.875rem;
  transition: color 150ms, box-shadow 150ms, border-color 150ms;
}
.wakeb-sc-textarea.wakeb-textarea--compact .wakeb-textarea__input {
  padding-block: 0.25rem;
}
.wakeb-sc-textarea.wakeb-textarea--auto-grow .wakeb-textarea__input {
  field-sizing: content;
}
.wakeb-sc-textarea.wakeb-textarea--no-resize .wakeb-textarea__input {
  resize: none;
}
.wakeb-sc-textarea.wakeb-textarea--filled .wakeb-textarea__input {
  border-color: transparent;
  background: var(--muted, #f5f5f5);
  box-shadow: none;
}
.wakeb-sc-textarea .wakeb-textarea__input::placeholder {
  color: var(--wakeb-ui-muted, var(--muted-foreground, #737373));
}
.wakeb-sc-textarea .wakeb-textarea__input:focus-visible {
  border-color: var(--wakeb-ui-focus, var(--ring, #087f8c));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wakeb-ui-focus, var(--ring, #087f8c)) 50%, transparent);
}
.wakeb-sc-textarea.wakeb-textarea--invalid .wakeb-textarea__input {
  border-color: var(--wakeb-ui-danger, var(--destructive, #f04438));
}
.wakeb-sc-textarea .wakeb-textarea__input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.wakeb-sc-textarea .wakeb-textarea__details {
  min-height: 1.25rem;
}
.wakeb-sc-textarea .wakeb-textarea__message {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: var(--wakeb-ui-danger, var(--destructive, #f04438));
}
</style>

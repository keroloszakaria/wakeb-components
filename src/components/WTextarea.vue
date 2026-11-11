<script setup lang="ts">
import { computed, mergeProps, ref, useAttrs } from "vue";
import { VTextarea } from "vuetify/components/VTextarea";
import { textareaDefaults } from "../composables/text-field";
import { useWakebContext } from "../core/runtime";
import type { TextareaProps } from "../types";
defineOptions({ name: "WTextarea", inheritAttrs: false });
const props = withDefaults(defineProps<TextareaProps>(), textareaDefaults);
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
useWakebContext("WTextarea");
const attrs = useAttrs();
const field = ref<{ isValid?: boolean | null } | null>(null);
/* External messages are known here; VTextarea's forwarded isValid does not track them on first render. */
const hasExternalError = computed(() => (typeof props.errorMessages === "string" ? props.errorMessages !== "" : (props.errorMessages ?? []).some((item) => item !== "")));
/* VTextarea splits attributes like VTextField; aria-invalid follows its validation state here. */
const bindings = computed(() =>
  mergeProps(attrs, {
    ...(props.required ? { required: true } : {}),
    "aria-invalid": hasExternalError.value || field.value?.isValid === false ? "true" : undefined,
  }),
);
</script>
<template>
  <VTextarea
    ref="field"
    v-bind="bindings"
    class="wakeb-textarea"
    :class="density && `wakeb-textarea--${density}`"
    :model-value="modelValue ?? undefined"
    :label="label"
    :placeholder="placeholder"
    :variant="variant === 'filled' ? 'filled' : 'outlined'"
    :disabled="disabled"
    :readonly="readonly"
    :rules="rules as never"
    :hide-details="hideDetails"
    :density="density"
    :error-messages="errorMessages as never"
    :rows="rows"
    :auto-grow="autoGrow"
    :no-resize="noResize"
    @update:model-value="(value: string) => emit('update:modelValue', value)"
  />
</template>

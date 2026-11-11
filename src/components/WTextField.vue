<script setup lang="ts">
import { computed, mergeProps, ref, useAttrs } from "vue";
import { VTextField } from "vuetify/components/VTextField";
import { textFieldDefaults } from "../composables/text-field";
import { useWakebContext } from "../core/runtime";
import type { TextFieldProps } from "../types";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<TextFieldProps>(), textFieldDefaults);
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
defineSlots<{ start?(): unknown; end?(): unknown }>();
useWakebContext("WTextField");
const attrs = useAttrs();
const field = ref<{ isValid?: boolean | null } | null>(null);
/* VTextField splits attributes itself: class, style, id, inert and data-* reach the root, the rest the input.
 * It marks errors only with classes, so aria-invalid follows its validation state here. */
const bindings = computed(() =>
  mergeProps(attrs, {
    ...(props.required ? { required: true } : {}),
    "aria-invalid": field.value?.isValid === false ? "true" : undefined,
  }),
);
</script>
<template>
  <VTextField
    ref="field"
    v-bind="bindings"
    class="wakeb-text-field"
    :class="density && `wakeb-text-field--${density}`"
    :model-value="modelValue ?? undefined"
    :type="type"
    :label="label"
    :placeholder="placeholder"
    :variant="variant === 'filled' ? 'filled' : 'outlined'"
    :disabled="disabled"
    :readonly="readonly"
    :rules="rules as never"
    :hide-details="hideDetails"
    :density="density"
    :error-messages="errorMessages as never"
    @update:model-value="(value: string) => emit('update:modelValue', value)"
  >
    <template v-if="$slots.start" #prepend-inner><slot name="start" /></template>
    <template v-if="$slots.end" #append-inner><slot name="end" /></template>
  </VTextField>
</template>

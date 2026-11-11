<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { VCheckbox } from "vuetify/components/VCheckbox";
import { checkboxDefaults, useCheckboxModel } from "../composables/selection";
import { VUETIFY_INTENTS, useColor } from "../core/vocabulary";
import { useWakebContext } from "../core/runtime";
import type { CheckboxProps } from "../types";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<CheckboxProps>(), checkboxDefaults);
const emit = defineEmits<{ "update:modelValue": [value: boolean | unknown[]] }>();
defineSlots<{ label?(): unknown }>();
useWakebContext("WCheckbox");
const attrs = useAttrs();
const toColor = useColor("WCheckbox", VUETIFY_INTENTS);
const color = computed(() => toColor(props.color, "color", "primary").css);
/* Wakeb owns the array model, so every provider adds and removes `value` the same way. */
const { checked, setChecked } = useCheckboxModel(props, emit);
</script>
<template>
  <VCheckbox
    v-bind="attrs"
    class="wakeb-checkbox"
    :class="density && `wakeb-checkbox--${density}`"
    :model-value="checked"
    :label="label"
    :disabled="disabled"
    :color="color"
    :density="density"
    hide-details
    @update:model-value="(value: unknown) => setChecked(Boolean(value))"
  >
    <template v-if="$slots.label" #label><slot name="label" /></template>
  </VCheckbox>
</template>

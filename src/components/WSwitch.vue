<script setup lang="ts">
import { computed, mergeProps, useAttrs } from "vue";
import { VSwitch } from "vuetify/components/VSwitch";
import { switchDefaults } from "../composables/selection";
import { VUETIFY_INTENTS, useColor } from "../core/vocabulary";
import { useWakebContext } from "../core/runtime";
import type { SwitchProps } from "../types";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SwitchProps>(), switchDefaults);
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
defineSlots<{ label?(): unknown }>();
useWakebContext("WSwitch");
const attrs = useAttrs();
const toColor = useColor("WSwitch", VUETIFY_INTENTS);
const color = computed(() => toColor(props.color, "color", "primary").css);
/* VSwitch splits attributes like VTextField; its native checkbox also announces itself as a switch. */
const bindings = computed(() => mergeProps(attrs, { role: "switch", "aria-busy": props.loading ? "true" : undefined }));
</script>
<template>
  <VSwitch
    v-bind="bindings"
    class="wakeb-switch"
    :class="density && `wakeb-switch--${density}`"
    :model-value="modelValue"
    :label="label"
    :disabled="disabled"
    :color="color"
    :density="density"
    :inset="inset"
    :loading="loading ? color : false"
    hide-details
    @update:model-value="(value: unknown) => emit('update:modelValue', Boolean(value))"
  >
    <template v-if="$slots.label" #label><slot name="label" /></template>
  </VSwitch>
</template>

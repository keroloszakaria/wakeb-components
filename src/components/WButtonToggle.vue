<script setup lang="ts">
import { computed } from "vue";
import { VBtnGroup } from "vuetify/components/VBtnGroup";
import { VBtn } from "vuetify/components/VBtn";
import { buttonToggleDefaults, useButtonToggle } from "../composables/selection";
import { VUETIFY_INTENTS, useColor } from "../core/vocabulary";
import { useWakebContext } from "../core/runtime";
import type { ButtonToggleItem, ButtonToggleProps } from "../types";
defineOptions({ name: "WButtonToggle" });
const props = withDefaults(defineProps<ButtonToggleProps>(), buttonToggleDefaults);
const emit = defineEmits<{ "update:modelValue": [value: string | number | (string | number)[] | null] }>();
defineSlots<{ item?(props: { item: ButtonToggleItem; selected: boolean }): unknown }>();
useWakebContext("WButtonToggle");
const toColor = useColor("WButtonToggle", VUETIFY_INTENTS);
const color = computed(() => toColor(props.color, "color", "primary").css);
/* Wakeb owns the selection (VBtnToggle's mandatory would select an item by itself); VBtnGroup paints the group. */
const { isSelected, isDisabled, toggle } = useButtonToggle(props, emit);
</script>
<template>
  <VBtnGroup
    role="group"
    :aria-label="ariaLabel"
    class="wakeb-button-toggle"
    :class="{ 'wakeb-button-toggle--block': block }"
    :density="density"
    divided
    variant="outlined"
  >
    <VBtn
      v-for="item in items"
      :key="item.value"
      class="wakeb-button-toggle__item"
      :active="isSelected(item)"
      :aria-pressed="isSelected(item) ? 'true' : 'false'"
      :color="isSelected(item) ? color : undefined"
      :disabled="isDisabled(item)"
      @click="toggle(item)"
    >
      <slot name="item" :item="item" :selected="isSelected(item)">{{ item.label }}</slot>
    </VBtn>
  </VBtnGroup>
</template>
<style>
.wakeb-button-toggle.wakeb-button-toggle--block {
  display: flex;
  width: 100%;
}
.wakeb-button-toggle.wakeb-button-toggle--block > .wakeb-button-toggle__item {
  flex: 1 1 0;
}
</style>

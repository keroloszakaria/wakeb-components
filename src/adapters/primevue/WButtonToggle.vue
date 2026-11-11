<script setup lang="ts">
import { computed } from "vue";
import ToggleButton from "primevue/togglebutton";
import { buttonToggleDefaults, useButtonToggle } from "../../composables/selection";
import { PRIMEVUE_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { ButtonToggleItem, ButtonToggleProps } from "../../types";
defineOptions({ name: "WButtonToggle" });
const props = withDefaults(defineProps<ButtonToggleProps>(), buttonToggleDefaults);
const emit = defineEmits<{ "update:modelValue": [value: string | number | (string | number)[] | null] }>();
defineSlots<{ item?(props: { item: ButtonToggleItem; selected: boolean }): unknown }>();
useWakebContext("WButtonToggle");
const toColor = useColor("WButtonToggle", PRIMEVUE_INTENTS);
/* The checked ToggleButton tokens take the Wakeb color, in styled and themed hosts alike. */
const style = computed(() => {
  const color = toColor(props.color, "color", "primary").css;
  return {
    "--p-togglebutton-checked-background": color,
    "--p-togglebutton-content-checked-background": color,
    "--p-togglebutton-checked-border-color": color,
    "--p-togglebutton-checked-color": "var(--wakeb-ui-on-primary, #fff)",
  };
});
/* One ToggleButton per item (aria-pressed); Wakeb owns the group model, like the other providers. */
const { isSelected, isDisabled, toggle } = useButtonToggle(props, emit);
</script>
<template>
  <div
    role="group"
    :aria-label="ariaLabel"
    class="wakeb-button-toggle wakeb-pv-button-toggle"
    :class="[density && `wakeb-button-toggle--${density}`, { 'wakeb-button-toggle--block': block }]"
    :style="style"
  >
    <ToggleButton
      v-for="item in items"
      :key="item.value"
      class="wakeb-button-toggle__item"
      :model-value="isSelected(item)"
      :disabled="isDisabled(item)"
      :size="density === 'compact' ? 'small' : undefined"
      @update:model-value="toggle(item)"
    >
      <template #default>
        <span class="wakeb-button-toggle__label"><slot name="item" :item="item" :selected="isSelected(item)">{{ item.label }}</slot></span>
      </template>
    </ToggleButton>
  </div>
</template>
<style>
.wakeb-pv-button-toggle {
  display: inline-flex;
}
.wakeb-pv-button-toggle.wakeb-button-toggle--block {
  display: flex;
  width: 100%;
}
.wakeb-pv-button-toggle.wakeb-button-toggle--block > .wakeb-button-toggle__item {
  flex: 1 1 0;
}
.wakeb-pv-button-toggle > .wakeb-button-toggle__item:not(:first-child) {
  border-start-start-radius: 0;
  border-end-start-radius: 0;
  margin-inline-start: -1px;
}
.wakeb-pv-button-toggle > .wakeb-button-toggle__item:not(:last-child) {
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}
</style>

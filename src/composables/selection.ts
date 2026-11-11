import { computed } from "vue";
import type { ButtonToggleItem, ButtonToggleProps, CheckboxProps } from "../types";

/** Defaults shared by every WSwitch renderer; providers must not change them. */
export const switchDefaults = {
  modelValue: false,
  disabled: false,
  color: "primary",
  inset: false,
  loading: false,
} as const;

/** Defaults shared by every WCheckbox renderer. `value` stays undefined so boolean mode is the default. */
export const checkboxDefaults = {
  modelValue: false,
  value: undefined,
  disabled: false,
  color: "primary",
} as const;

/**
 * WCheckbox model, like Vuetify's VCheckbox: an array model holds the checked `value`s (toggling adds
 * or removes this one and emits a new array); any other model is a boolean.
 */
export function useCheckboxModel(props: CheckboxProps, emit: (event: "update:modelValue", value: boolean | unknown[]) => void) {
  const checked = computed(() =>
    Array.isArray(props.modelValue) ? props.modelValue.includes(props.value) : Boolean(props.modelValue),
  );
  const setChecked = (next: boolean) => {
    if (Array.isArray(props.modelValue)) {
      const without = props.modelValue.filter((item) => item !== props.value);
      emit("update:modelValue", next ? [...without, props.value] : without);
    } else emit("update:modelValue", next);
  };
  return { checked, setChecked };
}

/** Defaults shared by every WButtonToggle renderer. */
export const buttonToggleDefaults = {
  modelValue: null,
  items: () => [],
  multiple: false,
  mandatory: false,
  color: "primary",
  disabled: false,
  block: false,
} as const;

type ToggleValue = string | number;
/**
 * The WButtonToggle model, owned by Wakeb on every provider. Single mode holds one value or null;
 * multiple mode holds an array in item order. `mandatory` only stops the last selection from being
 * cleared; it never selects an item on its own.
 */
export function useButtonToggle(props: Readonly<ButtonToggleProps>, emit: (event: "update:modelValue", value: ToggleValue | ToggleValue[] | null) => void) {
  const selected = computed<ToggleValue[]>(() => {
    const value = props.modelValue;
    if (Array.isArray(value)) return [...value];
    return value === null || value === undefined ? [] : [value as ToggleValue];
  });
  const isSelected = (item: ButtonToggleItem) => selected.value.includes(item.value);
  const isDisabled = (item: ButtonToggleItem) => Boolean(props.disabled || item.disabled);
  const toggle = (item: ButtonToggleItem) => {
    if (isDisabled(item)) return;
    const on = isSelected(item);
    if (props.multiple) {
      if (on && props.mandatory && selected.value.length === 1) return;
      const next = on ? selected.value.filter((value) => value !== item.value) : [...selected.value, item.value];
      const order = (props.items ?? []).map((entry) => entry.value);
      emit("update:modelValue", next.sort((a, b) => order.indexOf(a) - order.indexOf(b)));
    } else if (on) {
      if (!props.mandatory) emit("update:modelValue", null);
    } else emit("update:modelValue", item.value);
  };
  return { selected, isSelected, isDisabled, toggle };
}

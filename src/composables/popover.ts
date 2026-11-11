import { computed, ref, useId, watch } from "vue";
import type { PopoverProps, WakebPopoverLocation } from "../types";

export const popoverDefaults = {
  modelValue: undefined,
  location: "bottom start",
  offset: 0,
  disabled: false,
  closeOnContentClick: false,
} as const;

/**
 * Open state for WPopover on every provider. Without `modelValue` the popover keeps its own state;
 * with it the parent decides and each change is emitted once. A disabled popover never opens.
 */
export function usePopover(props: Readonly<PopoverProps>, emit: (event: "update:modelValue", value: boolean) => void) {
  const local = ref(props.modelValue ?? false);
  watch(
    () => props.modelValue,
    (value) => {
      if (value !== undefined) local.value = value;
    },
  );
  watch(
    () => props.disabled,
    (disabled) => {
      /* Disabling an open popover closes it, and the parent hears about it once. */
      if (disabled && (props.modelValue ?? local.value)) {
        local.value = false;
        emit("update:modelValue", false);
      }
    },
  );
  const isActive = computed<boolean>({
    get: () => !props.disabled && (props.modelValue ?? local.value),
    set: (value) => {
      if (value && props.disabled) return;
      if (value === isActive.value) return;
      local.value = value;
      emit("update:modelValue", value);
    },
  });
  const id = `wakeb-popover-${useId()}`;
  const close = () => {
    isActive.value = false;
  };
  const toggle = () => {
    isActive.value = !isActive.value;
  };
  /** Accessibility props every renderer adds to the activator element. */
  const activatorAria = computed(() => ({
    "aria-haspopup": "dialog",
    "aria-expanded": isActive.value ? "true" : "false",
    "aria-controls": isActive.value ? id : undefined,
  }));
  return { isActive, id, close, toggle, activatorAria };
}

/** reka-ui side and align for a Wakeb location; `start` and `end` are logical and follow the direction. */
export function popoverPlacement(location: WakebPopoverLocation) {
  const [side, align] = location.split(" ") as ["bottom" | "top", "start" | "end" | undefined];
  return { side, align: align ?? "center" } as const;
}

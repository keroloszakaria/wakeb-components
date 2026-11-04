import { computed } from "vue";
import { useDisclosure } from "./disclosure";
import type { DrawerProps } from "../types";

/** Defaults shared by every WDrawer renderer; providers must not change them. */
export const drawerDefaults = {
  modelValue: false,
  title: "",
  width: 420,
  position: "end",
  persistent: false,
  transparentOverlay: false,
  closable: true,
  loading: false,
  dataLoaded: true,
  closeLabel: "Close",
  loadingLabel: "Loading",
  ariaLabel: "Drawer",
} as const;

type Emit = {
  (event: "update:modelValue", value: boolean): void;
  (event: "close"): void;
};

/**
 * Provider-neutral WDrawer behavior: the mirrored boolean model (SPEC R13), the close callback that
 * updates the model before emitting `close`, the physical side for a logical position, and the
 * baseline width parsing (numbers pass, strings use parseInt with a 420 fallback).
 */
export function useDrawer(props: Required<Pick<DrawerProps, "modelValue" | "position" | "width">>, emit: Emit) {
  const { model } = useDisclosure(props, emit);
  const side = (rtl: boolean): "left" | "right" =>
    props.position === "start" ? (rtl ? "right" : "left") : rtl ? "left" : "right";
  const numericWidth = computed(() => {
    if (typeof props.width === "number") return props.width;
    const value = parseInt(props.width, 10);
    return Number.isNaN(value) ? 420 : value;
  });
  const close = () => {
    model.value = false;
    emit("close");
  };
  return { model, side, numericWidth, close };
}

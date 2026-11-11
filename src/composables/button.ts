import { computed, mergeProps, useAttrs } from "vue";
import type { ButtonProps, IconSlotProps } from "../types";

/** Defaults shared by every WButton renderer; providers must not change them. */
export const buttonDefaults = {
  isTooltip: false,
  location: "top",
  title: "",
  classList: "",
  iconPosition: "start",
  type: "primary",
  size: "lg",
  isLoading: false,
  isDropdown: false,
  action: "button",
  disabled: false,
  icon: "",
  iconSize: "sm",
  maxIconWidth: "100%",
  iconColorType: "currentColor",
  customIconColor: "",
  wrapperAttrs: () => ({}),
} as const;

const ICON_COLORS = {
  danger: "var(--wakeb-button-danger-background, var(--wakeb-button-fallback, #d92d20))",
  primary: "var(--wakeb-button-icon-primary, var(--wakeb-button-fallback, #087f8c))",
  success: "var(--wakeb-button-icon-success, var(--wakeb-button-fallback, #12b76a))",
  warning: "var(--wakeb-button-icon-warning, var(--wakeb-button-fallback, #f79009))",
  currentColor: "currentColor",
};
const ICON_PIXELS: Record<string, number> = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 };

/** Provider-neutral WButton behavior: classes, icon presentation, activation rules and attrs. */
export function useButton(props: Required<Omit<ButtonProps, "icon" | "providerProps">> & ButtonProps, emit: (event: "click", value: MouseEvent) => void) {
  const attrs = useAttrs();
  const classes = computed(() => [
    "btn",
    `btn--${props.type}`,
    `btn--${props.size}`,
    props.classList,
    { "btn--disabled": props.disabled, "btn--loading": props.isLoading },
  ]);
  const iconColor = computed(() => props.customIconColor || ICON_COLORS[props.iconColorType]);
  const iconProps = computed<IconSlotProps>(() => ({
    icon: props.icon ?? "",
    size: props.iconSize,
    color: iconColor.value,
    maxWidth: props.maxIconWidth,
  }));
  const pixelSize = computed(() => (props.iconSize === "free" ? undefined : (ICON_PIXELS[String(props.iconSize)] ?? props.iconSize)));
  const iconStyle = computed(() => ({
    maxWidth: typeof props.maxIconWidth === "number" ? `${props.maxIconWidth}px` : props.maxIconWidth,
  }));
  /** Loading suppresses activation like disabled: no click event and no native submit/reset. */
  const onClick = (event: MouseEvent) => {
    if (props.disabled || props.isLoading) {
      event.preventDefault();
      return;
    }
    emit("click", event);
  };
  /** Native provider props first, so tooltip bindings, the fallback name and caller attrs win over them. */
  const actualAttrs = (tooltip: Record<string, unknown> = {}, native: Record<string, unknown> = {}) =>
    mergeProps(native, tooltip, (props.isTooltip || props.isLoading) && !attrs["aria-label"] ? { "aria-label": props.title || undefined } : {}, attrs, props.isLoading ? { "aria-busy": "true" } : {});
  return { classes, iconColor, iconProps, pixelSize, iconStyle, onClick, actualAttrs };
}

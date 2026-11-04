import { computed, ref, watch } from "vue";
import type { ButtonProps, DropdownItem, DropdownProps, NavigationKey } from "../types";

export const dropdownDefaults = {
  menuItems: () => [],
  icon: "",
  iconColor: "",
  showSelected: false,
  showBoth: false,
  classList: "",
  size: "lg",
  isLinks: false,
  isLoading: false,
  disabled: false,
  showChevron: true,
  expandIcon: "$expand",
  collapseIcon: "$collapse",
  labelFormatter: (label: string | undefined) => label ?? "",
} as const;

type Props = DropdownProps &
  Required<Pick<DropdownProps, "menuItems" | "labelFormatter" | "expandIcon" | "collapseIcon" | "isLoading" | "disabled" | "showChevron">>;
type Emit = {
  (event: "selectedItem", item: DropdownItem): void;
  (event: "update:modelValue", value: NavigationKey): void;
};

/** Provider-neutral WDropdown selection, labels, colors and activation rules (SPEC R13). */
export function useDropdown(props: Props, emits: Emit) {
  const selectedItem = ref<DropdownItem | null>(null);

  const COLOR_TOKENS = computed<Record<string, string>>(() => ({
    success: "var(--wakeb-dropdown-color-success, #12b76a)",
    danger: "var(--wakeb-dropdown-color-danger, #f04438)",
    warning: "var(--wakeb-dropdown-color-warning, #f79009)",
    primary: "var(--wakeb-dropdown-color-primary, var(--wakeb-ui-primary, #087f8c))",
    info: "var(--wakeb-dropdown-color-info, #2e90fa)",
    ...props.colorMap,
  }));

  const resolveItemColor = (item: DropdownItem) => {
    if (!item?.color) return "currentColor";
    return COLOR_TOKENS.value[item.color] || item.color;
  };

  /** Exact values win over label fallbacks so a label can never shadow another row's value. */
  const findItemByValue = (value: NavigationKey) =>
    props.menuItems?.find((item: DropdownItem) => item.value === value) ??
    props.menuItems?.find((item: DropdownItem) => item.label === value) ??
    null;
  const keyOf = (item: DropdownItem) => item.value ?? item.label;

  watch(
    () => props.modelValue,
    (value, previous) => {
      // undefined leaves an uncontrolled selection alone; null is an explicit clear.
      if (value === undefined) return;
      if (value === null) {
        if (previous !== undefined) selectedItem.value = null;
        return;
      }
      selectedItem.value = findItemByValue(value);
    },
    { immediate: true },
  );
  watch(
    () => props.menuItems,
    () => {
      const key = props.modelValue ?? (selectedItem.value && keyOf(selectedItem.value));
      selectedItem.value = key == null ? null : findItemByValue(key);
    },
  );

  const buttonTitle = computed(() => {
    if (props.showSelected) {
      if (selectedItem.value) return selectedItem.value.label;
      if (props.title) return props.title;
      return props.menuItems[0]?.label || "";
    }
    if (props.showBoth) {
      const selectedLabel = selectedItem.value ? selectedItem.value.label : props.menuItems[0]?.label || "";
      return `${props.title}: ${selectedLabel}`;
    }
    return props.title;
  });

  /** Custom leading icon from prop or selected menu item (status icons, etc.). */
  const leadingIcon = computed(() => props.icon || selectedItem.value?.icon || "");
  const hasLeadingIcon = computed(() => Boolean(leadingIcon.value));

  /**
   * Backward compatible activator icon:
   * - With leading icon → show it (+ optional chevron via isDropdown)
   * - Without → keep old behavior (chevron-down as the only icon)
   */
  const resolvedActivatorIcon = computed(() => leadingIcon.value || props.expandIcon);
  const isChevronIcon = computed(() => resolvedActivatorIcon.value === props.expandIcon);

  /** Button accepts danger | primary | success | warning | currentColor */
  const activatorIconColorType = computed<ButtonProps["iconColorType"]>(() => {
    if (!hasLeadingIcon.value) return "currentColor";
    const color = props.iconColor || selectedItem.value?.color;
    if (color && ["success", "danger", "primary", "warning"].includes(color)) return color as ButtonProps["iconColorType"];
    return "currentColor";
  });

  /** Color activator label to match selected item (without touching Button.vue). */
  const activatorTextColor = computed(() => {
    const colorKey = props.iconColor || selectedItem.value?.color;
    if (!colorKey) return "";
    return COLOR_TOKENS.value[colorKey] || (colorKey.startsWith("var(") || colorKey.startsWith("#") ? colorKey : "");
  });

  const isItemActive = (item: DropdownItem) => {
    if (!selectedItem.value) return false;
    if (item.value != null && selectedItem.value.value != null) return item.value === selectedItem.value.value;
    return item.label === selectedItem.value.label;
  };

  const isItemDisabled = (item: DropdownItem) => Boolean(props.isLoading || props.disabled || item.disabled);
  const itemHref = (item: DropdownItem) => item.href ?? (typeof item.to === "string" ? item.to : undefined);

  const onMenuItemClick = (event: Event, item: DropdownItem) => {
    if (isItemDisabled(item)) {
      event.preventDefault();
      return;
    }
    emits("selectedItem", item);
    emits("update:modelValue", keyOf(item));
    selectedItem.value = item;
  };

  const buttonProps = (active: boolean): ButtonProps => ({
    icon: isChevronIcon.value ? (active ? props.collapseIcon : props.expandIcon) : resolvedActivatorIcon.value,
    iconColorType: activatorIconColorType.value,
    iconPosition: props.iconPosition || "start",
    title: props.labelFormatter(buttonTitle.value),
    type: props.type,
    classList: props.classList,
    size: props.size,
    isLoading: props.isLoading,
    disabled: props.disabled || props.isLoading,
    isDropdown: hasLeadingIcon.value && props.showChevron,
  });

  return {
    selectedItem,
    resolveItemColor,
    buttonTitle,
    activatorTextColor,
    isItemActive,
    isItemDisabled,
    itemHref,
    onMenuItemClick,
    buttonProps,
  };
}

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { VMenu } from "vuetify/components/VMenu";
import { VList, VListItem, VListItemTitle } from "vuetify/components/VList";
import { VIcon } from "vuetify/components/VIcon";
import WButton from "./WButton.vue";
import type {
  DropdownProps,
  DropdownItem,
  NavigationKey,
  ButtonProps,
} from "../types";
const props = withDefaults(defineProps<DropdownProps>(), {
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
});
const emits = defineEmits<{
  selectedItem: [item: DropdownItem];
  "update:modelValue": [value: NavigationKey];
}>();
defineSlots<{
  activator?(props: {
    props: Record<string, unknown>;
    isActive: boolean;
    buttonProps: ButtonProps;
  }): unknown;
  "item-icon"?(props: { item: DropdownItem; color: string }): unknown;
  "item-label"?(props: { item: DropdownItem; text: string }): unknown;
}>();
const selectedItem = ref<DropdownItem | null>(null);

const COLOR_TOKENS = computed<Record<string, string>>(() => ({
  success: "var(--wakeb-dropdown-color-success, #12b76a)",
  danger: "var(--wakeb-dropdown-color-danger, #f04438)",
  warning: "var(--wakeb-dropdown-color-warning, #f79009)",
  primary: "var(--wakeb-dropdown-color-primary, #087f8c)",
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
    const selectedLabel = selectedItem.value
      ? selectedItem.value.label
      : props.menuItems[0]?.label || "";
    return `${props.title}: ${selectedLabel}`;
  }
  return props.title;
});

/** Custom leading icon from prop or selected menu item (status icons, etc.). */
const leadingIcon = computed(
  () => props.icon || selectedItem.value?.icon || "",
);
const hasLeadingIcon = computed(() => Boolean(leadingIcon.value));

/**
 * Backward compatible activator icon:
 * - With leading icon → show it (+ optional chevron via isDropdown)
 * - Without → keep old behavior (chevron-down as the only icon)
 */
const resolvedActivatorIcon = computed(
  () => leadingIcon.value || props.expandIcon,
);
const isChevronIcon = computed(
  () => resolvedActivatorIcon.value === props.expandIcon,
);

const resolvedIconPosition = computed(() => {
  if (props.iconPosition) return props.iconPosition;
  // Old default: chevron at start when it's the only icon
  return "start";
});

/** Button accepts danger | primary | success | warning | currentColor */
const activatorIconColorType = computed<ButtonProps["iconColorType"]>(() => {
  if (!hasLeadingIcon.value) return "currentColor";
  const color = props.iconColor || selectedItem.value?.color;
  if (color && ["success", "danger", "primary", "warning"].includes(color))
    return color as ButtonProps["iconColorType"];
  return "currentColor";
});

/** Color activator label to match selected item (without touching Button.vue). */
const activatorTextColor = computed(() => {
  const colorKey = props.iconColor || selectedItem.value?.color;
  if (!colorKey) return "";
  return (
    COLOR_TOKENS.value[colorKey] ||
    (colorKey.startsWith("var(") || colorKey.startsWith("#") ? colorKey : "")
  );
});

const isItemActive = (item: DropdownItem) => {
  if (!selectedItem.value) return false;
  if (item.value != null && selectedItem.value.value != null) {
    return item.value === selectedItem.value.value;
  }
  return item.label === selectedItem.value.label;
};

const isItemDisabled = (item: DropdownItem) =>
  Boolean(props.isLoading || props.disabled || item.disabled);
const itemHref = (item: DropdownItem) =>
  item.href ?? (typeof item.to === "string" ? item.to : undefined);

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
  icon: isChevronIcon.value
    ? active
      ? props.collapseIcon
      : props.expandIcon
    : resolvedActivatorIcon.value,
  iconColorType: activatorIconColorType.value,
  iconPosition: resolvedIconPosition.value,
  title: props.labelFormatter(buttonTitle.value),
  type: props.type,
  classList: props.classList,
  size: props.size,
  isLoading: props.isLoading,
  disabled: props.disabled || props.isLoading,
  isDropdown: hasLeadingIcon.value && props.showChevron,
});
</script>
<template>
  <div>
    <v-menu :disabled="disabled || isLoading">
      <template v-slot:activator="{ props: activatorProps, isActive }">
        <div
          class="dropdown-activator"
          :class="{
            'dropdown-activator--colored': Boolean(activatorTextColor),
          }"
          :style="
            activatorTextColor
              ? { '--wakeb-dropdown-activator-color': activatorTextColor }
              : undefined
          "
        >
          <slot
            name="activator"
            :props="activatorProps"
            :is-active="isActive"
            :button-props="buttonProps(isActive)"
            ><WButton
              v-bind="{ ...activatorProps, ...buttonProps(isActive) }"
              :aria-label="labelFormatter(buttonTitle)"
          /></slot>
        </div>
      </template>
      <v-list :style="menuStyle" role="menu">
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="item.value ?? index"
          role="menuitem"
          :href="isLinks && !isItemDisabled(item) ? itemHref(item) : undefined"
          :disabled="isItemDisabled(item)"
          :aria-disabled="isItemDisabled(item) || undefined"
          :class="{ 'list-item-active': isItemActive(item) }"
          @click="(event: MouseEvent | KeyboardEvent) => onMenuItemClick(event, item)"
        >
          <template v-if="item.icon" #prepend>
            <slot name="item-icon" :item="item" :color="resolveItemColor(item)"
              ><VIcon
                :icon="item.icon"
                :size="16"
                :style="{ color: resolveItemColor(item) }"
            /></slot>
          </template>
          <v-list-item-title
            :style="item.color ? { color: resolveItemColor(item) } : undefined"
          >
            <slot
              name="item-label"
              :item="item"
              :text="labelFormatter(item.label)"
              ><span>{{ labelFormatter(item.label) }}</span></slot
            >
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-list-item-title span) {
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: inherit;
}

.dropdown-activator--colored {
  :deep(.btn p) {
    color: var(--wakeb-dropdown-activator-color);
  }
}

:deep(.v-list-item) {
  .v-list-item__prepend {
    margin-inline-end: 8px;
  }
}
</style>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import Menu from "primevue/menu";
import WButton from "./WButton.vue";
import WakebIcon from "../../icons/WakebIcon";
import { dropdownDefaults, useDropdown } from "../../composables/dropdown";
import { useWakebContext } from "../../core/runtime";
import type { DropdownProps, DropdownItem, NavigationKey, ButtonProps } from "../../types";
defineOptions({ name: "WDropdown" });
const props = withDefaults(defineProps<DropdownProps>(), dropdownDefaults);
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
useWakebContext("WDropdown");
const {
  resolveItemColor,
  buttonTitle,
  activatorTextColor,
  isItemActive,
  isItemDisabled,
  itemHref,
  onMenuItemClick,
  buttonProps,
} = useDropdown(props, emits);

const menu = ref<InstanceType<typeof Menu>>();
const menuId = `wakeb-dropdown-${useId()}`;
const isActive = ref(false);
/* PrimeVue owns positioning, focus and arrow/Escape keys; Wakeb keeps the record and its rules. */
const model = computed(() =>
  props.menuItems.map((item, index) => ({
    key: String(item.value ?? index),
    label: props.labelFormatter(item.label),
    disabled: isItemDisabled(item),
    wakeb: item,
  })),
);
const activatorProps = computed(() => ({
  "aria-haspopup": "menu",
  "aria-expanded": String(isActive.value),
  // PrimeVue puts role="menu" on the inner list, `${id}_list`, not on the overlay root.
  "aria-controls": isActive.value ? `${menuId}_list` : undefined,
  onClick: (event: MouseEvent) => {
    if (props.disabled || props.isLoading) return;
    // Opening is synchronous; closing paths (toggle, Escape, outside click, selection) report @hide.
    if (!isActive.value) isActive.value = true;
    menu.value?.toggle(event);
  },
}));
</script>
<template>
  <div>
    <div
      class="dropdown-activator"
      :class="{ 'dropdown-activator--colored': Boolean(activatorTextColor) }"
      :style="activatorTextColor ? { '--wakeb-dropdown-activator-color': activatorTextColor } : undefined"
    >
      <slot name="activator" :props="activatorProps" :is-active="isActive" :button-props="buttonProps(isActive)"
        ><WButton v-bind="{ ...activatorProps, ...buttonProps(isActive) }" :aria-label="labelFormatter(buttonTitle)"
      /></slot>
    </div>
    <Menu
      :id="menuId"
      ref="menu"
      :model="model"
      popup
      class="wakeb-pv-dropdown"
      :style="menuStyle"
      @hide="isActive = false"
    >
      <template #item="{ item, props: itemProps }">
        <!-- Always an anchor: PrimeVue's Enter/Space handler clicks a[data-pc-section=itemlink]. -->
        <a
          v-bind="itemProps.action"
          :href="isLinks && !item.disabled ? itemHref(item.wakeb) : undefined"
          class="wakeb-pv-dropdown__item"
          :class="{ 'list-item-active': isItemActive(item.wakeb) }"
          @click="(event: MouseEvent) => onMenuItemClick(event, item.wakeb)"
        >
          <span v-if="item.wakeb.icon" class="wakeb-pv-dropdown__icon">
            <slot name="item-icon" :item="item.wakeb" :color="resolveItemColor(item.wakeb)"
              ><WakebIcon :icon="item.wakeb.icon" :size="16" :color="resolveItemColor(item.wakeb)"
            /></slot>
          </span>
          <span
            class="wakeb-pv-dropdown__label"
            :style="item.wakeb.color ? { color: resolveItemColor(item.wakeb) } : undefined"
          >
            <slot name="item-label" :item="item.wakeb" :text="labelFormatter(item.wakeb.label)"
              ><span>{{ labelFormatter(item.wakeb.label) }}</span></slot
            >
          </span>
        </a>
      </template>
    </Menu>
  </div>
</template>
<style lang="scss" scoped>
.dropdown-activator--colored {
  :deep(.btn p) {
    color: var(--wakeb-dropdown-activator-color);
  }
}
</style>
<style lang="scss">
/* The menu is teleported, so its rules cannot be scoped to this component's root. */
.wakeb-pv-dropdown .wakeb-pv-dropdown__item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}
.wakeb-pv-dropdown .wakeb-pv-dropdown__icon {
  display: inline-flex;
}
</style>

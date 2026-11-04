<script setup lang="ts">
import { VMenu } from "vuetify/components/VMenu";
import { VList, VListItem, VListItemTitle } from "vuetify/components/VList";
import { VIcon } from "vuetify/components/VIcon";
import { useVuetifyIcon } from "../core/icons";
import WButton from "./WButton.vue";
import { dropdownDefaults, useDropdown } from "../composables/dropdown";
import { useWakebContext } from "../core/runtime";
import type { DropdownProps, DropdownItem, NavigationKey, ButtonProps } from "../types";
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
const context = useWakebContext("WDropdown");
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
const toIcon = useVuetifyIcon();
</script>
<template>
  <div>
    <!-- Teleported content carries the configured theme and direction scope. -->
    <v-menu :disabled="disabled || isLoading" v-bind="context.scope" :z-index="context.zIndexOverlay">
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
                :icon="toIcon(item.icon)"
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

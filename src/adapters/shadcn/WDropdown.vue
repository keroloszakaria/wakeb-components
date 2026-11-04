<script setup lang="ts">
import { computed, mergeProps, ref, useId } from "vue";
import { DropdownMenuRoot } from "reka-ui";
import DropdownMenuContent from "./ui/DropdownMenuContent.vue";
import DropdownMenuItem from "./ui/DropdownMenuItem.vue";
import WButton from "./WButton.vue";
import WakebIcon from "../../icons/WakebIcon";
import { dropdownDefaults, useDropdown } from "../../composables/dropdown";
import { useWakebContext } from "../../core/runtime";
import { useProviderProps } from "../../core/provider-props";
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

/*
 * The primitive is Wakeb's copy of the shadcn-vue DropdownMenuContent (reka-ui). Mounting, the
 * anchor, Escape handling, focus return and the element type stay Wakeb-owned (SPEC R12, R18);
 * placement props such as side, align and sideOffset pass.
 */
const native = useProviderProps(context, () => props.providerProps, {
  component: "WDropdown",
  primitive: DropdownMenuContent,
  label: "DropdownMenuContent",
  owned: ["forceMount", "as", "asChild", "reference", "portal", "onEscapeKeyDown", "onCloseAutoFocus"],
});
const menuId = `wakeb-dropdown-${useId()}`;
const isActive = ref(false);
/* The element that opened the menu: the popper anchor and the focus-return target. */
const activator = ref<HTMLElement>();
let interactedOutside = false;
/*
 * Wakeb keeps the activator contract of the other providers: the slot receives these props and binds
 * them to its own element, so the menu is opened here rather than through reka-ui's trigger, whose
 * props would be merged into arbitrary slot markup.
 */
const activatorProps = computed(() => ({
  "aria-haspopup": "menu",
  "aria-expanded": String(isActive.value),
  "aria-controls": isActive.value ? menuId : undefined,
  onClick: (event: MouseEvent) => {
    if (props.disabled || props.isLoading) return;
    activator.value = event.currentTarget as HTMLElement;
    isActive.value = !isActive.value;
  },
}));
/* A press on the activator is not an outside dismissal; its click toggles the menu instead. */
const onInteractOutside = (event: Event) => {
  if (activator.value && event.target instanceof Node && activator.value.contains(event.target)) event.preventDefault();
  else interactedOutside = true;
};
/* reka-ui focuses its own trigger, which Wakeb does not render; return focus to the activator instead. */
const onCloseAutoFocus = (event: Event) => {
  event.preventDefault();
  if (!interactedOutside) activator.value?.focus({ preventScroll: true });
  interactedOutside = false;
};
/* Native props first; the theme scope and the stacking that teleported content needs still win. */
const menuBindings = computed(() =>
  mergeProps(native.value, context.scope, context.zIndexOverlay === undefined ? {} : { style: { zIndex: context.zIndexOverlay } }),
);
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
    <!-- reka-ui owns positioning, roving focus, typeahead, arrow keys and Escape; non-modal like the other providers. -->
    <DropdownMenuRoot v-model:open="isActive" :modal="false" :dir="context.direction === 'rtl' ? 'rtl' : undefined">
      <DropdownMenuContent
        v-bind="menuBindings"
        :id="menuId"
        class="wakeb-sc-dropdown"
        :style="menuStyle"
        :aria-label="labelFormatter(buttonTitle) || undefined"
        :reference="activator"
        @interact-outside="onInteractOutside"
        @close-auto-focus="onCloseAutoFocus"
      >
        <DropdownMenuItem
          v-for="(item, index) in menuItems"
          :key="String(item.value ?? index)"
          :as="isLinks ? 'a' : 'div'"
          :href="isLinks && !isItemDisabled(item) ? itemHref(item) : undefined"
          :disabled="isItemDisabled(item)"
          :text-value="labelFormatter(item.label)"
          class="wakeb-sc-dropdown__item"
          :class="{ 'list-item-active': isItemActive(item) }"
          @select="(event: Event) => onMenuItemClick(event, item)"
        >
          <span v-if="item.icon" class="wakeb-sc-dropdown__icon">
            <slot name="item-icon" :item="item" :color="resolveItemColor(item)"
              ><WakebIcon :icon="item.icon" :size="16" :color="resolveItemColor(item)"
            /></slot>
          </span>
          <span class="wakeb-sc-dropdown__label" :style="item.color ? { color: resolveItemColor(item) } : undefined">
            <slot name="item-label" :item="item" :text="labelFormatter(item.label)"
              ><span>{{ labelFormatter(item.label) }}</span></slot
            >
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
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
.wakeb-sc-dropdown .wakeb-sc-dropdown__item {
  font-weight: 500;
}
.wakeb-sc-dropdown .wakeb-sc-dropdown__item.list-item-active {
  background: var(--accent, color-mix(in srgb, currentColor 8%, transparent));
}
.wakeb-sc-dropdown .wakeb-sc-dropdown__icon {
  display: inline-flex;
}
.wakeb-sc-dropdown .wakeb-sc-dropdown__label {
  min-width: 0;
  overflow-wrap: anywhere;
}
</style>

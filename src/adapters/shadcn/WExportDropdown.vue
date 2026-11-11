<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { DropdownMenuPortal, DropdownMenuRoot } from "reka-ui";
import DropdownMenuContent from "./ui/DropdownMenuContent.vue";
import DropdownMenuItem from "./ui/DropdownMenuItem.vue";
import WButton from "./WButton.vue";
import WakebIcon from "../../icons/WakebIcon";
import { exportDropdownDefaults, useExportDropdown, EXPORT_ICON_PATH, FORMAT_ICON_PATH } from "../../composables/export-dropdown";
import { popoverPlacement } from "../../composables/popover";
import { useWakebContext } from "../../core/runtime";
import type { ExportDropdownProps, ExportFormat, ButtonProps } from "../../types";
/* Baseline attribute target: the teleported menu overlay, while open (attrs bind to the overlay wrapper). */
defineOptions({ name: "WExportDropdown", inheritAttrs: false });
const props = withDefaults(defineProps<ExportDropdownProps>(), exportDropdownDefaults);
const emit = defineEmits<{ select: [value: string] }>();
defineSlots<{
  activator?(props: {
    props: Record<string, unknown>;
    buttonProps: ButtonProps;
  }): unknown;
  "format-icon"?(props: { format: ExportFormat; index: number }): unknown;
  "format-label"?(props: { format: ExportFormat; index: number }): unknown;
}>();
const context = useWakebContext("WExportDropdown");
const { buttonProps, isFormatDisabled, select } = useExportDropdown(props, emit);
const menuId = `wakeb-export-${useId()}`;
const isActive = ref(false);
/* The element that opened the menu: the popper anchor and the focus-return target. */
const activator = ref<HTMLElement>();
let interactedOutside = false;
/*
 * The overlay wrapper carries the caller attrs and the theme scope, like the other providers' menu
 * roots, and exists only while the menu is open or playing its exit animation.
 */
const rendered = ref(false);
watch(isActive, (open) => open && (rendered.value = true), { flush: "sync" });
const onRowUnmounted = () => {
  if (!isActive.value) rendered.value = false;
};
watch(isActive, (open) => {
  if (!open && props.formats.length === 0) rendered.value = false;
});
/* Same activator contract as WDropdown: Wakeb opens the menu instead of reka-ui's trigger. */
const activatorProps = computed(() => ({
  ...context.scope,
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
/* Disabled rows never emit; reka-ui already skips them, and the shared rule guards custom paths. */
const onSelect = (event: Event, format: ExportFormat) => {
  if (isFormatDisabled(format)) {
    event.preventDefault();
    return;
  }
  select(format);
};
/* zIndexOverlay on the menu (reka-ui copies it to its popper wrapper); menuStyle comes last and wins. */
/* Unset location keeps reka-ui's placement; start and end are logical and follow the direction. */
const placement = computed(() => (props.location ? popoverPlacement(props.location) : undefined));
const menuStyle = computed(() => [context.zIndexOverlay === undefined ? undefined : { zIndex: context.zIndexOverlay }, props.menuStyle]);
</script>
<template>
  <slot name="activator" :props="activatorProps" :button-props="buttonProps()"
    ><WButton
      v-bind="{ ...activatorProps, ...buttonProps() }"
      :aria-label="title"
      :style="{ height: 'var(--wakeb-export-button-height, 44px)' }"
      ><template #icon
        ><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path :d="EXPORT_ICON_PATH" fill="none" stroke="currentColor" stroke-width="2" /></svg></template></WButton
  ></slot>
  <!-- reka-ui owns positioning, roving focus, typeahead, arrow keys, Enter/Space and Escape; non-modal like the other providers. -->
  <DropdownMenuRoot v-model:open="isActive" :modal="false" :dir="context.direction === 'rtl' ? 'rtl' : undefined">
    <DropdownMenuPortal>
      <div v-if="rendered" v-bind="$attrs" class="wakeb-sc-export">
        <DropdownMenuContent
          :id="menuId"
          :portal="false"
          :style="menuStyle"
          :aria-label="title || undefined"
          :reference="activator"
          :side="placement?.side"
          :align="placement?.align"
          :side-offset="offset"
          @interact-outside="onInteractOutside"
          @close-auto-focus="onCloseAutoFocus"
        >
          <DropdownMenuItem
            v-for="(format, index) in formats"
            :key="format.value"
            :disabled="isFormatDisabled(format)"
            :text-value="format.label"
            class="wakeb-sc-export__item"
            @select="(event: Event) => onSelect(event, format)"
            @vue:unmounted="onRowUnmounted"
          >
            <span class="wakeb-sc-export__icon">
              <slot name="format-icon" :format="format" :index="index"
                ><WakebIcon v-if="format.icon" :icon="format.icon" :size="16" /><svg v-else width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path :d="FORMAT_ICON_PATH" fill="none" stroke="currentColor" stroke-width="1.5" /></svg
              ></slot>
            </span>
            <span class="wakeb-export-label"
              ><slot name="format-label" :format="format" :index="index">{{ format.label }}</slot></span
            >
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
<style lang="scss">
/* The menu is teleported, so its rules cannot be scoped to this component's root. */
.wakeb-sc-export .wakeb-sc-export__item {
  gap: 8px;
}
.wakeb-sc-export .wakeb-sc-export__icon {
  display: inline-flex;
}
.wakeb-sc-export .wakeb-export-label {
  font-size: 14px;
}
</style>

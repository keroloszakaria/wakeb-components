<script setup lang="ts">
import { computed, ref, useId } from "vue";
import Menu from "primevue/menu";
import WButton from "./WButton.vue";
import WakebIcon from "../../icons/WakebIcon";
import { exportDropdownDefaults, useExportDropdown, EXPORT_ICON_PATH, FORMAT_ICON_PATH } from "../../composables/export-dropdown";
import { useWakebContext } from "../../core/runtime";
import type { ExportDropdownProps, ExportFormat, ButtonProps } from "../../types";
/* Baseline attribute target: the teleported menu overlay, while open (attrs bind to the Menu root). */
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
const menu = ref<InstanceType<typeof Menu>>();
const menuId = `wakeb-export-${useId()}`;
const isActive = ref(false);
/* PrimeVue owns positioning, focus, arrow/Escape keys and outside clicks; Wakeb keeps the records. */
const model = computed(() =>
  props.formats.map((format, index) => ({ key: format.value, label: format.label, disabled: isFormatDisabled(format), wakeb: format, index })),
);
/* menuStyle targets the role="menu" list, inside the overlay that carries the theme scope, so it wins. */
const pt = computed(() => (props.menuStyle ? { list: { style: props.menuStyle } } : undefined));
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
const onItemClick = (event: MouseEvent, format: ExportFormat) => {
  if (isFormatDisabled(format)) event.preventDefault();
  select(format);
};
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
  <Menu
    :id="menuId"
    ref="menu"
    :model="model"
    popup
    class="wakeb-pv-export"
    v-bind="$attrs"
    :pt="pt"
    :style="context.zIndexOverlay === undefined ? undefined : { zIndex: context.zIndexOverlay }"
    :auto-z-index="context.zIndexOverlay === undefined"
    @hide="isActive = false"
  >
    <template #item="{ item, props: itemProps }">
      <!-- An anchor without href: PrimeVue's Enter/Space handler clicks a[data-pc-section=itemlink]. -->
      <a v-bind="itemProps.action" class="wakeb-pv-export__item" @click="(event: MouseEvent) => onItemClick(event, item.wakeb)">
        <span class="wakeb-pv-export__icon">
          <slot name="format-icon" :format="item.wakeb" :index="item.index"
            ><WakebIcon v-if="item.wakeb.icon" :icon="item.wakeb.icon" :size="16" /><svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path :d="FORMAT_ICON_PATH" fill="none" stroke="currentColor" stroke-width="1.5" /></svg
          ></slot>
        </span>
        <span class="wakeb-export-label"
          ><slot name="format-label" :format="item.wakeb" :index="item.index">{{ item.wakeb.label }}</slot></span
        >
      </a>
    </template>
  </Menu>
</template>
<style lang="scss">
/* The menu is teleported, so its rules cannot be scoped to this component's root. */
.wakeb-pv-export .wakeb-pv-export__item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
}
.wakeb-pv-export .wakeb-pv-export__icon {
  display: inline-flex;
}
.wakeb-pv-export .wakeb-export-label {
  font-size: 14px;
}
</style>

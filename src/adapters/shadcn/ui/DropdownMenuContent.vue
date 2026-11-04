<!--
  Adapted from shadcn-vue 2.9.0, apps/v4/registry/new-york-v4/ui/dropdown-menu/DropdownMenuContent.vue
  (MIT License, Copyright (c) 2023 unovue). See THIRD-PARTY-NOTICES.txt.
  Wakeb changes: Tailwind and tw-animate-css classes are replaced by the precompiled
  `wakeb-sc-dropdown-menu` rules below; cn() and reactiveOmit are not needed; `portal: false` lets
  a caller teleport the content inside its own overlay wrapper.
-->
<script setup lang="ts">
import type { DropdownMenuContentEmits, DropdownMenuContentProps } from "reka-ui";
import { computed } from "vue";
import { DropdownMenuContent, DropdownMenuPortal, useForwardPropsEmits } from "reka-ui";
import Passthrough from "./Passthrough";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DropdownMenuContentProps & { portal?: boolean }>(), { sideOffset: 4, portal: true });
const emits = defineEmits<DropdownMenuContentEmits>();
const delegated = computed(() => {
  const { portal: _portal, ...rest } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);
</script>

<template>
  <component :is="portal ? DropdownMenuPortal : Passthrough">
    <DropdownMenuContent data-slot="dropdown-menu-content" v-bind="{ ...$attrs, ...forwarded }" class="wakeb-sc-dropdown-menu">
      <slot />
    </DropdownMenuContent>
  </component>
</template>

<style>
/* Teleported to the body: namespaced global rules, no reset (SPEC R11, R17). */
.wakeb-sc-dropdown-menu {
  z-index: 50;
  box-sizing: border-box;
  min-width: 8rem;
  max-height: var(--reka-dropdown-menu-content-available-height);
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid var(--wakeb-ui-border, var(--border, #e5e5e5));
  border-radius: calc(var(--wakeb-ui-radius, var(--radius, 0.625rem)) - 2px);
  padding: 0.25rem;
  background: var(--wakeb-ui-surface, var(--popover, #fff));
  color: var(--wakeb-ui-on-surface, var(--popover-foreground, #0a0a0a));
  font-family: var(--wakeb-ui-font-family, inherit);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transform-origin: var(--reka-dropdown-menu-content-transform-origin);
  animation: wakeb-sc-menu-in 150ms ease-out;
}
.wakeb-sc-dropdown-menu:focus {
  outline: none;
}
.wakeb-sc-dropdown-menu[data-state="closed"] {
  animation: wakeb-sc-menu-out 150ms ease-in forwards;
}
@keyframes wakeb-sc-menu-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
}
@keyframes wakeb-sc-menu-out {
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
@media (prefers-reduced-motion: reduce) {
  .wakeb-sc-dropdown-menu,
  .wakeb-sc-dropdown-menu[data-state="closed"] {
    animation: none;
  }
}
</style>

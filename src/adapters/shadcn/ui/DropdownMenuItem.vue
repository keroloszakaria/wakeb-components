<!--
  Adapted from shadcn-vue 2.9.0, apps/v4/registry/new-york-v4/ui/dropdown-menu/DropdownMenuItem.vue
  (MIT License, Copyright (c) 2023 unovue). See THIRD-PARTY-NOTICES.txt.
  Wakeb changes: Tailwind classes are replaced by the precompiled `wakeb-sc-dropdown-menu__item`
  rules below; cn() and reactiveOmit are replaced by a computed copy of the forwarded props.
-->
<script setup lang="ts">
import { computed } from "vue";
import type { DropdownMenuItemEmits, DropdownMenuItemProps } from "reka-ui";
import { DropdownMenuItem, useForwardPropsEmits } from "reka-ui";

const props = withDefaults(defineProps<DropdownMenuItemProps & { inset?: boolean; variant?: "default" | "destructive" }>(), {
  variant: "default",
});
const emits = defineEmits<DropdownMenuItemEmits>();
const delegated = computed(() => {
  const { inset: _inset, variant: _variant, ...rest } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);
</script>

<template>
  <DropdownMenuItem
    data-slot="dropdown-menu-item"
    :data-inset="inset ? '' : undefined"
    :data-variant="variant"
    v-bind="forwarded"
    class="wakeb-sc-dropdown-menu__item"
  >
    <slot />
  </DropdownMenuItem>
</template>

<style>
.wakeb-sc-dropdown-menu__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: calc(var(--wakeb-ui-radius, var(--radius, 0.625rem)) - 4px);
  padding: 0.375rem 0.5rem;
  color: inherit;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-decoration: none;
  cursor: default;
  outline: none;
  user-select: none;
}
.wakeb-sc-dropdown-menu__item[data-highlighted],
.wakeb-sc-dropdown-menu__item:focus-visible {
  background: var(--accent, color-mix(in srgb, currentColor 8%, transparent));
  color: var(--accent-foreground, inherit);
}
.wakeb-sc-dropdown-menu__item[data-disabled] {
  pointer-events: none;
  opacity: 0.5;
}
.wakeb-sc-dropdown-menu__item[data-inset] {
  padding-inline-start: 2rem;
}
.wakeb-sc-dropdown-menu__item[data-variant="destructive"] {
  color: var(--destructive, #e7000b);
}
.wakeb-sc-dropdown-menu__item svg {
  flex-shrink: 0;
  pointer-events: none;
}
</style>

<!--
  Adapted from shadcn-vue 2.9.0, apps/v4/registry/new-york-v4/ui/popover/PopoverContent.vue (MIT
  License, Copyright (c) 2023 unovue). See THIRD-PARTY-NOTICES.txt.
  Wakeb changes: Tailwind and tw-animate-css classes are replaced by the precompiled `wakeb-sc-popover`
  rules below; cn() and reactiveOmit are not needed because the class is static.
-->
<script setup lang="ts">
import type { PopoverContentEmits, PopoverContentProps } from "reka-ui";
import { PopoverContent, PopoverPortal, useForwardPropsEmits } from "reka-ui";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<PopoverContentProps>(), { align: "center", sideOffset: 4 });
const emits = defineEmits<PopoverContentEmits>();
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <PopoverPortal>
    <PopoverContent data-slot="popover-content" v-bind="{ ...forwarded, ...$attrs }" class="wakeb-sc-popover">
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>

<style>
/* Teleported to the body: namespaced global rules, no reset (SPEC R11, R17). */
.wakeb-sc-popover {
  z-index: 50;
  width: 18rem;
  box-sizing: border-box;
  border: 1px solid var(--wakeb-ui-border, var(--border, #e5e5e5));
  border-radius: var(--wakeb-ui-radius, var(--radius, 0.625rem));
  padding: 1rem;
  background: var(--wakeb-ui-surface, var(--popover, #fff));
  color: var(--wakeb-ui-on-surface, var(--popover-foreground, #0a0a0a));
  font-family: var(--wakeb-ui-font-family, inherit);
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  outline: none;
  transform-origin: var(--reka-popover-content-transform-origin);
  animation: wakeb-sc-popover-in 150ms ease-out;
}
.wakeb-sc-popover[data-state="closed"] {
  animation: wakeb-sc-popover-out 150ms ease-in forwards;
}
@keyframes wakeb-sc-popover-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
}
@keyframes wakeb-sc-popover-out {
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
@media (prefers-reduced-motion: reduce) {
  .wakeb-sc-popover,
  .wakeb-sc-popover[data-state="closed"] {
    animation: none;
  }
}
</style>

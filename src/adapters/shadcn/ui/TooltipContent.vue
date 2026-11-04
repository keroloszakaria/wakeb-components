<!--
  Adapted from shadcn-vue 2.9.0, apps/v4/registry/new-york-v4/ui/tooltip/TooltipContent.vue (MIT
  License, Copyright (c) 2023 unovue). See THIRD-PARTY-NOTICES.txt.
  Wakeb changes: Tailwind and tw-animate-css classes are replaced by the precompiled `wakeb-sc-tooltip`
  rules below; cn() and reactiveOmit are not needed because the class is static.
-->
<script setup lang="ts">
import type { TooltipContentEmits, TooltipContentProps } from "reka-ui";
import { TooltipArrow, TooltipContent, TooltipPortal, useForwardPropsEmits } from "reka-ui";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<TooltipContentProps>(), { sideOffset: 4 });
const emits = defineEmits<TooltipContentEmits>();
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <TooltipPortal>
    <TooltipContent data-slot="tooltip-content" v-bind="{ ...forwarded, ...$attrs }" class="wakeb-sc-tooltip">
      <slot />
      <TooltipArrow class="wakeb-sc-tooltip__arrow" :width="10" :height="5" />
    </TooltipContent>
  </TooltipPortal>
</template>

<style>
/* Teleported to the body: namespaced global rules, no reset (SPEC R11, R17). */
.wakeb-sc-tooltip {
  z-index: 50;
  width: fit-content;
  max-width: var(--reka-tooltip-content-available-width);
  border-radius: calc(var(--wakeb-ui-radius, var(--radius, 0.625rem)) - 2px);
  padding: 0.375rem 0.75rem;
  background: var(--wakeb-ui-on-surface, var(--foreground, #171717));
  color: var(--wakeb-ui-surface, var(--background, #fff));
  font-family: var(--wakeb-ui-font-family, inherit);
  font-size: 0.75rem;
  line-height: 1rem;
  text-wrap: balance;
  transform-origin: var(--reka-tooltip-content-transform-origin);
  animation: wakeb-sc-pop-in 150ms ease-out;
}
.wakeb-sc-tooltip[data-state="closed"] {
  animation: wakeb-sc-pop-out 150ms ease-in forwards;
}
.wakeb-sc-tooltip__arrow {
  fill: var(--wakeb-ui-on-surface, var(--foreground, #171717));
}
@keyframes wakeb-sc-pop-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
}
@keyframes wakeb-sc-pop-out {
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
@media (prefers-reduced-motion: reduce) {
  .wakeb-sc-tooltip,
  .wakeb-sc-tooltip[data-state="closed"] {
    animation: none;
  }
}
</style>

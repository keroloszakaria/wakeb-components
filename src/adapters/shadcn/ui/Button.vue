<!--
  Adapted from shadcn-vue 2.9.0, apps/v4/registry/new-york-v4/ui/button (MIT License,
  Copyright (c) 2023 unovue). See THIRD-PARTY-NOTICES.txt.
  Wakeb changes: the class-variance-authority/Tailwind classes are replaced by the precompiled
  `wakeb-sc-button` rules below, so no cn(), cva or Tailwind runtime is needed. `variant` and `size`
  keep their shadcn-vue names and values; they apply only when set, because WButton paints its
  portable `type` and `size` with Wakeb token CSS (SPEC R23).
-->
<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui";
import { Primitive } from "reka-ui";

export type ShadcnButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
export type ShadcnButtonSize = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";

interface Props extends PrimitiveProps {
  variant?: ShadcnButtonVariant;
  size?: ShadcnButtonSize;
}

withDefaults(defineProps<Props>(), { as: "button" });
</script>

<template>
  <Primitive data-slot="button" :data-variant="variant" :data-size="size" :as="as" :as-child="asChild" class="wakeb-sc-button">
    <slot />
  </Primitive>
</template>

<style>
/*
 * shadcn-vue's own variants, reached only through providerProps (nonportable). The class is repeated
 * so a native variant wins over the Wakeb type rules, which carry a scoped attribute and :not() states.
 */
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant] {
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: calc(var(--wakeb-ui-radius, var(--radius, 0.625rem)) - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: none;
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant="default"] {
  background: var(--primary, #171717);
  color: var(--primary-foreground, #fafafa);
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant="destructive"] {
  background: var(--destructive, #e7000b);
  color: #fff;
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant="outline"] {
  border-color: var(--border, #e5e5e5);
  background: var(--background, #fff);
  color: var(--foreground, #0a0a0a);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant="secondary"] {
  background: var(--secondary, #f5f5f5);
  color: var(--secondary-foreground, #171717);
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant="ghost"] {
  background: transparent;
  color: inherit;
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant="link"] {
  background: transparent;
  color: var(--primary, #171717);
  text-underline-offset: 4px;
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant="default"]:hover:not(:disabled) {
  background: color-mix(in oklab, var(--primary, #171717) 90%, transparent);
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant="destructive"]:hover:not(:disabled) {
  background: color-mix(in oklab, var(--destructive, #e7000b) 90%, transparent);
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant="secondary"]:hover:not(:disabled) {
  background: color-mix(in oklab, var(--secondary, #f5f5f5) 80%, transparent);
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button:is([data-variant="outline"], [data-variant="ghost"]):hover:not(:disabled) {
  background: var(--accent, #f5f5f5);
  color: var(--accent-foreground, #171717);
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant="link"]:hover:not(:disabled) {
  background: transparent;
  text-decoration: underline;
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant]:focus-visible {
  outline: 3px solid color-mix(in oklab, var(--wakeb-ui-focus, var(--ring, #a1a1a1)) 50%, transparent);
  outline-offset: 0;
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-variant]:disabled {
  opacity: 0.5;
  pointer-events: none;
}
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-size="default"] { height: 2.25rem; padding: 0.5rem 1rem; }
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-size="xs"] { height: 1.5rem; gap: 0.25rem; padding: 0 0.5rem; font-size: 0.75rem; }
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-size="sm"] { height: 2rem; gap: 0.375rem; padding: 0 0.75rem; }
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-size="lg"] { height: 2.5rem; padding: 0 1.5rem; }
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-size="icon"] { width: 2.25rem; height: 2.25rem; padding: 0; }
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-size="icon-xs"] { width: 1.5rem; height: 1.5rem; padding: 0; }
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-size="icon-sm"] { width: 2rem; height: 2rem; padding: 0; }
.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button.wakeb-sc-button[data-size="icon-lg"] { width: 2.5rem; height: 2.5rem; padding: 0; }
</style>

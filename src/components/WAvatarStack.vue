<script setup lang="ts">
import { computed } from "vue";
import { VAvatar } from "vuetify/components/VAvatar";
import { VTooltip } from "vuetify/components/VTooltip";
import { VMenu } from "vuetify/components/VMenu";
import { VList, VListItem, VListItemTitle } from "vuetify/components/VList";
import type { AvatarStackProps } from "../types";
const props = withDefaults(defineProps<AvatarStackProps>(), { items: () => [], max: 3, size: 32, avatarColor: "primary", showOverflowMenu: false, showTooltip: true, itemKey: "id", nameKey: "name", avatarKey: "avatar", unknownLabel: "Unknown user", overflowLabel: "", menuStyle: () => ({}), tooltipStyle: () => ({}) });
defineSlots<{ avatar(props: { item: unknown; index: number; label: string; avatar: string; initials: string }): unknown; overflow(props: { count: number }): unknown }>();
const count = computed(() => Number.isFinite(props.max) ? Math.max(0, Math.floor(props.max)) : 3);
const items = computed(() => Array.isArray(props.items) ? props.items : []);
const visibleItems = computed(() => items.value.slice(0, count.value));
const overflowItems = computed(() => items.value.slice(count.value));
const overflowCount = computed(() => overflowItems.value.length);
const overflowName = computed(() => props.overflowLabel || `+${overflowCount.value}`);
function field(item: unknown, path: string): unknown { return path.split(".").reduce<unknown>((value, key) => value != null && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, key) ? (value as Record<string, unknown>)[key] : undefined, item); }
const getName = (item: unknown) => { const value = field(item, props.nameKey); return typeof value === "string" && value.trim() ? value : props.unknownLabel; };
const getAvatar = (item: unknown) => { const value = field(item, props.avatarKey); return typeof value === "string" && (value.startsWith("http") || value.startsWith("/") || value.startsWith("data:")) ? value : ""; };
const getKey = (item: unknown, index: number) => { const value = field(item, props.itemKey); return typeof value === "string" || typeof value === "number" ? value : index; };
const initials = (item: unknown) => { const value = field(item, props.nameKey); if (typeof value !== "string" || !value.trim() || value === "—") return "?"; return value.trim().split(/\s+/).slice(0, 2).map(word => Array.from(word)[0]).join("").toUpperCase(); };
</script>
<template>
  <div class="avatars-stack">
    <VTooltip v-for="(item, index) in visibleItems" :key="getKey(item, index)" :text="getName(item)" :disabled="!showTooltip" location="top" :content-props="{ style: tooltipStyle }">
      <template #activator="{ props: tooltipProps }">
        <div v-bind="tooltipProps" :tabindex="showTooltip ? 0 : undefined" role="img" :aria-label="getName(item)">
          <slot name="avatar" :item="item" :index="index" :label="getName(item)" :avatar="getAvatar(item)" :initials="initials(item)">
            <VAvatar v-if="getAvatar(item)" color="primary" :image="getAvatar(item)" :size="size" class="actor-avatar" aria-hidden="true" />
            <VAvatar v-else :size="size" :color="avatarColor" class="actor-avatar" aria-hidden="true">{{ initials(item) }}</VAvatar>
          </slot>
        </div>
      </template>
    </VTooltip>
    <VMenu v-if="overflowCount > 0 && showOverflowMenu" open-on-hover location="top" :offset="8">
      <template #activator="{ props: menuProps }">
        <VAvatar v-bind="menuProps" tag="button" type="button" :size="size" :color="avatarColor" class="actor-avatar actor-overflow" :aria-label="overflowName"><span class="actor-initials"><slot name="overflow" :count="overflowCount">+{{ overflowCount }}</slot></span></VAvatar>
      </template>
      <VList class="overflow-menu-list py-1" :style="menuStyle">
        <VListItem v-for="(item, index) in overflowItems" :key="getKey(item, index)" class="overflow-menu-item" density="compact">
          <template #prepend><VAvatar v-if="getAvatar(item)" :image="getAvatar(item)" :size="24" class="overflow-menu-avatar" aria-hidden="true" /><VAvatar v-else :color="avatarColor" :size="24" class="overflow-menu-avatar" aria-hidden="true"><span class="overflow-menu-initials">{{ initials(item) }}</span></VAvatar></template>
          <VListItemTitle class="overflow-menu-name">{{ getName(item) }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
    <VAvatar v-else-if="overflowCount > 0" :size="size" :color="avatarColor" class="actor-avatar actor-overflow" role="img" :aria-label="overflowName"><span class="actor-initials"><slot name="overflow" :count="overflowCount">+{{ overflowCount }}</slot></span></VAvatar>
  </div>
</template>
<style scoped lang="scss">
.avatars-stack { display:flex; align-items:center;
  > :not(:first-child) { margin-inline-start:var(--wakeb-avatar-overlap, -10px); }
  .actor-avatar { border:2px solid var(--wakeb-avatar-border, rgb(var(--v-theme-surface, 255, 255, 255))); font-size:.6875rem; font-weight:600; }
  .actor-initials { font-size:.6875rem; font-weight:600; line-height:1; }
  > div:focus-visible, button:focus-visible { outline:2px solid var(--wakeb-avatar-focus, rgb(var(--v-theme-primary, 8, 127, 140))); outline-offset:2px; }
}
.overflow-menu-list { background:var(--wakeb-avatar-menu-surface, rgb(var(--v-theme-surface, 255, 255, 255))) !important; min-width:200px; }
.overflow-menu-item { padding-inline:.625rem !important; }
.overflow-menu-avatar { margin-inline-end:.5rem; }
.overflow-menu-name { color:var(--wakeb-avatar-menu-text, rgb(var(--v-theme-on-surface, 16, 24, 40))); font-size:.75rem; font-weight:600; }
.overflow-menu-initials { font-size:.625rem; font-weight:600; line-height:1; }
</style>

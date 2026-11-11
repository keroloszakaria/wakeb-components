<script setup lang="ts">
import { VList, VListItem } from "vuetify/components/VList";
import { VIcon } from "vuetify/components/VIcon";
import { listDefaults, listKey } from "../composables/elements";
import { useVuetifyIcon } from "../core/icons";
import { useWakebContext } from "../core/runtime";
import type { ListItem, ListProps } from "../types";
defineOptions({ name: "WList" });
const props = withDefaults(defineProps<ListProps>(), listDefaults);
const emit = defineEmits<{ select: [item: ListItem] }>();
defineSlots<{ item?(props: { item: ListItem; index: number }): unknown; prepend?(props: { item: ListItem; index: number }): unknown }>();
useWakebContext("WList");
const toIcon = useVuetifyIcon();
const select = (item: ListItem) => {
  if (props.interactive && !item.disabled) emit("select", item);
};
</script>
<template>
  <!-- VList is role=list with listitem rows; interactive rows are clickable and use Vuetify's arrow-key focus. -->
  <VList class="wakeb-list" :density="density" :aria-label="ariaLabel">
    <VListItem
      v-for="(item, index) in items"
      :key="listKey(item, index)"
      class="wakeb-list__item"
      :title="$slots.item ? undefined : item.title"
      :subtitle="$slots.item ? undefined : item.subtitle"
      :disabled="item.disabled"
      :aria-disabled="item.disabled || undefined"
      v-on="interactive ? { click: () => select(item) } : {}"
    >
      <template v-if="$slots.prepend || item.icon" #prepend>
        <slot name="prepend" :item="item" :index="index"><VIcon :icon="toIcon(item.icon)" size="20" class="wakeb-list__icon" /></slot>
      </template>
      <slot name="item" :item="item" :index="index" />
    </VListItem>
  </VList>
</template>
<style>
.wakeb-list .wakeb-list__icon {
  margin-inline-end: 12px;
}
</style>

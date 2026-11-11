<script setup lang="ts">
import WakebIcon from "../../icons/WakebIcon";
import { listDefaults, listKey } from "../../composables/elements";
import { useWakebContext } from "../../core/runtime";
import type { ListItem, ListProps } from "../../types";
defineOptions({ name: "WList" });
const props = withDefaults(defineProps<ListProps>(), listDefaults);
const emit = defineEmits<{ select: [item: ListItem] }>();
defineSlots<{ item?(props: { item: ListItem; index: number }): unknown; prepend?(props: { item: ListItem; index: number }): unknown }>();
useWakebContext("WList");
const select = (item: ListItem) => {
  if (props.interactive && !item.disabled) emit("select", item);
};
</script>
<template>
  <!-- A native list; interactive rows are buttons inside the list items. -->
  <ul class="wakeb-list wakeb-list-native" :class="density && `wakeb-list--${density}`" role="list" :aria-label="ariaLabel">
    <li v-for="(item, index) in items" :key="listKey(item, index)" class="wakeb-list__item">
      <component
        :is="interactive ? 'button' : 'div'"
        class="wakeb-list__row"
        :type="interactive ? 'button' : undefined"
        :disabled="interactive && item.disabled ? true : undefined"
        :aria-disabled="!interactive && item.disabled ? 'true' : undefined"
        @click="select(item)"
      >
        <span v-if="$slots.prepend || item.icon" class="wakeb-list__icon">
          <slot name="prepend" :item="item" :index="index"><WakebIcon v-if="item.icon" :icon="item.icon" :size="20" /></slot>
        </span>
        <slot name="item" :item="item" :index="index">
          <span class="wakeb-list__text">
            <span class="wakeb-list__title">{{ item.title }}</span>
            <span v-if="item.subtitle" class="wakeb-list__subtitle">{{ item.subtitle }}</span>
          </span>
        </slot>
      </component>
    </li>
  </ul>
</template>
<style lang="scss">
@use "../../styles/list";
</style>

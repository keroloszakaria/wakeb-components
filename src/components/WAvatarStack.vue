<script setup lang="ts">
import { computed } from "vue";
import { VAvatar } from "vuetify/components/VAvatar";
import { VTooltip } from "vuetify/components/VTooltip";
import { VMenu } from "vuetify/components/VMenu";
import { VList, VListItem, VListItemTitle } from "vuetify/components/VList";
import type { AvatarStackProps } from "../types";
import { VUETIFY_INTENTS, useColor, vuetifyFill } from "../core/vocabulary";
import { avatarStackDefaults, useAvatarStack } from "../composables/avatar-stack";
import { useWakebContext } from "../core/runtime";
const props = withDefaults(defineProps<AvatarStackProps>(), avatarStackDefaults);
const toColor = useColor("WAvatarStack", VUETIFY_INTENTS, true);
const context = useWakebContext("WAvatarStack");
const fill = computed(() => vuetifyFill(toColor(props.avatarColor, "avatarColor", "primary"), "var(--wakeb-avatar-text, var(--wakeb-ui-on-primary, #fff))"));
defineSlots<{ avatar(props: { item: unknown; index: number; label: string; avatar: string; initials: string }): unknown; overflow(props: { count: number }): unknown }>();
const { visibleItems, overflowItems, overflowCount, overflowName, getName, getAvatar, getKey, initials } = useAvatarStack(props);
</script>
<template>
  <div class="avatars-stack">
    <VTooltip v-for="(item, index) in visibleItems" :key="getKey(item, index)" :text="getName(item)" :disabled="!showTooltip" location="top" v-bind="context.scope" :z-index="context.zIndexOverlay" :content-props="{ style: tooltipStyle }">
      <template #activator="{ props: tooltipProps }">
        <div v-bind="tooltipProps" :tabindex="showTooltip ? 0 : undefined" role="img" :aria-label="getName(item)">
          <slot name="avatar" :item="item" :index="index" :label="getName(item)" :avatar="getAvatar(item)" :initials="initials(item)">
            <VAvatar v-if="getAvatar(item)" v-bind="fill" :image="getAvatar(item)" :size="size" class="actor-avatar" aria-hidden="true" />
            <VAvatar v-else :size="size" v-bind="fill" class="actor-avatar" aria-hidden="true">{{ initials(item) }}</VAvatar>
          </slot>
        </div>
      </template>
    </VTooltip>
    <VMenu v-if="overflowCount > 0 && showOverflowMenu" open-on-hover location="top" :offset="8" v-bind="context.scope" :z-index="context.zIndexOverlay">
      <template #activator="{ props: menuProps }">
        <VAvatar v-bind="{ ...menuProps, 'aria-haspopup': undefined, ...fill }" tag="button" type="button" :size="size" class="actor-avatar actor-overflow" :aria-label="overflowName"><span class="actor-initials"><slot name="overflow" :count="overflowCount">+{{ overflowCount }}</slot></span></VAvatar>
      </template>
      <VList class="overflow-menu-list py-1" :style="menuStyle">
        <VListItem v-for="(item, index) in overflowItems" :key="getKey(item, index)" class="overflow-menu-item" density="compact">
          <template #prepend><VAvatar v-if="getAvatar(item)" :image="getAvatar(item)" :size="24" class="overflow-menu-avatar" aria-hidden="true" /><VAvatar v-else v-bind="fill" :size="24" class="overflow-menu-avatar" aria-hidden="true"><span class="overflow-menu-initials">{{ initials(item) }}</span></VAvatar></template>
          <VListItemTitle class="overflow-menu-name">{{ getName(item) }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
    <VAvatar v-else-if="overflowCount > 0" :size="size" v-bind="fill" class="actor-avatar actor-overflow" role="img" :aria-label="overflowName"><span class="actor-initials"><slot name="overflow" :count="overflowCount">+{{ overflowCount }}</slot></span></VAvatar>
  </div>
</template>
<style scoped lang="scss">
@use "../styles/avatar-stack";
</style>

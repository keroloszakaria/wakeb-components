<script setup lang="ts">
import { useWakebContext } from "../core/runtime";
import { VMenu } from "vuetify/components/VMenu";
import { VList, VListItem } from "vuetify/components/VList";
import { VIcon } from "vuetify/components/VIcon";
import { useVuetifyIcon } from "../core/icons";
import { badgeStackDefaults, useBadgeStack } from "../composables/badge-stack";
import WBadge from "./WBadge.vue";
import type {
  BadgeStackProps,
  BadgeStackItem,
  BadgeStackIconSlotProps,
  SharedIcon,
} from "../types";
const props = withDefaults(defineProps<BadgeStackProps>(), badgeStackDefaults);
defineSlots<{
  icon?(props: BadgeStackIconSlotProps): unknown;
  badgeIcon?(props: {
    item: BadgeStackItem;
    icon: SharedIcon | undefined;
    size: string | number;
  }): unknown;
  label?(props: {
    item: BadgeStackItem;
    text: string;
    overflow: boolean;
  }): unknown;
}>();
const context = useWakebContext("WBadgeStack");
const { stackVariant, visibleItems, overflowItems, overflowCount, iconWrapStyle, resolveBadgeProps, truncate } = useBadgeStack(props);
const toIcon = useVuetifyIcon();
</script>
<template>
  <div
    class="badge-stack"
    :class="{ 'badge-stack--circle-icon': iconVariant === 'circle' }"
  >
    <WBadge
      v-for="(item, index) in visibleItems"
      :key="item.id ?? index"
      v-bind="{ ...resolveBadgeProps(item), ...badgeAttrs }"
      ><template #icon>
        <slot
          v-if="item.icon"
          name="icon"
          :item="item"
          :index="index"
          :overflow="false"
          :variant="iconVariant"
          :style="iconWrapStyle(item)"
        >
          <span
            v-if="iconVariant === 'circle'"
            class="badge-stack__icon-wrap"
            :style="iconWrapStyle(item)"
            ><img class="badge-stack__icon" :src="item.icon" alt=""
          /></span>
          <img v-else class="badge-stack__icon" :src="item.icon" alt="" />
        </slot>
        <slot
          v-else
          name="badgeIcon"
          :item="item"
          :icon="item.badgeIcon"
          :size="item.iconSize ?? iconSize"
          ><VIcon
            v-if="item.badgeIcon"
            class="icon"
            :icon="toIcon(item.badgeIcon)"
            :size="
              (
                { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 } as Record<
                  string,
                  number
                >
              )[String(item.iconSize ?? iconSize)] ??
              item.iconSize ??
              iconSize
            "
        /></slot>
      </template>
      <span
        ><slot
          name="label"
          :item="item"
          :text="truncate(item.label)"
          :overflow="false"
          >{{ truncate(item.label) }}</slot
        ></span
      ></WBadge
    >
    <VMenu
      v-if="overflowCount > 0 && showOverflowMenu"
      open-on-hover
      :open-on-click="overflowTag === 'button'"
      :open-on-focus="overflowTag === 'button' ? false : undefined"
      location="top"
      :offset="8"
      v-bind="context.scope" :z-index="context.zIndexOverlay"
    >
      <template #activator="{ props: menuProps }">
        <component
          :is="overflowTag"
          v-bind="{ ...menuProps, 'aria-haspopup': undefined }"
          class="badge-stack__overflow-activator"
          :type="overflowTag === 'button' ? 'button' : undefined"
          :aria-label="overflowLabel || `+${overflowCount}`"
        >
          <WBadge
            v-bind="badgeAttrs"
            :label="`+${overflowCount}`"
            :type="badgeType"
            :variant="stackVariant"
            :border-radius="badgeBorderRadius"
            :custom-border-radius="customOverflowBorderRadius"
            class-list="badge-stack__overflow"
          />
        </component>
      </template>
      <VList
        class="overflow-menu-list py-1"
        :class="{ 'badge-stack--circle-icon': iconVariant === 'circle' }"
        :style="menuStyle"
      >
        <VListItem
          v-for="(item, index) in overflowItems"
          :key="item.id ?? index"
          class="overflow-menu-item"
          density="compact"
        >
          <WBadge v-bind="{ ...resolveBadgeProps(item), ...badgeAttrs }"
            ><template #icon>
              <slot
                v-if="item.icon"
                name="icon"
                :item="item"
                :index="index"
                :overflow="true"
                :variant="iconVariant"
                :style="iconWrapStyle(item)"
              >
                <span
                  v-if="iconVariant === 'circle'"
                  class="badge-stack__icon-wrap"
                  :style="iconWrapStyle(item)"
                  ><img class="badge-stack__icon" :src="item.icon" alt=""
                /></span>
                <img v-else class="badge-stack__icon" :src="item.icon" alt="" />
              </slot>
              <slot
                v-else
                name="badgeIcon"
                :item="item"
                :icon="item.badgeIcon"
                :size="item.iconSize ?? iconSize"
                ><VIcon
                  v-if="item.badgeIcon"
                  class="icon"
                  :icon="toIcon(item.badgeIcon)"
                  :size="
                    (
                      { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 } as Record<
                        string,
                        number
                      >
                    )[String(item.iconSize ?? iconSize)] ??
                    item.iconSize ??
                    iconSize
                  "
              /></slot>
            </template>
            <span
              ><slot
                name="label"
                :item="item"
                :text="item.label || ''"
                :overflow="true"
                >{{ item.label || "" }}</slot
              ></span
            ></WBadge
          >
        </VListItem>
      </VList>
    </VMenu>
    <WBadge
      v-else-if="overflowCount > 0"
      v-bind="badgeAttrs"
      :label="`+${overflowCount}`"
      :type="badgeType"
      :variant="stackVariant"
      :border-radius="badgeBorderRadius"
      :custom-border-radius="customBorderRadius"
      class-list="badge-stack__overflow"
    />
  </div>
</template>
<style lang="scss" scoped>
@use "../styles/badge-stack";
</style>

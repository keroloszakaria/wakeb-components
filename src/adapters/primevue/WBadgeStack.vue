<script setup lang="ts">
import { computed, useId } from "vue";
import Popover from "primevue/popover";
import WakebIcon from "../../icons/WakebIcon";
import { useWakebContext } from "../../core/runtime";
import { badgeStackDefaults, useBadgeStack } from "../../composables/badge-stack";
import { useOverflowPopup } from "./overlay";
/* WBadge's public props are the interface; swap to "./WBadge.vue" once the PrimeVue WBadge renderer lands. */
import WBadge from "./StackBadge.vue";
import type { BadgeStackProps, BadgeStackItem, BadgeStackIconSlotProps, SharedIcon } from "../../types";
defineOptions({ name: "WBadgeStack" });
const props = withDefaults(defineProps<BadgeStackProps>(), badgeStackDefaults);
defineSlots<{
  icon?(props: BadgeStackIconSlotProps): unknown;
  badgeIcon?(props: { item: BadgeStackItem; icon: SharedIcon | undefined; size: string | number }): unknown;
  label?(props: { item: BadgeStackItem; text: string; overflow: boolean }): unknown;
}>();
const context = useWakebContext("WBadgeStack");
const { stackVariant, visibleItems, overflowItems, overflowCount, overflowName, iconWrapStyle, resolveBadgeProps, truncate, glyphSize } = useBadgeStack(props);
/* Same opening rules as the Vuetify menu: hover always; click toggles the button; the legacy div opens on hover only. */
const { popover, open, activator, content } = useOverflowPopup({
  click: () => (props.overflowTag === "button" ? "toggle" : false),
  focus: () => props.overflowTag !== "button",
});
const menuId = `wakeb-badge-overflow-${useId()}`;
/* The theme scope sits on the teleported root; menuStyle sits on the list inside it and wins. */
const overlay = computed(() => {
  const { style, ...attrs } = context.scope;
  return { ...attrs, style: [style, context.zIndexOverlay === undefined ? undefined : { zIndex: context.zIndexOverlay }] };
});
</script>
<template>
  <div class="badge-stack" :class="{ 'badge-stack--circle-icon': iconVariant === 'circle' }">
    <WBadge v-for="(item, index) in visibleItems" :key="item.id ?? index" v-bind="{ ...resolveBadgeProps(item), ...badgeAttrs }"
      ><template #icon>
        <slot v-if="item.icon" name="icon" :item="item" :index="index" :overflow="false" :variant="iconVariant" :style="iconWrapStyle(item)">
          <span v-if="iconVariant === 'circle'" class="badge-stack__icon-wrap" :style="iconWrapStyle(item)"><img class="badge-stack__icon" :src="item.icon" alt="" /></span>
          <img v-else class="badge-stack__icon" :src="item.icon" alt="" />
        </slot>
        <slot v-else name="badgeIcon" :item="item" :icon="item.badgeIcon" :size="item.iconSize ?? iconSize"
          ><WakebIcon v-if="item.badgeIcon" class="icon" :icon="item.badgeIcon" :size="glyphSize(item)"
        /></slot>
      </template>
      <span
        ><slot name="label" :item="item" :text="truncate(item.label)" :overflow="false">{{ truncate(item.label) }}</slot></span
      ></WBadge
    >
    <template v-if="overflowCount > 0 && showOverflowMenu">
      <component
        :is="overflowTag"
        class="badge-stack__overflow-activator"
        :type="overflowTag === 'button' ? 'button' : undefined"
        :aria-label="overflowName"
        :aria-expanded="open"
        :aria-controls="open ? menuId : undefined"
        v-bind="activator"
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
      <Popover
        :id="menuId"
        ref="popover"
        class="wakeb-pv-overflow"
        v-bind="overlay"
        :aria-label="overflowName"
        aria-modal="false"
        :auto-z-index="context.zIndexOverlay === undefined"
        @mouseenter="content.onMouseenter"
        @mouseleave="content.onMouseleave"
        @hide="content.onHide"
      >
        <ul class="overflow-menu-list wakeb-pv-overflow__list" :class="{ 'badge-stack--circle-icon': iconVariant === 'circle' }" role="list" :style="menuStyle">
          <li v-for="(item, index) in overflowItems" :key="item.id ?? index" class="overflow-menu-item wakeb-pv-overflow__item">
            <WBadge v-bind="{ ...resolveBadgeProps(item), ...badgeAttrs }"
              ><template #icon>
                <slot v-if="item.icon" name="icon" :item="item" :index="index" :overflow="true" :variant="iconVariant" :style="iconWrapStyle(item)">
                  <span v-if="iconVariant === 'circle'" class="badge-stack__icon-wrap" :style="iconWrapStyle(item)"><img class="badge-stack__icon" :src="item.icon" alt="" /></span>
                  <img v-else class="badge-stack__icon" :src="item.icon" alt="" />
                </slot>
                <slot v-else name="badgeIcon" :item="item" :icon="item.badgeIcon" :size="item.iconSize ?? iconSize"
                  ><WakebIcon v-if="item.badgeIcon" class="icon" :icon="item.badgeIcon" :size="glyphSize(item)"
                /></slot>
              </template>
              <span
                ><slot name="label" :item="item" :text="item.label || ''" :overflow="true">{{ item.label || "" }}</slot></span
              ></WBadge
            >
          </li>
        </ul>
      </Popover>
    </template>
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
@use "../../styles/badge-stack";

.wakeb-pv-overflow__list {
  margin: 0;
  padding: 4px 0;
  list-style: none;
}
.wakeb-pv-overflow__item {
  display: flex;
  align-items: center;
  min-height: 36px;
}
</style>

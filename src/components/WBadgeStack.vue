<script setup lang="ts">
import { computed } from "vue";
import { VMenu } from "vuetify/components/VMenu";
import { VList, VListItem } from "vuetify/components/VList";
import { VIcon } from "vuetify/components/VIcon";
import { truncateText } from "wakeb-utils";
import WBadge from "./WBadge.vue";
import type {
  BadgeStackProps,
  BadgeStackItem,
  BadgeStackIconSlotProps,
  BadgeProps,
  SharedIcon,
} from "../types";
const props = withDefaults(defineProps<BadgeStackProps>(), {
  items: () => [],
  max: 1,
  truncateLength: 12,
  showOverflowMenu: false,
  badgeType: "transparent",
  badgeVariant: "default",
  badgeBorderRadius: "md",
  customBorderRadius: "sm",
  badgePadding: "",
  dotColor: "",
  badgeClassList: "",
  isDot: false,
  iconSize: "xs",
  iconPosition: "before",
  iconVariant: "default",
  iconBackgroundOpacity: 1,
  customOverflowBorderRadius: "999px",
  overflowLabel: "",
  overflowTag: "button",
});
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
const items = computed(() => (Array.isArray(props.items) ? props.items : []));
const visibleItems = computed(() => items.value.slice(0, props.max));
const overflowItems = computed(() => items.value.slice(props.max));
const overflowCount = computed(() =>
  Math.max(items.value.length - props.max, 0),
);
const iconWrapStyle = (item: BadgeStackItem) => {
  const color =
    item.color || "var(--wakeb-badge-stack-icon-background, #087f8c)";
  const percent = Math.round(
    Math.min(Math.max(Number(props.iconBackgroundOpacity) || 0, 0), 1) * 100,
  );
  return {
    backgroundColor:
      percent >= 100
        ? color
        : `color-mix(in srgb, ${color} ${percent}%, transparent)`,
  };
};
const resolveBadgeProps = (item: BadgeStackItem): BadgeProps => ({
  type: item.type ?? props.badgeType,
  variant: item.variant ?? props.badgeVariant,
  borderRadius: item.borderRadius ?? props.badgeBorderRadius,
  customBorderRadius: item.customBorderRadius ?? props.customBorderRadius,
  customPadding: item.customPadding ?? props.badgePadding,
  dotColor: item.dotColor ?? props.dotColor,
  isDot: item.isDot ?? props.isDot,
  classList: item.classList ?? props.badgeClassList,
  icon: item.badgeIcon,
  iconSize: item.iconSize ?? props.iconSize,
  iconPosition: item.iconPosition ?? props.iconPosition,
});
const truncate = (text: string | undefined) =>
  truncateText(text || "", props.truncateLength);
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
            :icon="item.badgeIcon"
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
    >
      <template #activator="{ props: menuProps }">
        <component
          :is="overflowTag"
          v-bind="menuProps"
          class="badge-stack__overflow-activator"
          :type="overflowTag === 'button' ? 'button' : undefined"
          :aria-label="overflowLabel || `+${overflowCount}`"
        >
          <WBadge
            v-bind="badgeAttrs"
            :label="`+${overflowCount}`"
            :type="badgeType"
            :variant="badgeVariant"
            :border-radius="badgeBorderRadius"
            :custom-border-radius="customOverflowBorderRadius"
            class-list="badge-stack__overflow"
          />
        </component>
      </template>
      <VList class="overflow-menu-list py-1" :style="menuStyle">
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
                  :icon="item.badgeIcon"
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
      :variant="badgeVariant"
      :border-radius="badgeBorderRadius"
      :custom-border-radius="customBorderRadius"
      class-list="badge-stack__overflow"
    />
  </div>
</template>
<style lang="scss" scoped>
.badge-stack {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.badge-stack__overflow-activator {
  display: inline-flex;
  cursor: pointer;
}

button.badge-stack__overflow-activator {
  border: 0;
  padding: 0;
  background: none;
  color: inherit;
  font: inherit;
}
.badge-stack__overflow-activator:focus-visible {
  outline: 2px solid var(--wakeb-badge-stack-focus, #087f8c);
  outline-offset: 2px;
  border-radius: 999px;
}
.badge-stack__overflow {
  max-width: 58px;
  width: fit-content;
  height: 22px;
  padding: 2px 6px;
  border-radius: 999px;
  background: var(--wakeb-badge-stack-overflow-background, #fff) !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;

  :deep(.v-chip__content) {
    padding: 0 6px !important;
    gap: 4px !important;
  }

  :deep(span) {
    font-size: 10px !important;
    font-weight: 500 !important;
    line-height: 1.2 !important;
    text-align: center !important;
    color: var(--wakeb-badge-stack-overflow-color, #101828) !important;
    white-space: nowrap;
  }
}

.badge-stack :deep(.badge-stack__icon),
.overflow-menu-item :deep(.badge-stack__icon) {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  object-fit: contain;
}

.badge-stack--circle-icon {
  :deep(.badge-stack__icon-wrap) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 2px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  :deep(.badge-stack__icon) {
    width: 14px;
    height: 14px;
  }
}

.overflow-menu-list {
  background: var(
    --wakeb-badge-stack-menu-surface,
    var(
      --wakeb-badge-stack-fallback,
      rgb(var(--v-theme-surface, 255, 255, 255))
    )
  ) !important;
  min-width: 160px;
  width: max-content;
  max-width: calc(100vw - 24px);
  overflow: visible;
}

.overflow-menu-item {
  padding-inline: 0.625rem !important;
  overflow: visible;
}

.overflow-menu-item :deep(.v-list-item__content) {
  min-width: max-content;
  overflow: visible;
}

.overflow-menu-item :deep(.v-chip) {
  max-width: calc(100vw - 44px);
}
</style>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  ref,
  useSlots,
  watch,
  type CSSProperties,
} from "vue";
import {
  VTabs,
  VTab,
  VTabsWindow,
  VTabsWindowItem,
} from "vuetify/components/VTabs";
import { VCardText } from "vuetify/components/VCard";
import { VIcon } from "vuetify/components/VIcon";
import type { TabsProps, TabItem, NavigationKey } from "../types";
const props = withDefaults(defineProps<TabsProps>(), {
  styleType: "outlined",
  isVertical: false,
  tabs: () => [],
  selectedTab: "",
  isSwitcherOnly: false,
  valueKey: "slot",
  iconOnly: false,
  tabHeight: null,
  iconSize: "sm",
  classList: "",
  contentGap: null,
  ariaLabel: "Tabs",
});
defineSlots<{
  [name: string]: (props: any) => unknown;
  "tab-label"(props: { tabItem: TabItem; index: number }): unknown;
  "tab-icon"(props: {
    tabItem: TabItem;
    index: number;
    size: string | number;
  }): unknown;
}>();
const tabValue = (item: TabItem) => item[props.valueKey] as NavigationKey;
const pixelIconSize = computed(
  () =>
    (({ xs: 16, sm: 20, md: 24, lg: 32, xl: 40 }) as Record<string, number>)[
      String(props.iconSize)
    ] ?? props.iconSize,
);
const slots = useSlots();
const hasHeader = computed(() => Boolean(slots.header));
const rootStyle = computed(() => {
  const style: CSSProperties = {};

  if (props.tabHeight != null) {
    style["--wakeb-tabs-item-height"] = `${props.tabHeight}px`;
    style["--v-tabs-height"] = `${props.tabHeight}px`;
  }

  if (props.contentGap != null) {
    style.gap = `${props.contentGap}px`;
  }

  return Object.keys(style).length ? style : undefined;
});

const tabsRoot = ref<HTMLElement | null>(null);
const emits = defineEmits<{ updateTab: [value: NavigationKey | undefined] }>();

/** Empty selectedTab + isSwitcherOnly = no highlight (dual rails on settings). */
function tabFromProps() {
  if (props.selectedTab !== "" && props.selectedTab != null)
    return props.selectedTab;
  if (props.isSwitcherOnly) return undefined;
  return props.tabs[0] ? tabValue(props.tabs[0]) : undefined;
}

const tab = ref<NavigationKey | undefined>(tabFromProps());

const hasCustomHtml = (tabItem: TabItem) => {
  return (
    typeof tabItem?.customHTML === "function" ||
    typeof tabItem?.customHTML === "string"
  );
};

const resolveCustomHtml = (tabItem: TabItem) => {
  if (typeof tabItem?.customHTML === "function") {
    const context = {
      value: tabItem?.[props.valueKey],
      isSelected: tab.value === tabItem?.[props.valueKey],
    };
    return tabItem.customHTML(tabItem, context) || "";
  }

  if (typeof tabItem?.customHTML === "string") return tabItem.customHTML;
  return "";
};

const resolveItemClassList = (tabItem: TabItem, index: number) => {
  const itemClassList = tabItem?.itemClassList;
  if (typeof itemClassList === "function") {
    return (
      itemClassList(tabItem, index, {
        value: tabItem?.[props.valueKey],
        isSelected: tab.value === tabItem?.[props.valueKey],
      }) || ""
    );
  }

  return itemClassList || "";
};

let syncingFromProps = false;
let acceptTabChange = false;

watch(
  () => [props.selectedTab, props.isSwitcherOnly],
  () => {
    syncingFromProps = true;
    tab.value = tabFromProps();
    nextTick(() => {
      syncingFromProps = false;
    });
  },
);
watch(tab, (newVal, oldVal) => {
  if (!acceptTabChange || syncingFromProps) return;
  if (newVal === oldVal) return;
  emits("updateTab", newVal);
});

onMounted(() => {
  nextTick(() => {
    syncingFromProps = true;
    tab.value = tabFromProps();
    nextTick(() => {
      syncingFromProps = false;
      acceptTabChange = true;
    });
  });
});
</script>
<template>
  <div
    ref="tabsRoot"
    :class="[
      { 'flex-col': !isVertical },
      styleType,
      tabHeight != null ? 'tabs--sized' : '',
      classList,
      contentGap == null ? 'gap-8' : '',
    ]"
    class="wakeb-tabs flex items-start"
    :style="rootStyle"
  >
    <div
      :class="{ 'w-full': !isVertical }"
      class="wakeb-tabs__rail flex justify-between items-center"
    >
      <v-tabs
        :aria-label="ariaLabel"
        :direction="isVertical ? 'vertical' : 'horizontal'"
        v-model="tab"
      >
        <div v-if="hasHeader" class="tabs__rail-header">
          <slot name="header" />
        </div>

        <template v-for="(tabItem, index) in tabs" :key="tabValue(tabItem)">
          <div v-if="tabItem.sectionLabel" class="tabs__section-label">
            <span>{{ tabItem.sectionLabel }}</span>
            <span class="tabs__section-label-line" aria-hidden="true"></span>
          </div>
          <v-tab
            :value="tabValue(tabItem)"
            :aria-label="iconOnly ? tabItem.label : undefined"
            :class="resolveItemClassList(tabItem, index)"
            :ripple="false"
          >
            <slot name="tab-label" :tabItem="tabItem" :index="index">
              <template v-if="hasCustomHtml(tabItem)">
                <div
                  class="tab-custom-html"
                  v-html="resolveCustomHtml(tabItem)"
                ></div>
              </template>
              <template v-else>
                <slot
                  v-if="tabItem.icon"
                  name="tab-icon"
                  :tab-item="tabItem"
                  :index="index"
                  :size="iconSize"
                  ><VIcon :icon="tabItem.icon" :size="pixelIconSize"
                /></slot>
                <p class="font-semibold!" v-if="!iconOnly">
                  {{ tabItem.label }}
                </p>
              </template>
            </slot>
            <p class="tab-notification" v-if="tabItem.notification">
              {{ tabItem.notification }}
            </p>
          </v-tab>
        </template>
      </v-tabs>
      <slot name="actions"></slot>
    </div>

    <v-card-text class="w-full py-0!" v-if="!isSwitcherOnly">
      <v-tabs-window v-model="tab">
        <v-tabs-window-item
          v-for="tabItem in tabs"
          :key="tabValue(tabItem)"
          :value="tabValue(tabItem)"
        >
          <template v-if="tabItem.content">
            {{ tabItem.content }}
          </template>
          <template v-else>
            <slot :name="String(tabValue(tabItem))"></slot>
          </template>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </div>
</template>

<style lang="scss" scoped>
.wakeb-tabs {
  display: flex;
  align-items: flex-start;
  gap: var(--wakeb-tabs-content-gap, 32px);
}
.wakeb-tabs.flex-col {
  flex-direction: column;
}
.wakeb-tabs__rail {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wakeb-tabs > .w-full {
  width: 100%;
}
.wakeb-tabs > :deep(.v-card-text) {
  width: 100%;
  padding-block: 0 !important;
}

.tabs--sized {
  :deep() {
    .v-tabs {
      height: var(
        --wakeb-tabs-item-height,
        var(--wakeb-tabs-fallback, 44px)
      ) !important;
      min-height: var(
        --wakeb-tabs-item-height,
        var(--wakeb-tabs-fallback, 44px)
      );
    }

    .v-slide-group__content {
      height: var(--wakeb-tabs-item-height, var(--wakeb-tabs-fallback, 44px));
      min-height: var(
        --wakeb-tabs-item-height,
        var(--wakeb-tabs-fallback, 44px)
      );
    }

    .v-slide-group__content .v-btn {
      height: var(
        --wakeb-tabs-item-height,
        var(--wakeb-tabs-fallback, 44px)
      ) !important;
      min-height: var(
        --wakeb-tabs-item-height,
        var(--wakeb-tabs-fallback, 44px)
      ) !important;
      max-height: var(
        --wakeb-tabs-item-height,
        var(--wakeb-tabs-fallback, 44px)
      ) !important;
      padding: 8px 14px !important;
      line-height: 1 !important;
    }

    .v-slide-group__content .v-btn__content {
      line-height: 1 !important;
    }
  }
}

.v-tabs {
  width: fit-content !important;
  height: fit-content !important;
}
.tabs__rail-header {
  width: 100%;
  text-align: start !important;
  padding: 0 4px 12px 0 !important;
}

.tabs__section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin: 0;
  padding-block: 8px;
  padding-inline: 4px 8px;
  color: var(--wakeb-tabs-section-color, var(--wakeb-tabs-fallback, #667085));
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  white-space: nowrap;
}

.tabs__section-label-line {
  flex: 1;
  height: 0;
  border-top: 1px solid
    var(--wakeb-tabs-section-border, var(--wakeb-tabs-fallback, #d0d5dd));
}

.tabs__rail-header {
  width: 100%;
  text-align: start !important;
  padding: 0 4px 12px 0 !important;
}

.none {
  :deep() {
    .v-tabs {
      width: 100% !important;
      .v-slide-group__content {
        gap: 0.5rem;
        flex-wrap: wrap;
      }
    }
    .v-slide-group__content {
      background-color: transparent !important;
      border: none !important;
    }
  }
}

.filled {
  :deep() {
    .v-slide-group {
      width: 100% !important;
      border-radius: var(
        --wakeb-tabs-filled-tab-radius,
        var(--wakeb-tabs-fallback, 10px)
      ) !important;
      background-color: transparent;
      &__content {
        .v-btn {
          height: 45px;
          border-radius: 0 !important;
        }
        .v-tab-item {
          &--selected {
            background-color: var(
              --wakeb-tabs-filled-item-active-bg,
              var(--wakeb-tabs-fallback, #e6f2f3)
            ) !important;
            color: var(
              --wakeb-tabs-filled-item-active-color,
              var(--wakeb-tabs-fallback, #087f8c)
            ) !important;

            border: none !important;
          }
        }
      }
    }
  }
}

:deep() {
  .v-window-item {
    padding: 2px;
  }

  .v-slide-group {
    &--vertical {
      .v-slide-group__content {
        min-width: 223px;
        border-radius: 20px;
        .v-btn {
          width: 100% !important  ;

          &.v-tab-item--selected {
            background-color: var(
              --wakeb-tabs-filled-item-active-bg,
              var(--wakeb-tabs-fallback, #e6f2f3)
            ) !important;
            color: var(
              --wakeb-tabs-item-active-color,
              var(--wakeb-tabs-fallback, #087f8c)
            ) !important;
            border: 1px solid
              var(
                --wakeb-tabs-item-active-border,
                var(--wakeb-tabs-fallback, #d0d5dd)
              ) !important;
          }

          &:not(:first-child) {
            &::before {
              content: unset !important;
            }
          }
        }
      }
    }
    &__content {
      display: flex;
      align-items: center;
      background-color: transparent !important;
      border: 1px solid
        var(
          --wakeb-tabs-item-active-border,
          var(--wakeb-tabs-fallback, #d0d5dd)
        );
      border-radius: 10px;
      overflow: hidden;
      .v-btn {
        height: 44px;
        padding: 8px 12px;
        border-radius: 10px !important;
        font-size: 14px;
        font-weight: 600;
        position: relative;
        margin: 0;
        min-width: unset;
        background-color: transparent !important;
        color: var(
          --wakeb-tabs-item-color,
          var(--wakeb-tabs-fallback, #344054)
        ) !important;
        &:not(:first-child) {
          &::before {
            content: "";
            position: absolute;
            inset-inline-start: 0;
            width: 1px;
            background-color: var(
              --wakeb-tabs-item-active-border,
              var(--wakeb-tabs-fallback, #d0d5dd)
            );
            height: 100%;
            z-index: 999;
          }
        }
        .v-tab__slider {
          display: none;
        }
      }
      .v-btn__content {
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        > div {
          width: 100%;
        }
        .tab-notification {
          width: 29px;
          height: 24px;
          background-color: var(
            --wakeb-tabs-input-bg,
            var(--wakeb-tabs-fallback, #fff)
          );
          border: 1px solid
            var(--wakeb-tabs-input-border, var(--wakeb-tabs-fallback, #d0d5dd));
          border-radius: 50%;
          padding: 2px 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(
            --wakeb-tabs-input-label,
            var(--wakeb-tabs-fallback, #344054)
          );
          font-size: 14px;
          font-weight: 600;
        }
      }

      .v-tab-item {
        &--selected {
          background-color: var(
            --wakeb-tabs-filled-item-active-bg,
            var(--wakeb-tabs-fallback, #e6f2f3)
          ) !important;
          color: var(
            --wakeb-tabs-item-active-color,
            var(--wakeb-tabs-fallback, #087f8c)
          ) !important;
          border: 1px solid
            var(
              --wakeb-tabs-item-active-border,
              var(--wakeb-tabs-fallback, #d0d5dd)
            ) !important;
          border-radius: 0 !important;
        }
      }
    }
  }
}

.minimal {
  :deep() {
    .v-slide-group {
      &__content {
        gap: var(--wakeb-tabs-minimal-tab-gap, var(--wakeb-tabs-fallback, 4px));
        padding: var(
          --wakeb-tabs-minimal-tab-padding,
          var(--wakeb-tabs-fallback, 4px)
        );
        background-color: var(
          --wakeb-tabs-minimal-tab-bg,
          var(--wakeb-tabs-fallback, #f2f4f7)
        ) !important;
        border: 1px solid
          var(
            --wakeb-tabs-minimal-tab-border,
            var(--wakeb-tabs-fallback, #d0d5dd)
          ) !important;
        border-radius: var(
          --wakeb-tabs-minimal-tab-radius,
          var(--wakeb-tabs-fallback, 12px)
        ) !important;
        overflow: hidden;

        .v-btn {
          height: 42px;
          padding: 8px 12px;
          border-radius: var(
            --wakeb-tabs-minimal-item-radius,
            var(--wakeb-tabs-fallback, 8px)
          ) !important;
          background-color: transparent !important;
          color: var(
            --wakeb-tabs-minimal-item-color,
            var(--wakeb-tabs-fallback, #667085)
          ) !important;
          border: 1px solid transparent !important;
          box-shadow: none;

          &:not(:first-child)::before {
            content: unset !important;
          }
        }

        .v-btn__content {
          font-size: 16px;
          font-weight: 600;
        }

        .v-tab-item {
          &--selected {
            background-color: var(
              --wakeb-tabs-filled-item-active-bg,
              var(--wakeb-tabs-fallback, #e6f2f3)
            ) !important;
            color: var(
              --wakeb-tabs-minimal-item-active-color,
              var(--wakeb-tabs-fallback, #101828)
            ) !important;

            border-radius: var(
              --wakeb-tabs-minimal-item-active-radius,
              var(--wakeb-tabs-fallback, 8px)
            ) !important;
          }
        }
      }
    }
  }
}
</style>

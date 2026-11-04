<script setup lang="ts">
import { ref, watch } from "vue";
import WakebIcon from "../../icons/WakebIcon";
import { rovingTabIndex, tabsDefaults, useTabs } from "../../composables/tabs";
import type { TabsProps, TabItem, NavigationKey } from "../../types";
/*
 * Native Wakeb tabs on PrimeVue. PrimeVue Tabs generates its own ids and either mounts every panel or
 * unmounts inactive ones, so the tablist, the lazily mounted and retained panels, and the roving keys
 * are Wakeb-owned here, with the same selection behavior as the Vuetify renderer (composables/tabs).
 */
defineOptions({ name: "WTabs" });
const props = withDefaults(defineProps<TabsProps>(), tabsDefaults);
defineSlots<{
  [name: string]: (props: any) => unknown;
  "tab-label"(props: { tabItem: TabItem; index: number }): unknown;
  "tab-icon"(props: {
    tabItem: TabItem;
    index: number;
    size: string | number;
  }): unknown;
}>();
const emits = defineEmits<{ updateTab: [value: NavigationKey | undefined] }>();
const {
  tab,
  tabValue,
  isSelected,
  pixelIconSize,
  hasHeader,
  rootStyle,
  tabId,
  panelId,
  hasCustomHtml,
  resolveCustomHtml,
  resolveItemClassList,
} = useTabs(props, emits);
const tablist = ref<HTMLElement | null>(null);

/* Manual activation: click, Enter or Space select; arrows only move focus (Vuetify slide group behavior). */
function select(item: TabItem) {
  tab.value = tabValue(item);
}
/* One tab stop: the selected tab, or the first tab when nothing is selected. */
const tabStop = (item: TabItem, index: number) =>
  isSelected(item) || (index === 0 && !props.tabs.some((other) => isSelected(other))) ? 0 : -1;
function onTabKeydown(event: KeyboardEvent) {
  const buttons = Array.from(tablist.value?.querySelectorAll<HTMLElement>("[role=tab]") ?? []);
  const rtl = tablist.value ? getComputedStyle(tablist.value).direction === "rtl" : false;
  const target = rovingTabIndex(event.key, buttons.indexOf(event.currentTarget as HTMLElement), buttons.length, props.isVertical, rtl);
  if (target === undefined) return;
  event.preventDefault();
  buttons[target]?.focus();
}

/* Panels mount on first selection and stay mounted, so their Vue state survives a round trip. */
const visited = ref<NavigationKey[]>([]);
watch(
  tab,
  (value) => {
    if (value !== undefined && !visited.value.includes(value)) visited.value = [...visited.value, value];
  },
  { immediate: true },
);
</script>
<template>
  <div
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
    <div :class="{ 'w-full': !isVertical }" class="wakeb-tabs__rail flex justify-between items-center">
      <div
        ref="tablist"
        class="wakeb-tabs__list"
        :class="{ 'wakeb-tabs__list--vertical': isVertical }"
        role="tablist"
        :aria-label="ariaLabel"
        :aria-orientation="isVertical ? 'vertical' : undefined"
      >
        <div v-if="hasHeader" class="tabs__rail-header">
          <slot name="header" />
        </div>

        <template v-for="(tabItem, index) in tabs" :key="tabValue(tabItem)">
          <div v-if="tabItem.sectionLabel" class="tabs__section-label">
            <span>{{ tabItem.sectionLabel }}</span>
            <span class="tabs__section-label-line" aria-hidden="true"></span>
          </div>
          <button
            :id="tabId(index)"
            type="button"
            role="tab"
            :aria-selected="isSelected(tabItem) ? 'true' : 'false'"
            :aria-controls="
              // Inactive panels are lazy, so only the rendered panel is referenced.
              isSwitcherOnly || tab !== tabValue(tabItem) ? undefined : panelId(index)
            "
            :aria-label="iconOnly ? tabItem.label : undefined"
            :tabindex="tabStop(tabItem, index)"
            class="wakeb-tabs__tab"
            :class="[{ 'wakeb-tabs__tab--selected': isSelected(tabItem) }, resolveItemClassList(tabItem, index)]"
            @click="select(tabItem)"
            @keydown="onTabKeydown"
          >
            <span class="wakeb-tabs__tab-content">
              <slot name="tab-label" :tabItem="tabItem" :index="index">
                <template v-if="hasCustomHtml(tabItem)">
                  <div class="tab-custom-html" v-html="resolveCustomHtml(tabItem)"></div>
                </template>
                <template v-else>
                  <slot v-if="tabItem.icon" name="tab-icon" :tab-item="tabItem" :index="index" :size="iconSize"
                    ><WakebIcon :icon="tabItem.icon" :size="pixelIconSize"
                  /></slot>
                  <p class="font-semibold!" v-if="!iconOnly">
                    {{ tabItem.label }}
                  </p>
                </template>
              </slot>
              <p class="tab-notification" v-if="tabItem.notification">
                {{ tabItem.notification }}
              </p>
            </span>
          </button>
        </template>
      </div>
      <slot name="actions"></slot>
    </div>

    <div class="wakeb-tabs__panels w-full" v-if="!isSwitcherOnly">
      <template v-for="(tabItem, index) in tabs" :key="tabValue(tabItem)">
        <div v-if="visited.includes(tabValue(tabItem))" v-show="tab === tabValue(tabItem)" class="wakeb-tabs__window-item">
          <div :id="panelId(index)" class="wakeb-tabs__panel" role="tabpanel" :aria-labelledby="tabId(index)" tabindex="0">
            <template v-if="tabItem.content">
              {{ tabItem.content }}
            </template>
            <template v-else>
              <slot :name="String(tabValue(tabItem))"></slot>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Same Wakeb variables as the Vuetify renderer, applied to Wakeb-owned markup. */
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
.wakeb-tabs > .w-full,
.wakeb-tabs__panels {
  width: 100%;
}
.wakeb-tabs__window-item {
  padding: 2px;
}
.wakeb-tabs__list {
  display: flex;
  align-items: center;
  width: fit-content;
  border: 1px solid var(--wakeb-tabs-item-active-border, var(--wakeb-tabs-fallback, #d0d5dd));
  border-radius: 10px;
  overflow: hidden;
  &--vertical {
    flex-direction: column;
    align-items: stretch;
    min-width: 223px;
    border-radius: 20px;
  }
}
.wakeb-tabs__tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--wakeb-tabs-item-height, 44px);
  margin: 0;
  padding: 8px 12px;
  border: 1px solid transparent;
  border-radius: 0;
  background: transparent;
  color: var(--wakeb-tabs-item-color, var(--wakeb-tabs-fallback, #344054));
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  &:not(:first-of-type)::before {
    content: "";
    position: absolute;
    inset-inline-start: 0;
    top: 0;
    width: 1px;
    height: 100%;
    background-color: var(--wakeb-tabs-item-active-border, var(--wakeb-tabs-fallback, #d0d5dd));
  }
  &--selected {
    background-color: var(--wakeb-tabs-filled-item-active-bg, var(--wakeb-tabs-fallback, #e6f2f3));
    color: var(--wakeb-tabs-item-active-color, var(--wakeb-tabs-fallback, #087f8c));
    border-color: var(--wakeb-tabs-item-active-border, var(--wakeb-tabs-fallback, #d0d5dd));
  }
  &:focus-visible {
    outline: 2px solid var(--wakeb-ui-focus, #087f8c);
    outline-offset: -2px;
  }
}
.wakeb-tabs__list--vertical .wakeb-tabs__tab {
  width: 100%;
  &::before {
    content: unset;
  }
}
.wakeb-tabs__tab-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  p {
    margin: 0;
  }
  .tab-notification {
    width: 29px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px 10px;
    border: 1px solid var(--wakeb-tabs-input-border, var(--wakeb-tabs-fallback, #d0d5dd));
    border-radius: 50%;
    background-color: var(--wakeb-tabs-input-bg, var(--wakeb-tabs-fallback, #fff));
    color: var(--wakeb-tabs-input-label, var(--wakeb-tabs-fallback, #344054));
    font-size: 14px;
    font-weight: 600;
  }
}
.tabs__rail-header {
  width: 100%;
  text-align: start;
  padding: 0 4px 12px 0;
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
  border-top: 1px solid var(--wakeb-tabs-section-border, var(--wakeb-tabs-fallback, #d0d5dd));
}
.tabs--sized .wakeb-tabs__tab {
  height: var(--wakeb-tabs-item-height, var(--wakeb-tabs-fallback, 44px));
  min-height: var(--wakeb-tabs-item-height, var(--wakeb-tabs-fallback, 44px));
  padding: 8px 14px;
  line-height: 1;
}
.none .wakeb-tabs__list {
  width: 100%;
  flex-wrap: wrap;
  gap: 0.5rem;
  border: none;
  background-color: transparent;
}
.filled .wakeb-tabs__list {
  width: 100%;
  border-radius: var(--wakeb-tabs-filled-tab-radius, var(--wakeb-tabs-fallback, 10px));
  .wakeb-tabs__tab {
    height: 45px;
  }
  .wakeb-tabs__tab--selected {
    background-color: var(--wakeb-tabs-filled-item-active-bg, var(--wakeb-tabs-fallback, #e6f2f3));
    color: var(--wakeb-tabs-filled-item-active-color, var(--wakeb-tabs-fallback, #087f8c));
    border: none;
  }
}
.minimal .wakeb-tabs__list {
  gap: var(--wakeb-tabs-minimal-tab-gap, var(--wakeb-tabs-fallback, 4px));
  padding: var(--wakeb-tabs-minimal-tab-padding, var(--wakeb-tabs-fallback, 4px));
  background-color: var(--wakeb-tabs-minimal-tab-bg, var(--wakeb-tabs-fallback, #f2f4f7));
  border: 1px solid var(--wakeb-tabs-minimal-tab-border, var(--wakeb-tabs-fallback, #d0d5dd));
  border-radius: var(--wakeb-tabs-minimal-tab-radius, var(--wakeb-tabs-fallback, 12px));
  .wakeb-tabs__tab {
    height: 42px;
    border-radius: var(--wakeb-tabs-minimal-item-radius, var(--wakeb-tabs-fallback, 8px));
    color: var(--wakeb-tabs-minimal-item-color, var(--wakeb-tabs-fallback, #667085));
    font-size: 16px;
    &::before {
      content: unset;
    }
  }
  .wakeb-tabs__tab--selected {
    background-color: var(--wakeb-tabs-filled-item-active-bg, var(--wakeb-tabs-fallback, #e6f2f3));
    color: var(--wakeb-tabs-minimal-item-active-color, var(--wakeb-tabs-fallback, #101828));
    border-color: transparent;
    border-radius: var(--wakeb-tabs-minimal-item-active-radius, var(--wakeb-tabs-fallback, 8px));
  }
}
</style>

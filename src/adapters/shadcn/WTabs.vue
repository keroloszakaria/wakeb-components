<script setup lang="ts">
import { ref, watch } from "vue";
import WakebIcon from "../../icons/WakebIcon";
import { rovingTabIndex, tabsDefaults, useTabs } from "../../composables/tabs";
import type { TabsProps, TabItem, NavigationKey } from "../../types";
/*
 * Native Wakeb tabs on shadcn-vue. The shadcn-vue Tabs (reka-ui TabsRoot) activates on arrow focus by
 * default and either mounts every panel or unmounts inactive ones, so the tablist, the lazily mounted and
 * retained panels, and the roving keys are Wakeb-owned here, with the same selection behavior as the
 * Vuetify and PrimeVue renderers (composables/tabs, styles/tabs-native).
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
@use "../../styles/tabs-native";
</style>

import { computed, inject, nextTick, onMounted, ref, useId, useSlots, watch, type CSSProperties } from "vue";
import { WAKEB_CONTEXT, warnOnce } from "../core/runtime";
import type { NavigationKey, TabItem, TabsProps } from "../types";

/** Defaults shared by every WTabs renderer; providers must not change them. */
export const tabsDefaults = {
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
} as const;

type ResolvedTabsProps = Required<Omit<TabsProps, "selectedTab" | "tabHeight" | "contentGap">> & TabsProps;
type TabsEmit = (event: "updateTab", value: NavigationKey | undefined) => void;
const ICON_PIXELS: Record<string, number> = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 };

/**
 * Provider-neutral WTabs behavior (SPEC R13, R18): selection synchronized from `selectedTab` without
 * echo, one `updateTab` per accepted local change, app-unique tab and panel ids, and the legacy
 * customHTML/itemClassList callbacks. `heightVariables` lets a renderer mirror `tabHeight` into
 * its provider's own size variable.
 */
export function useTabs(props: ResolvedTabsProps, emit: TabsEmit, heightVariables: readonly string[] = []) {
  const tabValue = (item: TabItem) => item[props.valueKey] as NavigationKey;
  const pixelIconSize = computed(() => ICON_PIXELS[String(props.iconSize)] ?? props.iconSize);
  const slots = useSlots();
  const hasHeader = computed(() => Boolean(slots.header));
  const rootStyle = computed(() => {
    const style: CSSProperties = {};
    if (props.tabHeight != null) {
      style["--wakeb-tabs-item-height"] = `${props.tabHeight}px`;
      for (const name of heightVariables) (style as Record<string, string>)[name] = `${props.tabHeight}px`;
    }
    if (props.contentGap != null) style.gap = `${props.contentGap}px`;
    return Object.keys(style).length ? style : undefined;
  });

  const uid = useId();
  const tabId = (index: number) => `wakeb-tabs-${uid}-tab-${index}`;
  const panelId = (index: number) => `wakeb-tabs-${uid}-panel-${index}`;

  /** Empty selectedTab + isSwitcherOnly = no highlight (dual rails on settings). */
  function tabFromProps() {
    if (props.selectedTab !== "" && props.selectedTab != null) return props.selectedTab;
    if (props.isSwitcherOnly) return undefined;
    return props.tabs[0] ? tabValue(props.tabs[0]) : undefined;
  }
  const tab = ref<NavigationKey | undefined>(tabFromProps());
  const isSelected = (item: TabItem) => tab.value === item?.[props.valueKey];

  const wakebContext = inject(WAKEB_CONTEXT, null);
  // SPEC R16: customHTML keeps working but is deprecated; report it once per app in development.
  const hasCustomHtml = (tabItem: TabItem) => {
    const used = typeof tabItem?.customHTML === "function" || typeof tabItem?.customHTML === "string";
    if (used && process.env.NODE_ENV !== "production")
      warnOnce(wakebContext, "WAKEB_DEPRECATED_VALUE", "WTabs.tabs.customHTML", "WTabs tab item 'customHTML' is deprecated; render the label through the 'tab-label' slot instead. customHTML is removed in the next major release.");
    return used;
  };
  const resolveCustomHtml = (tabItem: TabItem) => {
    if (typeof tabItem?.customHTML === "function") {
      const context = { value: tabItem?.[props.valueKey], isSelected: isSelected(tabItem) };
      return tabItem.customHTML(tabItem, context) || "";
    }
    if (typeof tabItem?.customHTML === "string") return tabItem.customHTML;
    return "";
  };
  const resolveItemClassList = (tabItem: TabItem, index: number) => {
    const itemClassList = tabItem?.itemClassList;
    if (typeof itemClassList === "function")
      return itemClassList(tabItem, index, { value: tabItem?.[props.valueKey], isSelected: isSelected(tabItem) }) || "";
    return itemClassList || "";
  };

  /*
   * Parent syncs and the mount settle are silent. Changes made by the provider while mounting (for
   * example a mandatory group selecting its first item) are overwritten by the props value.
   */
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
    emit("updateTab", newVal);
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

  return {
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
  };
}

/**
 * Roving focus target for renderers that draw their own tablist, matching the Vuetify slide group:
 * arrows follow the orientation (horizontal arrows reverse in RTL) and wrap; Home/End jump to the ends.
 * Returns the index to focus, or undefined when the key is not a tablist key.
 */
export function rovingTabIndex(key: string, index: number, count: number, vertical: boolean, rtl: boolean) {
  if (!count) return undefined;
  const forward = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
  const backward = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
  if (key === forward) return (index + 1) % count;
  if (key === backward) return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return undefined;
}

/** Public component names (AGENTS.md); every one is a facade over the selected renderer. */
export const COMPONENTS = [
  "WTruncatedText",
  "WSegmentedProgress",
  "WSemiCircleGauge",
  "WAvatarStack",
  "WLoading",
  "WPageSkeleton",
  "WVerticalSteps",
  "WButton",
  "WBadge",
  "WAccordion",
  "WBadgeStack",
  "WUserBadge",
  "WTooltipBtn",
  "WTabs",
  "WTree",
  "WDropdown",
  "WCarousel",
  "WExportDropdown",
  "WBaseSidebar",
  "WModal",
  "WDrawer",
] as const;
export type ComponentName = (typeof COMPONENTS)[number];

/** Alpha coverage per provider (SPEC R21). Anything missing renders WAKEB_COMPONENT_UNSUPPORTED. */
export const SUPPORTED: Record<"vuetify" | "primevue" | "shadcn", readonly ComponentName[]> = {
  vuetify: COMPONENTS,
  primevue: ["WButton", "WDropdown", "WLoading", "WModal", "WSegmentedProgress", "WSemiCircleGauge", "WVerticalSteps", "WPageSkeleton", "WTabs", "WTree", "WCarousel", "WExportDropdown", "WBaseSidebar", "WDrawer"],
  shadcn: [],
};

/*
 * Each public component is a typed facade over the renderer that wakebComponents() selects at build
 * time. Its public type comes from the provider-neutral contracts in ./contracts, never from a renderer
 * file; tests/types/conformance.ts checks that every renderer matches those contracts.
 */
import WTruncatedTextRenderer from "wakeb-components/_internal/selected/WTruncatedText";
import WSegmentedProgressRenderer from "wakeb-components/_internal/selected/WSegmentedProgress";
import WSemiCircleGaugeRenderer from "wakeb-components/_internal/selected/WSemiCircleGauge";
import WAvatarStackRenderer from "wakeb-components/_internal/selected/WAvatarStack";
import WLoadingRenderer from "wakeb-components/_internal/selected/WLoading";
import WPageSkeletonRenderer from "wakeb-components/_internal/selected/WPageSkeleton";
import WVerticalStepsRenderer from "wakeb-components/_internal/selected/WVerticalSteps";
import WButtonRenderer from "wakeb-components/_internal/selected/WButton";
import WBadgeRenderer from "wakeb-components/_internal/selected/WBadge";
import WAccordionRenderer from "wakeb-components/_internal/selected/WAccordion";
import WBadgeStackRenderer from "wakeb-components/_internal/selected/WBadgeStack";
import WUserBadgeRenderer from "wakeb-components/_internal/selected/WUserBadge";
import WTooltipBtnRenderer from "wakeb-components/_internal/selected/WTooltipBtn";
import WTabsRenderer from "wakeb-components/_internal/selected/WTabs";
import WTreeRenderer from "wakeb-components/_internal/selected/WTree";
import WDropdownRenderer from "wakeb-components/_internal/selected/WDropdown";
import WCarouselRenderer from "wakeb-components/_internal/selected/WCarousel";
import WExportDropdownRenderer from "wakeb-components/_internal/selected/WExportDropdown";
import WBaseSidebarRenderer from "wakeb-components/_internal/selected/WBaseSidebar";
import WModalRenderer from "wakeb-components/_internal/selected/WModal";
import WDrawerRenderer from "wakeb-components/_internal/selected/WDrawer";
import { defineWakebFacade } from "./core/facade";
import "./styles/tokens.css";
import type { WakebComponent } from "./contracts";
export const WTruncatedText = /* @__PURE__ */ defineWakebFacade("WTruncatedText", WTruncatedTextRenderer) as unknown as WakebComponent<"WTruncatedText">;
export const WSegmentedProgress = /* @__PURE__ */ defineWakebFacade("WSegmentedProgress", WSegmentedProgressRenderer) as unknown as WakebComponent<"WSegmentedProgress">;
export const WSemiCircleGauge = /* @__PURE__ */ defineWakebFacade("WSemiCircleGauge", WSemiCircleGaugeRenderer) as unknown as WakebComponent<"WSemiCircleGauge">;
export const WAvatarStack = /* @__PURE__ */ defineWakebFacade("WAvatarStack", WAvatarStackRenderer) as unknown as WakebComponent<"WAvatarStack">;
export const WLoading = /* @__PURE__ */ defineWakebFacade("WLoading", WLoadingRenderer) as unknown as WakebComponent<"WLoading">;
export const WPageSkeleton = /* @__PURE__ */ defineWakebFacade("WPageSkeleton", WPageSkeletonRenderer) as unknown as WakebComponent<"WPageSkeleton">;
export const WVerticalSteps = /* @__PURE__ */ defineWakebFacade("WVerticalSteps", WVerticalStepsRenderer) as unknown as WakebComponent<"WVerticalSteps">;
export const WButton = /* @__PURE__ */ defineWakebFacade("WButton", WButtonRenderer) as unknown as WakebComponent<"WButton">;
export const WBadge = /* @__PURE__ */ defineWakebFacade("WBadge", WBadgeRenderer) as unknown as WakebComponent<"WBadge">;
export const WAccordion = /* @__PURE__ */ defineWakebFacade("WAccordion", WAccordionRenderer) as unknown as WakebComponent<"WAccordion">;
export const WBadgeStack = /* @__PURE__ */ defineWakebFacade("WBadgeStack", WBadgeStackRenderer) as unknown as WakebComponent<"WBadgeStack">;
export const WUserBadge = /* @__PURE__ */ defineWakebFacade("WUserBadge", WUserBadgeRenderer) as unknown as WakebComponent<"WUserBadge">;
export const WTooltipBtn = /* @__PURE__ */ defineWakebFacade("WTooltipBtn", WTooltipBtnRenderer) as unknown as WakebComponent<"WTooltipBtn">;
export const WTabs = /* @__PURE__ */ defineWakebFacade("WTabs", WTabsRenderer) as unknown as WakebComponent<"WTabs">;
export const WTree = /* @__PURE__ */ defineWakebFacade("WTree", WTreeRenderer) as unknown as WakebComponent<"WTree">;
export const WDropdown = /* @__PURE__ */ defineWakebFacade("WDropdown", WDropdownRenderer) as unknown as WakebComponent<"WDropdown">;
export const WCarousel = /* @__PURE__ */ defineWakebFacade("WCarousel", WCarouselRenderer) as unknown as WakebComponent<"WCarousel">;
export const WExportDropdown = /* @__PURE__ */ defineWakebFacade("WExportDropdown", WExportDropdownRenderer) as unknown as WakebComponent<"WExportDropdown">;
export const WBaseSidebar = /* @__PURE__ */ defineWakebFacade("WBaseSidebar", WBaseSidebarRenderer) as unknown as WakebComponent<"WBaseSidebar">;
export const WModal = /* @__PURE__ */ defineWakebFacade("WModal", WModalRenderer) as unknown as WakebComponent<"WModal">;
export const WDrawer = /* @__PURE__ */ defineWakebFacade("WDrawer", WDrawerRenderer) as unknown as WakebComponent<"WDrawer">;

export type { TruncatedTextProps, SegmentedProgressProps, SemiCircleGaugeProps } from "./types";
export type { AvatarStackProps, LoadingProps, SkeletonItem, SkeletonRow, PageSkeletonProps, VerticalStep, VerticalStepsProps } from "./types";
export type { ComponentClass, SharedIcon, WakebSvgIcon, WakebIconComponent, WakebIconDefinition, IconSlotProps, ButtonProps, BadgeProps, AccordionProps, WakebVariant, WakebDeprecatedVariant, WakebIntent, WakebColor, WakebSkeletonName, WakebBadgeType, WakebProviderProps } from "./types";
export type { BadgeStackItem, BadgeStackProps, BadgeStackIconSlotProps, BadgeUser, UserBadgeProps, TooltipBtnProps } from "./types";
export type { NavigationKey, TabContext, TabItem, TabsProps, TreeNode, TreeToggleSlotProps, TreeProps, DropdownItem, DropdownProps } from "./types";
export type { CarouselProps, ExportFormat, ExportDropdownProps, SidebarItem, BaseSidebarProps } from "./types";
export type { ModalProps, DrawerProps } from "./types";
export type { WakebFacade, WakebComponent, WakebComponentEmits, WakebComponentSlots, AccordionTriggerProps } from "./contracts";
export type { AccordionEmits, ButtonEmits, TabsEmits, TreeEmits, DropdownEmits, CarouselEmits, ExportDropdownEmits, BaseSidebarEmits, ModalEmits, DrawerEmits } from "./contracts";
export type { TruncatedTextSlots, SegmentedProgressSlots, SemiCircleGaugeSlots, AvatarStackSlots, LoadingSlots, PageSkeletonSlots, VerticalStepsSlots, ButtonSlots, BadgeSlots, AccordionSlots, BadgeStackSlots } from "./contracts";
export type { UserBadgeSlots, TooltipBtnSlots, TabsSlots, TreeSlots, DropdownSlots, CarouselSlots, ExportDropdownSlots, BaseSidebarSlots, ModalSlots, DrawerSlots } from "./contracts";
export { createWakebComponents } from "./core/plugin";
export { WakebError } from "./core/errors";
export type { WakebErrorCode } from "./core/errors";
export type { WakebCapabilities, WakebComponentName, WakebComponentProps, WakebComponentsOptions, WakebDefaults, WakebFramework, WakebIconsOptions, WakebPlugin, WakebProviderMode, WakebProviderOptions, WakebTheme, WakebThemeTokens } from "./core/options";

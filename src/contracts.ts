/*
 * Provider-neutral component contracts (SPEC R01, R05, R14). Props come from ./types; this file adds the
 * exact event payload tuples and slot payloads. The public type of every facade in ./index is built
 * here, never from a renderer file, so every provider renderer must conform to these declarations.
 * tests/types/conformance.ts checks each renderer against them with vue-tsc. No provider type may
 * appear in this file.
 */
import type { ComponentOptionsMixin, ComponentProvideOptions, DefineComponent, EmitsToProps, PublicProps } from "vue";
import type { WakebComponentName, WakebComponentProps } from "./core/options";
import type {
  BadgeStackIconSlotProps,
  BadgeStackItem,
  BadgeUser,
  ButtonProps,
  DropdownItem,
  ExportFormat,
  IconSlotProps,
  NavigationKey,
  SharedIcon,
  SidebarItem,
  TabItem,
  TreeNode,
  TreeToggleSlotProps,
  VerticalStep,
} from "./types";

/** Maps event names to payload tuples, as in `defineEmits<{ click: [event: MouseEvent] }>()`. */
type EmitsOptionsOf<E> = { [K in keyof E]: (...args: Extract<E[K], unknown[]>) => any };

/**
 * Public component type for a facade: props, `on*` handlers derived from the event map (event name to
 * payload tuple) and typed slots. It has the same shape vue-tsc gives a `<script setup>` component, so
 * `$props`, emitted handler types and template slot inference work in `.vue` and `.ts` consumers alike.
 */
export type WakebFacade<P extends object, E, S> = DefineComponent<
  P,
  {},
  {},
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  EmitsOptionsOf<E>,
  string,
  PublicProps,
  Readonly<P> & Readonly<EmitsToProps<EmitsOptionsOf<E>>>,
  {},
  {},
  {},
  {},
  string,
  ComponentProvideOptions,
  false,
  {},
  any
> & { new (): { $slots: S } };

/* Events. Components without events use an empty map. */
export interface AccordionEmits { "update:modelValue": [value: boolean]; }
export interface ButtonEmits { click: [event: MouseEvent]; }
export interface TabsEmits { updateTab: [value: NavigationKey | undefined]; }
export interface TreeEmits { "node-click": [node: TreeNode]; toggle: [node: TreeNode]; }
export interface DropdownEmits { selectedItem: [item: DropdownItem]; "update:modelValue": [value: NavigationKey]; }
export interface CarouselEmits { "update:modelValue": [index: number]; }
export interface ExportDropdownEmits { select: [value: string]; }
export interface BaseSidebarEmits { search: [payload: unknown]; filterClick: []; filterCancel: []; }
export interface ModalEmits { "update:modelValue": [value: boolean]; afterLeave: []; }
export interface DrawerEmits { "update:modelValue": [value: boolean]; close: []; }
type NoEvents = {};

/* Slots. A slot without a payload is declared with no parameter. */
export interface TruncatedTextSlots { default?(props: { text: string; label: string; truncated: boolean }): unknown; }
export interface SegmentedProgressSlots { default?(props: { value: number; label: string }): unknown; }
export interface SemiCircleGaugeSlots { default?(props: { value: number; label: string; subLabel: string }): unknown; }
export interface AvatarStackSlots {
  avatar(props: { item: unknown; index: number; label: string; avatar: string; initials: string }): unknown;
  overflow(props: { count: number }): unknown;
}
export interface LoadingSlots { default?(props: {}): unknown; }
/** WPageSkeleton renders no slots. */
export type PageSkeletonSlots = {};
export interface VerticalStepsSlots {
  indicator(props: { step: VerticalStep; index: number }): unknown;
  icon(props: { step: VerticalStep; index: number }): unknown;
  title(props: { step: VerticalStep; index: number }): unknown;
  timeIcon(props: { step: VerticalStep; index: number }): unknown;
  dateIcon(props: { step: VerticalStep; index: number }): unknown;
}
export interface ButtonSlots {
  icon(props: IconSlotProps): unknown;
  dropdown(props: IconSlotProps): unknown;
  content(): unknown;
  default(): unknown;
}
export interface BadgeSlots {
  icon(props: { icon: SharedIcon; size: string | number }): unknown;
  actions(): unknown;
  default(): unknown;
}
/** Attributes and handler a custom WAccordion header binds to its own toggle control. */
export interface AccordionTriggerProps {
  type: "button";
  "aria-expanded": boolean;
  "aria-controls": string;
  "aria-label": string;
  onClick: (event: MouseEvent) => void;
}
export interface AccordionSlots {
  header(props: { open: boolean; toggle: () => void; triggerProps: AccordionTriggerProps }): unknown;
  actions(props: { open: boolean; toggle: () => void }): unknown;
  default(props: { open: boolean }): unknown;
  toggleIcon(props: IconSlotProps): unknown;
}
export interface BadgeStackSlots {
  icon?(props: BadgeStackIconSlotProps): unknown;
  badgeIcon?(props: { item: BadgeStackItem; icon: SharedIcon | undefined; size: string | number }): unknown;
  label?(props: { item: BadgeStackItem; text: string; overflow: boolean }): unknown;
}
export interface UserBadgeSlots {
  avatar?(props: { user: BadgeUser; avatar: string; initials: string; size: string | number }): unknown;
  default?(props: { user: BadgeUser }): unknown;
  actions?(props: { user: BadgeUser }): unknown;
}
export interface TooltipBtnSlots { icon?(props: { icon: SharedIcon | undefined }): unknown; }
/** Panel slots are named after each tab key and, like `header` and `actions`, receive no payload. */
export interface TabsSlots {
  [name: string]: (props: any) => unknown;
  "tab-label"(props: { tabItem: TabItem; index: number }): unknown;
  "tab-icon"(props: { tabItem: TabItem; index: number; size: string | number }): unknown;
}
export interface TreeSlots {
  node?(props: { node: TreeNode; level: number; expanded: boolean }): unknown;
  actions?(props: { node: TreeNode; level: number }): unknown;
  "toggle-leading"?(props: TreeToggleSlotProps): unknown;
  "toggle-trailing"?(props: TreeToggleSlotProps): unknown;
}
export interface DropdownSlots {
  activator?(props: { props: Record<string, unknown>; isActive: boolean; buttonProps: ButtonProps }): unknown;
  "item-icon"?(props: { item: DropdownItem; color: string }): unknown;
  "item-label"?(props: { item: DropdownItem; text: string }): unknown;
}
export interface CarouselSlots {
  slide?(props: { slide: unknown; index: number }): unknown;
  prev?(props: { props: Record<string, unknown> }): unknown;
  next?(props: { props: Record<string, unknown> }): unknown;
}
export interface ExportDropdownSlots {
  activator?(props: { props: Record<string, unknown>; buttonProps: ButtonProps }): unknown;
  "format-icon"?(props: { format: ExportFormat; index: number }): unknown;
  "format-label"?(props: { format: ExportFormat; index: number }): unknown;
}
export interface BaseSidebarSlots {
  "header-actions"?(props: { isFiltered: boolean; filterClick: () => void; filterCancel: () => void }): unknown;
  content?(props: { search: (payload: unknown) => void }): unknown;
  search?(props: { search: (payload: unknown) => void }): unknown;
  item?(props: { item: SidebarItem; index: number }): unknown;
  loading?(props: { type: string; width: string | number }): unknown;
  empty?(props: { label: string }): unknown;
  "filter-modal"(): unknown;
}
export interface ModalSlots {
  activator(props: { props: Record<string, unknown>; isActive: boolean }): unknown;
  header(props: { close: () => void }): unknown;
  title(): unknown;
  "header-icon"(): unknown;
  "header-decoration"(): unknown;
  "header-actions"(): unknown;
  "close-button"(props: { close: () => void; label: string }): unknown;
  content(): unknown;
  default(): unknown;
  actions(): unknown;
  loading(props: { label: string }): unknown;
  "loading-overlay"(props: { label: string }): unknown;
}
export interface DrawerSlots {
  title(): unknown;
  "header-actions"(): unknown;
  "close-button"(props: { close: () => void; label: string }): unknown;
  content(): unknown;
  default(): unknown;
  actions(): unknown;
  loading(props: { label: string }): unknown;
  "loading-overlay"(props: { label: string }): unknown;
}

/** Event payload tuples of each component, keyed by its exported name. */
export interface WakebComponentEmits {
  WTruncatedText: NoEvents;
  WSegmentedProgress: NoEvents;
  WSemiCircleGauge: NoEvents;
  WAvatarStack: NoEvents;
  WLoading: NoEvents;
  WPageSkeleton: NoEvents;
  WVerticalSteps: NoEvents;
  WButton: ButtonEmits;
  WBadge: NoEvents;
  WAccordion: AccordionEmits;
  WBadgeStack: NoEvents;
  WUserBadge: NoEvents;
  WTooltipBtn: NoEvents;
  WTabs: TabsEmits;
  WTree: TreeEmits;
  WDropdown: DropdownEmits;
  WCarousel: CarouselEmits;
  WExportDropdown: ExportDropdownEmits;
  WBaseSidebar: BaseSidebarEmits;
  WModal: ModalEmits;
  WDrawer: DrawerEmits;
}

/** Slot payloads of each component, keyed by its exported name. */
export interface WakebComponentSlots {
  WTruncatedText: TruncatedTextSlots;
  WSegmentedProgress: SegmentedProgressSlots;
  WSemiCircleGauge: SemiCircleGaugeSlots;
  WAvatarStack: AvatarStackSlots;
  WLoading: LoadingSlots;
  WPageSkeleton: PageSkeletonSlots;
  WVerticalSteps: VerticalStepsSlots;
  WButton: ButtonSlots;
  WBadge: BadgeSlots;
  WAccordion: AccordionSlots;
  WBadgeStack: BadgeStackSlots;
  WUserBadge: UserBadgeSlots;
  WTooltipBtn: TooltipBtnSlots;
  WTabs: TabsSlots;
  WTree: TreeSlots;
  WDropdown: DropdownSlots;
  WCarousel: CarouselSlots;
  WExportDropdown: ExportDropdownSlots;
  WBaseSidebar: BaseSidebarSlots;
  WModal: ModalSlots;
  WDrawer: DrawerSlots;
}

/** The public type of the named facade. */
export type WakebComponent<C extends WakebComponentName> = WakebFacade<
  WakebComponentProps[C],
  WakebComponentEmits[C],
  WakebComponentSlots[C]
>;

import type * as Props from "../types";

export type WakebFramework ="vuetify" | "primevue" | "shadcn";
export const FRAMEWORKS: readonly WakebFramework[] = ["vuetify", "primevue", "shadcn"];

/**
 * How Wakeb obtains the provider instance (SPEC R24).
 * - auto: reuse a compatible host instance on the same app, otherwise install one.
 * - reuse: require a host instance installed before Wakeb.
 * - install: Wakeb installs the provider and fails if the host already did.
 */
export type WakebProviderMode = "auto" | "reuse" | "install";

export interface WakebProviderOptions<F extends WakebFramework> {
  kind: F;
  mode?: WakebProviderMode;
  /** Native provider options used only when Wakeb installs the provider. Not portable. */
  options?: Readonly<Record<string, unknown>>;
}

/** Public props of each component, keyed by its exported name. */
export interface WakebComponentProps {
  WTruncatedText: Props.TruncatedTextProps;
  WSegmentedProgress: Props.SegmentedProgressProps;
  WSemiCircleGauge: Props.SemiCircleGaugeProps;
  WAvatarStack: Props.AvatarStackProps;
  WLoading: Props.LoadingProps;
  WPageSkeleton: Props.PageSkeletonProps;
  WVerticalSteps: Props.VerticalStepsProps;
  WButton: Props.ButtonProps;
  WBadge: Props.BadgeProps;
  WAccordion: Props.AccordionProps;
  WBadgeStack: Props.BadgeStackProps;
  WUserBadge: Props.UserBadgeProps;
  WTooltipBtn: Props.TooltipBtnProps;
  WTabs: Props.TabsProps;
  WTree: Props.TreeProps;
  WDropdown: Props.DropdownProps;
  WCarousel: Props.CarouselProps;
  WExportDropdown: Props.ExportDropdownProps;
  WBaseSidebar: Props.BaseSidebarProps;
  WModal: Props.ModalProps;
  WDrawer: Props.DrawerProps;
}
export type WakebComponentName = keyof WakebComponentProps;

/** Data and model props stay on each instance (SPEC R06). */
type ControlledProp =
  | "items" | "nodes" | "tabs" | "steps" | "slides" | "config" | "user" | "menuItems" | "formats"
  | "modelValue" | "selectedTab" | "expandedKeys" | "activeKey" | "activePath" | "editingNodeId";
/** Keys whose values are callbacks; plugin defaults cannot hold them. */
type CallbackProp<P> = { [K in keyof P]-?: NonNullable<P[K]> extends (...args: never[]) => unknown ? K : never }[keyof P];

/** Plugin-wide component defaults: props only, shallow, with data, model and callback props excluded. */
export type WakebDefaults = {
  [C in WakebComponentName]?: Partial<Omit<WakebComponentProps[C], ControlledProp | CallbackProp<WakebComponentProps[C]>>>;
};

/** Semantic tokens written to `--wakeb-ui-*` variables (kebab-case keys). */
export interface WakebThemeTokens {
  primary?: string;
  onPrimary?: string;
  /** Intent colors (SPEC R23). `primary` above is also the primary intent. */
  secondary?: string;
  success?: string;
  warning?: string;
  danger?: string;
  info?: string;
  neutral?: string;
  surface?: string;
  onSurface?: string;
  muted?: string;
  border?: string;
  focus?: string;
  radius?: string;
  spacing?: string;
  fontFamily?: string;
  zIndexOverlay?: number;
}

export interface WakebTheme {
  mode?: "light" | "dark";
  tokens?: WakebThemeTokens;
}

interface WakebBaseOptions {
  defaults?: WakebDefaults;
  locale?: "en" | "ar";
  direction?: "ltr" | "rtl";
  theme?: WakebTheme;
}

export type WakebComponentsOptions = {
  [F in WakebFramework]: WakebBaseOptions & { framework: F; providerOptions?: WakebProviderOptions<F> };
}[WakebFramework];

/** Implemented components per provider; alpha adapters report what they do not cover yet (SPEC R21). */
export interface WakebCapabilities {
  readonly version: 1;
  readonly framework: WakebFramework;
  readonly components: readonly string[];
}

export interface WakebPlugin {
  readonly framework: WakebFramework;
  readonly capabilities: WakebCapabilities;
  install(app: import("vue").App): void;
}

/** What a provider service module exports; the build integration selects exactly one. */
export interface WakebProviderServices {
  readonly framework: WakebFramework | null;
  readonly components: readonly string[];
  installProvider(
    app: import("vue").App,
    options: { mode: WakebProviderMode; options?: Readonly<Record<string, unknown>> },
  ): { reused: boolean };
}

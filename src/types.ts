import type { CSSProperties } from "vue";
/** Portable intents (SPEC R23), mapped to `--wakeb-ui-*` tokens on every provider. */
export type WakebIntent = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral";
/**
 * A portable color: a Wakeb intent or a CSS color value. Provider theme and palette names (for
 * example Vuetify `error` or `red-darken-2`) are not portable.
 */
export type WakebColor =
  | WakebIntent
  | `#${string}`
  | `rgb(${string})` | `rgba(${string})` | `hsl(${string})` | `hsla(${string})` | `hwb(${string})`
  | `lab(${string})` | `lch(${string})` | `oklab(${string})` | `oklch(${string})` | `color(${string})` | `color-mix(${string})`
  | `var(--${string})`
  | "transparent" | "currentColor";
/**
 * @deprecated A 0.7 provider color name, such as the Vuetify theme name `error` or the palette name
 * `red-darken-2`. It type-checks during the one-major deprecation window only on the props that still
 * render it: WLoading `color`, and WAvatarStack and WUserBadge `avatarColor`. Under Vuetify it renders
 * as before with `WAKEB_DEPRECATED_VALUE`; under PrimeVue and shadcn-vue the prop falls back with
 * `WAKEB_UNKNOWN_VALUE`. Use a {@link WakebColor} (an intent or a CSS color) instead. Removed in the
 * next major release; type a value as `WakebColor` to reject provider names today.
 */
export type WakebDeprecatedColor = string & {};
/** Portable skeleton names (SPEC R16). Skeleton props take a comma-separated list of these, each optionally `@N`. */
export type WakebSkeletonName =
  | "text" | "paragraph" | "heading" | "avatar" | "image" | "button" | "chip" | "list-item" | "list-item-avatar"
  | "list-item-two-line" | "list-item-three-line" | "list-item-avatar-two-line" | "list-item-avatar-three-line"
  | "table" | "table-row" | "card";
/** WBadge style keys, rendered by Wakeb CSS on every provider (frozen in M0). */
export type WakebBadgeType =
  | "success" | "success-transparent" | "primary" | "primarybtn" | "danger" | "danger-transparent" | "warning" | "info"
  | "transparent" | "dark" | "tertiary" | "outline" | "outline-secondary" | "check" | "uncheck";
/**
 * @deprecated A 0.7 badge type outside the {@link WakebBadgeType} list, which 0.7 forwarded to Vuetify
 * as the chip color (for example `teal`). It type-checks during the one-major deprecation window: under
 * Vuetify it is still passed as the chip color with `WAKEB_DEPRECATED_VALUE`; under PrimeVue and
 * shadcn-vue it falls back to `primary` with `WAKEB_UNKNOWN_VALUE`. Use a `WakebBadgeType` instead.
 * Removed in the next major release; type a value as `WakebBadgeType` to reject other names today.
 */
export type WakebDeprecatedBadgeType = string & {};
/**
 * Native props and listeners for the selected provider's primitive (SPEC R12). Not portable: the keys
 * belong to whichever provider the build selected. Wakeb-owned bindings, portable attributes
 * (class, style, id, role, aria-*, data-*) and keys the primitive does not declare are ignored.
 */
export type WakebProviderProps = Record<string, unknown>;
export interface TruncatedTextProps {
  label?: string;
  length?: number;
  tooltipLocation?: "top" | "bottom" | "start" | "end";
  tooltipMaxWidth?: string | number;
  contentClass?: string;
  tooltipStyle?: CSSProperties;
}
export interface SegmentedProgressProps { value?: number; label?: string; color?: WakebColor; ariaLabel?: string; }
export interface SemiCircleGaugeProps { value?: number; size?: number; thickness?: number; label?: string; subLabel?: string; ariaLabel?: string; }

/** Stack entries may use arbitrary nested fields; labels are rendered as escaped text. */
export interface AvatarStackProps {
  items?: readonly unknown[];
  max?: number;
  size?: string | number;
  avatarColor?: WakebColor | WakebDeprecatedColor;
  showOverflowMenu?: boolean;
  showTooltip?: boolean;
  itemKey?: string;
  nameKey?: string;
  avatarKey?: string;
  unknownLabel?: string;
  overflowLabel?: string;
  menuStyle?: CSSProperties;
  tooltipStyle?: CSSProperties;
}
export interface LoadingProps { size?: string | number; color?: WakebColor | WakebDeprecatedColor; label?: string; providerProps?: WakebProviderProps; }
export interface SkeletonItem {
  type?: string;
  width?: string | number;
  height?: string | number;
  class?: string | string[] | Record<string, boolean>;
}
export interface SkeletonRow {
  repeat?: number;
  cols?: string | number | boolean;
  sm?: string | number | boolean;
  md?: string | number | boolean;
  lg?: string | number | boolean;
  variant?: "default" | "card" | "chart" | "form" | "tabs" | "table";
  rowClass?: string | string[] | Record<string, boolean>;
  colClass?: string | string[] | Record<string, boolean>;
  classList?: string | string[] | Record<string, boolean>;
  header?: readonly SkeletonItem[];
  items?: readonly SkeletonItem[];
}
export interface PageSkeletonProps { config: readonly SkeletonRow[]; direction?: "row" | "column"; label?: string; }
export interface VerticalStep { title?: string; time?: string; date?: string; is_active?: boolean; }
export interface VerticalStepsProps { steps?: readonly VerticalStep[]; label?: string; }

export type ComponentClass = string | Record<string, boolean> | ComponentClass[];
/** SVG path data on a 24x24 viewBox; a path may carry a fill opacity (SPEC R15). */
export type WakebSvgIcon = readonly (string | readonly [path: string, opacity: number])[];
/** A Vue component that renders an icon. */
export type WakebIconComponent = { new (): import("vue").ComponentPublicInstance } | import("vue").FunctionalComponent;
/** What an icon name resolves to: SVG path data or a component, never an HTML string. */
export type WakebIconDefinition = WakebSvgIcon | WakebIconComponent;
/**
 * Icon prop value (SPEC R15): a name resolved by the `icons` plugin option, a Wakeb built-in or the
 * selected provider's icon set; SVG path data (`svg:<path>` strings are also accepted); or a Vue component.
 */
export type SharedIcon = string | WakebIconDefinition;
export interface IconSlotProps { icon: SharedIcon; size: string | number; color: string; maxWidth: string | number; }
export interface ButtonProps {
  isTooltip?: boolean;
  location?: "top" | "bottom" | "start" | "end";
  title?: string;
  classList?: ComponentClass;
  iconPosition?: "start" | "end";
  type?: string;
  size?: string;
  isLoading?: boolean;
  isDropdown?: boolean;
  action?: "button" | "submit" | "reset";
  disabled?: boolean;
  icon?: SharedIcon;
  iconSize?: string | number;
  maxIconWidth?: string | number;
  iconColorType?: "danger" | "primary" | "success" | "warning" | "currentColor";
  customIconColor?: string;
  wrapperAttrs?: Record<string, unknown>;
  providerProps?: WakebProviderProps;
}
/** Portable style variants (SPEC R23), rendered on every provider. */
export type WakebVariant = "soft" | "solid" | "outline" | "ghost";
/**
 * @deprecated Baseline 0.7 variant names, accepted on every provider with `WAKEB_DEPRECATED_VALUE`
 * until the next major release. Use the matching {@link WakebVariant} instead.
 */
export type WakebDeprecatedVariant = "default" | "tonal" | "flat" | "elevated" | "outlined" | "text" | "plain";
export interface BadgeProps {
  label?: string;
  classList?: ComponentClass;
  type?: WakebBadgeType | WakebDeprecatedBadgeType;
  icon?: SharedIcon;
  isDot?: boolean;
  borderRadius?: string;
  customBorderRadius?: string;
  customPadding?: string;
  dotColor?: WakebColor;
  variant?: WakebVariant | WakebDeprecatedVariant;
  iconSize?: string | number;
  iconPosition?: "before" | "after";
  chipAttrs?: Record<string, unknown>;
}
export interface AccordionProps {
  title?: string;
  modelValue?: boolean;
  classList?: ComponentClass;
  icon?: SharedIcon;
  noBorder?: boolean;
  beforeIcon?: boolean;
  afterIcon?: boolean;
  iconColor?: WakebColor;
  iconSize?: string | number;
  maxIconWidth?: string | number;
  headerTitleClassList?: ComponentClass;
  headerClassList?: ComponentClass;
  bodyClassList?: ComponentClass;
  transparent?: boolean;
  toggleLabel?: string;
  contentId?: string;
}

export interface BadgeStackItem {
  id?: string | number;
  label?: string;
  icon?: string;
  color?: WakebColor;
  type?: WakebBadgeType | WakebDeprecatedBadgeType;
  variant?: BadgeProps["variant"];
  borderRadius?: string;
  customBorderRadius?: string;
  customPadding?: string;
  dotColor?: WakebColor;
  isDot?: boolean;
  classList?: ComponentClass;
  badgeIcon?: SharedIcon;
  iconSize?: string | number;
  iconPosition?: "before" | "after";
}
export interface BadgeStackProps {
  items?: readonly BadgeStackItem[];
  max?: number;
  truncateLength?: number;
  showOverflowMenu?: boolean;
  badgeType?: WakebBadgeType | WakebDeprecatedBadgeType;
  badgeVariant?: BadgeProps["variant"];
  badgeBorderRadius?: string;
  customBorderRadius?: string;
  badgePadding?: string;
  dotColor?: WakebColor;
  badgeClassList?: ComponentClass;
  isDot?: boolean;
  iconSize?: string | number;
  iconPosition?: "before" | "after";
  iconVariant?: "default" | "circle";
  iconBackgroundOpacity?: number;
  customOverflowBorderRadius?: string;
  overflowLabel?: string;
  overflowTag?: "button" | "div";
  menuStyle?: CSSProperties;
  badgeAttrs?: Record<string, unknown>;
}
export interface BadgeStackIconSlotProps {
  item: BadgeStackItem;
  index: number;
  overflow: boolean;
  variant: "default" | "circle";
  style: CSSProperties;
}
export interface BadgeUser { name?: string; avatar?: string; }
export interface UserBadgeProps {
  user?: BadgeUser;
  type?: WakebBadgeType | WakebDeprecatedBadgeType;
  borderRadius?: string;
  icon?: SharedIcon;
  iconSize?: string | number;
  iconPosition?: "before" | "after";
  avatarSize?: string | number;
  avatarColor?: WakebColor | WakebDeprecatedColor;
}
export interface TooltipBtnProps {
  icon?: SharedIcon;
  text?: string;
  ariaLabel?: string | null;
  btnIcon?: boolean;
  variant?: WakebVariant | WakebDeprecatedVariant;
  location?: "top" | "bottom" | "start" | "end";
  openDelay?: string | number;
  contentClass?: string;
  tooltipStyle?: CSSProperties;
  wrapperAttrs?: Record<string, unknown>;
}

export type NavigationKey = string | number;
export interface TabContext { value: unknown; isSelected: boolean; }
export interface TabItem {
  [field: string]: unknown;
  label?: string;
  slot?: NavigationKey;
  icon?: SharedIcon;
  notification?: string | number;
  sectionLabel?: string;
  content?: string | number;
  customHTML?: string | ((item: TabItem, context: TabContext) => string);
  itemClassList?: ComponentClass | ((item: TabItem, index: number, context: TabContext) => ComponentClass);
}
export interface TabsProps {
  styleType?: "outlined" | "filled" | "none" | "minimal";
  isVertical?: boolean;
  tabs: readonly TabItem[];
  selectedTab?: NavigationKey | null;
  isSwitcherOnly?: boolean;
  valueKey?: string;
  iconOnly?: boolean;
  tabHeight?: string | number | null;
  iconSize?: string | number;
  classList?: ComponentClass;
  contentGap?: string | number | null;
  ariaLabel?: string;
}
export interface TreeNode { [field: string]: unknown; id?: NavigationKey; name?: string; description?: string; children?: readonly TreeNode[]; }
export interface TreeToggleSlotProps { node: TreeNode; level: number; expanded: boolean; hasChildren: boolean; toggle: () => void; }
export interface TreeProps {
  nodes?: readonly TreeNode[];
  itemKey?: string;
  itemLabel?: string;
  itemDescription?: string;
  childrenKey?: string;
  level?: number;
  isRoot?: boolean;
  expandedKeys?: readonly NavigationKey[];
  activeKey?: NavigationKey | null;
  activePath?: readonly NavigationKey[];
  rtl?: boolean;
  editingNodeId?: NavigationKey | null;
  keyboardNavigation?: boolean;
  ariaLabel?: string;
  toggleLabel?: string;
}
export interface DropdownItem { [field: string]: unknown; label: string; value?: NavigationKey | null; icon?: SharedIcon; color?: string; disabled?: boolean; to?: unknown; href?: string; }
export interface DropdownProps {
  menuItems?: readonly DropdownItem[];
  title?: string;
  icon?: SharedIcon;
  iconColor?: string;
  showSelected?: boolean;
  showBoth?: boolean;
  iconPosition?: "start" | "end";
  type?: string;
  classList?: ComponentClass;
  size?: string;
  isLinks?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  showChevron?: boolean;
  modelValue?: NavigationKey | null;
  expandIcon?: SharedIcon;
  collapseIcon?: SharedIcon;
  labelFormatter?: (label: string | undefined) => string;
  colorMap?: Record<string, string>;
  menuStyle?: CSSProperties;
  providerProps?: WakebProviderProps;
}

export interface CarouselProps {
  slides?: readonly unknown[];
  modelValue?: number;
  interval?: number;
  cycle?: boolean;
  showArrows?: boolean | "hover";
  showIndicators?: boolean;
  height?: string | number;
  ariaLabel?: string;
  indicatorLabel?: (index: number) => string;
  indicatorAttrs?: Record<string, unknown>;
  keyboardIndicators?: boolean;
}
export interface ExportFormat { label: string; value: string; icon?: SharedIcon; disabled?: boolean; }
export interface ExportDropdownProps {
  isLoading?: boolean;
  disabled?: boolean;
  title?: string;
  formats?: readonly ExportFormat[];
  menuStyle?: CSSProperties;
}
export interface SidebarItem { [field: string]: unknown; id?: NavigationKey; }
export interface BaseSidebarProps {
  title: string;
  loading?: boolean;
  items?: readonly SidebarItem[];
  skeletonType?: string;
  hasFilter?: boolean;
  isFiltered?: boolean;
  skeletonWidth?: string | number;
  itemKey?: string;
  filterLabel?: string;
  cancelLabel?: string;
  emptyLabel?: string;
}

export interface ModalProps {
  modelValue?: boolean;
  width?: string | number;
  title?: string;
  description?: string;
  persistent?: boolean;
  closable?: boolean;
  loading?: boolean;
  dataLoaded?: boolean;
  showActions?: boolean;
  titleClass?: ComponentClass;
  headerIcon?: SharedIcon;
  closeLabel?: string;
  loadingLabel?: string;
  ariaLabel?: string;
  providerProps?: WakebProviderProps;
}
export interface DrawerProps {
  modelValue?: boolean;
  title?: string;
  width?: string | number;
  position?: "start" | "end";
  persistent?: boolean;
  transparentOverlay?: boolean;
  closable?: boolean;
  loading?: boolean;
  dataLoaded?: boolean;
  closeLabel?: string;
  loadingLabel?: string;
  ariaLabel?: string;
}

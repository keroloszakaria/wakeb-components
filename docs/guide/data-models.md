# Data models

Public descriptor types are exported from the package root. These are presentational records; the host formats dates and supplies translations. Repeat, grid and fallback rules are documented on each component page.

```ts
import type { ButtonProps, BadgeProps, AccordionProps, IconSlotProps, AvatarStackProps, SkeletonRow, VerticalStep } from 'wakeb-components'
```

```ts
import type { CSSProperties } from "vue";
export interface TruncatedTextProps {
  label?: string;
  length?: number;
  tooltipLocation?: "top" | "bottom" | "start" | "end";
  tooltipMaxWidth?: string | number;
  contentClass?: string;
  tooltipStyle?: CSSProperties;
}
export interface SegmentedProgressProps { value?: number; label?: string; color?: string; ariaLabel?: string; }
export interface SemiCircleGaugeProps { value?: number; size?: number; thickness?: number; label?: string; subLabel?: string; ariaLabel?: string; }

/** Stack entries may use arbitrary nested fields; labels are rendered as escaped text. */
export interface AvatarStackProps {
  items?: readonly unknown[];
  max?: number;
  size?: string | number;
  avatarColor?: string;
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
export interface LoadingProps { size?: string | number; color?: string; label?: string; }
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
export type SharedIcon = string | (string | [path: string, opacity: number])[] | import("vuetify").JSXComponent;
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
}
export interface BadgeProps {
  label?: string;
  classList?: ComponentClass;
  type?: string;
  icon?: SharedIcon;
  isDot?: boolean;
  borderRadius?: string;
  customBorderRadius?: string;
  customPadding?: string;
  dotColor?: string;
  variant?: "default" | "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
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
  iconColor?: string;
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
  color?: string;
  type?: string;
  variant?: BadgeProps["variant"];
  borderRadius?: string;
  customBorderRadius?: string;
  customPadding?: string;
  dotColor?: string;
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
  badgeType?: string;
  badgeVariant?: BadgeProps["variant"];
  badgeBorderRadius?: string;
  customBorderRadius?: string;
  badgePadding?: string;
  dotColor?: string;
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
  type?: string;
  borderRadius?: string;
  icon?: SharedIcon;
  iconSize?: string | number;
  iconPosition?: "before" | "after";
  avatarSize?: string | number;
  avatarColor?: string;
}
export interface TooltipBtnProps {
  icon?: SharedIcon;
  text?: string;
  ariaLabel?: string | null;
  btnIcon?: boolean;
  variant?: "text" | "flat" | "elevated" | "tonal" | "outlined" | "plain";
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

```

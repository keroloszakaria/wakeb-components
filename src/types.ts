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

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

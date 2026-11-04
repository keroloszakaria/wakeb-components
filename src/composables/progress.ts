import { computed, useId } from "vue";
import { useColor } from "../core/vocabulary";
import type { SegmentedProgressProps, SemiCircleGaugeProps } from "../types";

/*
 * Provider-neutral progress and gauge behavior shared by every renderer (SPEC R03, M3): value
 * clamping, color resolution, accessible names and SVG geometry. Renderers only paint the result.
 */

/** Clamps a progress value to 0–100; non-numeric and NaN values become 0. */
export const clampPercent = (value: unknown) => Math.min(100, Math.max(0, Number(value) || 0));

const PROGRESS_COLOR = "var(--wakeb-progress-color, #12b76a)";

export const segmentedProgressDefaults = { value: 0, label: "", color: PROGRESS_COLOR, ariaLabel: "" } as const;

/** WSegmentedProgress: the clamped value, the resolved fill color and the accessible name. */
export function useSegmentedProgress(props: Readonly<Required<SegmentedProgressProps>>) {
  const toColor = useColor("WSegmentedProgress");
  const value = computed(() => clampPercent(props.value));
  const fillColor = computed(() => toColor(props.color, "color", PROGRESS_COLOR).css);
  const name = computed(() => props.ariaLabel || props.label || `${value.value}%`);
  return { value, fillColor, name };
}

export const semiCircleGaugeDefaults = { value: 0, size: 154, thickness: 0, label: "", subLabel: "", ariaLabel: "" } as const;

/**
 * WSemiCircleGauge geometry. Invalid sizes fall back to 154 and the band to 23.6% of the size, capped
 * at half of it. SVG IDs come from Vue useId, so they are distinct per instance and stable across SSR.
 */
export function useSemiCircleGauge(props: Readonly<Required<SemiCircleGaugeProps>>) {
  const uid = useId();
  const ids = {
    pattern: `wakeb-gauge-hatch-${uid}`,
    gradient: `wakeb-gauge-gradient-${uid}`,
    progressPattern: `wakeb-gauge-progress-hatch-${uid}`,
  };
  const value = computed(() => clampPercent(props.value));
  const size = computed(() => (Number.isFinite(props.size) && props.size > 0 ? props.size : 154));
  const band = computed(() =>
    Number.isFinite(props.thickness) && props.thickness > 0 ? Math.min(props.thickness, size.value / 2) : size.value * 0.236,
  );
  const center = computed(() => size.value / 2);
  const radius = computed(() => center.value - band.value / 2);
  const needleWidth = computed(() => Math.max(3, size.value * 0.0256));
  const arcLength = computed(() => Math.PI * radius.value);
  const arcPath = computed(
    () => `M ${band.value / 2} ${center.value} A ${radius.value} ${radius.value} 0 0 1 ${size.value - band.value / 2} ${center.value}`,
  );
  const dashOffset = computed(() => arcLength.value * (1 - value.value / 100));
  const needleAngle = computed(() => -90 + (value.value / 100) * 180);
  const name = computed(() => props.ariaLabel || `${value.value}%`);
  return { ids, value, size, band, center, needleWidth, arcLength, arcPath, dashOffset, needleAngle, name };
}

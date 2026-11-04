import { computed } from "vue";
import { truncateText } from "wakeb-utils";
import type { TruncatedTextProps } from "../types";

/** Defaults shared by every WTruncatedText renderer; providers must not change them. */
export const truncatedTextDefaults = {
  label: "",
  length: 12,
  tooltipLocation: "top",
  tooltipMaxWidth: 280,
  contentClass: "wakeb-truncated-tooltip",
} as const;

/** Provider-neutral truncation: Wakeb Utils UTF-16 behavior, unchanged from the baseline. */
export function useTruncatedText(props: TruncatedTextProps & { length: number }) {
  const displayLabel = computed(() => truncateText(props.label || "", props.length));
  const isTruncated = computed(() => (props.label || "").length > props.length);
  return { displayLabel, isTruncated };
}

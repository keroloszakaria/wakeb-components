import { computed } from "vue";
import { useVariant } from "../core/vocabulary";
import type { TooltipBtnProps } from "../types";

/** Defaults shared by every WTooltipBtn renderer; providers must not change them. */
export const tooltipBtnDefaults = {
  text: "",
  btnIcon: false,
  variant: "ghost",
  location: "bottom",
  openDelay: 200,
  contentClass: "v-app-tooltip-btn__content",
} as const;

/** Provider-neutral WTooltipBtn behavior: the portable variant and the accessible name. */
export function useTooltipBtn(props: TooltipBtnProps) {
  const toVariant = useVariant("WTooltipBtn");
  const variant = computed(() => toVariant(props.variant, "variant", "ghost"));
  /* An explicit ariaLabel wins, including null and ''; otherwise the tooltip text names the button. */
  const accessibleName = computed(() => (props.ariaLabel === undefined ? props.text || undefined : props.ariaLabel));
  return { variant, accessibleName };
}

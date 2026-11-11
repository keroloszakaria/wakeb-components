import { computed, ref } from "vue";
import type { WakebFieldRule } from "../types";

export const textFieldDefaults = {
  type: "text",
  variant: "outline",
  disabled: false,
  readonly: false,
  required: false,
  rules: () => [],
  hideDetails: false,
} as const;

/** WTextarea defaults: the WTextField ones without `type`, plus Vuetify's five rows. */
export const textareaDefaults = {
  variant: "outline",
  disabled: false,
  readonly: false,
  required: false,
  rules: () => [],
  hideDetails: false,
  rows: 5,
  autoGrow: false,
  noResize: false,
} as const;

/* Events that bubble from the input to the field root; Vuetify binds the others to the input too. */
const BUBBLING = new Set([
  "onAuxclick", "onBeforeinput", "onChange", "onClick", "onCompositionend", "onCompositionstart", "onCompositionupdate",
  "onContextmenu", "onCopy", "onCut", "onDblclick", "onFocusin", "onFocusout", "onInput", "onKeydown", "onKeypress",
  "onKeyup", "onMousedown", "onMousemove", "onMouseout", "onMouseover", "onMouseup", "onPaste", "onPointercancel",
  "onPointerdown", "onPointerenter", "onPointerleave", "onPointermove", "onPointerout", "onPointerover", "onPointerup",
  "onSelect", "onTouchcancel", "onTouchend", "onTouchmove", "onTouchstart", "onWheel",
]);

/**
 * The WTextField attribute split, the same on every provider (it mirrors Vuetify's VTextField):
 * class, style, id, inert, dir and data-* reach the field root, with every listener. Other
 * attributes reach the native input, with the listeners for events that do not bubble (focus, blur).
 */
export function splitFieldAttrs(attrs: Record<string, unknown>) {
  const root: Record<string, unknown> = {};
  const input: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (/^on[^a-z]/.test(key)) {
      root[key] = value;
      if (!BUBBLING.has(key)) input[key] = value;
    } else if (["class", "style", "id", "inert", "dir"].includes(key) || key.startsWith("data-")) root[key] = value;
    else input[key] = value;
  }
  return { root, input };
}

/**
 * Rules run on every value, like Vuetify's default `validate-on="input"`. A message shows once the
 * user has typed in or left the field. The first failing rule wins; `false` marks the field invalid
 * without a message.
 */
export function useFieldValidation(
  props: { rules: readonly WakebFieldRule[]; hideDetails: boolean | "auto"; errorMessages?: string | readonly string[] },
  value: () => string | number | null | undefined,
) {
  const touched = ref(false);
  const failures = computed(() =>
    props.rules.map((rule) => rule(value())).filter((result) => result !== true).map((result) => (typeof result === "string" ? result : "")),
  );
  /* External messages (for example from the server) show at once and come before rule messages, like Vuetify. */
  const external = computed(() =>
    (typeof props.errorMessages === "string" ? [props.errorMessages] : props.errorMessages ?? []).filter((item) => item !== ""),
  );
  const ruleInvalid = computed(() => touched.value && failures.value.length > 0);
  const invalid = computed(() => external.value.length > 0 || ruleInvalid.value);
  const message = computed(() => external.value[0] ?? (ruleInvalid.value ? failures.value[0] : ""));
  const showDetails = computed(() => (props.hideDetails === true ? false : props.hideDetails === "auto" ? message.value !== "" : true));
  const touch = () => {
    touched.value = true;
  };
  return { invalid, message, showDetails, touch };
}

import { computed, ref, useId, watch } from "vue";
import { useColor } from "../core/vocabulary";
import type { WakebColor } from "../types";

export const modalDefaults = {
  modelValue: false,
  title: "",
  description: "",
  persistent: true,
  closable: true,
  loading: false,
  dataLoaded: true,
  showActions: true,
  titleClass: "",
  headerIcon: "",
  closeLabel: "Close",
  loadingLabel: "Loading",
  ariaLabel: "Dialog",
} as const;

/**
 * Locally mirrored boolean model: parent changes apply silently, user changes emit once (SPEC R13).
 */
export function useDisclosure(props: { modelValue: boolean }, emit: (event: "update:modelValue", value: boolean) => void) {
  const open = ref(props.modelValue);
  watch(
    () => props.modelValue,
    (value) => {
      open.value = value;
    },
  );
  const model = computed({
    get: () => open.value,
    set: (value: boolean) => {
      if (open.value === value) return;
      open.value = value;
      emit("update:modelValue", value);
    },
  });
  const close = () => {
    model.value = false;
  };
  return { model, close };
}

/** Defaults shared by every WAccordion renderer; providers must not change them. */
export const accordionDefaults = {
  title: "",
  modelValue: false,
  classList: "",
  icon: "$expand",
  noBorder: false,
  beforeIcon: false,
  afterIcon: false,
  iconSize: "sm",
  maxIconWidth: "100%",
  headerTitleClassList: "",
  headerClassList: "",
  bodyClassList: "",
  transparent: false,
  toggleLabel: "",
  contentId: "",
} as const;

/**
 * Provider-neutral WAccordion behavior: the mirrored boolean model, the deterministic panel id and
 * the trigger bindings every header control shares (`aria-expanded`, `aria-controls`, a name).
 * The panel is a named region when a title is set.
 */
export function useAccordion(
  props: { modelValue: boolean; title: string; toggleLabel: string; contentId: string; iconColor?: WakebColor },
  emit: (event: "update:modelValue", value: boolean) => void,
) {
  const { model } = useDisclosure(props, emit);
  const toColor = useColor("WAccordion");
  const iconCss = computed(() => toColor(props.iconColor, "iconColor", "").css);
  const uid = useId();
  const panelId = computed(() => props.contentId || `wakeb-accordion-${uid}`);
  const toggle = () => {
    model.value = !model.value;
  };
  const toggleName = computed(() => props.toggleLabel || props.title || "Toggle section");
  const triggerProps = computed(() => ({
    type: "button" as const,
    "aria-expanded": model.value,
    "aria-controls": panelId.value,
    "aria-label": toggleName.value,
    onClick: (event: MouseEvent) => {
      event.stopPropagation();
      toggle();
    },
  }));
  const panelProps = computed(() => ({
    id: panelId.value,
    role: props.title ? "region" : undefined,
    "aria-label": props.title || undefined,
  }));
  return { open: model, toggle, panelId, triggerProps, panelProps, toggleName, iconCss };
}

import { computed, ref, watch } from "vue";

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

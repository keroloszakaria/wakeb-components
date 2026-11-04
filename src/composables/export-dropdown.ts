import type { ButtonProps, ExportDropdownProps, ExportFormat } from "../types";

/** Defaults shared by every WExportDropdown renderer; providers must not change them. */
export const exportDropdownDefaults = {
  isLoading: false,
  disabled: false,
  title: "Download",
  formats: () => [
    { label: "Export as PDF", value: "pdf" },
    { label: "Export as Excel", value: "xlsx" },
  ],
} as const;

/** Inline SVG paths so the default activator and rows need no icon font on any provider. */
export const EXPORT_ICON_PATH = "M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5";
export const FORMAT_ICON_PATH = "M5 2h9l5 5v15H5zM14 2v6h5M8 13h8m-8 4h8";

/** Provider-neutral WExportDropdown rules: activator presentation and one `select` per enabled format. */
export function useExportDropdown(
  props: Required<Pick<ExportDropdownProps, "isLoading" | "disabled" | "title">>,
  emit: (event: "select", value: string) => void,
) {
  const buttonProps = (): ButtonProps => ({
    type: "outline",
    icon: "$file",
    iconPosition: "start",
    title: props.title,
    isLoading: props.isLoading,
    disabled: props.disabled || props.isLoading,
    iconSize: 20,
  });
  const isFormatDisabled = (format: ExportFormat) => Boolean(props.isLoading || format.disabled);
  function select(format: ExportFormat) {
    if (props.disabled || props.isLoading || format.disabled) return;
    emit("select", format.value);
  }
  return { buttonProps, isFormatDisabled, select };
}

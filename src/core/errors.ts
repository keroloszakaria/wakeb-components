/** Stable diagnostic codes (SPEC R07). Messages may improve; codes never change meaning. */
export type WakebErrorCode =
  | "WAKEB_CONFIG_INVALID"
  | "WAKEB_BUILD_PLUGIN_MISSING"
  | "WAKEB_FRAMEWORK_MISMATCH"
  | "WAKEB_PROVIDER_MISSING"
  | "WAKEB_CONTEXT_MISSING"
  | "WAKEB_INSTALL_CONFLICT"
  | "WAKEB_HOST_PROVIDER_MISSING"
  | "WAKEB_COMPONENT_UNSUPPORTED"
  | "WAKEB_CAPABILITY_UNSUPPORTED";

export class WakebError extends Error {
  readonly code: WakebErrorCode;
  constructor(code: WakebErrorCode, message: string) {
    super(`[${code}] ${message}`);
    this.name = "WakebError";
    this.code = code;
  }
}

export const buildPluginMissing = () =>
  new WakebError(
    "WAKEB_BUILD_PLUGIN_MISSING",
    "wakeb-components was bundled without its build integration. Add wakebComponents() from 'wakeb-components/vite' to the Vite plugins and restart the dev server.",
  );

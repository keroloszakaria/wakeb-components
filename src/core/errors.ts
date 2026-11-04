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
  /**
   * Reserved. Raised only when a documented optional feature (a typed entry in the capability
   * manifest, SPEC R05/R21) cannot work on the selected provider; the message must name the
   * capability and its alternative. No optional feature is defined in this build, so nothing raises
   * it. Missing mandatory behavior never uses this code: a missing component is
   * WAKEB_COMPONENT_UNSUPPORTED, and provider layout hosts are encapsulated by the renderer (R19).
   */
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

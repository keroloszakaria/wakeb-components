import { WakebError } from "../core/errors";
import type { WakebProviderMode } from "../core/options";

/** Shared SPEC R24 decision table; each provider supplies only detection and installation. */
export function reuseOrInstall(
  provider: string,
  hostInstall: string,
  hostPresent: boolean,
  { mode, options }: { mode: WakebProviderMode; options?: Readonly<Record<string, unknown>> },
  install: () => void,
): { reused: boolean } {
  if (hostPresent) {
    if (mode === "install")
      throw new WakebError(
        "WAKEB_INSTALL_CONFLICT",
        `providerOptions.mode is 'install' but the app already has ${provider} installed. Use mode 'auto' or 'reuse', or remove the host ${hostInstall}.`,
      );
    if (options !== undefined)
      throw new WakebError(
        "WAKEB_CONFIG_INVALID",
        `providerOptions.options would be ignored because Wakeb reuses the host ${provider} instance. Configure ${provider} in the host ${hostInstall} instead.`,
      );
    return { reused: true };
  }
  if (mode === "reuse")
    throw new WakebError(
      "WAKEB_HOST_PROVIDER_MISSING",
      `providerOptions.mode is 'reuse' but no ${provider} instance is installed on this app. Call app.use(${hostInstall}) before app.use(wakeb).`,
    );
  install();
  return { reused: false };
}

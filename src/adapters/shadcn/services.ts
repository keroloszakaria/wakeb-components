import { WakebError } from "../../core/errors";
import type { WakebProviderServices } from "../../core/options";
import { SUPPORTED } from "../manifest";

/*
 * shadcn-vue is not an app plugin: an app copies component sources that sit on reka-ui primitives,
 * and Wakeb ships its own adapted copies in this adapter. There is no app-level instance to detect
 * or reuse (SPEC R24), and no global options to install. `auto` and `install` therefore install
 * nothing beyond Wakeb's own context; `reuse` cannot be satisfied, and native `options` have no
 * receiver, so both fail instead of being silently ignored.
 */
const services: WakebProviderServices = {
  framework: "shadcn",
  components: SUPPORTED.shadcn,
  installProvider(_app, { mode, options }) {
    if (mode === "reuse")
      throw new WakebError(
        "WAKEB_HOST_PROVIDER_MISSING",
        "providerOptions.mode is 'reuse', but shadcn-vue has no app-level instance to reuse: Wakeb ships its own shadcn-vue components over reka-ui. Use mode 'auto' or 'install'.",
      );
    if (options !== undefined)
      throw new WakebError(
        "WAKEB_CONFIG_INVALID",
        "providerOptions.options is not supported with framework 'shadcn': shadcn-vue has no app plugin or global configuration to receive it. Remove it, and theme the adapter with theme.tokens or your shadcn-vue CSS variables.",
      );
    return { reused: false };
  },
};
export default services;

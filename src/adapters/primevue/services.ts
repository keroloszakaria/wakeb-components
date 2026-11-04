import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { reuseOrInstall } from "../host";
import type { WakebProviderServices } from "../../core/options";
import { SUPPORTED } from "../manifest";

/** PrimeVue exposes its configuration as the public $primevue global property of each app. */
const hasHostPrimeVue = (app: import("vue").App) => {
  const host = app.config.globalProperties.$primevue as { config?: unknown } | undefined;
  return Boolean(host && typeof host.config === "object");
};

const services: WakebProviderServices = {
  framework: "primevue",
  components: SUPPORTED.primevue,
  installProvider: (app, options) =>
    reuseOrInstall("PrimeVue", "PrimeVue", hasHostPrimeVue(app), options, () =>
      app.use(PrimeVue, { theme: { preset: Aura }, ...options.options }),
    ),
};
export default services;

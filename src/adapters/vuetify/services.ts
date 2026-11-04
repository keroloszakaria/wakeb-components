import { inject } from "vue";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import { reuseOrInstall } from "../host";
import type { WakebProviderServices } from "../../core/options";
import { SUPPORTED } from "../manifest";

/** Vuetify registers its services under global symbols; detection never touches module singletons. */
const hasHostVuetify = (app: import("vue").App) =>
  app.runWithContext(() =>
    ["theme", "defaults", "icons", "locale"].every((name) => inject(Symbol.for(`vuetify:${name}`), null) !== null),
  );

const services: WakebProviderServices = {
  framework: "vuetify",
  components: SUPPORTED.vuetify,
  installProvider: (app, options) =>
    reuseOrInstall("vuetify", "createVuetify()", hasHostVuetify(app), options, () =>
      // ssr: true keeps server and client display state identical (SPEC R19).
      app.use(createVuetify({ ssr: true, ...options.options })),
    ),
};
export default services;

import { computed, defineComponent, h, inject, provide } from "vue";
import { createVuetify, useLocale } from "vuetify";
import "vuetify/styles";
import { reuseOrInstall } from "../host";
import type { WakebProviderServices } from "../../core/options";
import { SUPPORTED } from "../manifest";

/** Vuetify registers its services under global symbols; detection never touches module singletons. */
const hasHostVuetify = (app: import("vue").App) =>
  app.runWithContext(() =>
    ["theme", "defaults", "icons", "locale"].every((name) => inject(Symbol.for(`vuetify:${name}`), null) !== null),
  );

// VLocaleProvider introduces a div. Keep Wakeb's attribute targets and layout intact by providing
// only the scoped RTL refs, using the same per-app symbol as Vuetify's public useLocale().
const DirectionScope = defineComponent({
  name: "WakebVuetifyDirection",
  props: { rtl: Boolean },
  setup(props, { slots }) {
    const locale = useLocale();
    const isRtl = computed(() => props.rtl);
    provide(Symbol.for("vuetify:locale"), {
      ...locale,
      isRtl,
      rtlClasses: computed(() => `v-locale--is-${isRtl.value ? "rtl" : "ltr"}`),
    });
    return () => slots.default?.()[0];
  },
});

const services: WakebProviderServices = {
  framework: "vuetify",
  components: SUPPORTED.vuetify,
  withDirection: (node, direction) => h(DirectionScope, { rtl: direction === "rtl" }, () => node),
  installProvider: (app, options) =>
    reuseOrInstall("vuetify", "createVuetify()", hasHostVuetify(app), options, () =>
      // ssr: true keeps server and client display state identical (SPEC R19).
      app.use(createVuetify({ ssr: true, ...options.options })),
    ),
};
export default services;

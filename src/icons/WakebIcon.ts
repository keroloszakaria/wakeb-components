import { defineComponent, h, inject, type PropType } from "vue";
import { FALLBACK_ICON, NO_ICONS, resolveIcon } from "../core/icons";
import { WAKEB_CONTEXT, warnOnce } from "../core/runtime";
import type { SharedIcon, WakebSvgIcon } from "../types";

const svg = (paths: WakebSvgIcon, size: string | undefined, color: string | undefined, fallback = false) =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: size,
      height: size,
      fill: color || "currentColor",
      "aria-hidden": "true",
      class: fallback ? "wakeb-icon wakeb-icon--fallback" : "wakeb-icon",
    },
    paths.map((path) => (typeof path === "string" ? h("path", { d: path }) : h("path", { d: path[0], "fill-opacity": path[1] }))),
  );

/** PrimeIcons class names are the matching icon set of the PrimeVue provider. */
const isPrimeIcon = (name: string) => /^pi(\s+pi-|-)[\w-]+$/.test(name);

/**
 * Provider-neutral icon renderer used by non-Vuetify adapters (SPEC R15): names go through the app's
 * `icons` option and the Wakeb built-ins; SVG path data renders inline and components render as
 * they are. An unresolved name renders the fallback box and reports WAKEB_ICON_UNRESOLVED.
 */
export default defineComponent({
  name: "WakebIcon",
  props: {
    icon: { type: [String, Array, Object, Function] as PropType<SharedIcon>, required: true },
    size: { type: [String, Number], default: undefined },
    color: { type: String, default: undefined },
  },
  setup(props) {
    const context = inject(WAKEB_CONTEXT, null);
    return () => {
      const size = props.size === undefined ? undefined : typeof props.size === "number" ? `${props.size}px` : props.size;
      const { color } = props;
      const resolved = resolveIcon(context?.icons ?? NO_ICONS, props.icon, context);
      if (!resolved) return null;
      if (resolved.kind === "svg") return svg(resolved.paths, size, color);
      if (resolved.kind === "component") return h(resolved.component, { width: size, height: size, style: { color } });
      const { name } = resolved;
      if (context?.framework === "primevue" && isPrimeIcon(name)) {
        const classes = name.startsWith("pi-") ? `pi ${name}` : name;
        return h("i", { class: ["wakeb-icon", classes], "aria-hidden": "true", style: { fontSize: size, color } });
      }
      if (process.env.NODE_ENV !== "production")
        warnOnce(
          context,
          "WAKEB_ICON_UNRESOLVED",
          name,
          `Icon '${name}' is not resolved under the ${context?.framework} provider; rendering the Wakeb fallback box. Add it to the icons.aliases or icons.resolve plugin option, or pass SVG path data or a Vue component.`,
        );
      return svg(FALLBACK_ICON, size, color, true);
    };
  },
});

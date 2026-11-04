import { defineComponent, h, type PropType } from "vue";
import type { SharedIcon } from "../types";

/* Built-in Material Design paths for the Vuetify aliases Wakeb uses by default (SPEC R15). */
const ALIASES: Record<string, string> = {
  $expand: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",
  $collapse: "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z",
  $close: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
  $complete: "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",
};

const svg = (paths: (string | [string, number])[], size: string | undefined, color: string | undefined) =>
  h(
    "svg",
    { viewBox: "0 0 24 24", width: size, height: size, fill: color || "currentColor", "aria-hidden": "true", class: "wakeb-icon" },
    paths.map((path) => (Array.isArray(path) ? h("path", { d: path[0], "fill-opacity": path[1] }) : h("path", { d: path }))),
  );

/**
 * Provider-neutral icon renderer used by non-Vuetify adapters: built-in aliases, `svg:` paths,
 * path lists, Vue components, or icon-font class names (for example `pi pi-check` or `mdi-check`).
 */
export default defineComponent({
  name: "WakebIcon",
  props: {
    icon: { type: [String, Array, Object, Function] as PropType<SharedIcon>, required: true },
    size: { type: [String, Number], default: undefined },
    color: { type: String, default: undefined },
  },
  setup(props) {
    return () => {
      const size = props.size === undefined ? undefined : typeof props.size === "number" ? `${props.size}px` : props.size;
      const { icon, color } = props;
      if (!icon) return null;
      if (Array.isArray(icon)) return svg(icon, size, color);
      if (typeof icon !== "string") return h(icon, { width: size, height: size, style: { color } });
      if (icon.startsWith("svg:")) return svg([icon.slice(4)], size, color);
      if (icon.startsWith("$")) return svg([ALIASES[icon] ?? ALIASES.$expand], size, color);
      const classes = icon.startsWith("mdi-") ? `mdi ${icon}` : icon;
      return h("i", { class: ["wakeb-icon", classes], "aria-hidden": "true", style: { fontSize: size, color } });
    };
  },
});

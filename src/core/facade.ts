import { camelize, defineComponent, h, inject, mergeProps, toHandlerKey, type Component, type ComponentObjectPropsOptions } from "vue";
import { LOCALE_DEFAULTS, clone } from "./defaults";
import { WAKEB_CONTEXT } from "./runtime";
import { reportUnsupportedProviderProps } from "./provider-props";
import type { WakebComponentName } from "./options";
import services from "wakeb-components/_internal/selected/services";

type PropOptions = Record<string, { type?: unknown; required?: boolean } | null>;
type Renderer = { props?: PropOptions; emits?: string[] | Record<string, unknown> };

/**
 * Wraps a selected renderer with the plugin defaults layer (SPEC R06). The wrapper declares the same
 * props without defaults, so it sees exactly what the caller passed: Boolean casting cannot invent
 * `false`, and only undefined counts as absent. It then resolves each prop in this order:
 * explicit value, plugin default, built-in localized string, and finally the renderer's own default.
 * Declared events are re-emitted from the wrapper, so they reach caller listeners once and stay visible
 * to devtools and test utilities. Other attributes, listeners and slots pass through unchanged; theme
 * scope attributes are merged first so the caller's class and style still win.
 *
 * Attribute routing (SPEC R14): the wrapper renders no element of its own. Class, style, id, role,
 * aria-*, data-* and listeners for undeclared events reach the renderer, which binds them to the
 * component's documented attribute target. `providerProps` is per instance and never comes from
 * plugin defaults. A renderer without a provider primitive does not declare it; the wrapper then
 * accepts and drops it with a development diagnostic, so it never leaks into the DOM as an attribute.
 */
export function defineWakebFacade(name: WakebComponentName, renderer: Component) {
  const source = (renderer as Renderer).props ?? {};
  const declared = (renderer as Renderer).emits ?? [];
  const emits = Array.isArray(declared) ? declared : Object.keys(declared);
  const props: ComponentObjectPropsOptions = Object.fromEntries(
    Object.entries(source).map(([key, option]) => [
      key,
      { type: (option?.type ?? null) as null, required: option?.required ?? false, default: undefined },
    ]),
  );
  const nativeProps = "providerProps" in props;
  if (!nativeProps) props.providerProps = { type: null, required: false, default: undefined };
  return defineComponent({
    name,
    inheritAttrs: false,
    props,
    emits,
    setup(input, { attrs, slots, emit }) {
      const context = inject(WAKEB_CONTEXT, null);
      const localized = context?.locale === "ar" ? LOCALE_DEFAULTS.ar[name] : undefined;
      const fallback: Record<string, unknown> = { ...localized, ...clone(context?.defaults[name]) };
      const forward = Object.fromEntries(
        emits.map((event) => [toHandlerKey(camelize(event)), (...args: unknown[]) => emit(event, ...args)]),
      );
      return () => {
        const resolved: Record<string, unknown> = {};
        for (const key of Object.keys(props)) {
          const value = (input as Record<string, unknown>)[key];
          if (key === "providerProps") {
            // Per instance only: plugin defaults and locale strings never supply native props.
            if (nativeProps) resolved[key] = value;
            else if (value !== undefined) reportUnsupportedProviderProps(context, name);
            continue;
          }
          resolved[key] = value !== undefined ? value : fallback[key];
        }
        const node = h(renderer, mergeProps(context?.scope ?? {}, resolved, attrs, forward), slots);
        return context?.scope.dir && services.withDirection ? services.withDirection(node, context.direction) : node;
      };
    },
  });
}

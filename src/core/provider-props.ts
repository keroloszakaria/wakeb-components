import { camelize, computed, toHandlerKey, type Component } from "vue";
import { warnOnce, type WakebContext } from "./runtime";

type Declared = Record<string, unknown> | readonly string[] | undefined;
type Options = { props?: Declared; emits?: Declared; extends?: Options; mixins?: Options[] };

const names = (declared: Declared) => (Array.isArray(declared) ? declared : Object.keys(declared ?? {})) as string[];

/** Normalizes `on-after-hide`, `onAfterHide` and `afterHide` style keys to one comparable form. */
export const normalizeKey = (key: string) =>
  /^on[A-Z]/.test(key) ? toHandlerKey(camelize(key.charAt(2).toLowerCase() + key.slice(3))) : camelize(key);

/** Props and handler keys a provider primitive declares, including inherited options. */
function declaredKeys(component: Options, keys = new Set<string>()) {
  for (const prop of names(component.props)) keys.add(normalizeKey(prop));
  for (const event of names(component.emits)) keys.add(toHandlerKey(camelize(event)));
  if (component.extends) declaredKeys(component.extends, keys);
  for (const mixin of component.mixins ?? []) declaredKeys(mixin, keys);
  return keys;
}

/** Portable attributes and identity keys that only the component's attribute target may receive. */
const PORTABLE = /^(class|style|id|role|tabindex|tabIndex|key|ref|ref_for|ref_key|aria-.+|aria[A-Z].*|data-.+)$/;
const isPlain = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype;

export interface ProviderPropsTarget {
  /** The public component, for diagnostics. */
  component: string;
  /** The provider primitive that receives the props, for example the dialog primitive. */
  primitive: Component;
  /** A readable primitive name for diagnostics, such as `VDialog` or `Dialog`. */
  label: string;
  /**
   * Native props and listeners Wakeb binds or owns on this primitive: models and their update
   * handlers, loading/disabled safety, element type, focus containment, and callbacks that map to a
   * portable Wakeb event. They are never taken from providerProps.
   */
  owned: readonly string[];
}

/**
 * Filters an instance's `providerProps` for the selected provider's primitive (SPEC R12). Only keys
 * the primitive declares as props or events pass, and never a Wakeb-owned binding or a portable
 * attribute. Ignored keys are dropped in every build and reported once in development with
 * `WAKEB_PROVIDER_PROP_IGNORED`. Bind the result before Wakeb's own bindings so Wakeb still wins.
 */
export function useProviderProps(context: WakebContext | null, source: () => unknown, target: ProviderPropsTarget) {
  let declared: Set<string> | undefined;
  const owned = new Set(target.owned.map(normalizeKey));
  const where = `${target.component} providerProps`;
  const report = (key: string, message: string) => {
    if (process.env.NODE_ENV !== "production")
      warnOnce(context, "WAKEB_PROVIDER_PROP_IGNORED", `${target.component}.${key}`, `${where}: ${message}`);
  };
  return computed<Record<string, unknown>>(() => {
    const input = source();
    if (input === undefined || input === null) return {};
    if (!isPlain(input)) {
      report("<value>", "expected a plain object of native props; the value was ignored.");
      return {};
    }
    declared ??= declaredKeys(target.primitive as Options);
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      if (value === undefined) continue;
      const name = normalizeKey(key);
      if (PORTABLE.test(key) || PORTABLE.test(name))
        report(key, `'${key}' is a portable attribute. Pass it on ${target.component} itself; it reaches the documented attribute target.`);
      else if (owned.has(name) || /^onUpdate:/.test(name))
        report(key, `Wakeb owns '${key}' on ${target.label}. Use the portable ${target.component} prop or event instead.`);
      else if (!declared.has(name))
        report(key, `'${key}' is not a prop or event of ${target.label} in the ${context?.framework ?? "selected"} provider; it was ignored.`);
      else result[key] = value;
    }
    return result;
  });
}

/** Reported by a facade whose selected renderer has no provider primitive to receive providerProps. */
export function reportUnsupportedProviderProps(context: WakebContext | null, component: string) {
  if (process.env.NODE_ENV !== "production")
    warnOnce(
      context,
      "WAKEB_PROVIDER_PROP_IGNORED",
      `${component}.providerProps`,
      `${component} does not accept providerProps on the ${context?.framework ?? "selected"} provider yet; the value was ignored. Use its portable props, slots and attributes.`,
    );
}

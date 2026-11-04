import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { WButton, WDropdown, WLoading, WModal } from "../src";
import TooltipContent from "../src/adapters/shadcn/ui/TooltipContent.vue";
import { shadcnHost, wakeb } from "./wakeb";

/*
 * shadcn-vue wiring the shared contract cannot express: reka-ui keyboard paths, dialog focus
 * management, afterLeave timing, nonportable native looks and the precompiled CSS (SPEC R11, R18).
 */
const render = (component: unknown, options: Record<string, unknown> = {}, plugin = wakeb()) =>
  mount(component as never, { attachTo: document.body, global: { plugins: [shadcnHost as never, plugin] }, ...options });
const settle = async () => {
  for (let i = 0; i < 4; i++) await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
};
const key = (target: Element, name: string) => target.dispatchEvent(new KeyboardEvent("keydown", { key: name, bubbles: true, cancelable: true }));
beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});
enableAutoUnmount(afterEach);

describe("shadcn WDropdown keyboard and focus", () => {
  const items = [
    { label: "Pending", value: "p" },
    { label: "Archived", value: "a", disabled: true },
    { label: "Done", value: "d" },
  ];
  const menu = () => document.querySelector<HTMLElement>('[role="menu"]');

  it("moves with arrow keys past disabled rows, selects with Enter and returns focus to the activator", async () => {
    const w = render(WDropdown, { props: { title: "Status", menuItems: items, showSelected: true } });
    const activator = w.get("button").element as HTMLButtonElement;
    activator.focus();
    activator.click();
    await vi.waitFor(() => expect(menu()).not.toBeNull());
    expect(activator.getAttribute("aria-controls")).toBe(menu()!.id);
    for (const name of ["ArrowDown", "ArrowDown"]) {
      key(document.activeElement ?? menu()!, name);
      await settle();
    }
    expect(document.activeElement?.textContent).toContain("Done");
    key(document.activeElement!, "Enter");
    await settle();
    expect(w.emitted("update:modelValue")).toEqual([["d"]]);
    expect(w.emitted("selectedItem")).toEqual([[items[2]]]);
    await vi.waitFor(() => expect(menu()).toBeNull());
    await vi.waitFor(() => expect(document.activeElement).toBe(activator));
    expect(activator.textContent).toContain("Done");
  });

  it("closes on Escape without selecting and returns focus", async () => {
    const w = render(WDropdown, { props: { title: "Status", menuItems: items } });
    const activator = w.get("button").element as HTMLButtonElement;
    activator.focus();
    activator.click();
    await vi.waitFor(() => expect(menu()).not.toBeNull());
    key(menu()!, "Escape");
    await settle();
    expect(menu()).toBeNull();
    expect(activator.getAttribute("aria-expanded")).toBe("false");
    expect(w.emitted("update:modelValue")).toBeUndefined();
    await vi.waitFor(() => expect(document.activeElement).toBe(activator));
  });

  it("toggles closed from the activator and names the menu after it", async () => {
    const w = render(WDropdown, { props: { title: "Status", menuItems: items } });
    const activator = w.get("button").element as HTMLButtonElement;
    activator.click();
    await vi.waitFor(() => expect(menu()).not.toBeNull());
    expect(menu()!.getAttribute("aria-label")).toBe("Status");
    activator.click();
    await settle();
    expect(menu()).toBeNull();
  });
});

describe("shadcn WModal focus, dismissal and afterLeave", () => {
  const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]');
  const view = (props: Record<string, unknown>, onAfterLeave = () => {}) => {
    const open = ref(false);
    const component = defineComponent(() => () => [
      h("button", { class: "opener", onClick: () => (open.value = true) }, "Open"),
      h(
        WModal,
        { ...props, modelValue: open.value, "onUpdate:modelValue": (value: boolean) => (open.value = value), onAfterLeave },
        { default: () => [h("input", { class: "first" }), h("button", { class: "last" }, "Last")] },
      ),
    ]);
    return { open, w: render(component) };
  };

  it("contains Tab, closes on Escape, emits afterLeave once and returns focus to the opener", async () => {
    const afterLeave = vi.fn();
    const { open, w } = view({ title: "Edit", persistent: false, closeLabel: "Close dialog" }, afterLeave);
    const opener = w.get(".opener").element as HTMLButtonElement;
    opener.focus();
    opener.click();
    await vi.waitFor(() => expect(dialog()?.contains(document.activeElement)).toBe(true));
    // reka-ui's focus scope wraps Tab from the last tabbable element to the first.
    (dialog()!.querySelector(".last") as HTMLElement).focus();
    key(dialog()!.querySelector(".last")!, "Tab");
    await settle();
    expect(dialog()!.contains(document.activeElement)).toBe(true);
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Close dialog");
    key(document.activeElement!, "Escape");
    await settle();
    expect(open.value).toBe(false);
    expect(dialog()).toBeNull();
    expect(afterLeave).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => expect(document.activeElement).toBe(opener));
  });

  it("stays open on Escape and outside presses when persistent", async () => {
    const { open, w } = view({ title: "Edit", persistent: true });
    w.get(".opener").element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await vi.waitFor(() => expect(dialog()).not.toBeNull());
    key(dialog()!, "Escape");
    document.body.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    await settle();
    expect(open.value).toBe(true);
    expect(dialog()).not.toBeNull();
  });

  it("does not emit afterLeave when an open dialog is torn down", async () => {
    const afterLeave = vi.fn();
    const w = render(WModal, { props: { modelValue: true, title: "Edit", onAfterLeave: afterLeave } });
    await settle();
    w.unmount();
    await settle();
    expect(afterLeave).not.toHaveBeenCalled();
  });

  it("marks the page outside the dialog inert for assistive technology", async () => {
    render(defineComponent(() => () => [h("main", { class: "page" }, "Page"), h(WModal, { modelValue: true, title: "Edit" })]));
    await settle();
    expect(document.querySelector(".page")?.closest("[aria-hidden='true']")).not.toBeNull();
  });
});

describe("shadcn WButton tooltip and native looks", () => {
  it("opens the tooltip on keyboard focus and maps logical sides through the direction", async () => {
    const w = render(WButton, { props: { title: "Settings", icon: "$close", isTooltip: true, location: "end" } });
    (w.get("button").element as HTMLElement).focus();
    await vi.waitFor(() => expect(document.querySelector('[role="tooltip"]')?.textContent).toBe("Settings"));
    // The requested side; reka-ui may still flip it to fit the viewport.
    expect(w.findComponent(TooltipContent).props("side")).toBe("right");
    expect(w.get("button").attributes("aria-describedby")).toBe(document.querySelector('[role="tooltip"]')!.id);
  });

  it("flips logical sides under a configured right-to-left direction", async () => {
    const w = render(WButton, { props: { title: "Settings", icon: "$close", isTooltip: true, location: "end" } }, wakeb({ direction: "rtl" }));
    (w.get("button").element as HTMLElement).focus();
    await vi.waitFor(() => expect(document.querySelector('[role="tooltip"]')).not.toBeNull());
    expect(w.findComponent(TooltipContent).props("side")).toBe("left");
    expect(document.querySelector(".wakeb-sc-tooltip")?.getAttribute("dir")).toBe("rtl");
  });

  it("renders no tooltip parts for a plain button", () => {
    const w = render(WButton, { props: { title: "Save" } });
    expect(w.get("button").attributes("data-state")).toBeUndefined();
    expect(w.get("button").attributes("data-slot")).toBe("button");
  });

  it("exposes shadcn-vue variant and size only through providerProps, as data attributes", () => {
    const plain = render(WButton, { props: { title: "Save" } }).get("button");
    expect(plain.attributes("data-variant")).toBeUndefined();
    const native = render(WButton, { props: { title: "Delete", providerProps: { variant: "destructive", size: "sm" } } }).get("button");
    expect(native.attributes("data-variant")).toBe("destructive");
    expect(native.attributes("data-size")).toBe("sm");
    expect(native.classes()).toEqual(expect.arrayContaining(["btn", "btn--primary", "wakeb-sc-button"]));
  });

  it("renders PrimeIcons and Vuetify names as the Wakeb fallback: shadcn-vue has no icon set of its own", () => {
    const w = render(WButton, { props: { icon: "pi pi-check" } });
    expect(w.find(".wakeb-icon--fallback").exists()).toBe(true);
    expect(w.find("i.pi").exists()).toBe(false);
  });
});

describe("shadcn WLoading indicator", () => {
  it("keeps a decorative Lucide loader inside the named status", () => {
    const w = render(WLoading, { props: { label: "Saving", size: 32, providerProps: { strokeWidth: 3, absoluteStrokeWidth: true } } });
    const svg = w.get("svg.wakeb-sc-spinner");
    expect(svg.attributes("aria-hidden")).toBe("true");
    expect(svg.attributes("stroke-width")).toBe(String((3 * 24) / 32));
    expect(svg.attributes("style")).toContain("width: 32px");
    expect(w.get('[role="status"]').attributes("aria-label")).toBe("Saving");
  });
});

/*
 * Precompiled adapter CSS (SPEC R11): every class the shadcn renderers can put on the page has a rule
 * in the adapter sources, and nothing targets elements outside Wakeb-namespaced classes. The packed
 * consumer check repeats both assertions against the shipped style.css.
 */
describe("shadcn adapter CSS", () => {
  const dir = join(__dirname, "../src/adapters/shadcn");
  const sources = [...readdirSync(dir), ...readdirSync(join(dir, "ui")).map((name) => `ui/${name}`)]
    .filter((name) => name.endsWith(".vue"))
    .map((name) => readFileSync(join(dir, name), "utf8"));
  const styles = sources.map((source) => [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((match) => match[1]).join("\n")).join("\n");
  const templates = sources.map((source) => /<template>([\s\S]*)<\/template>/.exec(source)?.[1] ?? "").join("\n");

  it("styles every wakeb-sc class the templates use", () => {
    const used = new Set([...templates.matchAll(/wakeb-sc-[\w-]+/g)].map((match) => match[0]));
    expect(used.size).toBeGreaterThan(8);
    for (const name of used) expect(styles, name).toMatch(new RegExp(`\\.${name}(?![\\w-])`));
  });

  it("has no global reset: every top-level rule starts at a Wakeb class or an at-rule", () => {
    const css = styles.replace(/\/\*[\s\S]*?\*\//g, "");
    const topLevel = css.split("\n").filter((line) => /^\S.*[{,]\s*$/.test(line));
    expect(topLevel.length).toBeGreaterThan(10);
    for (const line of topLevel) expect(line, line).toMatch(/^(\.wakeb-|\.dropdown-activator|\.loading|@(keyframes|media))/);
    expect(css).not.toMatch(/(^|[\s,}])(\*|html|body|:root)\s*[,{]/);
  });
});

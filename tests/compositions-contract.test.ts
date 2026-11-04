import { afterEach, describe, expect, it, vi } from "vitest";
import { createSSRApp, defineComponent, h, nextTick, ref } from "vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { VLayout } from "vuetify/components/VLayout";
import PrimeVue from "primevue/config";
import { WBaseSidebar, WDrawer, WExportDropdown, WModal, type WakebComponentsOptions } from "../src";
import { framework, wakeb } from "./wakeb";

/*
 * WExportDropdown, WBaseSidebar and WDrawer contract (SPEC R12–R19, M4), run once per provider
 * project. Queries go through roles and Wakeb classes, never provider DOM. The only host difference
 * is the Vuetify layout that VNavigationDrawer needs; PrimeVue renders WDrawer with no host markup.
 */
const vuetify = framework === "vuetify";
const host = () => (vuetify ? createVuetify() : ([PrimeVue, { theme: "none" }] as const));
const plugins = (options: Partial<WakebComponentsOptions> = {}) => [host() as never, wakeb(options)];
/** Vuetify needs an application layout for WDrawer (documented limit); PrimeVue needs nothing. */
const layout = (render: () => unknown) => (vuetify ? h(VLayout, null, { default: render }) : render());
const render = (component: unknown, options: { props?: Record<string, unknown>; attrs?: Record<string, unknown>; slots?: Record<string, unknown>; wakeb?: Partial<WakebComponentsOptions> } = {}) =>
  mount(component as never, {
    attachTo: document.body,
    props: { ...options.props, ...options.attrs } as never,
    slots: options.slots as never,
    global: { plugins: plugins(options.wakeb), stubs: { transition: false } },
  });
/** Renders WDrawer inside the provider's required host and returns the WDrawer wrapper. */
const renderDrawer = (props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}, options: Partial<WakebComponentsOptions> = {}) => {
  const view = defineComponent(() => () => layout(() => h(WDrawer, props, slots)));
  const w = mount(view, { attachTo: document.body, global: { plugins: plugins(options), stubs: { transition: false } } });
  return w.findComponent(WDrawer as never);
};
const settle = async () => {
  for (let i = 0; i < 4; i++) await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
};
afterEach(() => {
  document.body.innerHTML = "";
  document.body.className = "";
  document.body.removeAttribute("style");
  vi.restoreAllMocks();
});
// After hooks run in reverse: unmount first, so open overlays release PrimeVue's z-index and scroll lock.
enableAutoUnmount(afterEach);
const theme = { mode: "dark" as const, tokens: { primary: "#123456", zIndexOverlay: 3100 } };
/** The nearest ancestor (or self) whose inline z-index is set. */
const stackedZ = (node: HTMLElement | null) => {
  while (node && !node.style.zIndex) node = node.parentElement;
  return node?.style.zIndex;
};

describe(`WExportDropdown contract (${framework})`, () => {
  const rows = () => Array.from(document.querySelectorAll<HTMLElement>('[role="menu"] [role="menuitem"]'));
  const open = async (activator: { trigger(event: string): Promise<void> }) => {
    await activator.trigger("click");
    await vi.waitFor(() => expect(rows().length).toBeGreaterThan(0));
  };
  const clickRow = async (label: string) => {
    const row = rows().find((item) => item.textContent?.includes(label))!;
    (row.querySelector("a, .v-list-item") as HTMLElement | null ?? row).click();
    await settle();
  };

  it("names a non-submit activator that opens a menu of the default formats and emits one string", async () => {
    const w = render(WExportDropdown);
    const button = w.get("button");
    expect(button.attributes("type")).toBe("button");
    expect(button.attributes("aria-label")).toBe("Download");
    expect(button.attributes("aria-haspopup")).toBe("menu");
    await open(button);
    expect(button.attributes("aria-expanded")).toBe("true");
    expect(rows().map((row) => row.textContent?.trim())).toEqual(["Export as PDF", "Export as Excel"]);
    await clickRow("Excel");
    expect(w.emitted("select")).toEqual([["xlsx"]]);
  });

  it("passes activator props/buttonProps and format slot payloads", async () => {
    const seen: { activator?: Record<string, unknown>; icons: unknown[]; labels: unknown[] } = { icons: [], labels: [] };
    const formats = [{ label: "CSV", value: "csv", icon: "$file" }, { label: "JSON", value: "json" }];
    const w = render(WExportDropdown, {
      props: { title: "Save report", formats },
      slots: {
        activator: (payload: Record<string, unknown>) => (
          (seen.activator = payload), h("button", { ...(payload.props as object), type: "button", class: "custom" }, "Open")
        ),
        "format-icon": (payload: unknown) => (seen.icons.push(payload), h("i", { class: "format-icon" })),
        "format-label": (payload: { format: { label: string } }) => (seen.labels.push(payload), h("strong", payload.format.label)),
      },
    });
    expect(seen.activator?.buttonProps).toMatchObject({ type: "outline", title: "Save report", isLoading: false, disabled: false, iconPosition: "start" });
    await open(w.get(".custom"));
    expect(seen.icons.at(-2)).toEqual({ format: formats[0], index: 0 });
    expect(seen.labels.at(-1)).toEqual({ format: formats[1], index: 1 });
    expect(document.querySelectorAll('[role="menu"] strong')).toHaveLength(2);
    await clickRow("CSV");
    expect(w.emitted("select")).toEqual([["csv"]]);
  });

  it("disables the activator while loading and never emits for disabled formats", async () => {
    const w = render(WExportDropdown, { props: { isLoading: true } });
    expect(w.get("button").attributes("disabled")).toBeDefined();
    await w.setProps({ isLoading: false, formats: [{ label: "Locked", value: "locked", disabled: true }, { label: "Open", value: "open" }] });
    await open(w.get("button"));
    const [locked] = rows();
    expect(locked.getAttribute("aria-disabled")).toBe("true");
    await clickRow("Locked");
    expect(w.emitted("select")).toBeUndefined();
  });

  it("sends attrs to the teleported menu overlay only while it is open", async () => {
    const w = render(WExportDropdown, { attrs: { "data-test": "exports", class: "caller" } });
    expect(document.querySelector('[data-test="exports"]')).toBeNull();
    await open(w.get("button"));
    const overlay = document.querySelector<HTMLElement>('[data-test="exports"]')!;
    expect(overlay.classList.contains("caller")).toBe(true);
    expect(overlay.querySelector('[role="menu"]')).not.toBeNull();
    expect(w.element.parentElement?.contains(overlay) && overlay.contains(w.get("button").element)).toBeFalsy();
  });

  it("carries the theme scope and zIndexOverlay into the teleported menu while menuStyle wins", async () => {
    const w = render(WExportDropdown, { props: { menuStyle: { "--wakeb-ui-primary": "#abcdef" } }, wakeb: { theme, direction: "rtl" } });
    await open(w.get("button"));
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!;
    const scoped = menu.closest<HTMLElement>("[data-wakeb-theme]")!;
    expect(scoped.getAttribute("data-wakeb-theme")).toBe("dark");
    expect(scoped.getAttribute("dir")).toBe("rtl");
    expect(scoped.style.getPropertyValue("--wakeb-ui-primary")).toBe("#123456");
    expect(stackedZ(menu)).toBe("3100");
    expect(getComputedStyle(menu).getPropertyValue("--wakeb-ui-primary")).toBe("#abcdef");
  });

  it("uses localized default formats under the Arabic locale", async () => {
    const w = render(WExportDropdown, { wakeb: { locale: "ar" } });
    await open(w.get("button"));
    expect(rows().map((row) => row.textContent?.trim())).toEqual(["تصدير بصيغة PDF", "تصدير بصيغة Excel"]);
  });
});

describe(`WBaseSidebar contract (${framework})`, () => {
  it("renders the title, the empty state and routes attrs to the root", () => {
    const w = render(WBaseSidebar, { props: { title: "الفريق", emptyLabel: "لا توجد عناصر", hasFilter: false }, attrs: { id: "teams", class: "screen" } });
    expect(w.get("h2").text()).toBe("الفريق");
    expect(w.get(".wakeb-base-sidebar__empty").text()).toBe("لا توجد عناصر");
    expect(w.element.matches(".wakeb-base-sidebar#teams.screen")).toBe(true);
    expect(w.find("button").exists()).toBe(false);
  });

  it("emits filterClick and filterCancel from named buttons, and hides them without hasFilter", async () => {
    const w = render(WBaseSidebar, { props: { title: "People", isFiltered: true, filterLabel: "Apply", cancelLabel: "Clear" } });
    const byText = (text: string) => w.findAll("button").find((button) => button.text() === text)!;
    expect(byText("Apply").attributes("type")).toBe("button");
    await byText("Clear").trigger("click");
    await byText("Apply").trigger("click");
    expect(Object.keys(w.emitted()).filter((name) => name.startsWith("filter"))).toEqual(["filterCancel", "filterClick"]);
    expect(w.emitted("filterClick")).toEqual([[]]);
    await w.setProps({ hasFilter: false });
    expect(w.find("button").exists()).toBe(false);
  });

  it("passes header, search, item and empty slot payloads", async () => {
    const seen: Record<string, unknown> = {};
    const payload = { query: "Ada" };
    const w = render(WBaseSidebar, {
      props: { title: "People", items: [{ key: "a", name: "Ada" }, { key: "b", name: "Grace" }], itemKey: "key", isFiltered: true },
      slots: {
        "header-actions": (props: Record<string, unknown>) => ((seen.header = props), h("span", "Controls")),
        search: ({ search }: { search: (value: unknown) => void }) => h("button", { type: "button", class: "search", onClick: () => search(payload) }, "Search"),
        item: ({ item, index }: { item: { name: string }; index: number }) => h("b", `${index}:${item.name}`),
      },
    });
    expect(seen.header).toMatchObject({ isFiltered: true, filterClick: expect.any(Function), filterCancel: expect.any(Function) });
    expect(w.findAll("li").map((li) => li.text())).toEqual(["0:Ada", "1:Grace"]);
    await w.get(".search").trigger("click");
    expect(w.emitted("search")).toEqual([[payload]]);
    (seen.header as { filterClick: () => void }).filterClick();
    expect(w.emitted("filterClick")).toHaveLength(1);
  });

  it("shows a named busy skeleton while loading and passes the normalized grammar to the loading slot", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = render(WBaseSidebar, { props: { title: "People", loading: true, items: [{ id: 1 }] } });
    const busy = w.get('.sidebar__list [role="alert"]');
    expect(busy.attributes("aria-live")).toBe("polite");
    expect(busy.attributes("aria-label")).toBe("Loading...");
    expect(w.find("li").exists()).toBe(false);
    const seen: unknown[] = [];
    render(WBaseSidebar, {
      props: { title: "People", loading: true, skeletonType: "list-item@2, bogus", skeletonWidth: 240 },
      slots: { loading: (payload: unknown) => (seen.push(payload), h("p", "Loading records")) },
    });
    expect(seen[0]).toEqual({ type: "list-item@2", width: 240 });
    expect(warn.mock.calls.some(([message]) => String(message).includes("WAKEB_UNKNOWN_VALUE"))).toBe(true);
    await w.setProps({ loading: false });
    expect(w.findAll("li")).toHaveLength(1);
  });

  it("lets content replace the list region and keeps filter-modal on the root", () => {
    const w = render(WBaseSidebar, {
      props: { title: "Custom", loading: true },
      slots: { content: () => h("article", "Custom body"), "filter-modal": () => h("dialog", "Filter modal") },
    });
    expect(w.get("article").text()).toBe("Custom body");
    expect(w.find(".sidebar__list").exists()).toBe(false);
    expect(w.get("dialog").element.parentElement).toBe(w.element);
  });

  it("server-renders without browser globals", async () => {
    const { renderToString } = await import("vue/server-renderer");
    const html = await renderToString(createSSRApp(() => h(WBaseSidebar, { title: "Team sidebar", loading: true })).use(host() as never).use(wakeb()));
    expect(html).toContain("Team sidebar");
    expect(html).toContain('role="alert"');
  });
});

describe(`WDrawer contract (${framework})`, () => {
  const drawer = () => document.querySelector<HTMLElement>(".wakeb-drawer");
  const closeButton = (label = "Close") => document.querySelector<HTMLElement>(`.wakeb-drawer button[aria-label="${label}"]`);
  const escape = () => {
    for (const target of [document, window] as EventTarget[])
      target.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true }));
  };

  it("keeps closed content inoperable", async () => {
    renderDrawer({ title: "Filters" }, { content: () => h("button", { type: "button", class: "inside" }, "Inside") });
    await settle();
    // Closed content is either not rendered or sits under an inert root.
    for (const node of document.querySelectorAll(".inside, .wakeb-drawer button")) expect(node.closest("[inert]")).not.toBeNull();
  });

  it("opens from the model with an accessible name, both content slots and an actions footer", async () => {
    renderDrawer({ modelValue: true, title: "Filters" }, { content: () => h("p", "Named body"), default: () => h("p", "Default body"), actions: () => h("button", { type: "button" }, "Apply") });
    await settle();
    expect(drawer()?.getAttribute("aria-label")).toBe("Filters");
    expect(drawer()?.querySelector(".drawer-panel__content")?.textContent).toBe("Named bodyDefault body");
    expect(drawer()?.querySelector(".drawer-panel__actions")?.textContent).toBe("Apply");
    expect(closeButton()?.getAttribute("type")).toBe("button");
  });

  it("falls back to ariaLabel, localized under Arabic", async () => {
    renderDrawer({ modelValue: true }, {}, { locale: "ar" });
    await settle();
    expect(drawer()?.getAttribute("aria-label")).toBe("لوحة جانبية");
    expect(closeButton("إغلاق")).not.toBeNull();
  });

  it("emits update:modelValue then close from the close button, and stays silent for parent changes", async () => {
    const w = renderDrawer({ modelValue: true, closeLabel: "Dismiss panel" });
    await settle();
    closeButton("Dismiss panel")!.click();
    await settle();
    expect(Object.keys(w.emitted()).filter((name) => name === "update:modelValue" || name === "close")).toEqual(["update:modelValue", "close"]);
    expect(w.emitted("update:modelValue")).toEqual([[false]]);
    expect(w.emitted("close")).toEqual([[]]);

    const parent = ref(false);
    const view = defineComponent(() => () => layout(() => h(WDrawer, { modelValue: parent.value, title: "Controlled" })));
    const controlled = mount(view, { attachTo: document.body, global: { plugins: plugins(), stubs: { transition: false } } });
    parent.value = true;
    await settle();
    expect([...document.querySelectorAll(".wakeb-drawer")].some((node) => node.getAttribute("aria-label") === "Controlled")).toBe(true);
    expect(controlled.findComponent(WDrawer as never).emitted("update:modelValue")).toBeUndefined();
  });

  it("passes the close-button and loading slot payloads and replaces content until data loads", async () => {
    const seen: Record<string, unknown> = {};
    renderDrawer(
      { modelValue: true, dataLoaded: false, loading: true, loadingLabel: "Fetching", closeLabel: "Shut" },
      {
        content: () => h("p", "Not ready"),
        "close-button": (payload: Record<string, unknown>) => ((seen.close = payload), h("button", { type: "button" }, "x")),
        loading: (payload: Record<string, unknown>) => ((seen.loading = payload), h("p", { class: "custom-loading" }, "Fetching")),
        "loading-overlay": (payload: Record<string, unknown>) => ((seen.overlay = payload), h("div", { class: "custom-overlay" })),
      } as never,
    );
    await settle();
    expect(seen.close).toEqual({ close: expect.any(Function), label: "Shut" });
    expect(seen.loading).toEqual({ label: "Fetching" });
    expect(seen.overlay).toEqual({ label: "Fetching" });
    expect(drawer()?.textContent).not.toContain("Not ready");
    expect(drawer()?.querySelector('[aria-busy="true"]')).not.toBeNull();
  });

  it("closes on Escape unless persistent (PrimeVue); the Vuetify drawer keeps its documented native behavior", async () => {
    const w = renderDrawer({ modelValue: true, persistent: false });
    await settle();
    escape();
    await settle();
    // Vuetify's VNavigationDrawer has no Escape dismissal; this is a documented provider difference.
    expect(w.emitted("update:modelValue")).toEqual(vuetify ? undefined : [[false]]);
    expect(w.emitted("close")).toBeUndefined();
    const persistent = renderDrawer({ modelValue: true, persistent: true });
    await settle();
    escape();
    await settle();
    expect(persistent.emitted("update:modelValue")).toBeUndefined();
  });

  it("routes attrs to the drawer root and carries the theme scope there", async () => {
    renderDrawer({ modelValue: true, title: "Filters", "data-test": "caller", style: { "--wakeb-ui-primary": "#abcdef" } }, {}, { theme, direction: "rtl" });
    await settle();
    const root = drawer()!;
    expect(root.getAttribute("data-test")).toBe("caller");
    expect(root.getAttribute("data-wakeb-theme")).toBe("dark");
    expect(root.getAttribute("dir")).toBe("rtl");
    // Caller styles merge after the scope, so they win.
    expect(root.style.getPropertyValue("--wakeb-ui-primary")).toBe("#abcdef");
    // PrimeVue teleports the drawer under a mask that takes zIndexOverlay; Vuetify keeps its layout z-index.
    if (!vuetify) expect(stackedZ(root)).toBe("3100");
  });

  it("server-renders a closed drawer without browser globals", async () => {
    const { renderToString } = await import("vue/server-renderer");
    const html = await renderToString(createSSRApp(() => layout(() => h(WDrawer, { title: "Server drawer" }))).use(host() as never).use(wakeb()));
    expect(html).not.toContain("NaN");
    // A closed drawer exposes no operable controls in server markup.
    expect(/<button(?![^>]*inert)/.test(html.replace(/<nav[^>]*inert[^>]*>[\s\S]*<\/nav>/, ""))).toBe(false);
  });
});

/* PrimeVue-only R18/R19 behavior: the provider-neutral overlay host Vuetify does not have. */
describe.runIf(!vuetify)("PrimeVue WDrawer overlay host (R18, R19)", () => {
  it("renders with no layout host, traps focus inside, blocks body scroll and returns focus to the opener", async () => {
    const open = ref(false);
    const view = defineComponent(() => () => [
      h("button", { type: "button", class: "opener", onClick: () => (open.value = true) }, "Open"),
      h(WDrawer, { modelValue: open.value, "onUpdate:modelValue": (value: boolean) => (open.value = value), title: "Filters" }, { content: () => h("input", { class: "field" }) }),
    ]);
    const w = mount(view, { attachTo: document.body, global: { plugins: plugins(), stubs: { transition: false } } });
    const opener = w.get(".opener").element as HTMLElement;
    opener.focus();
    await w.get(".opener").trigger("click");
    await settle();
    const root = document.querySelector<HTMLElement>(".wakeb-drawer")!;
    expect(root.getAttribute("role")).toBe("dialog");
    expect(root.getAttribute("aria-modal")).toBe("true");
    expect(w.element.parentElement?.contains(root) && !document.body.contains(root)).toBeFalsy();
    await vi.waitFor(() => expect(root.contains(document.activeElement)).toBe(true));
    await vi.waitFor(() => expect(document.body.classList.contains("p-overflow-hidden")).toBe(true));
    // PrimeVue's focus trap adds sentinels that send Tab back inside the drawer.
    expect(root.querySelectorAll("[data-p-hidden-focusable]").length).toBeGreaterThan(0);
    (root.querySelector('button[aria-label="Close"]') as HTMLElement).click();
    await settle();
    await vi.waitFor(() => expect(document.querySelector(".wakeb-drawer")).toBeNull());
    await vi.waitFor(() => expect(document.activeElement).toBe(opener));
    expect(document.body.classList.contains("p-overflow-hidden")).toBe(false);
  });

  it("closes from the mask unless persistent, and a transparent overlay still blocks the background", async () => {
    const w = renderDrawer({ modelValue: true, transparentOverlay: true });
    await settle();
    const mask = document.querySelector<HTMLElement>(".wakeb-drawer")!.parentElement!;
    expect(mask.classList.contains("wakeb-pv-drawer-mask--transparent")).toBe(true);
    mask.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await settle();
    expect(w.emitted("update:modelValue")).toEqual([[false]]);
    expect(w.emitted("close")).toBeUndefined();
    const persistent = renderDrawer({ modelValue: true, persistent: true });
    await settle();
    [...document.querySelectorAll<HTMLElement>(".wakeb-drawer")].at(-1)!.parentElement!.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await settle();
    expect(persistent.emitted("update:modelValue")).toBeUndefined();
  });

  it("maps logical positions through the Wakeb direction", async () => {
    renderDrawer({ modelValue: true, position: "end", width: "560px" }, {}, { direction: "rtl" });
    await settle();
    const root = document.querySelector<HTMLElement>(".wakeb-drawer")!;
    expect(root.parentElement?.getAttribute("data-p")).toContain("left");
    expect(root.style.width).toBe("560px");
  });

  it("stacks a dialog opened from the drawer above it through PrimeVue's shared modal z-index", async () => {
    const view = defineComponent(() => () =>
      h(WDrawer, { modelValue: true, title: "Drawer" }, { content: () => h(WModal, { modelValue: true, title: "Nested" }) }),
    );
    mount(view, { attachTo: document.body, global: { plugins: plugins(), stubs: { transition: false } } });
    await settle();
    const drawerZ = Number(stackedZ(document.querySelector<HTMLElement>(".wakeb-drawer")));
    const dialogZ = Number(stackedZ(document.querySelector<HTMLElement>(".wakeb-modal")));
    expect(drawerZ).toBeGreaterThan(0);
    expect(dialogZ).toBeGreaterThan(drawerZ);
  });
});

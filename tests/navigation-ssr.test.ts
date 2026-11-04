// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WCarousel, WTabs, WTree } from "../src";
import { framework, wakeb } from "./wakeb";

/* Server render without browser globals, with deterministic ids (SPEC R19), on each provider. */
const host = () => (framework === "vuetify" ? createVuetify({ ssr: true }) : ([PrimeVue, { theme: "none" }] as const));
const page = () =>
  h("main", [
    h(WTabs, { tabs: [{ slot: "one", label: "One", content: "Server panel" }, { slot: "two", label: "Two" }] }),
    h(WTree, { nodes: [{ id: 0, name: "Server root", children: [{ id: 1, name: "Server child" }] }], expandedKeys: [0], activeKey: 1 }),
    h(WCarousel, { slides: ["Server slide", "Other"], showIndicators: true, showArrows: true }, { slide: ({ slide }: { slide: string }) => h("p", slide) }),
  ]);
const request = () => renderToString(createSSRApp(page).use(host() as never).use(wakeb()));

describe(`navigation SSR (${framework})`, () => {
  it("renders without window or document and repeats identical markup per request", async () => {
    expect(typeof window).toBe("undefined");
    expect(typeof document).toBe("undefined");
    const [first, second] = await Promise.all([request(), request()]);
    expect(first).toContain("Server panel");
    expect(first).toContain('role="tabpanel"');
    expect(first).toContain("Server child");
    expect(first).toContain('role="tree"');
    expect(first).toContain("Server slide");
    expect(first).toContain('aria-roledescription="carousel"');
    expect(first).toContain('aria-current="true"');
    expect(second).toBe(first);
  });
});

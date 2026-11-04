// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WBadge, WButton, WTooltipBtn, WTruncatedText, WUserBadge } from "../src";
import { framework, wakeb } from "./wakeb";

/* Server render without browser globals (SPEC R19), on each provider. */
const renderPage = (root: () => unknown) => {
  const app = createSSRApp({ render: root as never });
  if (framework === "vuetify") app.use(createVuetify({ ssr: true }));
  else if (framework === "primevue") app.use(PrimeVue, { theme: "none" });
  app.use(wakeb({ theme: { mode: "dark" }, direction: "rtl" }));
  return renderToString(app);
};

describe(`SSR (${framework})`, () => {
  it("runs without window or document", () => {
    expect(typeof window).toBe("undefined");
    expect(typeof document).toBe("undefined");
  });

  it("renders the four components and their accessible names", async () => {
    const html = await renderPage(() =>
      h("main", [
        h(WTruncatedText, { label: "Server rendered label", length: 8 }),
        h(WTooltipBtn, { text: "Open settings", icon: "$close" }),
        h(WBadge, { label: "Approved", type: "success", isDot: true, variant: "outline" }),
        h(WUserBadge, { user: { name: "Grace Hopper", avatar: "/g.png" } }),
        h(WUserBadge, { user: { name: "Ada Lovelace" } }),
        h(WButton, { title: "Save", isTooltip: true, icon: "$close" }),
      ]),
    );
    expect(html).toContain('aria-label="Server rendered label"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('aria-label="Open settings"');
    expect(html).toMatch(/class="[^"]*wakeb-badge[^"]*success[^"]*wakeb-badge--outline/);
    expect(html).toContain("Approved");
    expect(html).toContain("Grace Hopper");
    expect(html).toMatch(/wakeb-user-badge__initials[^>]*>(?:<!--\[-->)*AL</);
    expect(html).toContain('dir="rtl"');
    expect(html).not.toMatch(/NaN|undefined/);
  });

  it("renders the same tooltip description ids for the same tree", async () => {
    const tree = () => h("div", [h(WTooltipBtn, { text: "Help" }), h(WTruncatedText, { label: "A label that is long", length: 6 })]);
    const ids = (html: string) => [...html.matchAll(/aria-describedby="([^"]+)"/g)].map((match) => match[1]);
    const first = ids(await renderPage(tree));
    // Vuetify links the WTooltipBtn tooltip on the client only (activator="parent"); reka-ui (shadcn) adds
    // aria-describedby only while a tooltip is open, so closed server output has none.
    expect(first).toHaveLength({ vuetify: 1, primevue: 2, shadcn: 0 }[framework]);
    expect(ids(await renderPage(tree))).toEqual(first);
  });
});

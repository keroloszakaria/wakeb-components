import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { WBadge, WBadgeStack, WTooltipBtn } from "../src";
import { wakeb } from "./wakeb";

/* Portable variants and deprecated aliases (SPEC R23, R07); WBadge-family renderers are Vuetify-only for now. */
const render = (component: unknown, props: Record<string, unknown> = {}, plugin = wakeb()) =>
  mount(component as never, { attachTo: document.body, props, global: { plugins: [createVuetify(), plugin] } });
const chipVariant = (w: ReturnType<typeof render>) => w.get(".v-chip").classes().find((name) => name.startsWith("v-chip--variant-"));
const warnings = () => vi.mocked(console.warn).mock.calls.map(([message]) => String(message));

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
enableAutoUnmount(afterEach);

describe("portable variants", () => {
  it.each([
    [undefined, "v-chip--variant-tonal"],
    ["soft", "v-chip--variant-tonal"],
    ["solid", "v-chip--variant-flat"],
    ["outline", "v-chip--variant-outlined"],
    ["ghost", "v-chip--variant-text"],
  ])("renders WBadge variant %s through the Vuetify mapping table", (variant, expected) => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(chipVariant(render(WBadge, { label: "Ready", variant }))).toBe(expected);
    expect(warnings()).toEqual([]);
  });

  it("defaults WTooltipBtn to ghost", () => {
    const w = render(WTooltipBtn, { text: "Help", icon: "$close" });
    expect(w.get(".v-btn").classes()).toContain("v-btn--variant-text");
  });
});

describe("deprecated aliases", () => {
  it.each([
    ["default", "soft", "v-chip--variant-tonal"],
    ["tonal", "soft", "v-chip--variant-tonal"],
    ["flat", "solid", "v-chip--variant-flat"],
    ["elevated", "solid", "v-chip--variant-flat"],
    ["outlined", "outline", "v-chip--variant-outlined"],
    ["text", "ghost", "v-chip--variant-text"],
    ["plain", "ghost", "v-chip--variant-text"],
  ])("maps %s to %s with one development warning", (alias, portable, expected) => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = render(defineComponent(() => () => [h(WBadge, { label: "A", variant: alias }), h(WBadge, { label: "B", variant: alias })]));
    expect(w.findAll(".v-chip").map((chip) => chip.classes().find((name) => name.startsWith("v-chip--variant-")))).toEqual([expected, expected]);
    expect(warnings()).toEqual([`[WAKEB_DEPRECATED_VALUE] WBadge variant '${alias}' is deprecated; use '${portable}'. The alias is removed in the next major release.`]);
  });

  it("warns again in another app", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    render(WBadge, { label: "A", variant: "tonal" });
    render(WBadge, { label: "B", variant: "tonal" });
    expect(warnings()).toHaveLength(2);
  });

  it("names the stack prop the caller used and keeps per-item overrides", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = render(WBadgeStack, {
      badgeVariant: "outlined",
      max: 5,
      items: [{ id: 1, label: "Stack" }, { id: 2, label: "Item", variant: "plain" }, { id: 3, label: "Portable", variant: "solid" }],
    });
    expect(w.findAll(".v-chip").map((chip) => chip.classes().find((name) => name.startsWith("v-chip--variant-")))).toEqual([
      "v-chip--variant-outlined",
      "v-chip--variant-text",
      "v-chip--variant-flat",
    ]);
    expect(warnings()).toEqual([
      "[WAKEB_DEPRECATED_VALUE] WBadgeStack badgeVariant 'outlined' is deprecated; use 'outline'. The alias is removed in the next major release.",
      "[WAKEB_DEPRECATED_VALUE] WBadgeStack items[].variant 'plain' is deprecated; use 'ghost'. The alias is removed in the next major release.",
    ]);
  });

  it("falls back to the component default for unknown values", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(chipVariant(render(WBadge, { label: "Odd", variant: "glow" }))).toBe("v-chip--variant-tonal");
    expect(warnings()).toEqual(["[WAKEB_UNKNOWN_VALUE] WBadge variant 'glow' is not a Wakeb variant; using 'soft'. Use one of: soft, solid, outline, ghost."]);
  });

  it("stays silent in production while still mapping the alias", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(chipVariant(render(WBadge, { label: "Prod", variant: "elevated" }))).toBe("v-chip--variant-flat");
    expect(warnings()).toEqual([]);
  });
});

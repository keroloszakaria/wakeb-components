import { vi } from "vitest";
// Browser shims for jsdom suites; node-environment suites (selector tests) skip them.
if (typeof window !== "undefined") {
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
  vi.stubGlobal("visualViewport", null);
}

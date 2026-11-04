# M5 architecture decision: shadcn-vue adapter foundation

Status: accepted for the framework alpha branch. The first slice (`ddceaec`, based on `2e5dc33`) delivered the adapter foundation and four renderers. Updated at `92f4657`: 15 of the 21 components are now supported (`SUPPORTED.shadcn` in `src/adapters/manifest.ts`), and six are on a parallel track (see "Coverage"). **M5 is not exited.** shadcn-vue stays advertised as alpha and incomplete until all 21 rows pass and real-browser evidence exists (IMPLEMENTATION.md M5 exit rule). This record does not authorize npm publication.

## Coverage (at `92f4657`)

| Component | Status | Commit | Primitive or markup |
| --- | --- | --- | --- |
| WButton | Supported | `ddceaec` | `ui/Button.vue`, `ui/TooltipContent.vue` |
| WLoading | Supported | `ddceaec` | `ui/Spinner.vue` |
| WDropdown | Supported | `ddceaec` | `ui/DropdownMenuContent.vue`, `ui/DropdownMenuItem.vue` |
| WModal | Supported | `ddceaec`, `92f4657` (a persistent modal stays open on a non-cancelable Escape) | `ui/DialogContent.vue` |
| WTabs | Supported | `c5451f3` | Wakeb-owned markup |
| WTree | Supported | `c5451f3` | Wakeb-owned markup |
| WCarousel | Supported | `c5451f3` | Wakeb-owned markup; Wakeb-owned autoplay |
| WSegmentedProgress | Supported | `08bf727` | Wakeb-owned markup |
| WSemiCircleGauge | Supported | `08bf727` | Wakeb-owned markup |
| WVerticalSteps | Supported | `08bf727` | Wakeb-owned markup |
| WPageSkeleton | Supported | `08bf727` | `ui/Skeleton.vue` with the Wakeb grid |
| WAccordion | Supported | `08bf727` | Wakeb-owned markup |
| WExportDropdown | Supported | `c88b803` | `ui/DropdownMenuContent.vue`, `ui/DropdownMenuItem.vue` |
| WBaseSidebar | Supported | `c88b803` | Wakeb skeleton sequence |
| WDrawer | Supported | `c88b803` | `ui/SheetContent.vue` (reka Dialog). Own overlay host, focus trap, Escape and outside press unless `persistent`, `zIndexOverlay` |

> **IN PROGRESS (parallel track) — the single place in this file to flip:** WTruncatedText, WTooltipBtn, WBadge, WUserBadge, WAvatarStack and WBadgeStack. At `92f4657` they are not in `SUPPORTED.shadcn` and render `WAKEB_COMPONENT_UNSUPPORTED` under `framework: 'shadcn'`. When they land, move them into the table above with their commits, and add their test files to the `shadcn` project in `vitest.config.ts`.

The upstream files used now also include `sheet/SheetContent.vue` and `skeleton` from the same shadcn-vue 2.9.0 commit (see the headers in `src/adapters/shadcn/ui/`). The license list under "License handling" names only the first five directories.

Evidence for the 15 rows: the `shadcn` Vitest project in `vitest.config.ts` runs the shared suites (`contract`, `defaults`, `colors`, `plugin`, `icons`, `provider-props`, `contract-display`, `navigation-contract`, `navigation-ssr`, `compositions-contract`) plus `tests/shadcn-adapter.test.ts`, `tests/accordion-shadcn.test.ts` and `tests/accordion-shadcn-ssr.test.ts`. All of these run in jsdom. No real-browser run has been recorded for keyboard, focus, positioning or visual parity.

## Decision

`framework: 'shadcn'` selects a Wakeb-owned adapter under `src/adapters/shadcn`. That adapter contains adapted copies of the shadcn-vue new-york-v4 components, built over `reka-ui`. The adapter ships precompiled, namespaced CSS. Consumers install `reka-ui` only. They need no Tailwind CSS, no `components.json`, no shadcn-vue CLI and no copied source files (SPEC R11).

## Dependencies

| Package | Decision | Range / version | License | Reason |
| --- | --- | --- | --- | --- |
| `reka-ui` | Optional peer of the selected provider (`PEERS.shadcn`) | `^2.10.5`; dev and current fixture 2.11.0 | MIT | The headless layer under shadcn-vue. It provides FocusScope, DismissableLayer, Presence, Popper (floating-ui), roving focus, `aria-hidden` and the ARIA patterns. A peer, so an app that already uses shadcn-vue shares one copy and one ConfigProvider. The range matches the shadcn-vue 2.9.0 catalog. |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Not used | — | — | Wakeb renders static class names, with variant/size as `data-*` attributes. No runtime class merging is needed. |
| `lucide-vue-next` | Not used | — | ISC | Only one icon (the Spinner's `loader-circle`). Its single path is inlined, with the notice. |
| `@vueuse/core` | Not used directly | — | MIT | `reactiveOmit` from upstream is replaced by plain prop forwarding. reka-ui brings its own `@vueuse` dependency. |
| Tailwind CSS | Not used at build or run time | — | MIT | See the CSS pipeline below. |

reka-ui's transitive dependencies (`@floating-ui/*`, `@vueuse/*`, `@internationalized/*`, `@tanstack/vue-virtual`, `aria-hidden`, `defu`, `ohash`) are MIT or Apache-2.0. They install with the peer, not with Wakeb. Duplication check: the shadcn consumer has one `reka-ui` copy, and Vuetify and PrimeVue modules are absent from the shadcn graphs (checked by `check:package` and `check:peers`).

## License handling

- The upstream source is shadcn-vue v2.9.0, commit `39cb0b277f009e47de2dc62c4217755fb9a27eec`, `apps/v4/registry/new-york-v4/ui/{button,dialog,dropdown-menu,spinner,tooltip}`. It is MIT, Copyright (c) 2023 unovue.
- Each adapted file under `src/adapters/shadcn/ui/` starts with a header comment. The header names the upstream file, the license and the Wakeb changes.
- `THIRD-PARTY-NOTICES.txt` sits at the package root and is listed in `files`. It reproduces the shadcn-vue MIT notice and the Lucide ISC notice. `packTarball` asserts that the file is in the tarball.

## CSS pipeline and scoping

- **No Tailwind step.** The upstream Tailwind utilities were translated by hand into plain CSS inside the SFC `<style>` blocks. Vite merges them into `dist/wakeb-components.css` (`style.css`). The reason: shadcn-vue hosts usually run their own Tailwind build. Generic utility class names would collide with it or depend on its configuration, and a second Preflight would reset the host.
- **Namespacing.** Every adapter class is `wakeb-sc-*`, and keyframes are `wakeb-sc-*` as well. Variants use `[data-variant]` / `[data-size]` / `[data-state]` / `[data-highlighted]` / `[data-disabled]` selectors under those classes.
- **No reset.** There are no rules for `*`, `html`, `body`, `:root`, `::before`, `::after` or `::backdrop`, no `--tw-*` and no `@layer base`.
- **Theme bridge.** Host shadcn-vue variables are read through fallbacks, for example `var(--wakeb-ui-surface, var(--background, #fff))`. The order is Wakeb token, then host shadcn-vue variable, then Wakeb default. Intent colors use `SHADCN_INTENTS` (`primary` maps to `--primary`, `danger` to `--destructive`). This assumes Tailwind v4 themes, where those variables hold complete colors.
- **Motion.** Animations are namespaced keyframes, turned off or slowed under `prefers-reduced-motion`.
- **Enforcement.** `assertScopedAdapterCss` in `scripts/consumer-harness.mjs` runs on the built shadcn consumer. Every selector's first compound must contain a class or an attribute, and there may be no global reset or Tailwind runtime. Every `wakeb-sc-*` class that appears in the bundled JS must have a CSS rule (the dynamic-class-survival check). `tests/shadcn-adapter.test.ts` checks the same at source level.

## `providerOptions.mode`

shadcn-vue has no app-level instance (SPEC line 148).

| Mode | shadcn behavior |
| --- | --- |
| `auto` (default) | Installs the Wakeb context only; `reused: false` |
| `install` | Same as `auto` |
| `reuse` | `WAKEB_HOST_PROVIDER_MISSING`: there is nothing to reuse |
| `options` set | `WAKEB_CONFIG_INVALID`: there are no native install options |

## Renderers

All four keep the Vuetify contract. Each is built from the shared composables (`useButton`, `useDropdown`, `useDisclosure`, `useColor`, `useProviderProps`, `WakebIcon`, the facade scope and `zIndexOverlay`).

| Component | Primitive (`providerProps` target) | Notes |
| --- | --- | --- |
| WButton | `ui/Button.vue` (reka `Primitive`) | The tooltip is reka Tooltip (`TooltipContent` copy) and opens on hover and focus. Logical sides are mapped through `direction`. The tooltip receives the scope and the z-index. Native `variant`/`size` render as `data-*`. |
| WLoading | `ui/Spinner.vue` (Lucide props) | The color comes from `useColor` with `SHADCN_INTENTS`. The SVG is decorative; the root keeps `role="status"` and the label. |
| WDropdown | `ui/DropdownMenuContent.vue` | Open state is controlled through `v-model:open`, not reka's Trigger, and the content is anchored with `reference` to the slot activator. This preserves Wakeb's `activator` slot contract. Focus return is handled in `onCloseAutoFocus`. A press on the activator is not counted as an outside interaction, so the activator toggles the menu. |
| WModal | `ui/DialogContent.vue` | The overlay and content receive the scope and stacking. Focus returns to the previously focused element. `persistent` blocks Escape and outside presses. `afterLeave` fires from the content's unmount after Presence, and never on teardown. A hidden `DialogTitle` satisfies reka's development check, while the accessible name comes from `aria-label`. |

## Evidence

- `npm run check`, including vitest with a third `shadcn` project. That project runs the shared contract, defaults, colors, plugin, icons and provider-props suites plus `tests/shadcn-adapter.test.ts`.
- `npm run check:package` covers three isolated consumers. The shadcn consumer has only `reka-ui`. It passes `tsc --strict`, browser and SSR builds, tree shaking, the no-Preflight CSS check and the runtime-classes-in-CSS check.
- `npm run check:peers` passes six cells: `shadcn-min` (Vue 3.5.40, Vite 6.0.0, reka-ui 2.10.5) and `shadcn-current` (Vue 3.5.44, Vite 6.4.5, reka-ui 2.11.0) pass alongside the Vuetify and PrimeVue rows.
- Rendered module counts, full graph / WButton-only graph. These were measured at the four-component slice and have not been re-recorded since the other 11 renderers landed:

| Provider | Full | WButton only |
| --- | --- | --- |
| Vuetify | 172 | 98 |
| PrimeVue | 183 | 143 |
| shadcn-vue | 124 | 64 |

In the WButton-only shadcn graph, reka Dialog and DropdownMenu content are tree-shaken.

## Deviations and open risks

- **`dir` on overlays.** reka-ui's PopperContent and Dialog write `dir` from its ConfigProvider, defaulting to `ltr`. Without Wakeb's `direction`, overlay content gets `dir="ltr"` instead of inheriting it. The shared defaults test expects `ltr` for shadcn.
- **Tooltip trigger.** The tooltip opens on focus and hover, as on Vuetify. PrimeVue opens on hover only.
- **Theme bridge.** The bridge only works with Tailwind v4 (complete-color) themes. A v3 HSL-channel theme needs Wakeb tokens.
- **`style.css`.** It still contains every renderer's CSS. Splitting it per provider is planned.
- **jsdom limits.** floating-ui positioning and pointer events are not fully modeled in jsdom. Side and outside-press tests check props and use `MouseEvent("pointerdown")`. Real-browser visual and positioning checks are still pending.
- **Remaining work for the M5 exit (at `92f4657`).**
  - Six components are on the parallel track (see "Coverage"). Until they land they fail with `WAKEB_COMPONENT_UNSUPPORTED`.
  - Still outstanding: SSR hydration-mismatch tests in a real browser, and real-browser keyboard, focus and visual contract tests.
  - The module counts above need re-recording for the full 15-component graph.
- **WDrawer difference across providers.** shadcn-vue and PrimeVue close the drawer on Escape. Vuetify does not, and still needs `VApp` or `VLayout`. This is an open owner decision; see RELEASE-NOTES-DRAFT.md.

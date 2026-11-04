# M1 architecture decision: single-selector packaging

Status: accepted for the framework alpha branch `feat/m1-selector-packaging`, based on `main` at `d8c75ad`. This record covers the IMPLEMENTATION.md M1 deliverables. It does not authorize publication.

## Decision

The root package exports typed facades. Each facade is a binding to an internal specifier, `wakeb-components/_internal/selected/<Component>`, and the consumer's `wakebComponents()` resolves that specifier to exactly one provider's renderer module. Selection comes from the consumer plugin file, read with Vite's `parseAst`; TypeScript is first stripped with `transformWithEsbuild`. The file is never executed. Optional peer resolution and tree shaking both work from the packed tarball, so the adapter work can expand.

## Exported paths

| Path | Purpose | Consumer-facing |
| --- | --- | --- |
| `wakeb-components` | Facades, types, `createWakebComponents`, `WakebError` | Yes |
| `wakeb-components/vite` | `wakebComponents(options?)` build integration (`dist/vite.js`, Node ESM) | Yes |
| `wakeb-components/style.css` | Wakeb CSS | Yes |
| `wakeb-components/package.json` | Metadata | Yes |
| `wakeb-components/_internal/selected/*` | Unconfigured stubs that throw `WAKEB_BUILD_PLUGIN_MISSING` when the integration is absent | No |
| `dist/_internal/adapters/<provider>/<Component>.js`, `services.js`, `dist/_internal/core.js` | Renderers, provider services and shared runtime; reached only through absolute paths from `wakebComponents()` | No, not in `exports` |

The core runtime is its own entry, `_internal/core.js`. It holds the injection key, the errors and the stub factories, and every adapter imports it, so the app context has a single module identity. The context key is also `Symbol.for(...)`.

## Tested versions

From locked, isolated consumers installed outside the repository: Vue 3.5.x (the repository lock), Vite 6.4.5, Vuetify 3.13.2 in the consumer (3.13.7 in development), PrimeVue 4.5.5 and `@primeuix/themes` 2.0.3. All are declared as `peerDependencies`. Vuetify, PrimeVue and the themes package are optional peers. (M2 update: Vite became a required peer because provider selection only works through `wakebComponents()`, and the `vue` range became `^3.5.40` because the emitted declarations need the `DefineComponent` element type parameter; see the locked peer matrix in `tests/fixtures/peers`.)

PrimeVue 5 is excluded by an owner decision on 2026-11-03. Version 5.x moved from MIT to the commercial PrimeUI license, which requires a license key and an OEM license for redistribution inside component libraries.

## Evidence (`npm run check:package`)

- Vuetify-only and PrimeVue-only consumers each install the packed tarball. The other provider's packages are absent from `node_modules`, and no module from them appears in either browser graph.
- The fixture sources (`scripts/consumer/*`) are byte-identical. Only the plugin file, `package.json` and the lockfile differ.
- `tsc --strict` passes on the root declarations in both consumers with no `skipLibCheck`. Neither consumer has the other provider installed.
- Rendered module counts after tree shaking:

| Consumer | All components | WButton only |
| --- | --- | --- |
| Vuetify | 170 | 95 |
| PrimeVue | 178 | 139 |

  The WButton-only graphs contain no WModal or WDropdown renderer and no dialog or menu primitive (`VDialog`, `VMenu`, `primevue/dialog`, `primevue/menu`). The PrimeVue baseline is larger because it carries PrimeVue's config, its styled-mode runtime and the Aura preset.

- SSR builds render every supported component on both providers.
- A bundle built without the integration fails with `WAKEB_BUILD_PLUGIN_MISSING`.
- The unit and contract suite has 202 tests in two Vitest projects. One shared contract file, `tests/contract.test.ts`, runs the same WButton, WDropdown and WModal assertions on each provider. The plugin and host-instance tests also run on both.
- A browser pass on the packed PrimeVue consumer's dev server found three defects that jsdom had missed; all three are fixed and now covered by tests. The dropdown `aria-controls` now names the `role="menu"` list. Enter now selects rows that are not links. Opening the dialog now moves focus into it. In the same pass, Tab stayed trapped inside the dialog, Escape left a persistent dialog open, and Close returned focus to the opener.

## Startup and SSR behavior

- `createWakebComponents()` validates the options synchronously and has no side effects. `install` is synchronous. It checks the compiled provider marker (`WAKEB_FRAMEWORK_MISMATCH`), reuses or installs the provider, and then provides a frozen context for the app. There is no asynchronous startup.
- Host detection is per app. Vuetify is detected by injecting its `Symbol.for('vuetify:*')` services, PrimeVue through the public `$primevue` global property. Neither check reads a module singleton. Detection runs at install time, so the host provider must be installed first; this is documented, and `reuse` mode gives an actionable error.
- When Wakeb installs Vuetify it uses `ssr: true`, so server and client agree. The integration adds `wakeb-components`, plus `vuetify` when it is selected, to `ssr.noExternal`, and excludes `wakeb-components` from dependency pre-bundling, so every graph goes through the same selector.

## Deviations from SPEC.md and IMPLEMENTATION.md

1. **Reference contract types.** The facades are typed from the Vuetify renderer declarations, which are provider-neutral after `SharedIcon` stopped importing Vuetify types. Separate neutral contract declarations are M2 work.
2. **Defaults, locale, theme and icons.** The context carries `locale` and `direction`. `defaults`, `theme` and `icons` options (R05, R06, R15) are not implemented. Unknown options fail rather than being silently ignored.
3. **Context enforcement.** Only the migrated components (WButton, WDropdown, WModal) require the Wakeb context. The other Vuetify renderers still work without it until M3.
4. **Coverage.** The PrimeVue adapter covers WButton, WDropdown, WModal and WLoading. WDrawer needs the R19 layout host (M4) and is type-checked but not rendered in the shared fixture.
5. **CSS.** `style.css` contains every renderer's scoped CSS, including selectors for Vuetify DOM. Provider framework CSS is not cross-included, and the PrimeVue build contains no Vuetify framework styles. Per-provider CSS splitting is open for M2.
6. **Tooltip and visuals.** The PrimeVue WButton tooltip is hover-only. PrimeVue offers focus or hover, not both, and the M4 tooltip primitive must fix this. PrimeVue WButton is rendered `unstyled` with Wakeb token CSS. Menu and Dialog keep PrimeVue styled mode.
7. **Dev server.** Configuration watching and restart on a framework change are implemented. The packaging script proves the build and SSR graphs, and dev-server behavior was checked by hand in a browser.

## Open risks carried forward

- PrimeVue keeps `ThemeService` in module scope. Two PrimeVue apps on one page share theme style elements, and the second install resets watchers. Wakeb contexts remain isolated.
- R23 mapping tables are drafts: WButton types use Wakeb CSS on both providers, and the WDropdown activator is a WButton. Badge and tooltip variants remain in M2.

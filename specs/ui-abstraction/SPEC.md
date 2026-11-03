# Normative specification: Wakeb UI Abstraction Framework

## 1. Purpose, terminology and baseline

Wakeb owns a stable Vue component contract. Providers supply rendering primitives; adapters translate those primitives into Wakeb behavior. A provider is an implementation detail, not a second public component API.

Baseline: repository commit `dcb755154f1fe58a6a3e49dcec1d59bced54b0da`, package 0.7.0. `baseline.json` freezes the current public type declarations, runtime exports and bilingual reference metadata for migration review. Existing tests remain evidence, but known defects are not normative behavior.

Requirements use IDs referenced in ACCEPTANCE.md. New features MUST NOT claim provider parity solely because their TypeScript signatures match.

### 1.1 Motivation and audience

`wakeb-components` is a public Vue component package for Jervis projects and for external Vue teams. Its product promise is that a team can move its Wakeb-based UI layer between Vuetify, PrimeVue and shadcn-vue by changing the framework selection and installed peers, while component imports, props, emits, slots, `v-model` bindings, public types and documented behavior stay the same. Wakeb absorbs the differences between providers.

Provider adapters are therefore the product, not overhead: consumers already run one of these libraries with their own theme and expect Wakeb components to integrate with that installation. A single headless implementation (for example Reka UI with Wakeb CSS only) was considered and rejected as the public model because it would not integrate with the host provider's installation, services and theme. Reka UI remains the expected primitive layer of the shadcn-vue adapter.

The promise applies only to the portable surface defined here; see R25 for what switching does not cover. The first framework release is a breaking change from 0.7 (R20): the API is stable *across providers*, not unchanged *from 0.7*.

## 2. Goals and non-goals

**R01 — Stable usage.** Consumers MUST import public components and public component types from `wakeb-components`. Existing 21 component names MUST remain available. Selecting another supported provider MUST NOT require changing component imports, template prop names, event handlers, slot names/payloads, or model bindings within the portable contract.

**R02 — Simple configuration.** The only public plugin factory is `createWakebComponents`. The required `framework` option accepts exactly `vuetify`, `primevue`, or `shadcn`. Framework selection is per application, immutable after installation, and build-time fixed in the initial Vite integration.

**R03 — Responsibility boundary.** Shared presentation logic belongs in Wakeb: normalization, selection, disclosure state, model/event normalization and composition. API requests, authorization, business validation, stores, route resolution, app i18n instances, application aliases and Aware tokens MUST remain outside Wakeb. Translated strings, data, callbacks and slots may enter through documented contracts.

Non-goals for the first framework release:

- Runtime hot-switching between providers; per-component provider mixing.
- Pixel-identical DOM, animations or native class names across providers.
- Forwarding every native provider feature through the portable API.
- Tables, general forms, WSelect, date inputs or domain components not already exported.
- React shadcn/ui, arbitrary third-party adapters, Nuxt/Webpack/Rollup integrations or plain Node CommonJS support. These need separate specs. A Nuxt module is planned after the first stable release (owner decision, 2026-11-03); nothing in the Vite design may preclude it, for example by depending on Vite-only runtime globals in components.
- Installing dependencies during application startup, package import or plugin installation.

## 3. Consumer API and setup

**R04 — Required consumer flow.** This is the target JavaScript API, not an existing export:

```js
// plugins/wakeb-components.js
import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'vuetify',
  defaults: {
    WButton: { size: 'md' },
  },
})
```

```js
// vite.config.js — one-time integration, no second framework selector
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { wakebComponents } from 'wakeb-components/vite'

export default defineConfig({
  plugins: [vue(), wakebComponents()],
})
```

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import wakeb from './plugins/wakeb-components.js'
import 'wakeb-components/style.css'

createApp(App).use(wakeb).mount('#app')
```

```vue
<script setup>
import { WButton, WModal } from 'wakeb-components'
</script>
```

The selected provider's documented peer dependencies MUST be installed before build. The plugin MUST install Wakeb's internal context and MUST reuse a compatible provider instance already installed by the host application (R24); it installs provider services itself only when none is present. Double registration MUST be detected and documented. Provider CSS MUST be imported through the selected build entry in the browser graph, not manually repeated in every project. SSR CSS handling MUST be bundler-safe.

### 3.1 Configuration schema

**R05 — Types.** Publish framework-neutral root types for:

- `WakebFramework = 'vuetify' | 'primevue' | 'shadcn'`.
- `WakebComponentsOptions`: discriminated union with required framework, typed defaults, locale, direction, theme, icons, and provider-specific optional options.
- `WakebDefaults`: component-keyed `Partial<Props>` map, not `Record<string, any>`.
- `WakebPlugin`: Vue Plugin with read-only `framework` and `capabilities` metadata; installation is synchronous. No hidden promise, asynchronous install, ready race, or rendering before provider initialization.
- `WakebCapabilities`: read-only versioned capability manifest with component support and documented optional features.

The discriminated union MUST reject options for a different provider. Native option types MAY be exposed from provider-specific type-only subpaths, never referenced by portable root declarations. Root options MUST use Wakeb-owned configuration types sufficient for ordinary setup; provider-specific advanced values must remain confined to the matching branch and must not force another provider's types to resolve.

The initial root schema is fixed as follows (all types below are future contract names): `locale: 'en' | 'ar'`, `direction: 'ltr' | 'rtl'`, and `theme: { mode?: 'light' | 'dark'; tokens?: Partial<WakebThemeTokens> }`. `WakebThemeTokens` includes string-valued `primary`, `onPrimary`, `surface`, `onSurface`, `muted`, `border`, `focus`, `radius`, `spacing`, `fontFamily`, and numeric `zIndexOverlay`, mapped to `--wakeb-ui-*` variables with kebab-case field names. Component-specific tokens remain CSS overrides. Invalid token values must fail development validation rather than generate malformed CSS.

`icons` accepts a Wakeb-owned name resolver returning a Vue component or SVG-path representation; it does not accept HTML. `providerOptions`, when present, is `{ kind: <the same framework literal>; mode?: 'auto' | 'reuse' | 'install'; options?: Readonly<Record<string, unknown>> }` (semantics in R24). `options` is valid only when Wakeb installs the provider and MUST fail with WAKEB_CONFIG_INVALID under `mode: 'reuse'`, or under `mode: 'auto'` when a host instance is reused, rather than being silently ignored. The opaque native `options` bag is explicitly nonportable and receives provider-side runtime validation; provider-type subpaths may offer stricter native typing without leaking it into root declarations. Wakeb owns ordinary initialization, so this bag is not required. Unsupported values must not be silently dropped. A reused host instance must be compatible with the selected adapter and its required services; the presence of some Vue plugin alone is not proof of compatibility.

Configuration defaults:

| Option | Default | Semantics |
| --- | --- | --- |
| framework | required | No silent fallback to Vuetify |
| defaults | empty | Component props only; no event listeners, v-model state, slots or item arrays |
| locale | `en` | `en` and `ar` built-in UI strings; no dependency on host i18n |
| direction | `ltr` | Explicit `ltr`/`rtl`, independent of locale |
| theme.mode | `light` | `light`/`dark`; no automatic storage or matchMedia policy |
| theme.tokens | empty | Typed Wakeb semantic-token overrides |
| icons | built-in provider-neutral symbols | No icon-font requirement; optional resolver and component slots |
| providerOptions | absent (`mode: 'auto'`) | Options for the selected provider only; reuse host instance when present |

Locale/direction/theme at installation are not independently reactive global singletons. Theme updates after install are deferred; consumers can override CSS variables using normal CSS. Explicit label props override localized defaults. Each provider MUST implement the same documented locale/direction precedence.

**R06 — Defaults.** Priority: explicitly passed non-undefined component prop > plugin component default > Wakeb component default. Explicit false, zero, empty string and null (where allowed by the prop type) MUST survive. Undefined means absent. Props MUST be resolved before provider defaults can mask them, including Vue Boolean casting; do not rely on `withDefaults` alone to detect explicit input.

Defaults are shallow per component prop; nested objects replace, not deep-merge. Arrays and controlled data/model props (`items`, `nodes`, `tabs`, `steps`, `slides`, `config`, `user`, `modelValue`, `selectedTab`, `expandedKeys`, `activeKey`, `activePath`, `editingNodeId`) MUST be rejected in plugin defaults at type level and with a descriptive runtime configuration error. Callback behavior props such as label formatters remain component-local. Mutable default objects MUST be cloned per instance and not mutate source config.

### 3.2 Registration and errors

Root named imports are the supported component registration path. `app.use(wakeb)` MUST NOT globally register all components or eagerly import every renderer. Automatic global registration is out of scope.

Calling create is side-effect-free with respect to DOM, storage, network and Vue installation. Install provides an application-scoped context and installs the selected provider. Reinstalling the same plugin on the same app is idempotent; conflicting Wakeb configuration on one app MUST fail. Reusing one plugin object on another app MUST create isolated mutable provider state. SSR guidance recommends a fresh plugin per request.

**R07 — Diagnostics.** Errors MUST include a stable code and actionable message:

| Code | Condition | Required action |
| --- | --- | --- |
| WAKEB_CONFIG_INVALID | Missing/unknown framework, malformed defaults or options | Name the invalid field and accepted values |
| WAKEB_BUILD_PLUGIN_MISSING | Public root renderer used without selected build integration | Explain adding wakebComponents() |
| WAKEB_FRAMEWORK_MISMATCH | Runtime plugin selection differs from compiled selection | Explain rebuilding/restarting with matching config |
| WAKEB_PROVIDER_MISSING | Selected peer cannot resolve | Name peer and install command; no network side effects |
| WAKEB_CONTEXT_MISSING | Component rendered without plugin | Explain app.use(createWakebComponents(...)) |
| WAKEB_INSTALL_CONFLICT | Conflicting plugin/provider instance | Explain use of one instance or supported reuse configuration |
| WAKEB_HOST_PROVIDER_MISSING | `mode: 'reuse'` but no compatible host instance is installed | Name the provider and the required install order |
| WAKEB_COMPONENT_UNSUPPORTED | Requested component missing in alpha adapter | Name component, provider and coverage matrix |
| WAKEB_CAPABILITY_UNSUPPORTED | Explicit documented optional feature cannot work | Name capability and alternative |

Invalid configuration and unavailable implementations MUST fail, not render blank content or silently choose another provider. Development-only warnings also carry stable codes; the first is `WAKEB_DEPRECATED_VALUE` for deprecated aliases (R23), emitted once per component/prop/value per app and stripped from production builds. Disabled optional features MUST not emit noisy warnings. Error reporting MUST not expose user data or serialize credentials in configuration.

### 3.3 Host provider instance

**R24 — Reuse before install.** Teams adopting Wakeb usually already install and theme their provider. `providerOptions.mode` controls this:

| Mode | Behavior |
| --- | --- |
| `auto` (default) | Reuse a compatible provider instance already installed on the same app; otherwise install one with Wakeb defaults and optional `options` |
| `reuse` | Require a host instance; fail with WAKEB_HOST_PROVIDER_MISSING if absent |
| `install` | Wakeb installs the provider; fail with WAKEB_INSTALL_CONFLICT if a host instance is already present |

Reusing a host instance MUST NOT change its theme, locale, defaults, icon sets, global components or registered directives; Wakeb applies its own values through Wakeb-scoped context and tokens only (R17). Detection uses the provider's public API or injection contract on the same app, never a module-level singleton, so two apps keep separate results (R19). If a provider can only be detected when it is installed before Wakeb, that install order is a documented requirement with an actionable error, not an undocumented assumption. M1 MUST prove the detection mechanism for Vuetify and PrimeVue; shadcn-vue has no app-level instance, so `auto` installs Wakeb-owned services only.

## 4. Architecture and packaging

### 4.1 Layers

**R08 — Layer boundaries.** Proposed source areas (not existing paths):

```text
src/
  core/          plugin, injection keys, defaults, errors, capabilities
  contracts/     neutral props, emits, slots, models, theme and icon types
  composables/   pure/shared presentation state and behavior
  components/    public typed W* facades and native Wakeb renderers
  adapters/
    vuetify/     provider services, primitive renderers, mappings
    primevue/
    shadcn/
  theme/         neutral tokens and selected-provider bridges
  build/         Vite integration and static config parser
```

Compositions MUST use public/internal neutral Wakeb primitives and share behavior rather than copy whole components per provider. Native SVG/text/layout components MUST NOT acquire provider dependencies just to fit an adapter architecture. Provider-owned focus, menu positioning and transitions belong in the adapter; Wakeb defines their contract and tests it. Avoid two overlapping focus traps or duplicate keyboard handlers.

### 4.2 String selector with a single installed provider

**R09 — Selected build graph.** Optional peerDependencies alone do not guarantee a clean build. Vite integration MUST statically select one provider before module resolution; a root registry that imports or literal-dynamically-imports all optional provider packages is forbidden.

- Selection lives in the consumer plugin file, not in vite.config (owner decision, 2026-11-03; a vite.config-only selector was considered and rejected to keep one user-facing configuration file). Because this design depends on static parsing, its supported syntax and failure messages are part of the public contract and MUST be documented with copyable valid and invalid examples.
- `wakebComponents()` reads `plugins/wakeb-components.js` relative to Vite root. An explicit `configFile` path supports alternate locations, monorepo packages and TypeScript. When neither the default file nor `configFile` exists, fail with WAKEB_CONFIG_INVALID naming every searched path.
- Parse syntax using an AST; never execute the app plugin from vite.config.
- Initially accept a default-exported call to `createWakebComponents` imported from `wakeb-components`, with a direct object argument and direct string literal `framework`. Other option values may be arbitrary expressions because only framework selection is extracted. Duplicate/spread/computed framework declarations MUST fail with an actionable static-config error.
- Environment expressions, re-exports from another module and imported constants for framework are not supported initially. Do not guess their values or require a duplicate selector in Vite config; fail with a static-config error that points to the supported pattern.
- Alias a reserved internal provider entry to exactly the selected provider's service factory, style entry and per-component renderer modules. The internal specifier is not a public consumer import. Published module paths, exports and error stubs MUST be proven inside the packed package, not just repository aliases.
- Each public facade statically imports only its own selected renderer, and uses injection for app configuration/provider state. The service factory must not import a full renderer registry. This keeps unused components tree-shakeable.
- An unconfigured published resolver MUST fail with WAKEB_BUILD_PLUGIN_MISSING without resolving absent providers.
- Watch config changes and require/full-restart the dev graph when framework changes; do not apply a live provider swap.
- Resolve selected peers with the consumer's module graph. Error before rendering if absent; missing unused peers MUST not fail installation, TypeScript, dev, build or SSR.
- All server/client/test build graphs MUST use the same selector. Runtime framework must match a compile-time provider marker.

**R10 — Export/dependency contract.** Required exports: root named components/types/createWakebComponents; `wakeb-components/style.css`; `wakeb-components/vite`; `wakeb-components/package.json`. Any provider-type subpath must be documented and have no runtime requirements when unused. Public runtime adapter imports are not required of consumers.

Vue stays a mandatory peer and is never bundled. Provider packages stay optional peers and are not bundled as second runtime copies. Only selected peers are required for a consumer. Exact supported version ranges MUST be determined by locked, tested consumer fixtures before implementation release; do not copy guessed PrimeVue/Reka/Tailwind versions into the manifest. Existing Vue 3.5/Node 22.14 baseline applies until tested otherwise. Root named imports from wakeb-utils remain required when reused.

Core modules and root portable declarations MUST NOT import provider implementations/types. Provider-specific native types may not leak through SharedIcon, slots or emitted payloads. Internal code may use native types in its adapter. Only required CSS side effects are marked sideEffects; never disable tree shaking broadly to mask missing initialization.

### 4.3 shadcn provider

**R11 — Packaged implementation.** `shadcn` means shadcn-vue, not React shadcn/ui. Wakeb owns the copied/generated component implementations inside its adapter and retains upstream license notices. Consumer apps MUST NOT copy, customize or maintain these source files to use Wakeb. Adapter primitive dependencies become selected optional peers or explicitly justified bundled implementation dependencies, with license and duplication checks.

Ship precompiled/scoped adapter CSS. Consumers MUST NOT configure Tailwind content scanning against node_modules or install a source generator just to render Wakeb. No application-wide reset/Preflight may be injected accidentally. All generated class names used at runtime MUST survive the adapter build. If Tailwind is used internally, it is a build concern; consumer runtime CSS setup stays the same.

## 5. Portable component contracts

**R12 — Baseline and compatibility.** Preserve existing prop names, defaults, events, payloads, event order, slots and model names unless an explicitly documented migration exception below applies. The baseline is exhaustive for current prop rows/type definitions and reference descriptions. Each implementation work item MUST turn those declarations into cross-provider contract cases, including custom slots. Unknown behavior is resolved through a written contract test before implementing divergent adapters.

Portable behavior excludes implicit native provider props/events/classes. Legacy attrs such as Vuetify `loading`, `max-width` and chipAttrs remain a Vuetify compatibility surface, not universal parity. Introduce a clearly separated `providerProps` escape hatch on adapter-backed components with selected-provider validation, no effect on portable semantics, and matching native documentation. Portable class/style/id/data-*/aria-* and DOM listeners remain portable. Provider escape-hatch usage must be flagged in migration guides as intentionally nonportable.

`providerProps` MUST NOT override Wakeb-owned model handlers, refs, item keys, loading/disabled safety, roles or required accessibility bindings. Unsupported keys receive development diagnostics. Native callback pass-through MUST not cause the portable event to emit twice.

### 5.1 Component map

The classification specifies ownership, not a promise to wrap a namesake component in each library. Adapters may use an equivalent primitive plus shared Wakeb behavior. All rows are required on each provider for a stable framework release.

| Component | Ownership | Models / special contract |
| --- | --- | --- |
| WTruncatedText | Native text + adapter tooltip | Existing UTF-16 truncation behavior; full accessible label; `{ text, label, truncated }` default slot |
| WSegmentedProgress | Native | Clamp 0–100; truthful geometric ratio independent of slot width; progressbar semantics |
| WSemiCircleGauge | Native SVG | Finite geometry; SSR-stable unique IDs; same slot and normalized value |
| WAvatarStack | Shared composition + avatar/menu/tooltip primitives | Own-property paths, max normalization, Unicode initials, avatar/overflow slots |
| WLoading | Native/shared indicator | Named status; decorative indicator; default replacement slot |
| WPageSkeleton | Shared layout + skeleton primitive/native bones | Existing SkeletonRow fields; normalize repeat; Wakeb-owned responsive grid |
| WVerticalSteps | Native | Existing data and indicator/icon/title/timeIcon/dateIcon slots |
| WButton | Adapter primitive + shared behavior | MouseEvent click exactly once; action button/submit/reset; same loading/disabled rules |
| WBadge | Adapter primitive | Existing labels, dot, icon ordering, variants and appearance customization |
| WAccordion | Shared disclosure + neutral/native control | `modelValue` / `update:modelValue` boolean; existing header/actions/default/toggleIcon slots |
| WBadgeStack | Shared WBadge/menu composition | Consistent visible/overflow icon payloads; circles survive Teleport |
| WUserBadge | Shared avatar/badge composition | Same user fallback, icon order and slots; no domain user/store coupling |
| WTooltipBtn | Shared button/tooltip composition | Accessible name; same icon/default slots and one forwarded click |
| WTabs | Shared selection + adapter tab primitives | Preserve selectedTab/updateTab API; dynamic panel slots; correct tab-panel linkage |
| WTree | Shared tree behavior + native/adapter primitives | Controlled expansion/active inputs; identical node/toggle/action events and slot payloads |
| WDropdown | Shared selection + menu primitives | `modelValue` / `update:modelValue`; selectedItem payload and order preserved |
| WCarousel | Shared index/timer + adapter/native viewport | Numeric model; stable slide and indicator payloads; timer cleanup and pause policy |
| WExportDropdown | Shared WDropdown composition | Existing select format string; UI selection only, no file generation or permissions |
| WBaseSidebar | Shared layout/composition | Existing item/search/header/content/filter slots and filter event contract |
| WModal | Shared disclosure + dialog primitive | Boolean model; afterLeave; same activator/header/content/actions/loading slots |
| WDrawer | Shared disclosure + drawer/dialog primitive | Boolean model; logical start/end; same close/loading/content slots |

For slot/event details beyond this summary, baseline component metadata and source declarations at the frozen commit are normative inputs. Before migration begins, snapshot source `defineEmits`/`defineSlots` signatures into contract tests; undocumented native fallthrough MUST not be mistaken for a declared event.

### 5.2 Common semantics

**R13 — Models/events.** Controlled parent updates MUST not emit synthetic user-change events. Emit once per effective user change. Same-value updates are suppressed where the existing contract suppresses them. Preserve false/0/empty keys. No object mutation of readonly input records. Native event payloads become documented Vue/DOM/Wakeb values, never native provider event objects. Dropdown matching MUST prefer exact value over label fallback; changes to item records must refresh selected presentation; null clearing follows an explicit tested clear state, not a stale cached item.

Global defaults cannot own models. Instance-local state is isolated. Existing locally mirrored disclosure models remain synchronized with parent changes. Form submission and resets use native HTML behavior; WButton defaults to `action='button'`. Disabled/loading controls suppress user activation, portable emitted actions and native link navigation. Programmatic parent state changes still apply.

**R14 — Slots/attrs.** Typed public facades MUST preserve consumer `$props`, emitted handler types and slot inference; a generic untyped dynamic component is not acceptable. Slot callbacks/payloads are provider neutral and reactive. Call each slot in render context; no cached VNodes across instances. Define attribute targets for every facade and document them in both languages. Merge class/style and consumer handlers; do not bind listeners to wrapper and button simultaneously. Explicit Wakeb-owned safety/ARIA behavior cannot be disabled by a generic spread. Custom interactive slots must receive the needed trigger props and remain the caller's responsibility where documented.

**R15 — Icons.** Replace the Vuetify-dependent SharedIcon with a Wakeb-owned representation supporting an icon name resolved by the configured resolver, a Vue component, and existing SVG path inputs through a compatibility mapping. Provide simple built-in SVGs for default chevrons, close, loading and toggles. Arbitrary MDI/Vuetify alias names are supported only by the matching resolver, not magically portable. Missing icon resolution must have a deterministic fallback and development diagnostic, not a broken silent control. Do not use raw HTML strings for icon rendering.

**R16 — Provider-specific baseline leakage.** WPageSkeleton's current Vuetify `type` syntax and grid fields require an explicit Wakeb grammar. Portable supported skeleton names are `text`, `paragraph`, `heading`, `avatar`, `image`, `button`, `chip`, `list-item`, `list-item-avatar`, `list-item-two-line`, `list-item-three-line`, `list-item-avatar-two-line`, `list-item-avatar-three-line`, `table`, `table-row`, and `card`; comma-separated sequences and positive integer `@N` repetitions are supported. Width/height/class, header/items and all existing row variants stay supported. Default type is `text`; cap parsed repetitions at 100 per item to prevent accidental render explosions; reject unknown types rather than passing incompatible strings to another provider. Snapshot current real application descriptors before finalizing migrations; extra Vuetify-only names require a compatibility warning/escape hatch, not an undocumented approximation. Grid breakpoints MUST be Wakeb-owned, fixed and documented (sm 600px, md 960px, lg 1280px for the first contract), with cols 1–12, auto and boolean behavior mapped explicitly in tests. Native provider breakpoint differences must not change this grid.

WTabs customHTML remains trusted-only legacy input: never interpolate user data or advertise sanitization. Prefer text/slots. No new unsafe HTML surfaces may be introduced. In the framework release customHTML is deprecated: it keeps working on every provider, emits `WAKEB_DEPRECATED_VALUE` in development, and is removed in the following major release; the migration guide shows the slot replacement.

### 5.3 Portable design vocabulary

**R23 — Wakeb owns every style value.** Any prop whose value selects a visual style, intent, size or position MUST accept only Wakeb-defined values. Adapters translate those values; consumers never pass a provider's own variant, color or size names through portable props.

Source inventory at the baseline commit shows two groups:

| Group | Props (baseline) | Status |
| --- | --- | --- |
| Already Wakeb-owned | WButton `type` (`primary`, `secondary`, `tertiary`, `outline`, `danger`, `link`, `text`, `icon`, `table-icon`) and `size` (`xl`, `lg`, `md`, `sm`), rendered by Wakeb CSS classes; WTabs `styleType`; `location`/`position` with logical `start`/`end`; WBadge `type` style keys rendered by Wakeb CSS | Canonical as-is; the exact accepted list is frozen from source in M0 |
| Provider-shaped | WBadge `variant`, WTooltipBtn `variant`, BadgeStack `badgeVariant` and item `variant` (Vuetify chip/button variants); WBadge `type` also forwarded as a Vuetify `color`; WBaseSidebar `skeletonType` (Vuetify skeleton grammar); free-form `color`/`avatarColor`/`iconColor` that today may be Vuetify theme or palette names | Replaced by the vocabulary below |

Portable values:

- **`variant`** (Badge, BadgeStack, TooltipBtn): `soft | solid | outline | ghost`. Badge default `soft`; TooltipBtn default `ghost`.
- **Intent** (where a component exposes one): `primary | secondary | success | warning | danger | info | neutral`, mapped to Wakeb tokens.
- **Color props**: a Wakeb intent name or a CSS color value (`#hex`, `rgb()`, `hsl()`, `var(--…)`). Provider theme or palette names are not portable.
- **Skeleton names**: the grammar in R16, used by both WPageSkeleton and WBaseSidebar `skeletonType`.

Deprecated aliases (owner decision, 2026-11-03): baseline values keep working on **every** provider for one major release, map to the portable value, and emit `WAKEB_DEPRECATED_VALUE` in development. Removal happens in the next major release with migration-guide entries.

| Baseline value | Portable value | Note |
| --- | --- | --- |
| `default`, `tonal` | `soft` | `default` was rendered as Vuetify `tonal` |
| `flat` | `solid` | |
| `elevated` | `solid` | Elevation is not portable; use a CSS shadow override |
| `outlined` | `outline` | |
| `text`, `plain` | `ghost` | `plain`'s reduced-opacity look is not preserved |
| Vuetify theme/palette color names | none | Accepted only under the Vuetify provider during the deprecation window, with a warning; other providers fail development validation with the replacement intent or CSS value |

Visual policy: Wakeb-owned style values are rendered with Wakeb token CSS on top of the provider primitive, so the Wakeb look and every style value exist on every provider, matching how WButton works at the baseline. An adapter MAY map a value to the nearest native provider variant only when the token and computed-style contract tests still pass. When a provider lacks a style (for example a tonal/soft look) or combines two axes in one prop (for example shadcn-vue's `destructive` button variant mixes intent and style), the adapter composes the result from the primitive plus Wakeb CSS; the portable prop never inherits that limitation. Each adapter MUST publish a per-component mapping table, Wakeb value → native props/classes, verified against the tested provider versions; mapping tables written before those versions are locked are drafts only.

## 6. Theme, style, accessibility and lifecycle

**R17 — Tokens.** Ship semantic namespaced variables for color, surface, on-surface, muted text, border, focus ring, radius, spacing, typography and overlay z-index. Existing component-specific --wakeb-* variables remain usable unless individually deprecated with replacement names. Tokens are the stable customization API; `.v-*`, `.p-*`, Tailwind utility classes and provider DOM structure are not.

Each variable in docs MUST be actually consumed, including state tokens. Selected adapters may bridge Wakeb tokens to provider tokens but cannot redefine global app themes as a side effect. Dark/light and RTL/LTR behavior require a provider/component matrix. Scope tokens/provider selectors to Wakeb roots and overlay content; Teleport does not inherit the original ancestor, so copy required theme/direction context or attach matching overlay scope attributes. Multiple apps/themes cannot overwrite each other's overlay tokens. style.css is imported once; selected-provider CSS must not pull unselected implementations or global resets.

**R18 — Accessibility.** Portable behavior MUST meet relevant WCAG 2.2 AA requirements and applicable ARIA patterns, not just identical markup:

- Named buttons, status/progress elements and dialogs; text contrast and visible focus.
- Tabs: stable unique IDs, aria-controls/labelledby and tabpanel semantics; roving keyboard behavior and orientation.
- Action dropdowns: coherent menu/menuitem roles, disabled behavior, arrow/Escape keys and focus return. Link menus require real link semantics with disabled navigation suppressed.
- Trees: one roving stop when enabled, expansion semantics and keyboard navigation; preserve actual focus when the focused descendant disappears without stealing focus from outside the tree.
- Tooltip content opens on keyboard focus and hover; no hover-only essential information.
- Modal and temporary drawer: focus containment, accessible name, Escape behavior controlled by persistent, background inertness, body-scroll policy and focus return. Closed content must not remain operable. Resolve the current drawer's documented weaker behavior as a deliberate migration change.
- Carousel: named controls, native non-submit indicator buttons; cycling pauses on hover/focus and when document is hidden; reduced-motion disables automatic cycling by default. Cleanup observers/listeners/timers on unmount.
- Reduced-motion disables nonessential animation; RTL flips geometry/direction without reversing text.

Custom slots may transfer limited responsibility to the caller only if required bindings and examples are supplied. Browser automation MUST verify keyboard focus; jsdom ARIA attribute checks alone are insufficient.

**R19 — SSR and isolation.** No browser globals during import/setup/server render. Use Vue useId or equivalent deterministic IDs; no random/time/counter-based IDs shared across requests. Server and client use identical provider, options and initial state. Selected provider SSR configuration is applied by Wakeb. Closed overlays render/hydrate without mismatch. Open-overlay hydration is separately exercised. Create isolated contexts for concurrent apps and SSR requests, including defaults, locale, theme and provider instances. Provider plugins requiring a layout context must be encapsulated without silently wrapping arbitrary app roots or changing application layout; a minimal internal overlay host is preferred and must be proven for WDrawer. If explicit host markup is unavoidable, it is a product exception requiring spec amendment and a documented setup component, not an unmentioned requirement.

## 7. Compatibility, capabilities and release policy

**R20 — Migration.** Require plugin + build integration for the new abstraction release; existing 0.7 imports alone are not enough. Keep 0.7 Vuetify usage documented until migration. Do not silently change the existing package default when landing an alpha. Implement on a separately versioned prerelease; stable release version is decided before publication, with the breaking migration clearly stated (do not label it a backwards-compatible patch).

Compatibility checklist must cover every baseline type, prop default, slot signature, event name/order and attribute target. Intentional breaks include required plugin/build setup, provider-neutral icon types, portable/native attribute separation, skeleton grammar restrictions, the portable style vocabulary (R23), improved drawer focus behavior and carousel pause policy. Baseline style values remain accepted as deprecated aliases for one major release (R23); everything else listed here breaks immediately. Publish a precise replacement guide.

Bug fixes to 0.7 behavior that do not depend on the abstraction (M0) ship first as 0.7.x patch releases so existing Vuetify consumers benefit even if the framework release is delayed. Existing Aware adapters remain in Aware and must be tested there; this repository cannot claim those tests passed without access/evidence.

**R21 — Capability policy.** All portable baseline component behaviors are mandatory for stable adapters. A missing mandatory capability blocks stable provider support; it is not hidden behind a warning or fallback to Vuetify. Alpha capability manifests report implemented/unsupported components. Optional advanced features have explicit typed names and support entries, but may not be used to excuse missing core props/slots/models. Native fallback implementations are allowed if they meet the same contract and are declared as such. Provider visual resemblance is allowed to differ; portable behavior must not.

**R25 — Switching scope disclosure.** Switching providers changes how Wakeb components render; it does not migrate the rest of an application. The installation page, the switching guide and the migration guide in both languages MUST state that switching does not cover:

- Direct use of provider components in the host app (for example `v-data-table`, PrimeVue `DataTable`, shadcn-vue source copied into the app).
- `providerProps` values and any other documented nonportable escape hatch.
- CSS targeting provider classes or DOM (`.v-*`, `.p-*`, Tailwind utilities inside Wakeb output).
- The host's own provider theme, plugin options, icon sets and global defaults.
- Deprecated aliases that are accepted only under one provider (R23).

The switching guide MUST give a checklist that finds these usages and reports them, for example search patterns, and SHOULD offer a development-mode report of nonportable values that were actually used. The docs MUST NOT describe switching as "zero changes" without these qualifications.

**R22 — Documentation and operations.** English and Arabic VitePress docs MUST cover installation per provider, single plugin selection, one-time Vite integration, SSR, optional peers, styles, supported versions, capability matrix, all props/emits/slots/models/types/attribute targets/tokens and limits. Include the same interactive usage page compiled separately for each provider, the R23 vocabulary with per-provider mapping tables and deprecated aliases, the R24 host-instance modes, the supported static selector syntax (R09), and the R25 switching guide. Mark providerProps examples as nonportable. Do not claim visual or behavioral parity without matrix results.

Use Jervis DevOps for builds/publication at wakeb-components.surge.sh. No GitHub Actions. npm publication requires explicit authorization independent of documentation publication. Library build and archive integrity checks must precede docs download packaging. Deployment verification compares the deployed receipt/assets against an independently expected local build manifest and source commit, not remote self-consistency alone.

## 8. Definition of done

The framework release is complete only when every row in ACCEPTANCE.md is verified, all 21 public components have all three provider contract results, root declarations resolve with only the chosen provider installed, real-browser accessibility/layout and SSR hydration suites pass, and bilingual migration/docs are built from the tested packed artifacts. No blanket 'done' claim based solely on the existing 0.7 unit test suite.

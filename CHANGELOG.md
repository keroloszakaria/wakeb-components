# Changelog

## Unreleased (framework alpha)

- Breaking: root imports need a plugin file and `wakebComponents()` from `wakeb-components/vite`.
- Add `createWakebComponents`, static provider selection, host provider reuse modes, `WakebError` codes and a PrimeVue 4 alpha adapter for WButton, WDropdown, WModal and WLoading.
- Add plugin `defaults`, Arabic built-in labels, `direction`, and `theme` mode and `--wakeb-ui-*` tokens scoped per app and overlay.
- Breaking: portable WBadge, WTooltipBtn and WBadgeStack variants (`soft`, `solid`, `outline`, `ghost`); baseline names map to them with a `WAKEB_DEPRECATED_VALUE` development warning stripped from production builds.
- Breaking: color props take a Wakeb intent (`primary`, `secondary`, `success`, `warning`, `danger`, `info`, `neutral`) or a CSS color (`WakebColor`); intents resolve through `--wakeb-ui-*` tokens, then the provider theme. Vuetify color names still render under Vuetify with `WAKEB_DEPRECATED_VALUE`.
- Breaking: WBadge `type` is no longer forwarded to Vuetify as a chip color; Wakeb CSS paints it, and `solid` fills with the type color. Add intent theme tokens and `--wakeb-avatar-text`, `--wakeb-badge-solid-bg` and `--wakeb-badge-solid-text`.
- Breaking: WBaseSidebar `skeletonType` and WPageSkeleton types use the Wakeb skeleton grammar with `@N` repetitions capped at 100; unknown names are skipped with `WAKEB_UNKNOWN_VALUE`.

## Unreleased (0.7.x)

- Fix progress geometry, dropdown value precedence, null clearing and item refresh, disabled link navigation, menu roles, tab-panel ARIA, tree focus recovery, button loading activation, teleported circle badge styles, secondary button tokens and modal description/width handling.
- The docs build packs a fresh library and checks documented CSS variables; deployment verification compares against the trusted local receipt.
- Update Vite to 6.4.5.

## 0.7.0

- Add WModal and WDrawer with typed models, header/content/action/loading slots and namespaced CSS variables.
- Retain native Vuetify overlay behavior and explicit Aware compatibility adapters; AddEditModal, forms and permissions remain in the application.
- Add standalone and host integration checks and bilingual interactive documentation.

## 0.6.0

- Add typed WCarousel, WExportDropdown and WBaseSidebar with playback/indicator controls, configurable export records and form-independent sidebar slots.
- Keep Aware permissions, GenericForm schemas, translations, SvgIcon names, gradient tokens and inverted carousel indicator semantics in adapters.
- Verify actual Vuetify cycling/menu/skeleton behavior, compatibility adapters and bilingual interactive documentation.

## 0.5.0

- Add typed WTabs, WTree and WDropdown with named panels, recursive slots and host-owned translation/router integration.
- Preserve Aware selection synchronization, tree connector/edit state, SvgIcon rendering and dropdown event ordering through compatibility adapters.
- Add controlled-tree keyboard navigation, Vuetify interaction tests, packed SSR/browser consumers and bilingual live examples.

## 0.4.0

- Add typed WBadgeStack, WUserBadge and WTooltipBtn with image/avatar/icon slots and explicit host translation.
- Preserve Aware badge item overrides, overflow styling, themed detection icons, user initials/actions and legacy tooltip attrs through adapters.
- Add real Vuetify overflow, tooltip, avatar and compatibility checks plus bilingual interactive reference pages.

## 0.3.0

- Extract WButton, WBadge and WAccordion with typed props, events and icon slots.
- Preserve Aware layout, icon rendering, loading attributes, click propagation and persistent form content through adapters.
- Add standalone semantic styles, accessible default title triggers and bilingual interactive documentation.

## 0.2.0

- Add typed avatar stacks, loading indicators, responsive page skeletons and vertical steps.
- Keep app colors and icons in compatibility adapters; add keyboard overflow controls and translated status labels.
- Publish npm installation docs, data models and live examples in English and Arabic.

## v0.1.1 - 2026-10-28

- fix: enable Vuetify SSR hydration in documentation and consumer
- feat: extract typed display components with bilingual VitePress docs
- Initial commit


## 0.1.0

- First extraction: text truncation, segmented progress and semicircle gauge.
- Typed Vue APIs, Vuetify tooltip integration, RTL and namespaced style customization.

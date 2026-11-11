# Introduction

Wakeb Components provides **39 typed Vue 3 components** with one API across **Vuetify 3, PrimeVue 4 and shadcn-vue**: display and identity, forms, navigation, layout, loading states, overlays and a server-driven data table. Select one provider at build time and keep the same public component imports.

This site describes the **unreleased 0.8.0-alpha.0 candidate**. The public 0.7 release is Vuetify-only. Follow [installation](installation.md) for the local archive and [provider setup](providers.md) for the Vite and runtime plugins. Vue and Vite are peers; install only the selected provider's peers. Import components by name from `wakeb-components` and CSS once from `wakeb-components/style.css`.

Every component page contains an interactive preview, two complete typed Vue examples, props/defaults, event and slot signatures, CSS variables, attribute routing, accessibility and provider limits. [Compatibility and coverage](verification.md) explains the tests and their limits. The website previews use Vuetify; independent tests cover all three providers.

Your application owns stores, routing, i18n instances, permissions, fetching, form submission and file generation. `WDataTable` shows supplied rows and emits options; the app sorts and pages the dataset. Customize through typed props, slots, attributes and namespaced variables. The [skill and MCP](agents.md) give coding agents the same contracts in English and Arabic before they write code.

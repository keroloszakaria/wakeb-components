# Wakeb Components

- Vue 3.5 and Vuetify 3 are peers; do not bundle another copy.
- Public runtime exports are WTruncatedText, WSegmentedProgress and WSemiCircleGauge.
- Keep business data, stores, routing, i18n instances, app aliases and Aware tokens out of the package.
- Public customization uses typed props, slots, attributes and namespaced CSS variables.
- Keep Aware compatibility adapters in Aware; test their default contracts.
- Use root named imports from wakeb-utils.
- Run npm run check; verify the packed package in an isolated Vite consumer.
- Document every prop, slot, CSS variable, accessibility behavior and limit in English and Arabic VitePress pages.
- Use Jervis DevOps for builds and documentation publication at wakeb-components.surge.sh. Do not add GitHub Actions.
- Do not publish to npm implicitly. A documentation release is not npm publication authorization.

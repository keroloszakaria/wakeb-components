# Wakeb Components

- Vue 3.5 and Vuetify 3 are peers; do not bundle another copy.
- Public runtime exports are WTruncatedText, WSegmentedProgress, WSemiCircleGauge, WAvatarStack, WLoading, WPageSkeleton, WVerticalSteps, WButton, WBadge, WAccordion, WBadgeStack, WUserBadge, WTooltipBtn, WTabs, WTree, WDropdown, WCarousel, WExportDropdown WBaseSidebar, WModal, WDrawer, WTextField, WPopover, WSwitch, WCheckbox, WSkeleton, WRow, WCol, WProgressLinear, WTextarea, WButtonToggle, WCard, WDivider, WList, WIcon, WImage, WAvatar, WCountBadge and WDataTable.
- Keep business data, stores, routing, i18n instances, app aliases and Aware tokens out of the package.
- Public customization uses typed props, slots, attributes and namespaced CSS variables.
- Keep Aware compatibility adapters in Aware; test their default contracts.
- Use root named imports from wakeb-utils.
- Run npm run check; verify the packed package in an isolated Vite consumer.
- Document every prop, slot, CSS variable, accessibility behavior and limit in English and Arabic VitePress pages.
- Use Jervis DevOps for builds and documentation publication at wakeb-components.surge.sh. Do not add GitHub Actions.
- Do not publish to npm implicitly. A documentation release is not npm publication authorization.

## Coding-agent contracts

- For Wakeb UI implementation, read `.agents/skills/wakeb-components/SKILL.md` and the relevant component references, or use the read-only MCP in `packages/mcp` (`list_components`, `get_component`, `get_guide`). Match the catalog version to the installed package.
- `docs/reference-data.mjs`, `docs/recipes.mjs` and `src/contracts.ts` feed both the bilingual pages and agent references. Run `npm run agents:build` after changing these contracts; do not hand-edit generated references or `packages/mcp/catalog.json`.
- `npm run test:agents` verifies source and packed MCP servers over stdio. `npm run test:docs` verifies representative bilingual pages after `npm run docs:build`. Setup and scope are documented in `docs/guide/agents.md` and `docs/guide/verification.md` (Arabic counterparts under `docs/ar`).

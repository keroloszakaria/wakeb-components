# Compatibility and verification

The 0.8.0-alpha.0 candidate exposes **39 components** with one public Vue contract
across Vuetify 3, PrimeVue 4 and shadcn-vue over Reka UI. This is a compatibility
target with explicit provider differences, not a claim that the providers render
identical HTML or supply every feature of their native libraries.

## What is checked

| Layer | Command | Evidence |
| --- | --- | --- |
| Public declarations and renderer conformance | `npm run typecheck` | Typed props, event payloads and scoped slots; no provider types in public facades. |
| Behavior contracts | `npm test` | The shared display, navigation, forms, selection, layout, elements and table suites run on all three providers; SSR, cleanup and app scope have focused checks. |
| Installed package | `npm run check:package` | A real tarball installed into three isolated Vite consumers outside the repository; strict root declarations, complete documentation SFCs, browser/SSR builds, tree shaking and absent unselected peers. |
| Browser interaction | `npm run test:browser` | Chromium, three providers × light/dark × LTR/RTL × 390px/1280px; hydration identity, console warnings, focus, keyboard controls, form input and overlays. All 39 components are present in the fixture. |
| Peer versions | `npm run check:peers` | Six locked minimum/current peer fixtures. [Supported versions](installation.md#supported-versions) shows the exact recorded versions, not an unbounded support promise. |
| Agent integration | `npm run test:agents` | Official MCP client over stdio; discovery, contracts, locales, resources, prompt and error paths. |
| Site and artifacts | `npm run docs:build` | Prop coverage against TypeScript, matching English/Arabic pages, internal links, library/skill/MCP archives and the deployment asset inventory. |

Run `npm run check` for the required combined gate. It includes the typecheck,
build, contract tests, packed consumers, browser checks, agent checks and site build.
The peer matrix is an additional explicit check because it installs six locked environments.

Run `npm run test:docs` after a site build for the English/Arabic accordion,
data-table and agent guides in light/dark mode at desktop and phone widths.
Run `npm run check:agents:package` to install the MCP tarball outside the checkout
and repeat discovery and contract calls against the installed server.

## Coverage by component

<!-- component-coverage -->

| Component | Vuetify | PrimeVue | shadcn-vue | SFC examples |
| --- | --- | --- | --- | --- |
| [WTruncatedText](truncated-text.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WSegmentedProgress](segmented-progress.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WSemiCircleGauge](semi-circle-gauge.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WAvatarStack](avatar-stack.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WLoading](loading.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WPageSkeleton](page-skeleton.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WVerticalSteps](vertical-steps.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WButton](button.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WBadge](badge.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WAccordion](accordion.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WBadgeStack](badge-stack.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WUserBadge](user-badge.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WTooltipBtn](tooltip-btn.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WTabs](tabs.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WTree](tree.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WDropdown](dropdown.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WCarousel](carousel.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WExportDropdown](export-dropdown.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WBaseSidebar](base-sidebar.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WModal](modal.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WDrawer](drawer.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WTextField](text-field.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WPopover](popover.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WSwitch](switch.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WCheckbox](checkbox.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WSkeleton](skeleton.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WRow](row.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WCol](col.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WProgressLinear](progress-linear.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WTextarea](textarea.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WButtonToggle](button-toggle.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WCard](card.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WDivider](divider.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WList](list.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WIcon](icon.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WImage](image.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WAvatar](avatar.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WCountBadge](count-badge.md) | Contract + browser | Contract + browser | Contract + browser | 2 |
| [WDataTable](data-table.md) | Contract + browser | Contract + browser | Contract + browser | 2 |

<!-- /component-coverage -->

## Reading the evidence

Browser results and screenshots are written to `.audit/browser/`; the JSON report
records each project and test outcome. The packed-consumer check prints its temporary
consumer path and provider module counts. The peer matrix records outcomes in
`tests/fixtures/peers/results.json`. A successful local build is not a production
deployment or an npm release. Documentation publication uses Jervis DevOps.

The website's live playgrounds use **Vuetify**. Copyable examples keep the same
Wakeb API on all providers, and the isolated consumers and browser matrix validate
those providers independently. Each component page documents its renderer differences.

## Limits

The browser matrix uses Chromium; Firefox, WebKit and physical touch devices are
not part of the recorded gate. Automated roles, ARIA, keyboard and focus checks
do not replace an assistive-technology audit with screen readers. The tests cover
the supported API and documented states, not every combination of application CSS,
native provider overrides or third-party plugins. Check your application on the
chosen provider when upgrading its peers.

## Documentation method

The page structure follows the useful patterns in
[shadcn-vue Accordion](https://www.shadcn-vue.com/docs/components/accordion)
(preview, installation and copyable usage) and
[PrimeVue AutoComplete](https://primevue.dev/autocomplete/)
(task examples, states, templates and keyboard accessibility). All examples and
descriptions here describe Wakeb's own API; native provider examples are not
interchangeable with Wakeb contracts. [Agent tools](agents.md) expose those same contracts.

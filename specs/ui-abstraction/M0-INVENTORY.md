# M0 inventory: style values, compatibility exceptions and advisories

Source: `fix/m0-contract-defects`, based on `540d7ba` (package 0.7.0). This file records the frozen inputs required by IMPLEMENTATION.md M0 items 3–5. It does not add framework APIs.

## 1. Style-value inventory (R23)

### Wakeb-owned values (canonical)

| Component | Prop | Accepted values | Rendered by |
| --- | --- | --- | --- |
| WButton | `type` | `primary`, `secondary`, `tertiary`, `outline`, `danger`, `link`, `text`, `icon`, `table-icon` | `btn--<type>` classes. `table-icon` row actions use the extra classes `edit`, `view`, `delete`, `restore`, `unlock`, and `outline` has an `outline--danger` modifier, both through `classList` |
| WButton | `size` | `xl`, `lg`, `md`, `sm` | `btn--<size>` classes |
| WButton | `iconColorType` | `danger`, `primary`, `success`, `warning`, `currentColor` | Wakeb CSS variables |
| WButton, WTabs, WBadge, WBadgeStack | `iconSize` | `xs`, `sm`, `md`, `lg`, `xl`, or a number. WButton also accepts `free` | Fixed pixel map (16/20/24/32/40) |
| WBadge | `type` | `success`, `success-transparent`, `primary`, `primarybtn`, `danger`, `danger-transparent`, `warning`, `info`, `transparent`, `dark`, `tertiary`, `outline`, `outline-secondary`, `check`, `uncheck` | Wakeb CSS classes. **Also forwarded as Vuetify `color`**, so the provider-shaped part has to be removed in M2 |
| WBadge | `borderRadius` | `sm`, `md`, … | `border-radius-<value>` classes |
| WTabs | `styleType` | `outlined`, `filled`, `none`, `minimal` | Wakeb CSS classes |
| Several | `location` / `tooltipLocation` | `top`, `bottom`, `start`, `end` | Logical sides |
| WDrawer | `position` | `start`, `end` | Logical sides |
| WBadge, WBadgeStack, WUserBadge | `iconPosition` | `before`, `after` | Wakeb ordering |
| WDropdown | item `color` / `iconColor` | `success`, `danger`, `warning`, `primary`, `info`, `colorMap` keys, or CSS colors | Wakeb CSS variables |

### Provider-shaped values to replace in M2

| Component | Prop | Baseline values | Portable value |
| --- | --- | --- | --- |
| WBadge, WBadgeStack (`badgeVariant`, item `variant`) | `variant` | `default`, `flat`, `text`, `elevated`, `tonal`, `outlined`, `plain` | `soft`, `solid`, `outline`, `ghost` (aliases in SPEC R23) |
| WTooltipBtn | `variant` | `text`, `flat`, `elevated`, `tonal`, `outlined`, `plain` | Same as above, default `ghost` |
| WLoading | `color` | Default `"primary"` (Vuetify theme name) | Wakeb intent or CSS color |
| WAvatarStack, WUserBadge | `avatarColor` | Default `"primary"` (Vuetify theme name) | Wakeb intent or CSS color |
| WBaseSidebar | `skeletonType` | Vuetify skeleton grammar | R16 skeleton grammar |
| WPageSkeleton | item `type` | Vuetify skeleton grammar | R16 skeleton grammar |

## 2. Compatibility exceptions shipped in 0.7.x

These are deliberate behavior changes from 0.7.0. Each one fixes a defect and has a regression test in `tests/regressions.test.ts` or `tests/navigation.test.ts`.

| Component | Change | Consumer impact |
| --- | --- | --- |
| WSegmentedProgress | Segments use a zero flex basis, so a label no longer widens the fill | The fill width now matches `value` (minus the 2px gap) |
| WDropdown | An exact `value` match wins over another row's label | Fixes rows whose label equals another row's value |
| WDropdown | `modelValue: null` after a selection clears it; `undefined` still leaves an uncontrolled selection alone | Hosts that set null and expected the old label to stay must keep the value instead |
| WDropdown | Replacing `menuItems` refreshes the selected presentation | The label and icon follow the new records |
| WDropdown | Rows use `role="menuitem"` inside `role="menu"`. Link rows are real anchors; disabled or loading link rows have no `href` and set `aria-disabled` | The default `item-label` content is now a `span`; the anchor is the row itself |
| WExportDropdown | Menu and menuitem roles, plus `aria-disabled` on disabled formats | Accessibility only |
| WAvatarStack, WBadgeStack | Informational overflow activators no longer claim `aria-haspopup="menu"` | Accessibility only |
| WBadgeStack | The circular icon class is also set on the teleported overflow list | Circle geometry now applies in the overflow menu |
| WTabs | Tabs get unique IDs; the selected tab gets `aria-controls`; panels are wrapped in `role="tabpanel"` with `aria-labelledby` | Panel content gains one wrapper `div.wakeb-tabs__panel` |
| WTree | When the focused row is hidden or removed, focus moves to the nearest visible ancestor, otherwise the previous visible row. Focus outside the tree is never taken | Rows gain `data-tree-key` |
| WButton | Loading suppresses the `click` emit and native submit/reset in both tooltip and standard modes | Hosts must not rely on clicks during loading |
| WButton | Secondary hover, disabled and loading tokens now win; the documented `--wakeb-button-secondary-background/-color` are consumed, with the undocumented `-surface/-text` as fallbacks | Visual: the state colors now apply |
| WModal | A description-only header renders. `width` wins, and a native `max-width` attr applies when `width` is absent | `max-width` without `width` now works |
| Docs build | Builds the library before packing the download archive. The receipt records `sourceDirty`. Every documented CSS variable must be consumed | Release tooling |
| Deployment verification | Compares the remote receipt and every asset with the trusted local build receipt, the HEAD commit and a clean tree | Release tooling; takes an optional expected-receipt path |

Unchanged Vuetify-native behavior (not portable, documented only):
- Vuetify overlay positioning and transitions.
- WDrawer's Escape and scroll behavior.
- VChip/VBtn native attributes passed through `chipAttrs`, `wrapperAttrs` and fallthrough attrs.

## 3. Dependency advisories (2026-11-03)

- `npm audit --omit=dev`: **0 vulnerabilities** in production dependencies.
- Dev: `vite` 6.4.4 → **6.4.5** (patch; fixes `server.fs.deny` bypass, GHSA advisory via vite, vitepress, vitest, @vitejs/plugin-vue). The override was updated with it.
- Dev, accepted: 5 moderate advisories (`minimatch` < 11.0.1, `glob` 3–14.0.1) reach the project only through `@vue/test-utils` → `js-beautify` → `editorconfig`/`glob`, which formats test snapshots. `npm audit fix` would resolve them by moving test tooling off the current `@vue/test-utils` line. They don't ship and aren't reachable from user input, so they're deferred until `js-beautify` publishes a compatible release.

// Shared render list: identical in every provider fixture; only the plugin file and dependencies differ.
import { h } from 'vue'
import * as W from 'wakeb-components'

const views = {
  WModal: () => h(W.WModal, { modelValue: false, title: 'Packed dialog' }),
  WCarousel: () => h(W.WCarousel, { slides: ['Welcome'], cycle: false }, { slide: ({ slide }) => h('p', slide) }),
  WExportDropdown: () => h(W.WExportDropdown, { title: 'Export report' }),
  WBaseSidebar: () => h(W.WBaseSidebar, { title: 'Team sidebar', items: [{ id: 1, name: 'Ada' }] }, { item: ({ item }) => h('b', item.name) }),
  WTabs: () => h(W.WTabs, { tabs: [{ slot: 'one', label: 'Overview', content: 'Public tab panel' }] }),
  WTree: () => h(W.WTree, { nodes: [{ id: 1, name: 'Root navigation' }] }),
  WDropdown: () => h(W.WDropdown, { title: 'Actions', menuItems: [{ label: 'Download', value: 0 }] }),
  WBadgeStack: () => h(W.WBadgeStack, { items: [{ label: 'Owner' }, { label: 'Member' }] }),
  WUserBadge: () => h(W.WUserBadge, { user: { name: 'Grace Hopper' } }),
  WTooltipBtn: () => h(W.WTooltipBtn, { text: 'Open settings' }),
  WTruncatedText: () => h(W.WTruncatedText, { label: 'Public package consumer' }),
  WSegmentedProgress: () => h(W.WSegmentedProgress, { value: 60, label: 'Ready' }),
  WSemiCircleGauge: () => h(W.WSemiCircleGauge, { value: 75, label: '75' }),
  WAvatarStack: () => h(W.WAvatarStack, { items: [{ name: 'Ada' }], showTooltip: false }),
  WLoading: () => h(W.WLoading, { label: 'Loading report' }),
  WPageSkeleton: () => h(W.WPageSkeleton, { config: [{ items: [{ type: 'text' }] }] }),
  WVerticalSteps: () => h(W.WVerticalSteps, { steps: [{ title: 'Review' }] }),
  WButton: () => h(W.WButton, { title: 'Save', action: 'submit' }),
  WBadge: () => h(W.WBadge, { label: 'Approved', type: 'success', isDot: true }),
  WAccordion: () => h(W.WAccordion, { title: 'Details', modelValue: true }, () => h('input', { value: 'Draft' })),
}
/** Text each supported component must server-render. WDrawer needs the R19 layout host (M4), so it is type-checked only. */
export const expected = {
  WModal: [], WCarousel: ['Welcome'], WExportDropdown: ['Export report'], WBaseSidebar: ['Team sidebar'], WTabs: ['Public tab panel'],
  WTree: ['Root navigation'], WDropdown: ['Actions'], WBadgeStack: ['Owner'], WUserBadge: ['Grace Hopper'], WTooltipBtn: ['Open settings'],
  WTruncatedText: [], WSegmentedProgress: ['role="progressbar"'], WSemiCircleGauge: ['aria-label="75%"'], WAvatarStack: ['Ada'],
  WLoading: ['Loading report'], WPageSkeleton: ['skeleton-block'], WVerticalSteps: ['Review'], WButton: ['Save'], WBadge: ['Approved'],
  WAccordion: ['wakeb-accordion-', 'Draft'],
}
export const rendered = (supported) => supported.filter((name) => name in views)
export const render = (supported) => () => h('main', rendered(supported).map((name) => views[name]()))

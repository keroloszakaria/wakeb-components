// Shared render list: identical in every provider fixture; only the plugin file and dependencies differ.
import { h } from 'vue'
import * as W from 'wakeb-components'

const views = {
  WModal: () => h(W.WModal, { modelValue: false, title: 'Packed dialog' }),
  WDrawer: () => h(W.WDrawer, { modelValue: false, title: 'Packed drawer' }),
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
  WTextField: () => h(W.WTextField, { label: 'Packed field', modelValue: 'Ada' }),
  WSwitch: () => h(W.WSwitch, { label: 'Packed switch', modelValue: true }),
  WCheckbox: () => h(W.WCheckbox, { label: 'Packed checkbox', modelValue: true }),
  WSkeleton: () => h(W.WSkeleton, { type: 'text', label: 'Packed skeleton' }),
  WRow: () => h(W.WRow, { dense: true }, () => h(W.WCol, { md: 6 }, () => 'Packed grid')),
  WCol: () => h(W.WCol, { cols: 12 }, () => 'Packed column'),
  WProgressLinear: () => h(W.WProgressLinear, { modelValue: 40, label: 'Packed progress' }),
  WTextarea: () => h(W.WTextarea, { label: 'Packed notes', modelValue: 'Draft' }),
  WButtonToggle: () => h(W.WButtonToggle, { modelValue: 'top', ariaLabel: 'Legend', items: [{ label: 'Packed top', value: 'top' }, { label: 'Bottom', value: 'bottom' }] }),
  WCard: () => h(W.WCard, { title: 'Packed card' }, () => 'Card body'),
  WDivider: () => h(W.WDivider, { 'data-packed': 'divider' }),
  WList: () => h(W.WList, { items: [{ title: 'Packed row' }] }),
  WIcon: () => h(W.WIcon, { icon: '$close', label: 'Packed icon' }),
  WImage: () => h(W.WImage, { src: '/packed.png', alt: 'Packed image', width: 40, height: 40 }),
  WAvatar: () => h(W.WAvatar, { name: 'Packed Avatar' }),
  WCountBadge: () => h(W.WCountBadge, { content: 120, label: 'Packed badge' }, () => 'Bell'),
  WDataTable: () => h(W.WDataTable, { headers: [{ key: 'name', title: 'Packed column' }], items: [{ id: 1, name: 'Packed cell' }] }),
  WPopover: () => h(W.WPopover, null, { activator: ({ props }) => h('button', { ...props, type: 'button' }, 'Packed filters') }),
}
/** Text each supported component must server-render. Closed overlays (WModal, WDrawer) only need to render without a host. */
export const expected = {
  WModal: [], WDrawer: [], WCarousel: ['Welcome'], WExportDropdown: ['Export report'], WBaseSidebar: ['Team sidebar'], WTabs: ['Public tab panel'],
  WTree: ['Root navigation'], WDropdown: ['Actions'], WBadgeStack: ['Owner'], WUserBadge: ['Grace Hopper'], WTooltipBtn: ['Open settings'],
  WTruncatedText: ['aria-label="Public package consumer"'], WSegmentedProgress: ['role="progressbar"'], WSemiCircleGauge: ['aria-label="75%"'], WAvatarStack: ['Ada'],
  WLoading: ['Loading report'], WPageSkeleton: ['skeleton-block'], WVerticalSteps: ['Review'], WButton: ['Save'], WBadge: ['Approved'],
  WAccordion: ['wakeb-accordion-', 'Draft'],
  WTextField: ['Packed field', 'wakeb-text-field'], WPopover: ['Packed filters', 'aria-haspopup="dialog"'], WSwitch: ['Packed switch', 'wakeb-switch'], WCheckbox: ['Packed checkbox', 'wakeb-checkbox'], WSkeleton: ['Packed skeleton', 'role="status"'], WRow: ['Packed grid', 'wakeb-grid-col--md-6'], WCol: ['Packed column', 'wakeb-grid-col--12'], WProgressLinear: ['Packed progress', 'role="progressbar"'], WTextarea: ['Packed notes', 'wakeb-textarea'], WButtonToggle: ['Packed top', 'aria-pressed="true"'], WCard: ['Packed card', 'wakeb-card'], WDivider: ['data-packed="divider"', 'wakeb-divider'], WList: ['Packed row', 'wakeb-list'], WIcon: ['Packed icon', 'role="img"'], WImage: ['Packed image', 'wakeb-image'], WAvatar: ['Packed Avatar', 'PA'], WCountBadge: ['Bell', '99+'], WDataTable: ['Packed cell', 'Packed column'],
}
export const rendered = (supported) => supported.filter((name) => name in views)
export const render = (supported) => () => h('main', rendered(supported).map((name) => views[name]()))

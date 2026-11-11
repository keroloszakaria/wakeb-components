import { createSSRApp, defineComponent, h, reactive } from 'vue'
import { createWakebComponents, WAccordion, WAvatarStack, WBadge, WBadgeStack, WBaseSidebar, WButton, WCarousel, WDrawer, WDropdown, WExportDropdown, WLoading, WModal, WPageSkeleton, WSegmentedProgress, WSemiCircleGauge, WTabs, WTooltipBtn, WTree, WTruncatedText, WUserBadge, WVerticalSteps } from 'wakeb-components'
import selection from './plugins/wakeb-components.js'
import { WTextField, WPopover, WSwitch, WCheckbox, WSkeleton, WRow, WCol, WProgressLinear, WTextarea, WButtonToggle, WCard, WDivider, WList, WIcon, WImage, WAvatar, WCountBadge, WDataTable } from 'wakeb-components'

const image = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24"%3E%3Ccircle cx="12" cy="12" r="10" fill="%23087f8c"/%3E%3C/svg%3E'
const english = 'A long English label that should remain readable and accessible in a narrow viewport'
const arabic = 'نص عربي طويل لاختبار وضوح المحتوى وسلامة الاتجاه والتنقل باستخدام لوحة المفاتيح'
const section = (name, children) => h('section', { 'data-testid': name }, [h('h2', name), ...children])
const control = (name, handler) => h('button', { type: 'button', 'data-testid': name, onClick: handler }, name)
const demo = (component, props, slots) => h('div', { 'data-component': component.name }, [h(component, props, slots)])

export function createRoots(options, warnings) {
  return Array.from({ length: options.twoApps === 'true' ? 2 : 1 }, (_, index) => {
    const direction = index ? (options.direction === 'rtl' ? 'ltr' : 'rtl') : (options.direction ?? 'ltr')
    const mode = index ? (options.mode === 'dark' ? 'light' : 'dark') : (options.mode ?? 'light')
    const color = index ? '#a6216a' : '#087f8c'
    const label = direction === 'rtl' ? arabic : english
    const state = reactive({
      clicks: 0, submits: 0, resets: 0, events: [], selected: null,
      dropdownDisabled: false, loading: false, modal: options.open === 'modal', drawer: options.open === 'drawer',
      nested: false, persistent: options.persistent === 'true', descriptionOnly: options.descriptionOnly === 'true',
      expanded: ['root'], nodes: [{ id: 'root', name: 'Root', children: [{ id: 'child', name: 'Child' }] }, { id: 'other', name: 'Other' }],
      slide: 0, carousel: true, cycle: false, accordion: true,
      email: '', notes: '', notifications: false, consent: false, formDisabled: false, popover: false,
      alignment: 'start', listValue: '', tableSelection: [], tableSort: [], tableOptions: [], tableLoading: false, tableEmpty: false,
    })
    const update = key => value => { state[key] = value; state.events.push([key, value]) }
    const tabs = prefix => demo(WTabs, { tabs: [{ slot: 'one', label: `${prefix} one` }, { slot: 'two', label: `${prefix} two` }, { slot: 'three', label: `${prefix} three` }], ariaLabel: `${prefix} tabs` }, { one: () => h('p', `${prefix} panel one`), two: () => h('p', `${prefix} panel two`), three: () => h('p', `${prefix} panel three`) })
    const overlayBody = name => h('div', { class: 'overlay-body' }, [h('input', { 'aria-label': `${name} input` }), control(`${name}-action`, () => state.clicks++), name === 'drawer' ? control('open-nested', () => { state.nested = true }) : null])
    const App = defineComponent({
      name: 'BrowserContractFixture',
      setup() {
        return () => {
          const overlay = options.scene === 'overlays'
          return h('main', { class: 'fixture', 'data-mode': mode, 'data-app': index, dir: direction }, [
            h('h1', `${selection.framework} ${mode} ${direction}`),
            h('div', { class: 'row' }, [control('outside', () => state.clicks++), control('open-modal', () => { state.modal = true }), control('open-drawer', () => { state.drawer = true })]),
            demo(WModal, { modelValue: state.modal, 'onUpdate:modelValue': update('modal'), onAfterLeave: () => state.events.push(['afterLeave']), title: state.descriptionOnly ? '' : `Modal ${index}`, description: label, ariaLabel: `Modal ${index}`, persistent: state.persistent, width: 320, closeLabel: 'Close modal' }, { default: () => overlayBody('modal') }),
            demo(WDrawer, { modelValue: state.drawer, 'onUpdate:modelValue': update('drawer'), onClose: () => state.events.push(['close']), title: `Drawer ${index}`, ariaLabel: `Drawer ${index}`, width: 320, persistent: state.persistent, closeLabel: 'Close drawer' }, { default: () => [overlayBody('drawer'), demo(WModal, { modelValue: state.nested, 'onUpdate:modelValue': update('nested'), title: 'Nested modal', persistent: false, closeLabel: 'Close nested' }, { default: () => overlayBody('nested') })] }),
            ...(overlay ? [] : [
              section('progress', ['', '10%', label, 'slot'].map((text, position) => demo(WSegmentedProgress, { class: 'progress-case', 'data-testid': `progress-${position}`, value: 10, label: text === 'slot' ? '' : text }, text === 'slot' ? { default: () => h('b', label) } : undefined))),
              section('buttons', [h('form', { onSubmit: event => { event.preventDefault(); state.submits++ }, onReset: () => state.resets++ }, [
                h('input', { name: 'example', 'aria-label': 'Form input', value: 'original' }),
                ...[false, true].map(tooltip => demo(WButton, { title: tooltip ? 'Tooltip action' : 'Plain action', isTooltip: tooltip, icon: '$expand', action: 'submit', isLoading: state.loading, disabled: state.dropdownDisabled, onClick: () => state.clicks++ })),
                demo(WButton, { title: 'Reset action', action: 'reset' }),
                demo(WButton, { title: 'Secondary action', type: 'secondary', isLoading: state.loading, disabled: state.dropdownDisabled, style: { '--wakeb-button-secondary-color': '#fff', '--wakeb-button-secondary-background': '#112233', '--wakeb-button-secondary-hover-background': '#223344', '--wakeb-button-secondary-disabled-background': '#334455', '--wakeb-button-secondary-loading-background': '#445566' } }),
              ])]),
              section('dropdown', [demo(WDropdown, { title: 'Actions', isLinks: true, disabled: state.dropdownDisabled, isLoading: state.loading, menuItems: [{ value: 'disabled', label: 'Disabled link', href: '#forbidden', disabled: true }, { value: 0, label: 'Enabled link', href: '#enabled' }, { value: 'last', label: 'Last link', href: '#last' }], onSelectedItem: item => state.events.push(['selectedItem', item.value]), 'onUpdate:modelValue': value => { state.selected = value; state.events.push(['modelValue', value]) } })]),
              section('tabs', [tabs('First'), tabs('Second')]),
              section('tree', [demo(WTree, { nodes: state.nodes, expandedKeys: state.expanded, rtl: direction === 'rtl', onToggle: node => { state.expanded = state.expanded.includes(node.id) ? [] : [node.id] } }), control('collapse-tree', () => { state.expanded = [] })]),
              section('accordion', [0, 1].map(n => demo(WAccordion, { title: `Accordion ${n}`, modelValue: state.accordion, 'onUpdate:modelValue': update('accordion') }, () => h('input', { 'aria-label': `Accordion input ${n}`, value: 'draft' })))),
              section('carousel', [h('form', { onSubmit: event => { event.preventDefault(); state.submits++ } }, [state.carousel ? demo(WCarousel, { slides: ['Slide one', 'Slide two', 'Slide three'], cycle: state.cycle, interval: 250, height: 120, showIndicators: true, modelValue: state.slide, 'onUpdate:modelValue': update('slide') }, { slide: ({ slide }) => h('p', { class: 'carousel-slide' }, slide) }) : null])]),
              section('identity', [demo(WBadgeStack, { items: [{ label: 'Visible badge', icon: image }, { label: 'Overflow badge', icon: image }], max: 1, showOverflowMenu: true, iconVariant: 'circle', overflowLabel: 'More badges', overflowTag: 'button' }), demo(WAvatarStack, { items: [{ name: 'Ada' }, { name: 'Grace' }], max: 1, showOverflowMenu: true, overflowLabel: 'More avatars' }), demo(WUserBadge, { user: { name: 'Grace Hopper' } }), demo(WBadge, { label: label, type: 'success', variant: 'solid' })]),
              section('display', [demo(WTruncatedText, { label }), demo(WTooltipBtn, { text: 'Accessible tooltip', icon: '$expand', openDelay: 0 }), demo(WLoading, { label: 'Loading report' }), ...[0, 1].map(n => demo(WSemiCircleGauge, { value: 75, label: `Gauge ${n}` })), demo(WPageSkeleton, { config: [{ cols: 12, sm: 6, md: 4, items: [{ type: 'text@2' }] }] }), demo(WVerticalSteps, { steps: [{ title: label, is_active: true }] })]),
              section('composition', [demo(WExportDropdown, { title: 'Export report', onSelect: value => state.events.push(['export', value]) }), demo(WBaseSidebar, { title: 'Sidebar', items: [{ id: 'one', name: label }] }, { item: ({ item }) => h('p', item.name) })]),
              section('forms', [
                demo(WTextField, { modelValue: state.email, 'onUpdate:modelValue': value => { state.email = value }, label: 'Contact email', type: 'email', disabled: state.formDisabled, rules: [value => !!value || 'Email required'], hideDetails: 'auto' }),
                demo(WTextarea, { modelValue: state.notes, 'onUpdate:modelValue': value => { state.notes = value }, label: 'Review notes', disabled: state.formDisabled, rows: 2 }),
                demo(WSwitch, { modelValue: state.notifications, 'onUpdate:modelValue': value => { state.notifications = value }, label: 'Enable notifications', disabled: state.formDisabled }),
                demo(WCheckbox, { modelValue: state.consent, 'onUpdate:modelValue': value => { state.consent = value }, label: 'Accept terms', disabled: state.formDisabled }),
                demo(WButtonToggle, { modelValue: state.alignment, 'onUpdate:modelValue': value => { state.alignment = value }, ariaLabel: 'Alignment', disabled: state.formDisabled, mandatory: true, items: [{ label: 'Start', value: 'start' }, { label: 'End', value: 'end' }] }),
                demo(WPopover, { modelValue: state.popover, 'onUpdate:modelValue': value => { state.popover = value }, ariaLabel: 'Filter help', closeOnContentClick: false }, { activator: ({ props }) => h('button', { ...props, type: 'button' }, 'Open filter help'), default: ({ close }) => h('div', [h('p', 'Choose filters'), h('button', { type: 'button', onClick: close }, 'Done with help')]) }),
              ]),
              section('elements', [
                demo(WCard, { title: 'Review card', subtitle: 'Independent providers', variant: 'outlined' }, { default: () => h('p', 'Card content'), actions: () => h('button', { type: 'button' }, 'Review card action') }),
                demo(WDivider), demo(WIcon, { icon: '$complete', label: 'Complete icon', size: 20 }),
                demo(WImage, { src: image, alt: 'Provider sample image', width: 48, height: 48, lazy: false }),
                demo(WAvatar, { name: 'Grace Hopper', size: 32 }), demo(WCountBadge, { content: 5, label: '5 unread messages' }, () => h('span', 'Inbox')),
                demo(WSkeleton, { type: 'paragraph', width: 240, label: 'Loading placeholder' }),
                demo(WProgressLinear, { modelValue: 45, label: 'Upload progress' }),
                demo(WRow, { dense: true }, () => [demo(WCol, { cols: 12, md: 6 }, () => 'First column'), demo(WCol, { cols: 12, md: 6 }, () => 'Second column')]),
                demo(WList, { interactive: true, ariaLabel: 'Account actions', items: [{ title: 'Profile', value: 'profile' }, { title: 'Locked account', value: 'locked', disabled: true }], onSelect: item => { state.listValue = item.value } }),
                demo(WDataTable, { headers: [{ key: 'name', title: 'Camera' }, { key: 'status', title: 'State', sortable: false }], items: state.tableEmpty ? [] : [{ id: 1, name: 'Gate 3', status: 'Online' }, { id: 2, name: 'Parking', status: 'Offline' }], modelValue: state.tableSelection, 'onUpdate:modelValue': value => { state.tableSelection = value }, sortBy: state.tableSort, 'onUpdate:sortBy': value => { state.tableSort = value }, 'onUpdate:options': value => { state.tableOptions.push(value) }, selectable: true, ariaLabel: 'Camera inventory', loading: state.tableLoading, noDataText: 'No cameras' }, { 'item.status': ({ value }) => h('strong', String(value)) }),
              ]),
            ]),
            h('output', { 'data-testid': 'counts' }, JSON.stringify({ clicks: state.clicks, submits: state.submits, resets: state.resets, events: state.events })),
          ])
        }
      },
    })
    const app = createSSRApp(App)
    app.config.idPrefix = `fixture-${index}-`
    app.config.warnHandler = message => warnings.push(message)
    app.use(createWakebComponents({ framework: selection.framework, direction, locale: direction === 'rtl' ? 'ar' : 'en', theme: { mode, tokens: { primary: color, zIndexOverlay: 2400 } } }))
    return { app, state }
  })
}

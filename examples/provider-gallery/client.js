import { createApp, defineComponent, h, reactive } from 'vue'
import { createWakebComponents, WAccordion, WAvatarStack, WBadge, WBadgeStack, WBaseSidebar, WButton, WCarousel, WDrawer, WDropdown, WExportDropdown, WLoading, WModal, WPageSkeleton, WSegmentedProgress, WSemiCircleGauge, WTabs, WTooltipBtn, WTree, WTruncatedText, WUserBadge, WVerticalSteps } from 'wakeb-components'
import selection from './plugins/wakeb-components.js'
import 'wakeb-components/style.css'
import './gallery.css'

const params = new URLSearchParams(location.search)
let locale = params.get('lang') === 'en' ? 'en' : 'ar'
let mode = params.get('theme') === 'dark' ? 'dark' : 'light'
let app
const labels = { vuetify: 'Vuetify', primevue: 'PrimeVue', shadcn: 'shadcn-vue' }
const providers = Object.keys(labels)
const image = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="10" fill="%23087f8c"/%3E%3C/svg%3E'
const t = (ar, en) => locale === 'ar' ? ar : en
const card = (name, description, children) => h('article', { class: 'component-card', id: name, 'data-component': name }, [h('header', [h('h2', name), h('p', description)]), h('div', { class: 'component-demo' }, children)])
const row = children => h('div', { class: 'demo-row' }, children)
const control = (label, value, change) => h('label', { class: 'demo-check' }, [h('input', { type: 'checkbox', checked: value, onChange: event => change(event.target.checked) }), label])

function mountGallery() {
  app?.unmount()
  document.documentElement.lang = locale
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  document.body.dataset.mode = mode
  document.title = `Wakeb · ${labels[selection.framework]} · ${locale} · ${mode}`
  history.replaceState(null, '', `?lang=${locale}&theme=${mode}`)
  document.querySelector('#gallery-title').textContent = `${t('معرض المكوّنات', 'Component gallery')} · ${labels[selection.framework]}`
  document.querySelector('#gallery-subtitle').textContent = t('٢١ مكوّنًا · أمثلة موحّدة · حزمة فعلية داخل مشروع مستقل', '21 components · identical examples · packed package in an isolated project')
  document.querySelector('#language').textContent = locale === 'ar' ? 'English' : 'العربية'
  document.querySelector('#theme').textContent = mode === 'light' ? t('الوضع الداكن', 'Dark mode') : t('الوضع الفاتح', 'Light mode')
  document.querySelector('#reset').textContent = t('إعادة الأمثلة', 'Reset examples')
  document.querySelector('#reset-note').textContent = t('تغيير اللغة أو الثيم يعيد الأمثلة لحالتها الأولى.', 'Changing language or theme resets the examples.')
  const nav = document.querySelector('#providers')
  nav.replaceChildren(...providers.map((provider, index) => {
    const link = document.createElement('a')
    link.href = `http://127.0.0.1:${41801 + index}/?lang=${locale}&theme=${mode}`
    link.textContent = labels[provider]
    if (provider === selection.framework) link.setAttribute('aria-current', 'page')
    return link
  }))
  const state = reactive({ clicks: 0, loading: false, disabled: false, progress: 65, accordion: false, modal: false, drawer: false, nested: false, persistent: false, expanded: ['team'], active: null, menu: null, slide: 0, cycle: false, filtered: false, events: [], warnings: [] })
  const record = (name, payload = '') => { state.events.unshift(`${name}${payload === '' ? '' : ': ' + String(payload)}`); state.events.splice(12) }
  const text = t('هذا نص عربي طويل لتجربة اختصار المحتوى وإظهار النص الكامل عند التركيز أو المرور بالمؤشر.', 'This is a long English label for testing truncation and showing the complete text on focus or hover.')
  const people = [{ name: t('نور أحمد', 'Noor Ahmed') }, { name: t('عمر علي', 'Omar Ali') }, { name: t('سارة حسن', 'Sara Hassan') }, { name: t('مريم خالد', 'Mariam Khaled') }]
  const nodes = [{ id: 'team', name: t('الفريق', 'Team'), children: [{ id: 'design', name: t('التصميم', 'Design') }, { id: 'engineering', name: t('التطوير', 'Engineering') }] }, { id: 'settings', name: t('الإعدادات', 'Settings') }]
  const btn = (title, action, props = {}) => h(WButton, { title, onClick: action, ...props })
  const field = label => h('label', { class: 'demo-field' }, [label, h('input', { type: 'text', placeholder: label })])
  const view = defineComponent({
    name: 'ProviderGallery',
    setup: () => () => h('main', { class: 'gallery-main' }, [
      h('div', { class: 'status-line' }, [h('span', t('جاهز للتجربة', 'Ready to explore')), h('span', { 'data-testid': 'diagnostics', role: 'status' }, `${t('تحذيرات Vue', 'Vue warnings')}: ${state.warnings.length}`)]),
      h('div', { class: 'component-grid' }, [
        card('WButton', t('الألوان والتحميل والتعطيل والنقر.', 'Intents, loading, disabled state and clicks.'), [row([
          btn(t('زر أساسي', 'Primary action'), () => { state.clicks++; record('button.click', state.clicks) }, { isLoading: state.loading, disabled: state.disabled }),
          btn(t('زر ثانوي', 'Secondary action'), () => record('secondary.click'), { type: 'secondary', disabled: state.disabled }),
          btn(t('بحدود', 'Outline'), () => record('outline.click'), { type: 'outline', disabled: state.disabled })
        ]), row([control(t('تحميل', 'Loading'), state.loading, value => { state.loading = value }), control(t('تعطيل', 'Disabled'), state.disabled, value => { state.disabled = value })]), h('output', `${t('النقرات', 'Clicks')}: ${state.clicks}`)]),
        card('WBadge', t('أنواع وشكل soft وsolid.', 'Intent colors with soft and solid variants.'), [row(['primary', 'success', 'warning', 'danger'].map(type => h(WBadge, { label: type, type, variant: 'soft', isDot: true }))), row([h(WBadge, { label: t('جاهز', 'Ready'), type: 'success', variant: 'solid' }), h(WBadge, { label: t('معلومات', 'Information'), type: 'info', variant: 'outline' })])]),
        card('WTruncatedText', t('النص الكامل متاح للتركيز والمرور بالمؤشر.', 'Focus or hover to read the full text.'), [h(WTruncatedText, { label: text, length: 30 })]),
        card('WSegmentedProgress', t('حرّك المؤشر لتغيير القيمة.', 'Move the slider to change the value.'), [h(WSegmentedProgress, { value: state.progress, label: `${state.progress}%` }), h('label', { class: 'demo-field' }, [t('القيمة', 'Value'), h('input', { type: 'range', min: 0, max: 100, value: state.progress, onInput: event => { state.progress = Number(event.target.value) } })])]),
        card('WSemiCircleGauge', t('يتبع قيمة مؤشر التقدم نفسه.', 'Shares the value of the progress slider.'), [h(WSemiCircleGauge, { value: state.progress, label: `${state.progress}%`, subLabel: t('الإنجاز', 'Completion') })]),
        card('WAvatarStack', t('جرّب التركيز أو المرور على العدد الإضافي.', 'Focus or hover the overflow count.'), [h(WAvatarStack, { items: people, max: 3, showOverflowMenu: true, overflowLabel: t('أعضاء إضافيون', 'More members') })]),
        card('WLoading', t('مؤشر تحميل باسم وصول مترجم.', 'A loading indicator with a localized accessible name.'), [h(WLoading, { label: t('جارٍ التحميل', 'Loading content'), size: 36 })]),
        card('WPageSkeleton', t('عناصر نائبة بتخطيط متجاوب.', 'Responsive loading placeholders.'), [h(WPageSkeleton, { config: [{ cols: 12, items: [{ type: 'avatar', width: 40, height: 40 }, { type: 'text@2' }] }] })]),
        card('WVerticalSteps', t('حالة خطوات عملية تجريبية.', 'A sample workflow with active steps.'), [h(WVerticalSteps, { steps: [{ title: t('الطلب', 'Request'), is_active: true }, { title: t('المراجعة', 'Review'), is_active: true }, { title: t('الاكتمال', 'Complete'), is_active: false }] })]),
        card('WAccordion', t('افتح المحتوى باستخدام النقر أو لوحة المفاتيح.', 'Expand with a click or the keyboard.'), [h(WAccordion, { title: t('تفاصيل الطلب', 'Request details'), modelValue: state.accordion, 'onUpdate:modelValue': value => { state.accordion = value; record('accordion', value) } }, () => field(t('ملاحظة', 'Note')))]),
        card('WBadgeStack', t('قائمة إضافية للشارات المخفية.', 'An overflow menu for hidden badges.'), [h(WBadgeStack, { items: ['Design', 'Engineering', 'Research'].map((label, id) => ({ id, label, icon: image })), max: 2, showOverflowMenu: true, badgeVariant: 'soft', overflowLabel: t('شارات إضافية', 'More badges') })]),
        card('WUserBadge', t('اسم مستخدم وبديل الصورة بالأحرف الأولى.', 'User identity with an initials fallback.'), [h(WUserBadge, { user: people[0] })]),
        card('WTooltipBtn', t('جرّب Tab ثم التركيز على الزر.', 'Use Tab to focus the tooltip trigger.'), [h(WTooltipBtn, { text: t('معلومة إضافية للمكوّن', 'Additional component information'), ariaLabel: t('معلومات', 'Information'), icon: '$expand', openDelay: 0 })]),
        card('WTabs', t('جرّب الأسهم وHome وEnd.', 'Try arrow keys, Home and End.'), [h(WTabs, { tabs: [{ slot: 'overview', label: t('نظرة عامة', 'Overview') }, { slot: 'activity', label: t('النشاط', 'Activity') }, { slot: 'settings', label: t('الإعدادات', 'Settings') }], ariaLabel: t('أقسام المثال', 'Example sections'), onUpdateTab: value => record('tabs', value) }, { overview: () => h('p', t('محتوى النظرة العامة.', 'Overview content.')), activity: () => h('p', t('لا يوجد نشاط جديد.', 'No new activity.')), settings: () => field(t('اسم العرض', 'Display name')) })]),
        card('WTree', t('افتح الفروع واختر عنصرًا باستخدام لوحة المفاتيح.', 'Expand branches and select a node with the keyboard.'), [h(WTree, { nodes, expandedKeys: state.expanded, activeKey: state.active, rtl: locale === 'ar', onToggle: node => { state.expanded = state.expanded.includes(node.id) ? state.expanded.filter(id => id !== node.id) : [...state.expanded, node.id]; record('tree.toggle', node.id) }, onNodeClick: node => { state.active = node.id; record('tree.select', node.id) } })]),
        card('WDropdown', t('عنصر معطل واختيار مضبوط بالقيمة.', 'A disabled option and a controlled selection.'), [h(WDropdown, { title: t('الإجراءات', 'Actions'), modelValue: state.menu, menuItems: [{ value: 'view', label: t('عرض', 'View') }, { value: 'blocked', label: t('غير متاح', 'Unavailable'), disabled: true }, { value: 'archive', label: t('أرشفة تجريبية', 'Demo archive') }], onSelectedItem: item => record('dropdown.selectedItem', item.value), 'onUpdate:modelValue': value => { state.menu = value; record('dropdown.modelValue', value) } })]),
        card('WCarousel', t('التنقل بين الشرائح والتشغيل التلقائي الاختياري.', 'Slide navigation with optional autoplay.'), [h(WCarousel, { slides: [1, 2, 3], height: 140, showArrows: true, showIndicators: true, interval: 2400, cycle: state.cycle, modelValue: state.slide, 'onUpdate:modelValue': value => { state.slide = value; record('carousel', value) } }, { slide: ({ slide }) => h('div', { class: 'sample-slide' }, `${t('الشريحة', 'Slide')} ${slide}`) }), control(t('تشغيل تلقائي', 'Autoplay'), state.cycle, value => { state.cycle = value })]),
        card('WExportDropdown', t('يسجل اختيار التنسيق بدون تنزيل ملف.', 'Records the format choice without downloading a file.'), [h(WExportDropdown, { title: t('تصدير المثال', 'Export example'), onSelect: format => record('export.select', format) })]),
        card('WBaseSidebar', t('عناصر مخصصة وزر فلترة.', 'Custom item content and a filter action.'), [h(WBaseSidebar, { title: t('المشروعات', 'Projects'), items: [{ id: 'alpha', name: t('مشروع ألفا', 'Project Alpha') }, { id: 'beta', name: t('مشروع بيتا', 'Project Beta') }], hasFilter: true, isFiltered: state.filtered, onFilterClick: () => { state.filtered = true; record('sidebar.filter', true) }, onFilterCancel: () => { state.filtered = false; record('sidebar.filter', false) } }, { item: ({ item }) => btn(item.name, () => record('sidebar.item', item.id), { type: 'text' }) })]),
        card('WModal', t('حوار مع حقل إدخال واستعادة التركيز.', 'A dialog with a field and return focus.'), [btn(t('فتح الحوار', 'Open modal'), () => { state.modal = true }), control(t('ثابت عند Escape والخارج', 'Persistent on Escape/outside'), state.persistent, value => { state.persistent = value }), h(WModal, { modelValue: state.modal, 'onUpdate:modelValue': value => { state.modal = value; record('modal', value) }, title: t('حوار تجريبي', 'Demo modal'), persistent: state.persistent, width: 440, showActions: true }, { content: () => field(t('اسم الطلب', 'Request name')), actions: () => row([btn(t('إلغاء', 'Cancel'), () => { state.modal = false }, { type: 'secondary' }), btn(t('حفظ تجريبي', 'Demo save'), () => { state.modal = false; record('modal.save') })]) })]),
        card('WDrawer', t('لوحة جانبية وحوار داخلها، بدون layout خارجي.', 'A drawer with a nested modal, without an external layout.'), [btn(t('فتح اللوحة', 'Open drawer'), () => { state.drawer = true }), h(WDrawer, { modelValue: state.drawer, 'onUpdate:modelValue': value => { state.drawer = value; record('drawer', value) }, title: t('لوحة تجريبية', 'Demo drawer'), width: 360 }, { content: () => [field(t('بحث داخل اللوحة', 'Search in drawer')), btn(t('حوار داخل اللوحة', 'Nested modal'), () => { state.nested = true }), h(WModal, { modelValue: state.nested, 'onUpdate:modelValue': value => { state.nested = value }, title: t('حوار داخلي', 'Nested dialog'), width: 300, persistent: false }, { content: () => h('p', t('Escape يغلق هذا الحوار أولًا.', 'Escape closes this dialog first.')) })] })])
      ]),
      h('section', { class: 'event-panel', 'aria-label': t('سجل التفاعل', 'Interaction log') }, [h('h2', t('سجل التفاعل', 'Interaction log')), h('p', t('كل البيانات محلية وتجريبية. لا يتم إرسال طلبات عمل.', 'All data is local and synthetic. No business requests are sent.')), h('output', { 'data-testid': 'events', 'aria-live': 'polite' }, state.events.length ? state.events.map((event, index) => h('div', { key: index }, event)) : t('جرّب أي مكوّن لعرض أحداثه هنا.', 'Interact with a component to see its events here.')), state.warnings.length ? h('pre', state.warnings.join('\n')) : null])
    ])
  })
  app = createApp(view)
  app.config.warnHandler = message => state.warnings.push(message)
  app.use(createWakebComponents({ framework: selection.framework, locale, direction: locale === 'ar' ? 'rtl' : 'ltr', theme: { mode, tokens: { primary: '#087f8c', fontFamily: 'Arial, sans-serif', zIndexOverlay: 2400 } } }))
  app.mount('#app')
}
document.querySelector('#language').addEventListener('click', () => { locale = locale === 'ar' ? 'en' : 'ar'; mountGallery() })
document.querySelector('#theme').addEventListener('click', () => { mode = mode === 'light' ? 'dark' : 'light'; mountGallery() })
document.querySelector('#reset').addEventListener('click', mountGallery)
mountGallery()

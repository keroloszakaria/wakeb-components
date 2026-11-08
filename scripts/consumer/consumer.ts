// Type-level contract of the packed root declarations; compiled with only the selected provider installed.
import { WTruncatedText, WSegmentedProgress, WSemiCircleGauge, WAvatarStack, WLoading, WPageSkeleton, WVerticalSteps, WButton, WBadge, WAccordion, WBadgeStack, WUserBadge, WTooltipBtn, WTabs, WTree, WDropdown, WModal, WDrawer, WCarousel, WExportDropdown, WBaseSidebar, type ButtonProps, type BadgeProps, type AccordionProps, type AvatarStackProps, type SkeletonRow, type VerticalStep, type TruncatedTextProps, type SemiCircleGaugeProps } from 'wakeb-components';
const modal: import('wakeb-components').ModalProps = {title:'Dialog',closable:false};
const drawer: import('wakeb-components').DrawerProps = {position:'start',width:420};
// @ts-expect-error drawer positions are logical sides
const invalidDrawer: import('wakeb-components').DrawerProps = {position:'top'};
void [modal,drawer,invalidDrawer,WModal,WDrawer];
const carousel: import('wakeb-components').CarouselProps = {slides:[{title:'Welcome'}],cycle:false,showIndicators:true};
const exportMenu: import('wakeb-components').ExportDropdownProps = {formats:[{label:'CSV',value:'csv'}]};
const sidebar: import('wakeb-components').BaseSidebarProps = {title:'People',items:[{id:1,name:'Ada'}]};
// @ts-expect-error native arrows accept only true, false or hover
const badCarousel: import('wakeb-components').CarouselProps = {showArrows:'always'};
void [carousel,exportMenu,sidebar,badCarousel,WCarousel,WExportDropdown,WBaseSidebar];
const tabsProps: import('wakeb-components').TabsProps = { tabs:[{slot:0,label:'Zero'}], selectedTab:0 };
const treeProps: import('wakeb-components').TreeProps = { nodes:[{id:1,name:'Root'}],expandedKeys:[1],keyboardNavigation:true };
const dropdownProps: import('wakeb-components').DropdownProps = {menuItems:[{label:'Ready',value:0}],modelValue:0};
// @ts-expect-error tree keys are primitive navigation keys
const badTree: import('wakeb-components').TreeProps = {activeKey:{id:1}};
const tabEvents: InstanceType<typeof WTabs>['$props'] = {tabs:[],onUpdateTab:(value:string|number|undefined)=>void value};
void [tabsProps,treeProps,dropdownProps,badTree,tabEvents,WTabs,WTree,WDropdown];
const stack: import('wakeb-components').BadgeStackProps = { items: [{id:1,label:'Admin',badgeIcon:'$complete'}], overflowTag: 'button' };
const userBadge: import('wakeb-components').UserBadgeProps = { user: {name:'Ada',avatar:'/a.png'}, iconPosition:'after' };
const tooltipBtn: import('wakeb-components').TooltipBtnProps = { text:'Save', openDelay:200 };
// @ts-expect-error icon positions are closed public values
const badStack: import('wakeb-components').BadgeStackProps = { iconPosition:'left' };
void [stack,userBadge,tooltipBtn,badStack,WBadgeStack,WUserBadge,WTooltipBtn];
const text: TruncatedTextProps = { label: 'Public package', length: 8, tooltipLocation: 'top' };
const gauge: SemiCircleGaugeProps = { value: 30, ariaLabel: 'Quality' };
// @ts-expect-error arbitrary locations are not public tooltip locations
const bad: TruncatedTextProps = { tooltipLocation: 'diagonal' };
const avatars: AvatarStackProps = { items: [{ name: 'Ada' }], max: 2, nameKey: 'name' };
const skeleton: SkeletonRow = { repeat: 2, cols: 6, variant: 'card', items: [{ type: 'text' }] };
const step: VerticalStep = { title: 'Review', is_active: true };
// @ts-expect-error skeleton direction is a closed public union
const badDirection: import('wakeb-components').PageSkeletonProps = { config: [], direction: 'diagonal' };
const button: ButtonProps = { title: 'Save', action: 'submit', classList: ['custom', { active: true }] };
const badge: BadgeProps = { label: 'Ready', type: 'success', iconPosition: 'after' };
const accordion: AccordionProps = { modelValue: true, title: 'Details', afterIcon: true };
const clickProps: InstanceType<typeof WButton>['$props'] = { onClick: (event: MouseEvent) => event.preventDefault() };
// @ts-expect-error native action is a closed HTML type
const badAction: ButtonProps = { action: 'danger' };
// @ts-expect-error click receives a MouseEvent
const badClick: InstanceType<typeof WButton>['$props'] = { onClick: (event: string) => event.toUpperCase() };
void [button, badge, accordion, clickProps, badAction, badClick, WButton, WBadge, WAccordion, WBadgeStack, WUserBadge, WTooltipBtn, WTabs, WTree, WDropdown, WModal, WDrawer, WCarousel, WExportDropdown, WBaseSidebar, text, gauge, bad, avatars, skeleton, step, badDirection, WTruncatedText, WSegmentedProgress, WSemiCircleGauge, WAvatarStack, WLoading, WPageSkeleton, WVerticalSteps];
import { createWakebComponents, type WakebPlugin } from 'wakeb-components';
const plugin: WakebPlugin = createWakebComponents({ framework: 'primevue', providerOptions: { kind: 'primevue', mode: 'reuse' } });
// @ts-expect-error provider options must name the selected framework
const mismatched = createWakebComponents({ framework: 'vuetify', providerOptions: { kind: 'primevue' } });
// @ts-expect-error there is no default provider
const unselected = createWakebComponents({});
void [plugin, mismatched, unselected];
const shadcnPlugin: WakebPlugin = createWakebComponents({ framework: 'shadcn', providerOptions: { kind: 'shadcn', mode: 'install' } });
// @ts-expect-error shadcn provider options must name shadcn
const shadcnMismatched = createWakebComponents({ framework: 'shadcn', providerOptions: { kind: 'vuetify' } });
void [shadcnPlugin, shadcnMismatched];
const configured: WakebPlugin = createWakebComponents({ framework: 'vuetify', defaults: { WButton: { size: 'md', disabled: false }, WModal: { persistent: false, closeLabel: 'Dismiss' } }, locale: 'ar', direction: 'rtl', theme: { mode: 'dark', tokens: { primary: '#123456', radius: '6px', zIndexOverlay: 3000 } } });
// @ts-expect-error model props stay on each instance
const modelDefault = createWakebComponents({ framework: 'vuetify', defaults: { WDropdown: { modelValue: 'x' } } });
// @ts-expect-error data arrays stay on each instance
const dataDefault = createWakebComponents({ framework: 'vuetify', defaults: { WDropdown: { menuItems: [] } } });
// @ts-expect-error callbacks such as label formatters stay on each instance
const callbackDefault = createWakebComponents({ framework: 'vuetify', defaults: { WDropdown: { labelFormatter: (value?: string) => value ?? '' } } });
// @ts-expect-error default values keep the prop type
const wrongDefault = createWakebComponents({ framework: 'vuetify', defaults: { WButton: { disabled: 'yes' } } });
// @ts-expect-error defaults are keyed by public component names
const unknownComponent = createWakebComponents({ framework: 'vuetify', defaults: { WSelect: {} } });
// @ts-expect-error defaults accept only declared props
const unknownProp = createWakebComponents({ framework: 'vuetify', defaults: { WButton: { colour: 'red' } } });
// @ts-expect-error the overlay z-index token is numeric
const textZIndex = createWakebComponents({ framework: 'vuetify', theme: { tokens: { zIndexOverlay: '10' } } });
// @ts-expect-error theme mode is light or dark
const dimMode = createWakebComponents({ framework: 'vuetify', theme: { mode: 'dim' } });
void [configured, modelDefault, dataDefault, callbackDefault, wrongDefault, unknownComponent, unknownProp, textZIndex, dimMode];
// Portable intents and color props (SPEC R23): WakebColor itself takes intents and CSS colors only.
const colors: import('wakeb-components').WakebColor[] = ['primary', 'neutral', '#0a7', 'rgb(0 0 0)', 'var(--brand, #000)', 'transparent'];
// @ts-expect-error the strict portable type still rejects provider color names
const strictColor: import('wakeb-components').WakebColor = 'red-darken-2';
// @ts-expect-error the strict portable badge type still rejects provider color names
const strictBadgeType: import('wakeb-components').WakebBadgeType = 'teal';
const loading: import('wakeb-components').LoadingProps = { color: 'danger' };
// Deprecated 0.7 values still type-check for one major release (WakebDeprecatedColor, WakebDeprecatedBadgeType).
const legacyLoading: import('wakeb-components').LoadingProps = { color: 'error' };
const legacyAvatar: AvatarStackProps = { avatarColor: 'red-darken-2' };
const legacyUserAvatar: import('wakeb-components').UserBadgeProps = { avatarColor: 'grey-lighten-1', type: 'teal' };
const legacyBadge: BadgeProps = { type: 'teal', variant: 'outlined' };
const legacyStack: import('wakeb-components').BadgeStackProps = { badgeType: 'teal', badgeVariant: 'tonal', items: [{ type: 'teal', variant: 'text' }] };
const deprecatedColor: import('wakeb-components').WakebDeprecatedColor = 'red-darken-2';
const deprecatedBadgeType: import('wakeb-components').WakebDeprecatedBadgeType = 'teal';
// @ts-expect-error the deprecated names are a closed Vuetify list, so a misspelled intent is still an error
const typoLoading: import('wakeb-components').LoadingProps = { color: 'primray' };
// @ts-expect-error a misspelled badge type is not a Vuetify color name either
const typoBadge: BadgeProps = { type: 'sucess' };
// @ts-expect-error a color is a string, not a number
const numericLoading: import('wakeb-components').LoadingProps = { color: 1 };
// @ts-expect-error a badge type is a string, not an object
const objectBadge: BadgeProps = { type: { color: 'teal' } };
// @ts-expect-error unknown variant names are not deprecated aliases
const unknownVariant: BadgeProps = { variant: 'shiny' };
// @ts-expect-error colors that only some components still render as provider names stay strict
const strictDot: BadgeProps = { dotColor: 'red-darken-2' };
const intentTheme = createWakebComponents({ framework: 'vuetify', theme: { tokens: { success: '#12b76a', neutral: 'var(--gray)' } } });
void [colors, strictColor, strictBadgeType, loading, legacyLoading, legacyAvatar, legacyUserAvatar, legacyBadge, legacyStack, deprecatedColor, deprecatedBadgeType, typoLoading, typoBadge, numericLoading, objectBadge, unknownVariant, strictDot, intentTheme];
// Wakeb-owned icons (SPEC R15): names resolve to SVG path data or components, never strings.
const iconPaths: import('wakeb-components').WakebSvgIcon = ['M7 10l5 5 5-5z', ['M0 0h24v24H0z', 0.2]];
const iconOptions: import('wakeb-components').WakebIconsOptions = { aliases: { brand: iconPaths }, resolve: (name: string) => (name === 'check' ? ['M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z'] : undefined) };
const withIcons = createWakebComponents({ framework: 'primevue', icons: iconOptions });
const iconButton: ButtonProps = { icon: 'svg:M7 10l5 5 5-5z' };
// @ts-expect-error the icons option is an object, not a bare resolver function
const bareResolver = createWakebComponents({ framework: 'vuetify', icons: (name: string) => [name] });
// @ts-expect-error aliases map to SVG path data or components, not other names or HTML strings
const stringAlias = createWakebComponents({ framework: 'vuetify', icons: { aliases: { check: '<svg></svg>' } } });
// @ts-expect-error the resolver returns path data, a component or undefined, never a string
const stringResolver = createWakebComponents({ framework: 'vuetify', icons: { resolve: (name: string) => `mdi-${name}` } });
// @ts-expect-error icons accepts only aliases and resolve
const unknownIconOption = createWakebComponents({ framework: 'vuetify', icons: { sets: {} } });
// @ts-expect-error a path opacity is a number
const badOpacity: import('wakeb-components').WakebSvgIcon = [['M0 0h24v24H0z', '0.2']];
void [iconPaths, iconOptions, withIcons, iconButton, bareResolver, stringAlias, stringResolver, unknownIconOption, badOpacity];
// Native escape hatch (SPEC R12): a provider-neutral record on adapter-backed components, set per instance only.
const nativeButton: InstanceType<typeof WButton>['$props'] = { title: 'Save', providerProps: { variant: 'tonal', severity: 'danger' } };
const nativeModal: import('wakeb-components').ModalProps = { providerProps: { scrollable: true } };
const nativeRecord: import('wakeb-components').WakebProviderProps = { location: 'end' };
const nativeDropdown: import('wakeb-components').DropdownProps = { providerProps: nativeRecord };
const nativeLoading: import('wakeb-components').LoadingProps = { providerProps: { width: 6 } };
// @ts-expect-error providerProps is a record of native props, not a string
const nativeString: ButtonProps = { providerProps: 'variant=tonal' };
// @ts-expect-error components without a provider primitive have no providerProps
const nativeBadge: BadgeProps = { providerProps: {} };
// @ts-expect-error providerProps is per instance and never a plugin default
const nativeDefault = createWakebComponents({ framework: 'vuetify', defaults: { WButton: { providerProps: { variant: 'tonal' } } } });
void [nativeButton, nativeModal, nativeDropdown, nativeLoading, nativeString, nativeBadge, nativeDefault];
// Neutral contracts (SPEC R01, R14): exact event payloads on every component that emits, and slot payloads.
type PropsOf<C extends abstract new (...args: any) => any> = InstanceType<C>['$props'];
const accordionModel: PropsOf<typeof WAccordion> = { 'onUpdate:modelValue': (open: boolean) => void open };
// @ts-expect-error the accordion model is a boolean
const badAccordionModel: PropsOf<typeof WAccordion> = { 'onUpdate:modelValue': (open: string) => void open };
// @ts-expect-error tab updates carry a navigation key or undefined, not an object
const badTabEvent: PropsOf<typeof WTabs> = { tabs: [], onUpdateTab: (value: { slot: string }) => void value };
const treeEvents: PropsOf<typeof WTree> = { 'onNode-click': (node: import('wakeb-components').TreeNode) => void node.id, onToggle: (node: import('wakeb-components').TreeNode) => void node.children };
// @ts-expect-error node-click receives the clicked node
const badTreeClick: PropsOf<typeof WTree> = { 'onNode-click': (key: number) => void key };
// @ts-expect-error toggle receives the node, not its expanded state
const badTreeToggle: PropsOf<typeof WTree> = { onToggle: (expanded: boolean) => void expanded };
const dropdownEvents: PropsOf<typeof WDropdown> = { onSelectedItem: (item: import('wakeb-components').DropdownItem) => void item.label, 'onUpdate:modelValue': (value: string | number) => void value };
// @ts-expect-error selectedItem receives the whole item
const badDropdownItem: PropsOf<typeof WDropdown> = { onSelectedItem: (label: string) => void label };
// @ts-expect-error the dropdown model is a navigation key, which may be a number
const badDropdownModel: PropsOf<typeof WDropdown> = { 'onUpdate:modelValue': (value: string) => void value };
const carouselModel: PropsOf<typeof WCarousel> = { 'onUpdate:modelValue': (index: number) => void index };
// @ts-expect-error the carousel model is a slide index
const badCarouselModel: PropsOf<typeof WCarousel> = { 'onUpdate:modelValue': (slide: string) => void slide };
const exportEvent: PropsOf<typeof WExportDropdown> = { onSelect: (value: string) => void value };
// @ts-expect-error select receives the format value, not the format object
const badExportEvent: PropsOf<typeof WExportDropdown> = { onSelect: (format: import('wakeb-components').ExportFormat) => void format };
const sidebarEvents: PropsOf<typeof WBaseSidebar> = { title: 'People', onSearch: (payload: unknown) => void payload, onFilterClick: () => undefined, onFilterCancel: () => undefined };
// @ts-expect-error the search payload is unknown and must be narrowed by the caller
const badSidebarSearch: PropsOf<typeof WBaseSidebar> = { title: 'People', onSearch: (payload: string) => void payload };
// @ts-expect-error filterClick has no payload
const badSidebarFilter: PropsOf<typeof WBaseSidebar> = { title: 'People', onFilterClick: (value: string) => void value };
const modalEvents: PropsOf<typeof WModal> = { 'onUpdate:modelValue': (open: boolean) => void open, onAfterLeave: () => undefined };
// @ts-expect-error the modal model is a boolean
const badModalModel: PropsOf<typeof WModal> = { 'onUpdate:modelValue': (open: number) => void open };
// @ts-expect-error afterLeave has no payload
const badModalLeave: PropsOf<typeof WModal> = { onAfterLeave: (event: Event) => void event };
const drawerEvents: PropsOf<typeof WDrawer> = { 'onUpdate:modelValue': (open: boolean) => void open, onClose: () => undefined };
// @ts-expect-error the drawer model is a boolean
const badDrawerModel: PropsOf<typeof WDrawer> = { 'onUpdate:modelValue': (open: string) => void open };
const emitted: import('wakeb-components').WakebComponentEmits['WTree']['node-click'] = [{ id: 1 }];
// @ts-expect-error event maps hold payload tuples
const badEmitted: import('wakeb-components').ButtonEmits['click'] = [new Event('click')];
void [accordionModel, badAccordionModel, badTabEvent, treeEvents, badTreeClick, badTreeToggle, dropdownEvents, badDropdownItem, badDropdownModel, carouselModel, badCarouselModel, exportEvent, badExportEvent, sidebarEvents, badSidebarSearch, badSidebarFilter, modalEvents, badModalModel, badModalLeave, drawerEvents, badDrawerModel, emitted, badEmitted];
// Slot payloads come from the facade instance type, without Vue's generic slot record.
type SlotsOf<C extends abstract new (...args: any) => any> = InstanceType<C>['$slots'] extends import('vue').Slots & infer Own ? Own : never;
type SlotPayload<C extends abstract new (...args: any) => any, K extends keyof SlotsOf<C>> = NonNullable<SlotsOf<C>[K]> extends (...args: infer A) => any ? A[0] : never;
const closeSlot: SlotPayload<typeof WModal, 'close-button'> = { close: () => undefined, label: 'Close' };
// @ts-expect-error the close-button label is a string
const badCloseSlot: SlotPayload<typeof WModal, 'close-button'> = { close: () => undefined, label: 1 };
const headerSlot: SlotPayload<typeof WAccordion, 'header'> = { open: true, toggle: () => undefined, triggerProps: { type: 'button', 'aria-expanded': true, 'aria-controls': 'panel', 'aria-label': 'Toggle', onClick: (event: MouseEvent) => event.stopPropagation() } };
// @ts-expect-error the accordion trigger is always a native button
const badHeaderSlot: SlotPayload<typeof WAccordion, 'header'> = { open: true, toggle: () => undefined, triggerProps: { type: 'submit', 'aria-expanded': true, 'aria-controls': 'panel', 'aria-label': 'Toggle', onClick: () => undefined } };
const toggleSlot: SlotPayload<typeof WTree, 'toggle-trailing'> = { node: { id: 1 }, level: 0, expanded: false, hasChildren: true, toggle: () => undefined };
// @ts-expect-error tree levels are numbers
const badToggleSlot: SlotPayload<typeof WTree, 'toggle-trailing'> = { node: { id: 1 }, level: '0', expanded: false, hasChildren: true, toggle: () => undefined };
const buttonIconSlot: SlotPayload<typeof WButton, 'icon'> = { icon: '$expand', size: 20, color: 'currentColor', maxWidth: '100%' };
const tabLabelSlot: SlotPayload<typeof WTabs, 'tab-label'> = { tabItem: { slot: 'one', label: 'One' }, index: 0 };
const exportLabelSlot: SlotPayload<typeof WExportDropdown, 'format-label'> = { format: { label: 'CSV', value: 'csv' }, index: 0 };
const neutralSlots: import('wakeb-components').ModalSlots = {} as SlotsOf<typeof WModal>;
// @ts-expect-error WButton has no activator slot
const missingSlot: SlotPayload<typeof WButton, 'activator'> = {};
void [closeSlot, badCloseSlot, headerSlot, badHeaderSlot, toggleSlot, badToggleSlot, buttonIconSlot, tabLabelSlot, exportLabelSlot, neutralSlots, missingSlot];

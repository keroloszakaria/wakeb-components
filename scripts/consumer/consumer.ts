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
// Portable intents and color props (SPEC R23): intents and CSS colors only, never provider names.
const colors: import('wakeb-components').WakebColor[] = ['primary', 'neutral', '#0a7', 'rgb(0 0 0)', 'var(--brand, #000)', 'transparent'];
const loading: import('wakeb-components').LoadingProps = { color: 'danger' };
// @ts-expect-error Vuetify theme names are not portable colors
const badLoading: import('wakeb-components').LoadingProps = { color: 'error' };
// @ts-expect-error Vuetify palette names are not portable colors
const badAvatar: AvatarStackProps = { avatarColor: 'red-darken-2' };
// @ts-expect-error badge types are Wakeb style keys, not provider colors
const badBadge: BadgeProps = { type: 'teal' };
const intentTheme = createWakebComponents({ framework: 'vuetify', theme: { tokens: { success: '#12b76a', neutral: 'var(--gray)' } } });
void [colors, loading, badLoading, badAvatar, badBadge, intentTheme];
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

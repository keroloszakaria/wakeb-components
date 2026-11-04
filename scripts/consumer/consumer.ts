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

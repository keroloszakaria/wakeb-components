import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.env.npm_execpath;
assert(npm, "Use npm run check:package");
mkdirSync(join(root, ".audit"), { recursive: true });
const fixture = mkdtempSync(join(root, ".audit/consumer-"));
const run = (args, cwd = root) => execFileSync(process.execPath, args, { cwd, encoding: "utf8", windowsHide: true, timeout: 180000 });
const output = run([npm, "pack", "--json", "--ignore-scripts", "--pack-destination", fixture]);
const [packed] = JSON.parse(output.slice(output.indexOf("[")));
for (const path of ["dist/index.js", "dist/index.d.ts", "dist/wakeb-components.css", "LICENSE", "README.md"]) assert(packed.files.some(file => file.path === path), path);
assert(!packed.files.some(file => /(^|\/)(node_modules|tests|\.env)(\/|$)/.test(file.path)));
writeFileSync(join(fixture, "package.json"), JSON.stringify({ private: true, type: "module", dependencies: { "wakeb-components": join(fixture, packed.filename), vue: "^3.5.0", vuetify: "3.13.2", "@vue/server-renderer": "^3.5.0" } }));
console.log(run([npm, "install", "--ignore-scripts", "--no-fund", "--no-audit", "--prefer-offline", ...(process.env.WAKEB_CHECK_OFFLINE ? ["--offline"] : [])], fixture));
writeFileSync(join(fixture, "consumer.ts"), `import { WTruncatedText, WSegmentedProgress, WSemiCircleGauge, WAvatarStack, WLoading, WPageSkeleton, WVerticalSteps, WButton, WBadge, WAccordion, WBadgeStack, WUserBadge, WTooltipBtn, WTabs, WTree, WDropdown, type ButtonProps, type BadgeProps, type AccordionProps, type AvatarStackProps, type SkeletonRow, type VerticalStep, type TruncatedTextProps, type SemiCircleGaugeProps } from 'wakeb-components';
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
void [button, badge, accordion, clickProps, badAction, badClick, WButton, WBadge, WAccordion, WBadgeStack, WUserBadge, WTooltipBtn, WTabs, WTree, WDropdown, text, gauge, bad, avatars, skeleton, step, badDirection, WTruncatedText, WSegmentedProgress, WSemiCircleGauge, WAvatarStack, WLoading, WPageSkeleton, WVerticalSteps];`);
run([join(root, "node_modules/typescript/bin/tsc"), "--noEmit", "--strict", "--skipLibCheck", "--target", "ES2022", "--module", "ESNext", "--moduleResolution", "Bundler", "consumer.ts"], fixture);
const components = `h(WTabs, {tabs:[{slot:'one',label:'Overview',content:'Public tab panel'}]}), h(WTree, {nodes:[{id:1,name:'Root navigation'}]}), h(WDropdown, {title:'Actions',menuItems:[{label:'Download',value:0}]}), h(WBadgeStack, { items: [{ label: 'Owner' }, { label: 'Member' }] }), h(WUserBadge, { user: { name: 'Grace Hopper' } }), h(WTooltipBtn, { text: 'Open settings' }), h(WTruncatedText, { label: 'Public package consumer' }), h(WSegmentedProgress, { value: 60, label: 'Ready' }), h(WSemiCircleGauge, { value: 75, label: '75' }), h(WAvatarStack, { items: [{ name: 'Ada' }], showTooltip: false }), h(WLoading, { label: 'Loading report' }), h(WPageSkeleton, { config: [{ items: [{ type: 'text' }] }] }), h(WVerticalSteps, { steps: [{ title: 'Review' }] }), h(WButton, { title: 'Save', action: 'submit' }), h(WBadge, { label: 'Approved', type: 'success', isDot: true }), h(WAccordion, { title: 'Details', modelValue: true }, () => h('input', { value: 'Draft' }))`;
writeFileSync(join(fixture, "index.html"), '<div id="app"></div><script type="module" src="/browser.js"></script>');
writeFileSync(join(fixture, "browser.js"), `import { createApp, h } from 'vue'; import { createVuetify } from 'vuetify'; import 'vuetify/styles'; import { WTruncatedText, WSegmentedProgress, WSemiCircleGauge, WAvatarStack, WLoading, WPageSkeleton, WVerticalSteps, WButton, WBadge, WAccordion, WBadgeStack, WUserBadge, WTooltipBtn, WTabs, WTree, WDropdown } from 'wakeb-components'; import 'wakeb-components/style.css'; createApp({ render: () => h('main', [${components}]) }).use(createVuetify()).mount('#app');`);
await build({ root: fixture, configFile: false, logLevel: "warn", build: { outDir: "browser-dist" } });
writeFileSync(join(fixture, "server.js"), `import { createSSRApp, h } from 'vue'; import { renderToString } from '@vue/server-renderer'; import { createVuetify } from 'vuetify'; import { WTruncatedText, WSegmentedProgress, WSemiCircleGauge, WAvatarStack, WLoading, WPageSkeleton, WVerticalSteps, WButton, WBadge, WAccordion, WBadgeStack, WUserBadge, WTooltipBtn, WTabs, WTree, WDropdown } from 'wakeb-components'; export async function render() { return renderToString(createSSRApp({ render: () => h('main', [${components}]) }).use(createVuetify({ ssr: true }))); }`);
await build({ root: fixture, configFile: false, logLevel: "warn", ssr: { noExternal: ["wakeb-components", "vuetify"] }, build: { ssr: join(fixture, "server.js"), outDir: "ssr-dist" } });
const { render } = await import(pathToFileURL(join(fixture, "ssr-dist/server.js")).href);
const html = await render();
assert(html.includes('role="progressbar"')); assert(html.includes('aria-label="75%"')); assert(!/NaN|Infinity/.test(html)); assert(html.includes('Loading report')); assert(html.includes('Ada')); assert(html.includes('Review')); assert(html.includes('skeleton-block')); assert(html.includes('Approved')); assert(html.includes('Save')); assert(html.includes('wakeb-accordion-')); assert(html.includes('Draft')); assert(html.includes('Owner')); assert(html.includes('Grace Hopper')); assert(html.includes('Open settings')); assert(html.includes('Public tab panel')); assert(html.includes('Root navigation')); assert(html.includes('Actions'));
console.log("Packed package passed: typed consumer, real browser bundle, Vuetify and server rendering.");
console.log(`Consumer fixture: ${fixture}`);

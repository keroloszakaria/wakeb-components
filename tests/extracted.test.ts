import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createSSRApp, h, nextTick } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createVuetify } from "vuetify";
import { WAvatarStack, WLoading, WPageSkeleton, WVerticalSteps } from "../src";
const wrappers: VueWrapper[] = [];
function render(component: any, options: any = {}) {
  const wrapper = mount(component, { attachTo: document.body, global: { plugins: [createVuetify()] }, ...options });
  wrappers.push(wrapper); return wrapper;
}
afterEach(() => { for (const w of wrappers.splice(0)) w.unmount(); document.body.innerHTML = ""; });
describe("WAvatarStack", () => {
  const items = [{ id: 1, profile: { name: "Ada Lovelace" } }, { id: 2, profile: { name: "آدم محمد" } }, { id: 3 }, { id: 4, profile: { name: "Grace Hopper" } }];
  it("reads nested fields, limits visible users and reacts when the list changes", async () => {
    const w = render(WAvatarStack, { props: { items, max: 2, nameKey: "profile.name", showTooltip: false } });
    expect(w.findAll('[role="img"]').map(x => x.attributes('aria-label'))).toEqual(["Ada Lovelace", "آدم محمد", "+2"]);
    expect(w.text()).toContain("AL"); expect(w.text()).toContain("آم");
    expect(w.find('[tabindex="0"]').exists()).toBe(false);
    await w.setProps({ max: 4 }); expect(w.find('.actor-overflow').exists()).toBe(false); expect(w.text()).toContain("?");
    await w.setProps({ items: [] }); expect(w.find('.actor-avatar').exists()).toBe(false);
  });
  it.each([[-1, 4], [0, 4], [1.8, 3], [Number.NaN, 1]])("normalizes max=%s without losing overflow users", (max, overflow) => {
    const w = render(WAvatarStack, { props: { items, max, nameKey: "profile.name" } });
    expect(w.get('.actor-overflow').text()).toBe(`+${overflow}`);
  });
  it("opens the real overflow menu from a keyboard-accessible button with local overlay styling", async () => {
    const w = render(WAvatarStack, { props: { items, max: 1, nameKey: "profile.name", showOverflowMenu: true, overflowLabel: "More people", unknownLabel: "بدون اسم", menuStyle: { '--wakeb-avatar-menu-text': '#112233' } } });
    const button = w.get('button[aria-label="More people"]');
    expect(button.attributes('type')).toBe('button');
    (button.element as HTMLElement).focus();
    await button.trigger('click'); await nextTick();
    await vi.waitFor(() => expect(document.querySelector('.overflow-menu-list')?.textContent).toContain('Grace Hopper'));
    expect(document.querySelector('.overflow-menu-list')?.textContent).toContain('بدون اسم');
    expect(document.querySelector('.overflow-menu-list')?.getAttribute('style')).toContain('--wakeb-avatar-menu-text: #112233');
  });
  it("provides slots and safe fallback labels for malformed rows", () => {
    const w = render(WAvatarStack, { props: { items: [null, { name: 12 }, { name: "😊 Team" }], max: 2 }, slots: { avatar: ({ label, initials }: any) => h('b', `${label}:${initials}`), overflow: ({ count }: any) => h('i', `${count} hidden`) } });
    expect(w.findAll('b').map(x => x.text())).toEqual(['Unknown user:?', 'Unknown user:?']); expect(w.get('i').text()).toBe('1 hidden');
  });
});
describe("WPageSkeleton", () => {
  it("renders responsive row descriptors, headers and repeated cards without Tailwind", async () => {
    const w = render(WPageSkeleton, { props: { label: 'Loading report', direction: 'row', config: [{ repeat: 2, cols: 6, md: 3, variant: 'card', header: [{ type: 'text', width: 120 }], items: [{ type: 'chip', height: 20 }] }] } });
    expect(w.attributes('aria-label')).toBe('Loading report'); expect(w.attributes('aria-busy')).toBe('true');
    expect(w.element.style.flexDirection).toBe('row'); expect(w.findAll('.v-col-6')).toHaveLength(2); expect(w.get('.v-row').attributes('aria-hidden')).toBe('true'); expect(w.findAll('.v-col-md-3')).toHaveLength(2);
    expect(w.findAll('.skeleton-block--card')).toHaveLength(2); expect(w.findAll('.skeleton-block__header')).toHaveLength(2);
    await w.setProps({ config: [], direction: 'column' }); expect(w.findAll('.v-row')).toHaveLength(0); expect(w.element.style.flexDirection).toBe('column');
  });
  it("handles invalid repeats and forwards consumer attributes", () => {
    const w = render(WPageSkeleton, { props: { config: [{ repeat: -8, items: [] }, { repeat: Number.NaN }, { repeat: 2.8 }] }, attrs: { 'data-owner': 'company', class: 'consumer' } });
    expect(w.findAll('.v-col')).toHaveLength(4); expect(w.attributes('data-owner')).toBe('company'); expect(w.classes()).toContain('consumer');
  });
});
describe("WLoading", () => {
  it("uses a translatable status label and keeps the spinner decorative", async () => {
    const w = render(WLoading, { props: { label: 'جار التحميل', size: 64, color: '#123456' } });
    expect(w.attributes('role')).toBe('status'); expect(w.attributes('aria-label')).toBe('جار التحميل');
    expect(w.get('.v-progress-circular').attributes('aria-hidden')).toBe('true');
    expect(w.get('.v-progress-circular').attributes('style')).toContain('64px');
    await w.setProps({ label: 'Ready' }); expect(w.attributes('aria-label')).toBe('Ready');
  });
  it("allows replacing the visual spinner through the default slot", () => {
    const w = render(WLoading, { slots: { default: () => h('strong', 'Working') } });
    expect(w.find('.v-progress-circular').exists()).toBe(false); expect(w.get('strong').text()).toBe('Working');
  });
});
describe("WVerticalSteps", () => {
  it("renders empty and active steps with a readable list and escaped labels", async () => {
    const w = render(WVerticalSteps, { props: { steps: [{ title: '<b>Review</b>', is_active: true }, { title: 'Ship', time: '09:00', date: '2026-10-28' }], label: 'Release steps' } });
    expect(w.attributes('role')).toBe('list'); expect(w.findAll('[role="listitem"]')).toHaveLength(2);
    expect(w.get('h2').text()).toBe('<b>Review</b>'); expect(w.find('h2 b').exists()).toBe(false); expect(w.findAll('.icon')[1].text()).toBe('02');
    expect(w.findAll('.icon')[0].classes()).toContain('active'); await w.setProps({ steps: [] }); expect(w.find('[role="listitem"]').exists()).toBe(false);
  });
  it("keeps company icons in consumer slots, including SSR", async () => {
    const view = () => h(WVerticalSteps, { steps: [{ title: 'Review', is_active: true }] }, { indicator: ({ index }: any) => h('b', { class: 'icon active' }, `icon-${index}`), timeIcon: () => h('i', 'clock') });
    const html = await renderToString(createSSRApp({ render: view })); expect(html).toContain('icon-0'); expect(html).toContain('clock'); expect(html).not.toContain('resolve component');
  });
});

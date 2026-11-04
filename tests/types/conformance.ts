/*
 * Renderer conformance (SPEC R01, R12, R14), checked by `npm run typecheck` (vue-tsc). Every provider
 * renderer must declare exactly the props, event payloads and slot payloads of its neutral contract in
 * src/contracts.ts, so a renderer cannot drift from the public facade type. tests/contracts.test.ts
 * asserts that every renderer file is listed here.
 */
import type { ButtonEmits, ButtonSlots, WakebComponent, WakebFacade } from "../../src/contracts";
import type { ButtonProps } from "../../src/types";
import type { Slots } from "vue";
import type { WakebComponentName } from "../../src/core/options";
import type VuetifyWTruncatedText from "../../src/components/WTruncatedText.vue";
import type VuetifyWSegmentedProgress from "../../src/components/WSegmentedProgress.vue";
import type VuetifyWSemiCircleGauge from "../../src/components/WSemiCircleGauge.vue";
import type VuetifyWAvatarStack from "../../src/components/WAvatarStack.vue";
import type VuetifyWLoading from "../../src/components/WLoading.vue";
import type VuetifyWPageSkeleton from "../../src/components/WPageSkeleton.vue";
import type VuetifyWVerticalSteps from "../../src/components/WVerticalSteps.vue";
import type VuetifyWButton from "../../src/components/WButton.vue";
import type VuetifyWBadge from "../../src/components/WBadge.vue";
import type VuetifyWAccordion from "../../src/components/WAccordion.vue";
import type VuetifyWBadgeStack from "../../src/components/WBadgeStack.vue";
import type VuetifyWUserBadge from "../../src/components/WUserBadge.vue";
import type VuetifyWTooltipBtn from "../../src/components/WTooltipBtn.vue";
import type VuetifyWTabs from "../../src/components/WTabs.vue";
import type VuetifyWTree from "../../src/components/WTree.vue";
import type VuetifyWDropdown from "../../src/components/WDropdown.vue";
import type VuetifyWCarousel from "../../src/components/WCarousel.vue";
import type VuetifyWExportDropdown from "../../src/components/WExportDropdown.vue";
import type VuetifyWBaseSidebar from "../../src/components/WBaseSidebar.vue";
import type VuetifyWModal from "../../src/components/WModal.vue";
import type VuetifyWDrawer from "../../src/components/WDrawer.vue";
import type PrimeVueWButton from "../../src/adapters/primevue/WButton.vue";
import type PrimeVueWDropdown from "../../src/adapters/primevue/WDropdown.vue";
import type PrimeVueWLoading from "../../src/adapters/primevue/WLoading.vue";
import type PrimeVueWModal from "../../src/adapters/primevue/WModal.vue";
import type PrimeVueWPageSkeleton from "../../src/adapters/primevue/WPageSkeleton.vue";
import type PrimeVueWSegmentedProgress from "../../src/adapters/primevue/WSegmentedProgress.vue";
import type PrimeVueWSemiCircleGauge from "../../src/adapters/primevue/WSemiCircleGauge.vue";
import type PrimeVueWVerticalSteps from "../../src/adapters/primevue/WVerticalSteps.vue";
import type PrimeVueWTabs from "../../src/adapters/primevue/WTabs.vue";
import type PrimeVueWTree from "../../src/adapters/primevue/WTree.vue";
import type PrimeVueWCarousel from "../../src/adapters/primevue/WCarousel.vue";
import type PrimeVueWExportDropdown from "../../src/adapters/primevue/WExportDropdown.vue";
import type PrimeVueWBaseSidebar from "../../src/adapters/primevue/WBaseSidebar.vue";
import type PrimeVueWDrawer from "../../src/adapters/primevue/WDrawer.vue";
import type PrimeVueWAvatarStack from "../../src/adapters/primevue/WAvatarStack.vue";
import type PrimeVueWBadgeStack from "../../src/adapters/primevue/WBadgeStack.vue";
import type PrimeVueWAccordion from "../../src/adapters/primevue/WAccordion.vue";

type Instance<T> = T extends abstract new (...args: any) => infer I ? I : never;
type PropsOf<T> = Instance<T> extends { $props: infer P } ? P : never;
/** The declared slots, without Vue's generic `Slots` record that every instance type intersects. */
type SlotsOf<T> = Instance<T> extends { $slots: infer S } ? (S extends Slots & infer Own ? (unknown extends Own ? {} : Own) : S) : never;
type Mutual<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type Every<T> = [T] extends [true] ? true : false;
type Known<K> = string extends K ? never : number extends K ? never : symbol extends K ? never : K;
type KnownKeys<T> = keyof { [K in keyof T as Known<K>]: 0 };
type OptionalKeys<T> = keyof { [K in keyof T as Known<K> extends never ? never : {} extends Pick<T, K> ? K : never]: 0 };
type Values<A, B, V> = { [K in keyof A as Known<K>]-?: K extends keyof B ? Compare<A[K], B[K], V> : false };
/** Same keys (named and index signatures), same optionality, and each value compared both ways. */
type SameShape<A, B, V extends "value" | "payload"> = Every<
  | Mutual<keyof A, keyof B>
  | Mutual<KnownKeys<A>, KnownKeys<B>>
  | Mutual<OptionalKeys<A>, OptionalKeys<B>>
  | Values<A, B, V>[keyof Values<A, B, V>]
  | (string extends keyof A ? (string extends keyof B ? Compare<A[string], B[string & keyof B], V> : false) : true)
>;
/** A slot without a parameter has the empty payload `{}`. */
type Payload<F> = NonNullable<F> extends (...args: infer A) => any ? (A extends [] ? {} : A[0]) : never;
type Compare<A, B, V> = V extends "payload" ? Mutual<Payload<A>, Payload<B>> : Mutual<A, B>;
/** `props` covers props and the `on*` handlers generated from emits, so it also checks event payloads. */
type Conformance<R, C extends WakebComponentName> = {
  props: SameShape<PropsOf<R>, PropsOf<WakebComponent<C>>, "value">;
  slots: SameShape<SlotsOf<R>, SlotsOf<WakebComponent<C>>, "payload">;
};
type Conforming<Renderers> = { [C in keyof Renderers]: { props: true; slots: true } };
type Check<Renderers> = { [C in keyof Renderers]: C extends WakebComponentName ? Conformance<Renderers[C], C> : never };

interface Vuetify {
  WTruncatedText: typeof VuetifyWTruncatedText;
  WSegmentedProgress: typeof VuetifyWSegmentedProgress;
  WSemiCircleGauge: typeof VuetifyWSemiCircleGauge;
  WAvatarStack: typeof VuetifyWAvatarStack;
  WLoading: typeof VuetifyWLoading;
  WPageSkeleton: typeof VuetifyWPageSkeleton;
  WVerticalSteps: typeof VuetifyWVerticalSteps;
  WButton: typeof VuetifyWButton;
  WBadge: typeof VuetifyWBadge;
  WAccordion: typeof VuetifyWAccordion;
  WBadgeStack: typeof VuetifyWBadgeStack;
  WUserBadge: typeof VuetifyWUserBadge;
  WTooltipBtn: typeof VuetifyWTooltipBtn;
  WTabs: typeof VuetifyWTabs;
  WTree: typeof VuetifyWTree;
  WDropdown: typeof VuetifyWDropdown;
  WCarousel: typeof VuetifyWCarousel;
  WExportDropdown: typeof VuetifyWExportDropdown;
  WBaseSidebar: typeof VuetifyWBaseSidebar;
  WModal: typeof VuetifyWModal;
  WDrawer: typeof VuetifyWDrawer;
}
interface PrimeVue {
  WButton: typeof PrimeVueWButton;
  WDropdown: typeof PrimeVueWDropdown;
  WLoading: typeof PrimeVueWLoading;
  WModal: typeof PrimeVueWModal;
  WPageSkeleton: typeof PrimeVueWPageSkeleton;
  WSegmentedProgress: typeof PrimeVueWSegmentedProgress;
  WSemiCircleGauge: typeof PrimeVueWSemiCircleGauge;
  WVerticalSteps: typeof PrimeVueWVerticalSteps;
  WTabs: typeof PrimeVueWTabs;
  WTree: typeof PrimeVueWTree;
  WCarousel: typeof PrimeVueWCarousel;
  WExportDropdown: typeof PrimeVueWExportDropdown;
  WBaseSidebar: typeof PrimeVueWBaseSidebar;
  WDrawer: typeof PrimeVueWDrawer;
  WAvatarStack: typeof PrimeVueWAvatarStack;
  WBadgeStack: typeof PrimeVueWBadgeStack;
  WAccordion: typeof PrimeVueWAccordion;
}

/** The Vuetify renderer set is complete: every public component has one. */
export const vuetify: Conforming<Record<WakebComponentName, unknown>> = null as unknown as Check<Vuetify>;
export const primevue: Conforming<PrimeVue> = null as unknown as Check<PrimeVue>;

/* The checks themselves must reject drift. */
type Fake<E, S> = WakebFacade<ButtonProps, E, S>;
type Drift<R> = Conformance<R, "WButton">;
type OptionalSlots = { [K in keyof ButtonSlots]?: ButtonSlots[K] };
export const drift: {
  matches: { props: true; slots: true };
  otherComponent: { props: false; slots: false };
  wrongPayload: { props: false; slots: true };
  extraEvent: { props: false; slots: true };
  missingEvent: { props: false; slots: true };
  wrongSlotPayload: { props: true; slots: false };
  optionalSlots: { props: true; slots: false };
  missingSlot: { props: true; slots: false };
  extraProp: { props: false; slots: true };
} = null as unknown as {
  matches: Drift<Fake<ButtonEmits, ButtonSlots>>;
  otherComponent: Conformance<WakebComponent<"WButton">, "WModal">;
  wrongPayload: Drift<Fake<{ click: [event: Event] }, ButtonSlots>>;
  extraEvent: Drift<Fake<ButtonEmits & { close: [] }, ButtonSlots>>;
  missingEvent: Drift<Fake<{}, ButtonSlots>>;
  wrongSlotPayload: Drift<Fake<ButtonEmits, Omit<ButtonSlots, "icon"> & { icon(props: { icon: string }): unknown }>>;
  optionalSlots: Drift<Fake<ButtonEmits, OptionalSlots>>;
  missingSlot: Drift<Fake<ButtonEmits, Omit<ButtonSlots, "dropdown">>>;
  extraProp: Drift<WakebFacade<ButtonProps & { extra?: string }, ButtonEmits, ButtonSlots>>;
};

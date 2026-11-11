/*
 * Renderer conformance (SPEC R01, R12, R14), checked by `npm run typecheck` (vue-tsc). Every provider
 * renderer must declare exactly the props, event payloads and slot payloads of its neutral contract in
 * src/contracts.ts, so a renderer cannot drift from the public facade type. tests/contracts.test.ts
 * asserts that every renderer file is listed here.
 */
import type { ButtonEmits, ButtonSlots, WakebComponent, WakebRendererContract, WakebComponentEmits, WakebComponentSlots } from "../../src/contracts";
import type { ButtonProps } from "../../src/types";
import type { Slots } from "vue";
import type { WakebComponentName, WakebComponentProps } from "../../src/core/options";
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
import type VuetifyWTextField from "../../src/components/WTextField.vue";
import type VuetifyWPopover from "../../src/components/WPopover.vue";
import type VuetifyWSwitch from "../../src/components/WSwitch.vue";
import type VuetifyWCheckbox from "../../src/components/WCheckbox.vue";
import type VuetifyWSkeleton from "../../src/components/WSkeleton.vue";
import type VuetifyWRow from "../../src/components/WRow.vue";
import type VuetifyWCol from "../../src/components/WCol.vue";
import type VuetifyWProgressLinear from "../../src/components/WProgressLinear.vue";
import type VuetifyWTextarea from "../../src/components/WTextarea.vue";
import type VuetifyWButtonToggle from "../../src/components/WButtonToggle.vue";
import type VuetifyWCard from "../../src/components/WCard.vue";
import type VuetifyWDivider from "../../src/components/WDivider.vue";
import type VuetifyWList from "../../src/components/WList.vue";
import type VuetifyWIcon from "../../src/components/WIcon.vue";
import type VuetifyWImage from "../../src/components/WImage.vue";
import type VuetifyWAvatar from "../../src/components/WAvatar.vue";
import type VuetifyWCountBadge from "../../src/components/WCountBadge.vue";
import type VuetifyWDataTable from "../../src/components/WDataTable.vue";
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
import type PrimeVueWTruncatedText from "../../src/adapters/primevue/WTruncatedText.vue";
import type PrimeVueWTooltipBtn from "../../src/adapters/primevue/WTooltipBtn.vue";
import type PrimeVueWBadge from "../../src/adapters/primevue/WBadge.vue";
import type PrimeVueWUserBadge from "../../src/adapters/primevue/WUserBadge.vue";
import type PrimeVueWTextField from "../../src/adapters/primevue/WTextField.vue";
import type PrimeVueWPopover from "../../src/adapters/primevue/WPopover.vue";
import type PrimeVueWSwitch from "../../src/adapters/primevue/WSwitch.vue";
import type PrimeVueWCheckbox from "../../src/adapters/primevue/WCheckbox.vue";
import type PrimeVueWSkeleton from "../../src/adapters/primevue/WSkeleton.vue";
import type PrimeVueWRow from "../../src/adapters/primevue/WRow.vue";
import type PrimeVueWCol from "../../src/adapters/primevue/WCol.vue";
import type PrimeVueWProgressLinear from "../../src/adapters/primevue/WProgressLinear.vue";
import type PrimeVueWTextarea from "../../src/adapters/primevue/WTextarea.vue";
import type PrimeVueWButtonToggle from "../../src/adapters/primevue/WButtonToggle.vue";
import type PrimeVueWCard from "../../src/adapters/primevue/WCard.vue";
import type PrimeVueWDivider from "../../src/adapters/primevue/WDivider.vue";
import type PrimeVueWList from "../../src/adapters/primevue/WList.vue";
import type PrimeVueWIcon from "../../src/adapters/primevue/WIcon.vue";
import type PrimeVueWImage from "../../src/adapters/primevue/WImage.vue";
import type PrimeVueWAvatar from "../../src/adapters/primevue/WAvatar.vue";
import type PrimeVueWCountBadge from "../../src/adapters/primevue/WCountBadge.vue";
import type PrimeVueWDataTable from "../../src/adapters/primevue/WDataTable.vue";
import type ShadcnWButton from "../../src/adapters/shadcn/WButton.vue";
import type ShadcnWDropdown from "../../src/adapters/shadcn/WDropdown.vue";
import type ShadcnWLoading from "../../src/adapters/shadcn/WLoading.vue";
import type ShadcnWModal from "../../src/adapters/shadcn/WModal.vue";
import type ShadcnWTabs from "../../src/adapters/shadcn/WTabs.vue";
import type ShadcnWTree from "../../src/adapters/shadcn/WTree.vue";
import type ShadcnWCarousel from "../../src/adapters/shadcn/WCarousel.vue";
import type ShadcnWSegmentedProgress from "../../src/adapters/shadcn/WSegmentedProgress.vue";
import type ShadcnWSemiCircleGauge from "../../src/adapters/shadcn/WSemiCircleGauge.vue";
import type ShadcnWVerticalSteps from "../../src/adapters/shadcn/WVerticalSteps.vue";
import type ShadcnWPageSkeleton from "../../src/adapters/shadcn/WPageSkeleton.vue";
import type ShadcnWAccordion from "../../src/adapters/shadcn/WAccordion.vue";
import type ShadcnWExportDropdown from "../../src/adapters/shadcn/WExportDropdown.vue";
import type ShadcnWBaseSidebar from "../../src/adapters/shadcn/WBaseSidebar.vue";
import type ShadcnWDrawer from "../../src/adapters/shadcn/WDrawer.vue";
import type ShadcnWTruncatedText from "../../src/adapters/shadcn/WTruncatedText.vue";
import type ShadcnWTooltipBtn from "../../src/adapters/shadcn/WTooltipBtn.vue";
import type ShadcnWBadge from "../../src/adapters/shadcn/WBadge.vue";
import type ShadcnWUserBadge from "../../src/adapters/shadcn/WUserBadge.vue";
import type ShadcnWAvatarStack from "../../src/adapters/shadcn/WAvatarStack.vue";
import type ShadcnWBadgeStack from "../../src/adapters/shadcn/WBadgeStack.vue";
import type ShadcnWTextField from "../../src/adapters/shadcn/WTextField.vue";
import type ShadcnWPopover from "../../src/adapters/shadcn/WPopover.vue";
import type ShadcnWSwitch from "../../src/adapters/shadcn/WSwitch.vue";
import type ShadcnWCheckbox from "../../src/adapters/shadcn/WCheckbox.vue";
import type ShadcnWSkeleton from "../../src/adapters/shadcn/WSkeleton.vue";
import type ShadcnWRow from "../../src/adapters/shadcn/WRow.vue";
import type ShadcnWCol from "../../src/adapters/shadcn/WCol.vue";
import type ShadcnWProgressLinear from "../../src/adapters/shadcn/WProgressLinear.vue";
import type ShadcnWTextarea from "../../src/adapters/shadcn/WTextarea.vue";
import type ShadcnWButtonToggle from "../../src/adapters/shadcn/WButtonToggle.vue";
import type ShadcnWCard from "../../src/adapters/shadcn/WCard.vue";
import type ShadcnWDivider from "../../src/adapters/shadcn/WDivider.vue";
import type ShadcnWList from "../../src/adapters/shadcn/WList.vue";
import type ShadcnWIcon from "../../src/adapters/shadcn/WIcon.vue";
import type ShadcnWImage from "../../src/adapters/shadcn/WImage.vue";
import type ShadcnWAvatar from "../../src/adapters/shadcn/WAvatar.vue";
import type ShadcnWCountBadge from "../../src/adapters/shadcn/WCountBadge.vue";
import type ShadcnWDataTable from "../../src/adapters/shadcn/WDataTable.vue";

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
  props: SameShape<PropsOf<R>, PropsOf<WakebRendererContract<WakebComponentProps[C], WakebComponentEmits[C], WakebComponentSlots[C]>>, "value">;
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
  WTextField: typeof VuetifyWTextField;
  WPopover: typeof VuetifyWPopover;
  WSwitch: typeof VuetifyWSwitch;
  WCheckbox: typeof VuetifyWCheckbox;
  WSkeleton: typeof VuetifyWSkeleton;
  WRow: typeof VuetifyWRow;
  WCol: typeof VuetifyWCol;
  WProgressLinear: typeof VuetifyWProgressLinear;
  WTextarea: typeof VuetifyWTextarea;
  WButtonToggle: typeof VuetifyWButtonToggle;
  WCard: typeof VuetifyWCard;
  WDivider: typeof VuetifyWDivider;
  WList: typeof VuetifyWList;
  WIcon: typeof VuetifyWIcon;
  WImage: typeof VuetifyWImage;
  WAvatar: typeof VuetifyWAvatar;
  WCountBadge: typeof VuetifyWCountBadge;
  WDataTable: typeof VuetifyWDataTable;
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
  WTruncatedText: typeof PrimeVueWTruncatedText;
  WTooltipBtn: typeof PrimeVueWTooltipBtn;
  WBadge: typeof PrimeVueWBadge;
  WUserBadge: typeof PrimeVueWUserBadge;
  WTextField: typeof PrimeVueWTextField;
  WPopover: typeof PrimeVueWPopover;
  WSwitch: typeof PrimeVueWSwitch;
  WCheckbox: typeof PrimeVueWCheckbox;
  WSkeleton: typeof PrimeVueWSkeleton;
  WRow: typeof PrimeVueWRow;
  WCol: typeof PrimeVueWCol;
  WProgressLinear: typeof PrimeVueWProgressLinear;
  WTextarea: typeof PrimeVueWTextarea;
  WButtonToggle: typeof PrimeVueWButtonToggle;
  WCard: typeof PrimeVueWCard;
  WDivider: typeof PrimeVueWDivider;
  WList: typeof PrimeVueWList;
  WIcon: typeof PrimeVueWIcon;
  WImage: typeof PrimeVueWImage;
  WAvatar: typeof PrimeVueWAvatar;
  WCountBadge: typeof PrimeVueWCountBadge;
  WDataTable: typeof PrimeVueWDataTable;
}
interface Shadcn {
  WButton: typeof ShadcnWButton;
  WDropdown: typeof ShadcnWDropdown;
  WLoading: typeof ShadcnWLoading;
  WModal: typeof ShadcnWModal;
  WTabs: typeof ShadcnWTabs;
  WTree: typeof ShadcnWTree;
  WCarousel: typeof ShadcnWCarousel;
  WSegmentedProgress: typeof ShadcnWSegmentedProgress;
  WSemiCircleGauge: typeof ShadcnWSemiCircleGauge;
  WVerticalSteps: typeof ShadcnWVerticalSteps;
  WPageSkeleton: typeof ShadcnWPageSkeleton;
  WAccordion: typeof ShadcnWAccordion;
  WExportDropdown: typeof ShadcnWExportDropdown;
  WBaseSidebar: typeof ShadcnWBaseSidebar;
  WDrawer: typeof ShadcnWDrawer;
  WTruncatedText: typeof ShadcnWTruncatedText;
  WTooltipBtn: typeof ShadcnWTooltipBtn;
  WBadge: typeof ShadcnWBadge;
  WUserBadge: typeof ShadcnWUserBadge;
  WAvatarStack: typeof ShadcnWAvatarStack;
  WBadgeStack: typeof ShadcnWBadgeStack;
  WTextField: typeof ShadcnWTextField;
  WPopover: typeof ShadcnWPopover;
  WSwitch: typeof ShadcnWSwitch;
  WCheckbox: typeof ShadcnWCheckbox;
  WSkeleton: typeof ShadcnWSkeleton;
  WRow: typeof ShadcnWRow;
  WCol: typeof ShadcnWCol;
  WProgressLinear: typeof ShadcnWProgressLinear;
  WTextarea: typeof ShadcnWTextarea;
  WButtonToggle: typeof ShadcnWButtonToggle;
  WCard: typeof ShadcnWCard;
  WDivider: typeof ShadcnWDivider;
  WList: typeof ShadcnWList;
  WIcon: typeof ShadcnWIcon;
  WImage: typeof ShadcnWImage;
  WAvatar: typeof ShadcnWAvatar;
  WCountBadge: typeof ShadcnWCountBadge;
  WDataTable: typeof ShadcnWDataTable;
}

/** The Vuetify renderer set is complete: every public component has one. */
export const vuetify: Conforming<Record<WakebComponentName, unknown>> = null as unknown as Check<Vuetify>;
export const primevue: Conforming<PrimeVue> = null as unknown as Check<PrimeVue>;
export const shadcn: Conforming<Shadcn> = null as unknown as Check<Shadcn>;

/* The checks themselves must reject drift. */
type Fake<E, S> = WakebRendererContract<ButtonProps, E, S>;
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
  extraProp: Drift<WakebRendererContract<ButtonProps & { extra?: string }, ButtonEmits, ButtonSlots>>;
};

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useData } from "vitepress";
import { VLocaleProvider } from "vuetify/components/VLocaleProvider";
import { WTruncatedText, WSegmentedProgress, WSemiCircleGauge, WAvatarStack, WLoading, WPageSkeleton, WVerticalSteps } from "../../../src";
const props = withDefaults(defineProps<{ initial?: string }>(), { initial: "all" });
const { lang } = useData(); const ar = computed(() => lang.value.startsWith("ar"));
const max = ref(2); const menu = ref(true); const value = ref(65); const text = ref(""); const length = ref(20); const color = ref("#087f8c"); const direction = ref("ltr");
function reset() { max.value = 2; menu.value = true; value.value = 65; text.value = ar.value ? "أساس مشترك لكل فريق ومشروع جديد" : "A shared foundation for every team"; length.value = 20; color.value = "#087f8c"; direction.value = ar.value ? "rtl" : "ltr"; }
watch([ar, () => props.initial], reset, { immediate: true });
const people = [{ id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'آدم محمد' }, { id: 3, name: 'Grace Hopper' }, { id: 4, name: 'Alan Turing' }];
const skeleton = [{ repeat: 2, cols: 12, md: 6, variant: 'card' as const, header: [{ type: 'text', width: 100 }], items: [{ type: 'paragraph' }] }];
const steps = computed(() => [{ title: ar.value ? 'مراجعة' : 'Review', is_active: value.value >= 50, time: '09:00', date: '2026-10-28' }, { title: ar.value ? 'نشر' : 'Publish', is_active: value.value === 100, time: '10:00', date: '2026-10-28' }]);
const label = computed(() => `${value.value}%`);
</script>
<template>
  <section class="w-demo" :aria-label="ar ? 'تجربة المكونات' : 'Component playground'">
    <div class="w-demo__top"><strong>{{ ar ? 'المكونات الفعلية' : 'ACTUAL COMPONENTS' }}</strong><span>Vue 3 + Vuetify 3</span></div>
    <div class="w-demo__controls">
      <label>{{ ar ? 'النص' : 'Label' }}<input v-model="text" /></label>
      <label>{{ ar ? 'حد النص' : 'Text length' }}<input v-model.number="length" type="number" min="0" max="100" /></label>
      <label>{{ ar ? 'القيمة' : 'Value' }}: {{ value }}<input v-model.number="value" type="range" min="0" max="100" /></label>
      <label>{{ ar ? 'اللون' : 'Accent color' }}<input v-model="color" type="color" /></label>
      <label v-if="initial === 'avatar-stack' || initial === 'all'">{{ ar ? 'الصور الظاهرة' : 'Visible avatars' }}<input v-model.number="max" type="number" min="0" max="4" /></label>
      <label v-if="initial === 'avatar-stack' || initial === 'all'">{{ ar ? 'قائمة الباقي' : 'Overflow menu' }}<select v-model="menu"><option :value="true">{{ ar ? 'مفعلة' : 'Enabled' }}</option><option :value="false">{{ ar ? 'مخفية' : 'Disabled' }}</option></select></label>
      <label>{{ ar ? 'الاتجاه' : 'Direction' }}<select v-model="direction"><option value="ltr">LTR</option><option value="rtl">RTL</option></select></label>
    </div>
    <VLocaleProvider :rtl="direction === 'rtl'">
      <div class="w-demo__stage" :dir="direction" :style="{ '--wakeb-gauge-color': color, '--wakeb-gauge-highlight': color, '--wakeb-progress-surface': 'var(--vp-c-bg-soft)', '--wakeb-gauge-text-color': 'var(--vp-c-text-1)' }">
        <WTruncatedText v-if="initial === 'all' || initial === 'truncated-text'" :label="text" :length="Number(length) || 0" />
        <WSegmentedProgress v-if="initial === 'all' || initial === 'segmented-progress'" :value="value" :label="label" :color="color" :aria-label="ar ? `التقدم ${value}%` : `Progress ${value}%`" />
        <WSemiCircleGauge v-if="initial === 'all' || initial === 'semi-circle-gauge'" :value="value" :label="label" :sub-label="ar ? 'الجودة' : 'Quality'" :aria-label="ar ? `الجودة ${value}%` : `Quality ${value}%`" />
        <WAvatarStack v-if="initial === 'all' || initial === 'avatar-stack'" :items="people" :max="Number(max)" :show-overflow-menu="menu" :overflow-label="ar ? 'باقي الأشخاص' : 'More people'" :menu-style="{ '--wakeb-avatar-menu-surface': 'var(--vp-c-bg)', '--wakeb-avatar-menu-text': 'var(--vp-c-text-1)' }" />
        <WLoading v-if="initial === 'all' || initial === 'loading'" :color="color" :label="ar ? 'جار التحميل' : 'Loading report'" />
        <WPageSkeleton v-if="initial === 'all' || initial === 'page-skeleton'" :config="skeleton" :label="ar ? 'جار تحميل المحتوى' : 'Loading content'" :style="{ '--wakeb-skeleton-surface': 'var(--vp-c-bg-soft)', '--wakeb-skeleton-border': 'var(--vp-c-divider)' }" />
        <WVerticalSteps v-if="initial === 'all' || initial === 'vertical-steps'" :steps="steps" :label="ar ? 'خطوات النشر' : 'Release steps'" :style="{ '--wakeb-steps-accent': color, '--wakeb-steps-surface': 'var(--vp-c-bg-soft)' }" />
      </div>
    </VLocaleProvider>
    <button type="button" @click="reset">{{ ar ? 'استعادة المثال' : 'Reset example' }}</button>
    <code>import { WTruncatedText, WSegmentedProgress, WSemiCircleGauge, WAvatarStack, WLoading, WPageSkeleton, WVerticalSteps } from 'wakeb-components'</code>
  </section>
</template>

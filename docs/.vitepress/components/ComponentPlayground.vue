<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useData } from "vitepress";
import { VLocaleProvider } from "vuetify/components/VLocaleProvider";
import { WTruncatedText, WSegmentedProgress, WSemiCircleGauge } from "../../../src";
const props = withDefaults(defineProps<{ initial?: string }>(), { initial: "all" });
const { lang } = useData(); const ar = computed(() => lang.value.startsWith("ar"));
const value = ref(65); const text = ref(""); const length = ref(20); const color = ref("#087f8c"); const direction = ref("ltr");
function reset() { value.value = 65; text.value = ar.value ? "أساس مشترك لكل فريق ومشروع جديد" : "A shared foundation for every team"; length.value = 20; color.value = "#087f8c"; direction.value = ar.value ? "rtl" : "ltr"; }
watch([ar, () => props.initial], reset, { immediate: true });
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
      <label>{{ ar ? 'الاتجاه' : 'Direction' }}<select v-model="direction"><option value="ltr">LTR</option><option value="rtl">RTL</option></select></label>
    </div>
    <VLocaleProvider :rtl="direction === 'rtl'">
      <div class="w-demo__stage" :dir="direction" :style="{ '--wakeb-gauge-color': color, '--wakeb-gauge-highlight': color, '--wakeb-progress-surface': 'var(--vp-c-bg-soft)', '--wakeb-gauge-text-color': 'var(--vp-c-text-1)' }">
        <WTruncatedText v-if="initial === 'all' || initial === 'truncated-text'" :label="text" :length="Number(length) || 0" />
        <WSegmentedProgress v-if="initial === 'all' || initial === 'segmented-progress'" :value="value" :label="label" :color="color" :aria-label="ar ? `التقدم ${value}%` : `Progress ${value}%`" />
        <WSemiCircleGauge v-if="initial === 'all' || initial === 'semi-circle-gauge'" :value="value" :label="label" :sub-label="ar ? 'الجودة' : 'Quality'" :aria-label="ar ? `الجودة ${value}%` : `Quality ${value}%`" />
      </div>
    </VLocaleProvider>
    <button type="button" @click="reset">{{ ar ? 'استعادة المثال' : 'Reset example' }}</button>
    <code>import { WTruncatedText, WSegmentedProgress, WSemiCircleGauge } from 'wakeb-components'</code>
  </section>
</template>

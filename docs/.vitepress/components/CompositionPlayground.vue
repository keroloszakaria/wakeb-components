<script setup lang="ts">
import { computed, ref } from "vue";
import { useData } from "vitepress";
import { VLocaleProvider } from "vuetify/components/VLocaleProvider";
import { VThemeProvider } from "vuetify/components/VThemeProvider";
import {
  WCarousel,
  WExportDropdown,
  WBaseSidebar,
  type ExportFormat,
} from "../../../src";
const props = withDefaults(defineProps<{ initial?: string }>(), {
  initial: "all",
});
const { lang, isDark } = useData(),
  ar = computed(() => lang.value.startsWith("ar"));
const show = (name: string) =>
  props.initial === "all" || props.initial === name;
const rtl = ref(false),
  cycle = ref(false),
  index = ref(0),
  indicators = ref(true),
  loading = ref(false),
  disabled = ref(false),
  csv = ref(false),
  selected = ref("—"),
  selects = ref(0),
  sidebarLoading = ref(false),
  filtered = ref(false),
  query = ref(""),
  searches = ref(0),
  filters = ref(0),
  cancels = ref(0);
const slides = computed(() => [
  {
    label: ar.value
      ? "مكونات مشتركة لكل مشروع"
      : "Shared components for every project",
  },
  { label: ar.value ? "تنسيق قابل للتخصيص" : "Customizable presentation" },
  { label: ar.value ? "عقود واضحة واختبارات" : "Clear contracts and tests" },
]);
const slideLabel = (slide: unknown) => (slide as { label: string }).label;
const formats = computed<ExportFormat[]>(() => [
  { label: ar.value ? "تصدير PDF" : "Export PDF", value: "pdf" },
  { label: ar.value ? "تصدير Excel" : "Export Excel", value: "xlsx" },
  ...(csv.value
    ? [{ label: ar.value ? "تصدير CSV" : "Export CSV", value: "csv" }]
    : []),
]);
const items = computed(() =>
  [
    { id: 1, name: "Ada Lovelace" },
    { id: 2, name: "Grace Hopper" },
    { id: 3, name: ar.value ? "فريق واكب" : "Wakeb team" },
  ].filter((item) =>
    item.name.toLowerCase().includes(query.value.toLowerCase()),
  ),
);
</script>
<template>
  <section
    class="composition-demo"
    :aria-label="
      ar
        ? 'تجربة الشرائح والتصدير والحاوية الجانبية'
        : 'Composition component playground'
    "
  >
    <div class="composition-controls">
      <label><input v-model="rtl" type="checkbox" />RTL</label>
      <template v-if="show('carousel')"
        ><label
          ><input v-model="cycle" type="checkbox" />{{
            ar ? "تشغيل تلقائي" : "Autoplay"
          }}</label
        ><label
          ><input v-model="indicators" type="checkbox" />{{
            ar ? "المؤشرات" : "Indicators"
          }}</label
        ></template
      >
      <template v-if="show('export-dropdown')"
        ><label
          ><input v-model="loading" type="checkbox" />{{
            ar ? "تصدير جارٍ" : "Export loading"
          }}</label
        ><label
          ><input v-model="disabled" type="checkbox" />{{
            ar ? "تعطيل" : "Disabled"
          }}</label
        ><label><input v-model="csv" type="checkbox" />CSV</label></template
      >
      <template v-if="show('base-sidebar')"
        ><label
          ><input v-model="sidebarLoading" type="checkbox" />{{
            ar ? "تحميل القائمة" : "List loading"
          }}</label
        ><label
          ><input v-model="filtered" type="checkbox" />{{
            ar ? "فلتر مطبق" : "Filter applied"
          }}</label
        ></template
      >
    </div>
    <VLocaleProvider :rtl="rtl"
      ><VThemeProvider :theme="isDark ? 'dark' : 'light'"
        ><div class="composition-stage" :dir="rtl ? 'rtl' : 'ltr'">
          <template v-if="show('carousel')"
            ><div class="composition-carousel">
              <WCarousel
                v-model="index"
                :slides="slides"
                :cycle="cycle"
                :interval="2500"
                :show-indicators="indicators"
                show-arrows
                :aria-label="ar ? 'عرض مميزات الحزمة' : 'Package highlights'"
                :indicator-label="
                  (n) => `${ar ? 'انتقل للشريحة' : 'Go to slide'} ${n + 1}`
                "
              >
                <template #slide="{ slide, index: slideIndex }"
                  ><div
                    class="composition-slide"
                    :class="`composition-slide--${slideIndex}`"
                  >
                    <strong>{{ slideLabel(slide) }}</strong>
                  </div></template
                >
                <template #prev="{ props: arrowProps }"
                  ><button
                    v-bind="arrowProps"
                    type="button"
                    class="composition-arrow"
                    :aria-label="ar ? 'الشريحة السابقة' : 'Previous slide'"
                  >
                    ‹
                  </button></template
                >
                <template #next="{ props: arrowProps }"
                  ><button
                    v-bind="arrowProps"
                    type="button"
                    class="composition-arrow"
                    :aria-label="ar ? 'الشريحة التالية' : 'Next slide'"
                  >
                    ›
                  </button></template
                >
              </WCarousel>
            </div>
            <output
              >{{ ar ? "الفهرس الحالي" : "Current index" }}: {{ index }}</output
            ></template
          >
          <template v-if="show('export-dropdown')"
            ><WExportDropdown
              :title="ar ? 'تنزيل التقرير' : 'Download report'"
              :formats="formats"
              :is-loading="loading"
              :disabled="disabled"
              :menu-style="{
                backgroundColor: 'var(--vp-c-bg)',
                color: 'var(--vp-c-text-1)',
              }"
              @select="
                (value) => {
                  selected = value;
                  selects++;
                }
              "
            /><output
              >{{ ar ? "الصيغة" : "Format" }}: {{ selected }} ·
              {{ ar ? "أحداث الاختيار" : "Selection events" }}:
              {{ selects }}</output
            >
            <p>
              {{
                ar
                  ? "المكوّن يرسل الصيغة؛ المشروع ينفذ توليد الملف وتنزيله."
                  : "The component emits the format; the host generates and downloads the file."
              }}
            </p></template
          >
          <template v-if="show('base-sidebar')"
            ><WBaseSidebar
              class="composition-sidebar"
              :title="ar ? 'أعضاء الفريق' : 'Team members'"
              :items="items"
              :loading="sidebarLoading"
              :is-filtered="filtered"
              :filter-label="ar ? 'فلتر' : 'Filter'"
              :cancel-label="ar ? 'إلغاء' : 'Cancel'"
              :empty-label="ar ? 'لا توجد نتائج' : 'No results'"
              @search="searches++"
              @filter-click="
                () => {
                  filtered = true;
                  filters++;
                }
              "
              @filter-cancel="
                () => {
                  filtered = false;
                  cancels++;
                }
              "
            >
              <template #search="{ search }"
                ><label class="composition-search"
                  >{{ ar ? "البحث بالاسم" : "Search by name"
                  }}<input v-model="query" @input="search(query)" /></label
              ></template>
              <template #item="{ item, index: itemIndex }"
                ><div class="composition-item">
                  <span>{{ itemIndex + 1 }}</span
                  ><strong>{{ item.name }}</strong>
                </div></template
              > </WBaseSidebar
            ><output
              >{{ ar ? "أحداث البحث" : "Search events" }}: {{ searches }} ·
              {{ ar ? "الفلترة" : "Filter clicks" }}: {{ filters }} ·
              {{ ar ? "الإلغاء" : "Cancel clicks" }}: {{ cancels }}</output
            ></template
          >
        </div></VThemeProvider
      ></VLocaleProvider
    >
    <code
      >import { WCarousel, WExportDropdown, WBaseSidebar } from
      'wakeb-components'</code
    >
  </section>
</template>
<style scoped>
.composition-demo {
  margin: 24px 0;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}
.composition-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.composition-demo label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.composition-stage {
  display: grid;
  gap: 16px;
  margin-top: 24px;
  padding: 18px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  --wakeb-carousel-indicator-bg: #94a3b8;
  --wakeb-carousel-indicator-active-bg: #fff;
  --wakeb-carousel-focus: #fff;
  --wakeb-button-outline-background: var(--vp-c-bg-soft);
  --wakeb-button-outline-color: var(--vp-c-text-1);
  --wakeb-button-outline-border: var(--vp-c-divider);
  --wakeb-button-outline-hover-background: var(--vp-c-bg);
  --wakeb-button-outline-hover-border: var(--vp-c-brand-1);
}
.composition-stage :deep(.btn p) {
  margin-block: 0;
}
.composition-carousel {
  position: relative;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
}
.composition-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 36px 58px 64px;
  background: linear-gradient(120deg, #153b52, #087f8c);
  color: white;
  text-align: center;
  font-size: 23px;
}
.composition-slide--1 {
  background: linear-gradient(120deg, #312e81, #134e4a);
}
.composition-slide--2 {
  background: linear-gradient(120deg, #4c1d95, #164e63);
}
.composition-arrow {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  border-radius: 50%;
  font-size: 24px;
}
.composition-stage[dir="rtl"] .composition-arrow {
  transform: scaleX(-1);
}
.composition-arrow:focus-visible {
  outline: 2px solid white;
  outline-offset: 3px;
}
.composition-sidebar :deep(h2) {
  letter-spacing: normal;
}
.composition-sidebar {
  min-width: 0;
  --wakeb-sidebar-outer-bg: var(--vp-c-divider);
  --wakeb-sidebar-inner-bg: var(--vp-c-bg-soft);
  --wakeb-sidebar-body: var(--vp-c-bg);
  --wakeb-sidebar-body-rgb: 127, 127, 127;
  --wakeb-sidebar-title: var(--vp-c-text-1);
  --wakeb-sidebar-empty-color: var(--vp-c-text-2);
}
.composition-search {
  display: grid !important;
  gap: 6px;
  padding: 8px 16px 4px;
}
.composition-search input {
  width: 100%;
  min-width: 0;
  height: 36px;
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.composition-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 13px;
}
.composition-item > span {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.composition-demo output,
.composition-demo p {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.composition-demo code {
  display: block;
  margin-top: 16px;
  white-space: normal;
}
@media (max-width: 600px) {
  .composition-demo,
  .composition-stage {
    padding: 12px;
  }
  .composition-slide {
    font-size: 19px;
  }
  .composition-sidebar :deep(.wakeb-base-sidebar__header) {
    flex-wrap: wrap;
  }
}
</style>

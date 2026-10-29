<script setup lang="ts">
import { computed, ref } from "vue";
import { useData } from "vitepress";
import { VApp } from "vuetify/components/VApp";
import { VLocaleProvider } from "vuetify/components/VLocaleProvider";
import { VThemeProvider } from "vuetify/components/VThemeProvider";
import { WModal, WDrawer, WButton } from "../../../src";
const props = withDefaults(defineProps<{ initial?: string }>(), {
  initial: "all",
});
const { lang, isDark } = useData(),
  ar = computed(() => lang.value.startsWith("ar"));
const modal = ref(false),
  drawer = ref(false),
  nested = ref(false),
  rtl = ref(false),
  persistent = ref(false),
  loading = ref(false),
  dataLoaded = ref(true),
  icon = ref(false),
  transparent = ref(false),
  start = ref(false),
  name = ref("Draft"),
  leaves = ref(0),
  closes = ref(0);
const launcher = ref<HTMLElement | null>(null);
function openDrawer(event: MouseEvent) {
  launcher.value = event.currentTarget as HTMLElement;
  drawer.value = true;
}
function restoreDrawerFocus(value: boolean) {
  if (!value) launcher.value?.focus();
}
const label = (en: string, arabic: string) => (ar.value ? arabic : en);
</script>
<template>
  <section
    class="overlay-playground"
    :aria-label="
      label('Dialog and drawer playground', 'تجربة النوافذ والحاويات الجانبية')
    "
  >
    <div class="overlay-controls">
      <label><input v-model="rtl" type="checkbox" /> RTL</label>
      <label
        ><input v-model="persistent" type="checkbox" />
        {{ label("Persistent", "منع الإغلاق الخارجي") }}</label
      >
      <label
        ><input v-model="dataLoaded" type="checkbox" />
        {{ label("Data ready", "البيانات جاهزة") }}</label
      >
      <label
        ><input v-model="loading" type="checkbox" />
        {{ label("Loading overlay", "طبقة التحميل") }}</label
      >
      <label
        ><input v-model="icon" type="checkbox" />
        {{ label("Header icon", "أيقونة الرأس") }}</label
      >
      <label
        ><input v-model="start" type="checkbox" />
        {{ label("Start side", "جانب البداية") }}</label
      >
      <label
        ><input v-model="transparent" type="checkbox" />
        {{ label("Transparent scrim", "خلفية شفافة") }}</label
      >
    </div>
    <VApp
      ><VLocaleProvider :rtl="rtl"
        ><VThemeProvider :theme="isDark ? 'dark' : 'light'">
          <div class="overlay-controls">
            <WModal
              v-if="initial === 'all' || initial === 'modal'"
              v-model="modal"
              :title="label('Report settings', 'إعدادات التقرير')"
              :description="
                label(
                  'Reusable shell, application-owned actions.',
                  'حاوية مشتركة وإجراءات يملكها المشروع.',
                )
              "
              width="640"
              :persistent="persistent"
              :loading="loading"
              :data-loaded="dataLoaded"
              :close-label="label('Close report', 'إغلاق التقرير')"
              :loading-label="label('Loading report', 'تحميل التقرير')"
              @after-leave="leaves++"
            >
              <template #activator="{ props: activatorProps }"
                ><button class="demo-launcher" v-bind="activatorProps">
                  {{ label("Open dialog", "فتح النافذة") }}
                </button></template
              >
              <template v-if="icon" #header-icon
                ><span aria-hidden="true">✦</span></template
              >
              <template #content>
                <label class="demo-field"
                  >{{ label("Report name", "اسم التقرير")
                  }}<input v-model="name"
                /></label>
                <WModal
                  v-model="nested"
                  :title="label('Nested confirmation', 'تأكيد داخل النافذة')"
                  width="420"
                  :persistent="false"
                  :close-label="label('Close confirmation', 'إغلاق التأكيد')"
                >
                  <template #activator="{ props: activatorProps }"
                    ><button class="demo-launcher" v-bind="activatorProps">
                      {{ label("Open confirmation", "فتح التأكيد") }}
                    </button></template
                  >
                  <template #content
                    ><input
                      :aria-label="label('Confirmation note', 'ملاحظة التأكيد')"
                      value="Confirm"
                  /></template>
                </WModal>
              </template>
              <template #actions
                ><WButton :title="label('Done', 'تم')" @click="modal = false"
              /></template>
            </WModal>
            <button
              v-if="initial === 'all' || initial === 'drawer'"
              class="demo-launcher"
              @click="openDrawer"
            >
              {{ label("Open drawer", "فتح الحاوية الجانبية") }}
            </button>
            <WDrawer
              v-if="initial === 'all' || initial === 'drawer'"
              v-model="drawer"
              :title="label('Report details', 'تفاصيل التقرير')"
              :position="start ? 'start' : 'end'"
              :persistent="persistent"
              :transparent-overlay="transparent"
              :loading="loading"
              :data-loaded="dataLoaded"
              :close-label="label('Close details', 'إغلاق التفاصيل')"
              :loading-label="label('Loading details', 'تحميل التفاصيل')"
              @close="closes++"
              @update:model-value="restoreDrawerFocus"
            >
              <template #content
                ><label class="demo-field"
                  >{{ label("Report name", "اسم التقرير")
                  }}<input v-model="name"
                /></label>
                <p>
                  {{
                    label(
                      "Scrollable content; the application owns submit and validation.",
                      "محتوى قابل للتمرير؛ المشروع مسؤول عن الإرسال والتحقق.",
                    )
                  }}
                </p></template
              >
              <template #actions
                ><WButton
                  :title="label('Done', 'تم')"
                  @click="
                    drawer = false;
                    restoreDrawerFocus(false);
                  "
              /></template>
            </WDrawer>
          </div> </VThemeProvider></VLocaleProvider
    ></VApp>
    <p role="status">
      {{ label("Dialog exits", "إغلاق انتقال النافذة") }}: {{ leaves }} ·
      {{ label("Drawer close-button events", "أحداث زر إغلاق الحاوية") }}:
      {{ closes }}
    </p>
    <p>
      {{
        label(
          "The demo starts non-persistent so outside clicks and dialog Escape are easy to test. WModal itself defaults persistent=true. Drawer follows native Vuetify behavior and has no Escape dismissal.",
          "المثال يبدأ بدون منع الإغلاق لتجربة النقر خارج النافذة وEscape في Dialog. افتراضي WModal نفسه persistent=true. الحاوية الجانبية تحتفظ بسلوك Vuetify دون إغلاق Escape.",
        )
      }}
    </p>
    <code>import { WModal, WDrawer } from 'wakeb-components'</code>
  </section>
</template>
<style scoped>
.overlay-playground {
  margin: 24px 0;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
}
.overlay-playground :deep(.v-application) {
  background: transparent;
  color: inherit;
}
.overlay-playground :deep(.v-application__wrap) {
  min-height: 0;
}
.overlay-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.overlay-controls label {
  display: flex;
  align-items: center;
  gap: 6px;
}
.demo-launcher {
  padding: 8px 16px;
  border: 1px solid #087f8c;
  border-radius: 8px;
  cursor: pointer;
}
.demo-launcher:focus-visible {
  outline: 2px solid #087f8c;
  outline-offset: 3px;
}
.demo-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.demo-field input,
input[aria-label] {
  padding: 8px;
  border: 1px solid #98a2b3;
  border-radius: 6px;
}
</style>

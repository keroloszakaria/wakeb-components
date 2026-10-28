<script setup lang="ts">
import { computed, ref } from "vue";
import { useData } from "vitepress";
import { VLocaleProvider } from "vuetify/components/VLocaleProvider";
import { WBadgeStack, WUserBadge, WTooltipBtn } from "../../../src";
const props = withDefaults(defineProps<{ initial?: string }>(), {
  initial: "all",
});
const { lang } = useData();
const ar = computed(() => lang.value.startsWith("ar"));
const max = ref(1),
  menu = ref(true),
  circles = ref(false),
  position = ref<"before" | "after">("before"),
  opacity = ref(0.3),
  avatar = ref(false),
  name = ref("Ada Lovelace"),
  disabled = ref(false),
  clicks = ref(0),
  removed = ref(0),
  rtl = ref(false);
const icon =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#fff" stroke="#087f8c" stroke-width="2" d="m4 12 5 5L20 5"/></svg>',
  );
const items = computed(() => [
  {
    id: 1,
    label: ar.value ? "مدير النظام" : "Administrator",
    icon,
    color: "#087f8c",
  },
  {
    id: 2,
    label: ar.value ? "مراجعة صلاحيات الفريق" : "Team permissions reviewer",
    icon,
    color: "#f79009",
  },
  {
    id: 3,
    label: ar.value ? "مشاهدة التقارير" : "Report viewer",
    isDot: true,
    dotColor: "#12b76a",
  },
]);
const show = (kind: string) =>
  props.initial === "all" || props.initial === kind;
</script>
<template>
  <section
    class="identity-demo"
    :aria-label="
      ar ? 'تجربة الشارات وزر المساعدة' : 'Identity component playground'
    "
  >
    <div class="identity-controls">
      <label v-if="show('badge-stack')"
        >{{ ar ? "العناصر الظاهرة" : "Visible badges"
        }}<input v-model.number="max" type="number" min="0" max="3"
      /></label>
      <label v-if="show('badge-stack')"
        ><input v-model="menu" type="checkbox" />{{
          ar ? "قائمة الزيادة" : "Overflow menu"
        }}</label
      >
      <label v-if="show('badge-stack')"
        ><input v-model="circles" type="checkbox" />{{
          ar ? "صور دائرية" : "Circular images"
        }}</label
      >
      <label v-if="show('badge-stack')"
        >{{ ar ? "قوة لون الدائرة" : "Circle opacity"
        }}<input
          v-model.number="opacity"
          type="range"
          min="0"
          max="1"
          step="0.1"
      /></label>
      <label v-if="show('user-badge')"
        >{{ ar ? "اسم المستخدم" : "User name" }}<input v-model="name"
      /></label>
      <label v-if="show('user-badge')"
        ><input v-model="avatar" type="checkbox" />{{
          ar ? "استخدم صورة" : "Use image"
        }}</label
      >
      <label v-if="show('tooltip-btn')"
        ><input v-model="disabled" type="checkbox" />{{
          ar ? "زر معطل" : "Disabled button"
        }}</label
      >
      <label v-if="show('badge-stack') || show('user-badge')"
        >{{ ar ? "موضع الأيقونة" : "Icon position"
        }}<select v-model="position">
          <option value="before">{{ ar ? "قبل" : "Before" }}</option>
          <option value="after">{{ ar ? "بعد" : "After" }}</option>
        </select></label
      >
      <label><input v-model="rtl" type="checkbox" />RTL</label>
    </div>
    <VLocaleProvider :rtl="rtl">
      <div class="identity-stage" :dir="rtl ? 'rtl' : 'ltr'">
        <WBadgeStack
          v-if="show('badge-stack')"
          :items="items"
          :max="max"
          :show-overflow-menu="menu"
          :icon-variant="circles ? 'circle' : 'default'"
          :icon-position="position"
          :icon-background-opacity="opacity"
          :overflow-label="ar ? 'المزيد من الصلاحيات' : 'More roles'"
          custom-border-radius="8px"
          :menu-style="{
            '--wakeb-badge-stack-menu-surface': 'var(--vp-c-bg)',
            color: 'var(--vp-c-text-1)',
          }"
          :badge-attrs="{
            style: { '--wakeb-badge-neutral-text': 'var(--vp-c-text-1)' },
          }"
        />
        <WUserBadge
          v-if="show('user-badge')"
          :user="{ name, avatar: avatar ? icon : '' }"
          :icon-position="position"
          ><template #actions
            ><button
              type="button"
              class="identity-action"
              :aria-label="ar ? 'إزالة المستخدم' : 'Remove user'"
              @click="removed++"
            >
              ×
            </button></template
          ></WUserBadge
        >
        <output v-if="show('user-badge')"
          >{{ ar ? "نقرات الإزالة" : "Remove clicks" }}: {{ removed }}</output
        >
        <WTooltipBtn
          v-if="show('tooltip-btn')"
          :text="ar ? 'حفظ التغييرات' : 'Save changes'"
          :disabled="disabled"
          btn-icon
          @click="clicks++"
          ><template #icon
            ><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="m5 12 4 4L19 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              /></svg></template
        ></WTooltipBtn>
        <output v-if="show('tooltip-btn')"
          >{{ ar ? "نقرات الزر" : "Button clicks" }}: {{ clicks }}</output
        >
      </div>
    </VLocaleProvider>
    <p>
      {{
        ar
          ? "جرّب Tab وEnter وSpace وEscape على زر القائمة وزر المساعدة."
          : "Try Tab, Enter, Space and Escape on the overflow and tooltip buttons."
      }}
    </p>
    <code
      >import { WBadgeStack, WUserBadge, WTooltipBtn } from
      'wakeb-components'</code
    >
  </section>
</template>
<style scoped>
.identity-demo {
  margin: 24px 0;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}
.identity-controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.identity-demo label {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 13px;
}
.identity-demo input:not([type="checkbox"]):not([type="range"]),
.identity-demo select {
  width: 100%;
  height: 36px;
  padding: 5px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.identity-stage {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
  padding: 24px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  --wakeb-badge-primary-text: var(--vp-c-text-1);
  --wakeb-badge-outline-border: var(--vp-c-divider);
  --wakeb-badge-neutral-text: var(--vp-c-text-1);
  --wakeb-badge-stack-overflow-background: var(--vp-c-bg);
  --wakeb-badge-stack-overflow-color: var(--vp-c-text-1);
}
.identity-action {
  font-size: 16px;
  padding: 0 4px;
  border-radius: 4px;
}
.identity-action:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.identity-demo output,
.identity-demo p {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.identity-demo code {
  display: block;
  margin-top: 16px;
  white-space: normal;
}
@media (max-width: 600px) {
  .identity-controls {
    grid-template-columns: 1fr;
  }
  .identity-demo,
  .identity-stage {
    padding: 14px;
  }
}
</style>

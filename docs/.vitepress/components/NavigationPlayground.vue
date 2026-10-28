<script setup lang="ts">
import { computed, ref } from "vue";
import { useData } from "vitepress";
import { VLocaleProvider } from "vuetify/components/VLocaleProvider";
import {
  WTabs,
  WTree,
  WDropdown,
  type NavigationKey,
  type TreeNode,
} from "../../../src";
const props = withDefaults(defineProps<{ initial?: string }>(), {
  initial: "all",
});
const { lang } = useData(),
  ar = computed(() => lang.value.startsWith("ar"));
const rtl = ref(false),
  vertical = ref(false),
  switcher = ref(false),
  styleType = ref<"outlined" | "filled" | "none" | "minimal">("outlined"),
  selectedTab = ref<NavigationKey>("overview"),
  tabEvents = ref(0),
  draft = ref(""),
  expanded = ref<NavigationKey[]>([1]),
  active = ref<NavigationKey | null>(null),
  actions = ref(0),
  selection = ref<NavigationKey>(0),
  loading = ref(false),
  disabled = ref(false),
  menuEvents = ref(0);
const show = (name: string) =>
  props.initial === "all" || props.initial === name;
const tabs = computed(() => [
  {
    slot: "overview",
    label: ar.value ? "نظرة عامة" : "Overview",
    icon: "$complete",
  },
  {
    slot: "details",
    label: ar.value ? "التفاصيل" : "Details",
    notification: 3,
  },
]);
const nodes = computed<TreeNode[]>(() => [
  {
    id: 1,
    name: ar.value ? "الفريق" : "Team",
    description: ar.value ? "فرع قابل للفتح" : "Expandable branch",
    children: [
      {
        id: 2,
        name: ar.value ? "التصميم" : "Design",
        children: [{ id: 3, name: ar.value ? "المكونات" : "Components" }],
      },
      { id: 4, name: ar.value ? "الهندسة" : "Engineering" },
    ],
  },
  { id: 5, name: ar.value ? "التقارير" : "Reports" },
]);
const items = computed(() => [
  { label: ar.value ? "قيد المراجعة" : "Pending", value: 0, color: "warning" },
  { label: ar.value ? "معتمد" : "Approved", value: 1, color: "success" },
  { label: ar.value ? "غير متاح" : "Unavailable", value: 2, disabled: true },
]);
const toggle = (node: TreeNode) => {
  const key = node.id!;
  expanded.value = expanded.value.includes(key)
    ? expanded.value.filter((k) => k !== key)
    : [...expanded.value, key];
};
</script>
<template>
  <section
    class="navigation-demo"
    :aria-label="
      ar
        ? 'تجربة التبويبات والشجرة والقائمة'
        : 'Navigation component playground'
    "
  >
    <div class="navigation-controls">
      <label><input v-model="rtl" type="checkbox" />RTL</label>
      <label v-if="show('tabs')"
        >{{ ar ? "شكل التبويبات" : "Tab style"
        }}<select v-model="styleType">
          <option
            v-for="style in ['outlined', 'filled', 'none', 'minimal']"
            :key="style"
          >
            {{ style }}
          </option>
        </select></label
      >
      <label v-if="show('tabs')"
        ><input v-model="vertical" type="checkbox" />{{
          ar ? "رأسي" : "Vertical"
        }}</label
      >
      <label v-if="show('tabs')"
        ><input v-model="switcher" type="checkbox" />{{
          ar ? "الشريط فقط" : "Switcher only"
        }}</label
      >
      <label v-if="show('dropdown')"
        ><input v-model="loading" type="checkbox" />{{
          ar ? "تحميل" : "Loading"
        }}</label
      >
      <label v-if="show('dropdown')"
        ><input v-model="disabled" type="checkbox" />{{
          ar ? "تعطيل" : "Disabled"
        }}</label
      >
    </div>
    <VLocaleProvider :rtl="rtl"
      ><div class="navigation-stage" :dir="rtl ? 'rtl' : 'ltr'">
        <template v-if="show('tabs')">
          <WTabs
            :tabs="tabs"
            :selected-tab="selectedTab"
            :style-type="styleType"
            :is-vertical="vertical"
            :is-switcher-only="switcher"
            :aria-label="ar ? 'أقسام المثال' : 'Example sections'"
            @update-tab="
              (value) => {
                selectedTab = value ?? '';
                tabEvents++;
              }
            "
          >
            <template #tab-icon
              ><svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="m5 12 4 4L19 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                /></svg
            ></template>
            <template #overview
              ><label
                >{{ ar ? "مسودة محفوظة" : "Saved draft"
                }}<input v-model="draft" /></label
            ></template>
            <template #details
              ><p>
                {{
                  ar
                    ? "ارجع للتبويب الأول وستجد المسودة."
                    : "Return to the first tab to find your draft."
                }}
              </p></template
            > </WTabs
          ><output
            >{{ ar ? "أحداث تغيير التبويب" : "Tab change events" }}:
            {{ tabEvents }}</output
          >
        </template>
        <template v-if="show('tree')">
          <WTree
            :nodes="nodes"
            :expanded-keys="expanded"
            :active-key="active"
            :rtl="rtl"
            :aria-label="ar ? 'فرق الشركة' : 'Company teams'"
            :toggle-label="ar ? 'تبديل فتح الفرع' : 'Toggle branch'"
            @toggle="toggle"
            @node-click="(node) => (active = node.id!)"
          >
            <template #actions="{ node }"
              ><button
                type="button"
                class="navigation-action"
                :aria-label="`${ar ? 'تعديل' : 'Edit'} ${node.name}`"
                @click="actions++"
              >
                {{ ar ? "تعديل" : "Edit" }}
              </button></template
            > </WTree
          ><output
            >{{ ar ? "العنصر المختار" : "Selected node" }}:
            {{ active ?? "—" }} ·
            {{ ar ? "إجراءات مستقلة" : "Isolated actions" }}:
            {{ actions }}</output
          >
        </template>
        <template v-if="show('dropdown')">
          <WDropdown
            v-model="selection"
            :title="ar ? 'الحالة' : 'Status'"
            :menu-items="items"
            show-selected
            :is-loading="loading"
            :disabled="disabled"
            :menu-style="{
              'background-color': 'var(--vp-c-bg)',
              color: 'var(--vp-c-text-1)',
            }"
            @selected-item="menuEvents++"
          >
            <template #activator="{ props: activatorProps, buttonProps }"
              ><button
                v-bind="activatorProps"
                type="button"
                class="navigation-menu-button"
                :aria-label="buttonProps.title"
                :disabled="buttonProps.disabled"
              >
                {{
                  buttonProps.isLoading
                    ? ar
                      ? "تحميل…"
                      : "Loading…"
                    : buttonProps.title
                }}<span aria-hidden="true">⌄</span>
              </button></template
            > </WDropdown
          ><output
            >{{ ar ? "القيمة" : "Value" }}: {{ selection }} ·
            {{ ar ? "أحداث الاختيار" : "Selection events" }}:
            {{ menuEvents }}</output
          >
        </template>
      </div></VLocaleProvider
    >
    <p>
      {{
        ar
          ? "جرّب الأسهم وHome وEnd وEnter وSpace وEscape؛ حالة الاختيار والفتح يديرها المثال."
          : "Try arrows, Home, End, Enter, Space and Escape; the example owns selection and expansion state."
      }}
    </p>
    <code>import { WTabs, WTree, WDropdown } from 'wakeb-components'</code>
  </section>
</template>
<style scoped>
.navigation-demo {
  margin: 24px 0;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}
.navigation-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.navigation-demo label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.navigation-demo select,
.navigation-demo input:not([type="checkbox"]) {
  min-width: 0;
  height: 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  padding: 4px 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.navigation-stage {
  display: grid;
  gap: 20px;
  margin-top: 24px;
  padding: 20px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  --wakeb-tabs-item-color: var(--vp-c-text-1);
  --wakeb-tabs-item-active-color: var(--vp-c-brand-1);
  --wakeb-tabs-filled-item-active-color: var(--vp-c-brand-1);
  --wakeb-tabs-item-active-border: var(--vp-c-divider);
  --wakeb-tabs-filled-item-active-bg: var(--vp-c-brand-soft);
  --wakeb-tabs-minimal-tab-bg: var(--vp-c-bg-soft);
  --wakeb-tabs-minimal-tab-border: var(--vp-c-divider);
  --wakeb-tabs-minimal-item-color: var(--vp-c-text-2);
  --wakeb-tabs-minimal-item-active-color: var(--vp-c-text-1);
  --wakeb-tabs-input-bg: var(--vp-c-bg);
  --wakeb-tabs-input-border: var(--vp-c-divider);
  --wakeb-tabs-input-label: var(--vp-c-text-1);
  --wakeb-tabs-section-color: var(--vp-c-text-2);
  --wakeb-tabs-section-border: var(--vp-c-divider);
  --wakeb-tree-paragraph-primary: var(--vp-c-text-1);
  --wakeb-tree-paragraph-tertiary: var(--vp-c-text-2);
  --wakeb-tree-hover-bg: var(--vp-c-bg-soft);
  --wakeb-tree-input-border: var(--vp-c-divider);
  --wakeb-tree-primary: var(--vp-c-brand-1);
  --wakeb-tree-toggle-color: var(--vp-c-text-2);
  --wakeb-tree-active-text: var(--vp-c-bg);
  --wakeb-button-icon-color: var(--vp-c-text-2);
  --wakeb-button-icon-hover-color: var(--vp-c-text-1);
  --wakeb-button-icon-hover-background: var(--vp-c-bg-soft);
}
.navigation-menu-button {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 9px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.navigation-menu-button:disabled {
  opacity: 0.5;
  cursor: default;
}
.navigation-menu-button:focus-visible,
.navigation-action:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.navigation-stage :deep(.tree__node-content--active .navigation-action) {
  color: var(--wakeb-tree-active-text);
}
.navigation-action {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}
.navigation-demo output,
.navigation-demo p {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.navigation-demo code {
  display: block;
  margin-top: 16px;
  white-space: normal;
}
@media (max-width: 600px) {
  .navigation-stage,
  .navigation-demo {
    padding: 12px;
  }
  .navigation-stage :deep(.wakeb-tabs) {
    flex-wrap: wrap;
  }
}
</style>

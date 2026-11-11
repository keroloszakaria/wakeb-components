<script setup lang="ts">
import { computed, ref } from "vue";
import { useData } from "vitepress";
import { VLocaleProvider } from "vuetify/components/VLocaleProvider";
import { WCheckbox, WPopover, WSwitch, WTextField } from "../../../src";
const props = withDefaults(defineProps<{ initial?: string }>(), { initial: "all" });
const { lang } = useData();
const ar = computed(() => lang.value.startsWith("ar"));
const email = ref("");
const variant = ref<"outline" | "filled">("outline");
const rtl = ref(false);
const open = ref(false);
const statuses = ref<string[]>([]);
const show = (name: string) => props.initial === "all" || props.initial === name;
const notify = ref(true);
const inset = ref(false);
const loading = ref(false);
const disabled = ref(false);
const density = ref<"default" | "comfortable" | "compact">("default");
const agree = ref(false);
const permissions = ref<string[]>(["read"]);
const required = (value: unknown) => Boolean(value) || (ar.value ? "مطلوب" : "Required");
const isEmail = (value: unknown) => String(value).includes("@") || (ar.value ? "بريد غير صحيح" : "Invalid email");
const options = computed(() => [
  { value: "open", label: ar.value ? "مفتوح" : "Open" },
  { value: "closed", label: ar.value ? "مغلق" : "Closed" },
]);
</script>
<template>
  <section class="w-demo" :aria-label="ar ? 'تجربة الحقول' : 'Forms playground'">
    <div class="w-demo__top"><strong>{{ ar ? 'المكونات الفعلية' : 'ACTUAL COMPONENTS' }}</strong><span>Vue 3 + Vuetify 3</span></div>
    <div class="w-demo__controls">
      <label v-if="show('text-field')">{{ ar ? 'الشكل' : 'Variant' }}<select v-model="variant"><option value="outline">outline</option><option value="filled">filled</option></select></label>
      <label v-if="show('switch') || show('checkbox')">{{ ar ? 'الكثافة' : 'Density' }}<select v-model="density"><option value="default">default</option><option value="comfortable">comfortable</option><option value="compact">compact</option></select></label>
      <label v-if="show('switch')"><input v-model="inset" type="checkbox" /> inset</label>
      <label v-if="show('switch')"><input v-model="loading" type="checkbox" /> loading</label>
      <label v-if="show('switch') || show('checkbox')"><input v-model="disabled" type="checkbox" /> disabled</label>
      <label>{{ ar ? 'الاتجاه' : 'Direction' }}<select v-model="rtl"><option :value="false">LTR</option><option :value="true">RTL</option></select></label>
    </div>
    <VLocaleProvider :rtl="rtl">
      <div class="w-demo__stage" :dir="rtl ? 'rtl' : 'ltr'">
        <WTextField
          v-if="show('text-field')"
          v-model="email"
          type="email"
          :label="ar ? 'البريد' : 'Email'"
          :placeholder="ar ? 'name@example.com' : 'name@example.com'"
          :variant="variant"
          :rules="[required, isEmail]"
          hide-details="auto"
        />
        <WPopover v-if="show('popover')" v-model="open" :aria-label="ar ? 'الفلاتر' : 'Filters'" :content-style="{ padding: '12px', minWidth: '200px' }">
          <template #activator="{ props: activator }">
            <button type="button" v-bind="activator">{{ ar ? 'الفلاتر' : 'Filters' }} ({{ statuses.length }})</button>
          </template>
          <template #default="{ close }">
            <label v-for="option in options" :key="option.value" style="display: block"><input v-model="statuses" type="checkbox" :value="option.value" /> {{ option.label }}</label>
            <button type="button" @click="close">{{ ar ? 'تم' : 'Done' }}</button>
          </template>
        </WPopover>
        <WSwitch v-if="show('switch')" v-model="notify" :label="ar ? 'الإشعارات' : 'Notifications'" :inset="inset" :loading="loading" :disabled="disabled" :density="density" />
        <div v-if="show('checkbox')">
          <WCheckbox v-model="agree" :label="ar ? 'أوافق على الشروط' : 'I accept the terms'" :disabled="disabled" :density="density" />
          <WCheckbox v-for="name in ['read', 'write']" :key="name" v-model="permissions" :value="name" :label="name" color="success" :disabled="disabled" :density="density" />
          <p>{{ permissions.join(', ') || '—' }}</p>
        </div>
      </div>
    </VLocaleProvider>
    <code>import { WTextField, WPopover, WSwitch, WCheckbox } from 'wakeb-components'</code>
  </section>
</template>

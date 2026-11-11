<script setup lang="ts">
import { computed, ref } from "vue";
import { useData } from "vitepress";
import { VLocaleProvider } from "vuetify/components/VLocaleProvider";
import { WAvatar, WButtonToggle, WCard, WCol, WCountBadge, WDataTable, WDivider, WIcon, WImage, WList, WProgressLinear, WRow, WSkeleton, WTextarea } from "../../../src";
const props = withDefaults(defineProps<{ initial?: string }>(), { initial: "all" });
const { lang } = useData();
const ar = computed(() => lang.value.startsWith("ar"));
const show = (name: string) => props.initial === "all" || props.initial === name;
const rtl = ref(false);
const loading = ref(true);
const skeletonType = ref("list-item-avatar-two-line@2");
const dense = ref(false);
const md = ref(4);
const progress = ref(40);
const indeterminate = ref(false);
const notes = ref("");
const position = ref<string | number | (string | number)[] | null>("top");
const multiple = ref(false);
const cardVariant = ref<"elevated" | "flat" | "outlined">("outlined");
const picked = ref("");
const unread = ref(5);
const tableSelected = ref<(string | number)[]>([]);
const tableSort = ref<{ key: string; order: "asc" | "desc" }[]>([]);
const tableLoading = ref(false);
const tableHeaders = computed(() => [
  { key: "id", title: "ID", width: 64 },
  { key: "name", title: ar.value ? "الكاميرا" : "Camera" },
  { key: "status", title: ar.value ? "الحالة" : "Status", sortable: false },
]);
const tableRows = computed(() => {
  const rows = [
    { id: 1, name: ar.value ? "البوابة 3" : "Gate 3", status: ar.value ? "متصلة" : "Online" },
    { id: 2, name: ar.value ? "الموقف" : "Parking", status: ar.value ? "غير متصلة" : "Offline" },
    { id: 3, name: ar.value ? "المدخل" : "Entrance", status: ar.value ? "متصلة" : "Online" },
  ];
  const sort = tableSort.value[0];
  if (!sort) return rows;
  const key = sort.key as "id" | "name";
  return [...rows].sort((a, b) => (a[key] > b[key] ? 1 : -1) * (sort.order === "asc" ? 1 : -1));
});
const listItems = computed(() => [
  { title: ar.value ? "الملف الشخصي" : "Profile", subtitle: ar.value ? "الحساب" : "Account", value: "profile", icon: "$complete" },
  { title: ar.value ? "تسجيل الخروج" : "Log out", value: "logout", icon: "$close", disabled: true },
]);
const photo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%23087f8c'/%3E%3Ccircle cx='8' cy='4.5' r='2.5' fill='%23fff'/%3E%3C/svg%3E";
const positions = computed(() => [
  { label: ar.value ? "أعلى" : "Top", value: "top" },
  { label: ar.value ? "أسفل" : "Bottom", value: "bottom" },
  { label: ar.value ? "يمين" : "Right", value: "right" },
]);
</script>
<template>
  <section class="w-demo" :aria-label="ar ? 'تجربة المكونات' : 'Components playground'">
    <div class="w-demo__top"><strong>{{ ar ? 'المكونات الفعلية' : 'ACTUAL COMPONENTS' }}</strong><span>Vue 3 + Vuetify 3</span></div>
    <div class="w-demo__controls">
      <label v-if="show('skeleton')">type<select v-model="skeletonType"><option>text</option><option>heading, paragraph</option><option>list-item-avatar-two-line@2</option><option>image</option><option>chip@3</option><option>table-row@3</option><option>card</option></select></label>
      <label v-if="show('skeleton')"><input v-model="loading" type="checkbox" /> loading</label>
      <label v-if="show('row') || show('col')"><input v-model="dense" type="checkbox" /> dense</label>
      <label v-if="show('row') || show('col')">md<select v-model.number="md"><option :value="3">3</option><option :value="4">4</option><option :value="6">6</option><option :value="12">12</option></select></label>
      <label v-if="show('progress-linear')">value<input v-model.number="progress" type="range" min="0" max="100" /></label>
      <label v-if="show('progress-linear')"><input v-model="indeterminate" type="checkbox" /> indeterminate</label>
      <label v-if="show('button-toggle')"><input v-model="multiple" type="checkbox" @change="position = multiple ? [] : 'top'" /> multiple</label>
      <label v-if="show('card')">variant<select v-model="cardVariant"><option>elevated</option><option>flat</option><option>outlined</option></select></label>
      <label>{{ ar ? 'الاتجاه' : 'Direction' }}<select v-model="rtl"><option :value="false">LTR</option><option :value="true">RTL</option></select></label>
    </div>
    <VLocaleProvider :rtl="rtl">
      <div class="w-demo__stage" :dir="rtl ? 'rtl' : 'ltr'">
        <WSkeleton v-if="show('skeleton')" :type="skeletonType" :loading="loading" width="100%" :label="ar ? 'جارٍ تحميل القائمة' : 'Loading list'">
          <p>{{ ar ? 'تم تحميل المحتوى' : 'Content loaded' }}</p>
        </WSkeleton>
        <WRow v-if="show('row') || show('col')" :dense="dense" align="center">
          <WCol v-for="n in 4" :key="n" cols="12" sm="6" :md="md"><div class="w-demo__cell">{{ ar ? 'عمود' : 'Column' }} {{ n }}</div></WCol>
        </WRow>
        <WProgressLinear v-if="show('progress-linear')" :model-value="progress" :indeterminate="indeterminate" :height="6" :label="ar ? 'تقدم الرفع' : 'Upload progress'" />
        <WTextarea v-if="show('textarea')" v-model="notes" :label="ar ? 'ملاحظات' : 'Notes'" rows="3" :rules="[(v: unknown) => String(v ?? '').length <= 120 || (ar ? 'الحد 120 حرفًا' : 'Up to 120 characters')]" />
        <WButtonToggle v-if="show('button-toggle')" v-model="position" :items="positions" :multiple="multiple" mandatory :aria-label="ar ? 'موضع وسيلة الإيضاح' : 'Legend position'" />
        <WCard v-if="show('card')" :title="ar ? 'الكاميرا' : 'Camera'" :subtitle="ar ? 'البوابة 3' : 'Gate 3'" :variant="cardVariant">
          {{ ar ? 'متصلة' : 'Online' }}
          <template #actions><button type="button">{{ ar ? 'فتح' : 'Open' }}</button></template>
        </WCard>
        <div v-if="show('divider')" style="display: flex; align-items: center; gap: 12px">
          <span>{{ ar ? 'أعلى' : 'Above' }}</span><WDivider vertical /><span>{{ ar ? 'جانبي' : 'Beside' }}</span>
        </div>
        <WDivider v-if="show('divider')" color="primary" :thickness="2" />
        <div v-if="show('list')">
          <WList :items="listItems" interactive :aria-label="ar ? 'الحساب' : 'Account'" @select="(item) => (picked = item.title)" />
          <p>{{ picked || '—' }}</p>
        </div>
        <p v-if="show('icon')"><WIcon icon="$complete" color="success" :label="ar ? 'مكتمل' : 'Complete'" /> <WIcon icon="$close" size="16" /></p>
        <WImage v-if="show('image')" :src="photo" :alt="ar ? 'صورة الكاميرا' : 'Camera snapshot'" aspect-ratio="16/9" width="240" cover />
        <p v-if="show('avatar')" style="display: flex; gap: 8px"><WAvatar name="Grace Hopper" /><WAvatar :name="ar ? 'آدا لوفليس' : 'Ada Lovelace'" color="success" :rounded="false" size="small" /><WAvatar :image="photo" name="Camera" /></p>
        <div v-if="show('data-table')">
          <label><input v-model="tableLoading" type="checkbox" /> loading</label>
          <WDataTable v-model="tableSelected" v-model:sort-by="tableSort" :headers="tableHeaders" :items="tableRows" :loading="tableLoading" selectable :aria-label="ar ? 'الكاميرات' : 'Cameras'" />
          <small>{{ ar ? "المحدد" : "Selected" }}: {{ tableSelected.join(", ") || "—" }}</small>
        </div>
        <p v-if="show('count-badge')" style="display: flex; gap: 24px; align-items: center">
          <WCountBadge :content="unread" :label="ar ? `${unread} إشعارات غير مقروءة` : `${unread} unread notifications`"><button type="button" :aria-label="ar ? 'الإشعارات' : 'Notifications'" @click="unread = unread > 120 ? 0 : unread * 3 + 1">🔔</button></WCountBadge>
          <WCountBadge dot color="success" location="bottom end"><WAvatar name="Grace Hopper" size="small" /></WCountBadge>
        </p>
      </div>
    </VLocaleProvider>
    <code>import { WSkeleton, WRow, WCol, WProgressLinear, WTextarea, WButtonToggle, WCard, WDivider, WList, WIcon, WImage, WAvatar, WCountBadge, WDataTable } from 'wakeb-components'</code>
  </section>
</template>
<style scoped>
.w-demo__cell {
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  text-align: center;
}
</style>

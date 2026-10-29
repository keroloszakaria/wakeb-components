<!-- Generated from docs/reference-data.mjs -->
# WDrawer

حاوية جانبية مؤقتة من Vuetify باتجاهات RTL ومحتوى قابل للتمرير وإجراءات قابلة للتركيب.

## الاستخدام

```vue
<script setup lang="ts">
import { WDrawer } from 'wakeb-components'
import { ref } from 'vue'
const open = ref(false)
</script>
<template>
  <button type="button" @click="open = true">Open</button>
  <WDrawer v-model="open" title="Details"><template #content>Details content</template></WDrawer>
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | حالة الفتح؛ التغيير المحلي يرسل حدثًا واحدًا. |
| `title` | `string` | `""` | عنوان مترجم من المشروع. |
| `persistent` | `boolean` | `false` | منع الإغلاق بالنقر على الخلفية. |
| `closable` | `boolean` | `true` | إظهار زر الإغلاق. |
| `loading` | `boolean` | `false` | طبقة تحميل مستقلة دون تنفيذ طلب. |
| `dataLoaded` | `boolean` | `true` | استبدال المحتوى بالتحميل حتى تجهز البيانات. |
| `closeLabel` | `string` | `"Close"` | اسم زر الإغلاق المقروء بعد ترجمته. |
| `loadingLabel` | `string` | `"Loading"` | اسم مقروء ومترجم للتحميل. |
| `width` | `string \| number` | `420` | الأرقام تمر كما هي؛ النصوص تستخدم parseInt والبديل 420. |
| `position` | `"start" \| "end"` | `"end"` | جانب منطقي حسب RTL في Vuetify. |
| `transparentOverlay` | `boolean` | `false` | إزالة الخلفية المعتمة مع الاحتفاظ بحاوية مؤقتة. |
| `ariaLabel` | `string` | `"Drawer"` | اسم مقروء بديل عند غياب العنوان. |

## الأحداث

`update:modelValue(value: boolean)` للتغييرات المحلية. `close()` من دالة زر الإغلاق فقط بعد تحديث الموديل؛ الخلفية وتغيير الأب لا يرسلان close.

## Slots

`title` و`header-actions` و`close-button {close,label}` و`content` و`default` و`actions` و`loading {label}` و`loading-overlay {label}`. content وdefault يظهران بالتتابع؛ القدم تظهر فقط عند توفير actions.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-drawer-bg` | `rgb(var(--v-theme-surface))` |
| `--wakeb-drawer-border` | `#d0d5dd` |
| `--wakeb-drawer-title` | `inherit` |
| `--wakeb-drawer-radius` | `20px` |
| `--wakeb-drawer-padding` | `1.25rem` |
| `--wakeb-drawer-loading-bg` | `#ffffffaa` |
| `--wakeb-drawer-fallback` | `undefined (legacy adapter switch)` |

## الوصول وحدود السلوك

تحتاج مزود layout من Vuetify، عادة VApp؛ لا تستخدمها خارج layout. الخصائص تستهدف VNavigationDrawer بما فيها خيارات التركيز وresize ومراقبة المسار الأصلية. تظل temporary مع الخلفية واللمس الأصليين؛ end يمين في LTR ويسار في RTL. بعكس VDialog، VNavigationDrawer لا يوفر إغلاق Escape أو حجب تمرير Dialog؛ المكوّن يحتفظ بالسلوك الأصلي. لا تفترض ضمان تراص Dialog عند تداخل حاويات جانبية ونوافذ؛ اختبر التركيب. المشروع يدير التركيز عند الفتح والعودة. العرض "50%" يتحول إلى 50px للحفاظ على سلوك Aware؛ استخدم أرقامًا أو بكسل. المحتوى يتمرر والرأس والقدم خارجه. عدم جاهزية البيانات يزيل المحتوى؛ طبقة التحميل مستقلة دون حفظ أو form. Aware يحتفظ بزر الأيقونة وترجمة المحتوى وربط الثيم ونقاط تنسيق drawer-panel. AddEditModal وschema والتحقق والصلاحيات تبقى في Aware.

## جرّب بنفسك

<OverlayPlayground initial="drawer" />

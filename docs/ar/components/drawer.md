<!-- Generated from docs/reference-data.mjs -->
# WDrawer

حاوية جانبية مؤقتة مشروطة باتجاهات RTL ومحتوى قابل للتمرير وإجراءات قابلة للتركيب. لا تحتاج layout حاضنًا على أي مزود.

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
| `--wakeb-drawer-loading-bg` | `rgba(var(--v-theme-surface), 0.72)` |
| `--wakeb-drawer-fallback` | `undefined (legacy adapter switch)` |
| `--wakeb-drawer-close-color` | `rgb(var(--v-theme-on-surface))` |

## وجهة السمات

العنصر الذي يحمل `.wakeb-drawer`: على Vuetify جذر VNavigationDrawer، وهو عنصر `<div role="dialog">` منقول يبقى في DOM تحت `inert` أثناء إغلاق اللوحة، وعلى PrimeVue العنصر المنقول الذي يحمل `role="dialog"` ولا يوجد إلا أثناء فتح اللوحة. يسميه `title` ثم `ariaLabel` على كل المزودين. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر. وعلى shadcn-vue هو عنصر reka-ui المنقول الذي يحمل `role="dialog"`، ولا يوجد إلا أثناء فتح اللوحة، ويسميه أيضًا `title` ثم `ariaLabel`.

## الوصول وحدود السلوك

على Vuetify: تُرسم بـVNavigationDrawer داخل VLayout خاص بـWakeb يُنقل إلى حاوية الطبقات الخاصة بـVuetify في body، فلا تحتاج VApp ولا VLayout. وداخل VApp تُسجَّل اللوحة في هذا التخطيط الداخلي وحده، فلا يتغير تخطيط التطبيق ولا موضع VMain. هي role=dialog مشروطة مع aria-modal=true: ينتقل التركيز إلى داخلها ويُبقي حاصر التركيز في Vuetify مفتاح Tab فيها، ويغلقها Escape والنقر على الخلفية ما لم تكن persistent، ويُمنع تمرير الصفحة أثناء فتحها، ويعود التركيز إلى زر الفتح بعد إغلاقها. ويُتجاهل Escape ما دام التركيز في طبقة أخرى، مثل نافذة فُتحت من داخل اللوحة. يبقى المحتوى المغلق في DOM تحت جذر inert. يخفي transparentOverlay لون الخلفية ويبقيها، فتظل الصفحة محجوبة. يأخذ الحاضن zIndexOverlay (والقيمة الافتراضية 2000، وهي القيمة الافتراضية لطبقات Vuetify)، وتظهر قوائم Vuetify وتلميحاته ونوافذه المفتوحة من داخل اللوحة فوقها. الخصائص تستهدف VNavigationDrawer؛ ويغلق السحب باللمس ومراقبة المسار الأصليان اللوحة أيضًا ويرسلان update:modelValue فقط. end يمين في LTR ويسار في RTL وفق لغة Vuetify. العرض "50%" يتحول إلى 50px للحفاظ على سلوك Aware؛ استخدم أرقامًا أو بكسل. المحتوى يتمرر والرأس والقدم خارجه. عدم جاهزية البيانات يزيل المحتوى؛ طبقة التحميل مستقلة دون حفظ أو form. Aware يحتفظ بزر الأيقونة وترجمة المحتوى وربط الثيم ونقاط تنسيق drawer-panel. AddEditModal وschema والتحقق والصلاحيات تبقى في Aware. على PrimeVue: تُرسم بـDrawer من PrimeVue، وهو يُنقل إلى body تحت طبقة خلفية خاصة به، فلا يحتاج layout حاضنًا ولا غلافًا حول جذر التطبيق. هي role=dialog مشروطة: ينتقل التركيز إلى داخلها ويبقى Tab فيها، ويغلقها Escape والنقر خارجها ما لم تكن persistent، ويُمنع تمرير الصفحة أثناء فتحها، ويعود التركيز إلى زر الفتح بعد إغلاقها. المحتوى المغلق لا يُرسم. يخفي transparentOverlay لون الخلفية ويبقيها، فتظل الصفحة غير قابلة للتفاعل ويغلق النقر الخارجي اللوحة غير الـpersistent. يتبع الجانب المنطقي خيار direction في Wakeb لا dir الصفحة. تأخذ الخلفية zIndexOverlay، وبدونه تتشارك اللوحة مع WModal ترتيب z-index الخاص بنوافذ PrimeVue. خصائص Vuetify الأصلية للوحة (rail واللمس ومراقبة المسار) لا تنطبق. على shadcn-vue: تُرسم بـSheet من shadcn-vue فوق Dialog من reka-ui، وتُنقل إلى body مع طبقة خلفية خاصة بها، فلا تحتاج layout حاضنًا. هي role=dialog مشروطة مع aria-modal=true: تنقل reka-ui التركيز إلى داخلها وتبقي Tab فيها، وتخفي بقية الصفحة عن التقنيات المساعدة وتمنع تمرير الصفحة؛ ويغلقها Escape والضغط خارجها ما لم تكن persistent، ويعيد Wakeb التركيز إلى العنصر الذي كان مركّزًا قبل فتحها. المحتوى المغلق لا يُرسم. يُبقي transparentOverlay طبقة خلفية شفافة، فتظل الصفحة محجوبة. يتبع الجانب خيار direction في Wakeb، ولا يوجد إلا الجانبان الأيسر والأيمن. تأخذ الطبقة الخلفية واللوحة معًا zIndexOverlay؛ وبدونه تستخدمان z-index الافتراضي 50 في Sheet، وتعلو الطبقات اللاحقة على السابقة.

## جرّب بنفسك

<OverlayPlayground initial="drawer" />

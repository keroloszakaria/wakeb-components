# مزودات الواجهة والإعداد

::: warning إصدار تجريبي للإطار
تشرح هذه الصفحة طبقة المزودات غير المنشورة بعد (المرحلتان M1 وM2، والعمل جارٍ)، وهي ليست جزءًا من 0.7.x.
يبقى الإصدار 0.7.x خاصًا بـVuetify ولا يحتاج أي تكامل في البناء.
:::

لمكونات Wakeb واجهة Vue واحدة: نفس الاستيراد والـprops والأحداث والـslots وروابط `v-model`.
المزود (Vuetify أو PrimeVue) هو الذي يرسم المكونات. تختار المزود مرة واحدة في ملف واحد، ولا
يحتوي ملف البناء إلا على renderers هذا المزود.

## الإعداد

1. ثبّت الحزمة والـpeers الخاصة بمزود **واحد**:

| المزود | التثبيت |
| --- | --- |
| Vuetify | `npm install wakeb-components vuetify` |
| PrimeVue | `npm install wakeb-components primevue @primeuix/themes` |

الإصدارات المختبرة: Vue 3.5 وVite 6.4 وVuetify 3.13 (‏3.13.2 في اختبار الحزمة المعبأة)
وPrimeVue 4.5.5 مع `@primeuix/themes` 2.0.3. PrimeVue 5 غير مدعوم لأن رخصته أصبحت تجارية
وتتطلب مفتاح ترخيص.

2. أنشئ الملف `plugins/wakeb-components.js` بجوار `vite.config.js`:

```js
import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'primevue', // 'vuetify' أو 'primevue'
})
```

3. أضف تكامل البناء مرة واحدة:

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { wakebComponents } from 'wakeb-components/vite'

export default defineConfig({
  plugins: [vue(), wakebComponents()],
})
```

4. ثبّت الـplugin واستورد الأنماط:

```js
import { createApp } from 'vue'
import App from './App.vue'
import wakeb from './plugins/wakeb-components.js'
import 'wakeb-components/style.css'

createApp(App).use(wakeb).mount('#app')
```

يبقى استيراد المكونات واحدًا مع كل مزود:

```vue
<script setup>
import { WButton, WModal } from 'wakeb-components'
</script>
```

## كيف يُحدَّد المزود

تقرأ `wakebComponents()` ملف الـplugin بمحلل نحوي ولا تشغّله أبدًا. الصيغة الوحيدة المقبولة:

```js
import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'vuetify', // نص ثابت
  // بقية الخيارات يمكن أن تكون أي تعبير
})
```

يمكن إعادة تسمية الاستيراد (`import { createWakebComponents as make }`)، وتُقبل صيغ TypeScript
مثل `satisfies`. الصيغ التالية تفشل بالرمز `WAKEB_CONFIG_INVALID`، وتعرض الرسالة الصيغة المقبولة:

| المرفوض | مثال |
| --- | --- |
| قيمة من البيئة | `framework: import.meta.env.VITE_UI` أو `process.env.UI ?? 'vuetify'` |
| متغير أو ثابت مستورد | `framework: UI` |
| Spread | `createWakebComponents({ ...base })` |
| مفتاح مكرر أو محسوب | `{ framework: 'a', framework: 'b' }` و`{ ['framework']: 'a' }` |
| إعادة تصدير | `export { default } from './real-plugin.js'` |
| تصدير افتراضي غير مباشر | `const plugin = createWakebComponents(...); export default plugin` |
| متغير للخيارات | `createWakebComponents(options)` |

لمسار آخر أو حزمة داخل monorepo أو ملف TypeScript مرّر `configFile` نسبيًا إلى جذر Vite:
`wakebComponents({ configFile: 'src/plugins/wakeb.ts' })`. إذا لم يوجد الملف تعرض الرسالة كل
المسارات التي بُحث فيها. تغيير `framework` يعيد تشغيل خادم التطوير، ولا يُبدَّل المزود أثناء العمل.

## نسخة المزود في التطبيق

تثبّت أغلب التطبيقات مزودها بنفسها وتضبط الـtheme الخاص به. في الوضع الافتراضي (`mode: 'auto'`)
يعيد Wakeb استخدام تلك النسخة ولا يغيّر الـtheme ولا القيم الافتراضية ولا الأيقونات ولا اللغة.

```js
export default createWakebComponents({
  framework: 'vuetify',
  providerOptions: { kind: 'vuetify', mode: 'reuse' },
})
```

| الوضع | السلوك |
| --- | --- |
| `auto` (الافتراضي) | يستخدم المزود المثبت على نفس التطبيق، وإلا يثبّت نسخة |
| `reuse` | يتطلب مزودًا مثبتًا، وإلا يفشل بـ`WAKEB_HOST_PROVIDER_MISSING` |
| `install` | يثبّت Wakeb المزود، ويفشل بـ`WAKEB_INSTALL_CONFLICT` إذا كان التطبيق قد ثبّته |

ثبّت مزودك **قبل** `app.use(wakeb)`. يجري الاكتشاف لحظة تثبيت Wakeb، فلا يُرى المزود المثبت
بعده وتتعارض نسختان. الاكتشاف خاص بكل تطبيق: Vuetify عبر خدماته المحقونة، وPrimeVue عبر
`app.config.globalProperties.$primevue`.

يحمل `providerOptions.options` خيارات المزود الأصلية، ويُستخدم فقط عندما يثبّت Wakeb المزود.
هذه الخيارات غير قابلة للنقل بين المزودات، وتُرفض مع `mode: 'reuse'`، وتُرفض أيضًا عندما يجد
وضع `auto` نسخة مثبتة لأنها ستُتجاهل. عندما يثبّت Wakeb مكتبة Vuetify يستخدم `ssr: true`،
وعندما يثبّت PrimeVue يستخدم preset ‏Aura.

## خيارات الـplugin

كل الخيارات اختيارية ما عدا `framework`. القيم غير الصالحة تفشل بالخطأ `WAKEB_CONFIG_INVALID`
مع رسالة تحدد الحقل.

```js
export default createWakebComponents({
  framework: 'vuetify',
  defaults: { WButton: { size: 'md' }, WModal: { persistent: false } },
  locale: 'ar',
  direction: 'rtl',
  theme: { mode: 'dark', tokens: { primary: '#087f8c', radius: '8px' } },
})
```

### القيم الافتراضية للمكونات

يضبط `defaults` خصائص كل نسخ المكوّن في هذا التطبيق. تُحسم قيمة كل خاصية بهذا الترتيب:

1. القيمة الممررة على المكوّن. تُعد `false` و`0` و`''` و`null` قيمًا ممررة.
2. القيمة الافتراضية في الـplugin.
3. النص المدمج الخاص بالـ`locale` المضبوط.
4. القيمة الافتراضية للمكوّن نفسه.

القيمة `undefined` تعني أن الخاصية لم تُمرَّر. وتحتفظ السمات المنطقية بمعناها في HTML، فتكون
`<WButton disabled>` بالقيمة `true` حتى لو كانت القيمة الافتراضية في الـplugin هي `false`.

القيم الافتراضية سطحية: القيمة من نوع object تحل محل القيمة الافتراضية للمكوّن ولا تُدمج
معها. تحصل كل نسخة على نسختها الخاصة، وتغيير الكائن المصدر بعد `createWakebComponents()` لا
يؤثر. وتُرفض الحالات التالية في TypeScript ووقت التشغيل:

- خصائص البيانات والـmodel: `items` و`nodes` و`tabs` و`steps` و`slides` و`config` و`user`
  و`menuItems` و`formats` و`modelValue` و`selectedTab` و`expandedKeys` و`activeKey`
  و`activePath` و`editingNodeId`.
- مستمعات الأحداث مثل `onClick`.
- دوال الاستدعاء مثل `labelFormatter`.
- أسماء المكونات غير المعروفة. ويرفض TypeScript أيضًا الخصائص غير المعروفة وأنواع القيم الخاطئة.

تنطبق القيم الافتراضية على المكونات المستوردة من `wakeb-components`. أما المكونات التي يرسمها
Wakeb داخل مكوّن آخر، مثل زر الإغلاق في WModal، فتأخذ خصائصها من ذلك المكوّن.

### اللغة والاتجاه

يحدد `locale` (القيمة الافتراضية `'en'`) النصوص المدمجة، مثل اسم زر الإغلاق في WModal واسم
حالة WLoading. مع `'ar'` تظهر هذه النصوص بالعربية. خاصية النص أو القيمة الافتراضية في الـplugin
تتقدم دائمًا، ولا يقرأ Wakeb نسخة i18n الخاصة بالتطبيق.

الخيار `direction` مستقل عن `locale`. عند ضبطه يكتب Wakeb السمة `dir` على جذور مكوناته وعلى
محتوى الطبقات المنقولة (teleported). وعند تركه دون ضبط ترث المكونات اتجاه الصفحة.

### متغيرات الـtheme

يضبط `theme.tokens` متغيرات دلالية على جذور مكونات Wakeb ومحتوى الطبقات، وتقتصر على هذا التطبيق:

| الـtoken | المتغير | يستخدمه |
| --- | --- | --- |
| `primary` | `--wakeb-ui-primary` | خلفية WButton الأساسية، ولون `primary` في WDropdown |
| `onPrimary` | `--wakeb-ui-on-primary` | نص WButton الأساسي، وأحرف الصور الرمزية، ونص WBadge الممتلئ |
| `secondary` و`success` و`warning` و`danger` و`info` و`neutral` | `--wakeb-ui-<intent>` | خصائص الألوان المضبوطة على هذا الـintent |
| `surface` | `--wakeb-ui-surface` | خلفية WModal |
| `onSurface` | `--wakeb-ui-on-surface` | عنوان WModal |
| `muted` | `--wakeb-ui-muted` | وصف WModal |
| `border` | `--wakeb-ui-border` | حدود WModal |
| `focus` | `--wakeb-ui-focus` | إطار التركيز في WButton |
| `radius` | `--wakeb-ui-radius` | زوايا WButton وWModal |
| `spacing` | `--wakeb-ui-spacing` | الحشو الداخلي في WModal |
| `fontFamily` | `--wakeb-ui-font-family` | محتوى WModal |
| `zIndexOverlay` (رقم) | `--wakeb-ui-z-index-overlay` | ترتيب طبقات WModal وWDropdown |

متغيرات المكونات مثل `--wakeb-button-primary-background` تتقدم على هذه المتغيرات. تقبل
متغيرات الألوان صيغ hex و`rgb()` و`hsl()` و`var(--…)` وأسماء الألوان، ويقبل `radius`
و`spacing` الأطوال. وتُرفض القيم التي قد تخرج من تعريف CSS.

يكتب `theme.mode: 'dark'` السمة `data-wakeb-theme="dark"` ويحوّل متغيرات السطح والنص والنص
الثانوي والحدود إلى قيم داكنة. لا يتبع Wakeb إعداد `prefers-color-scheme` ولا يحفظ الوضع.
تُطبَّق الخيارات عند تثبيت الـplugin، والتغييرات اللاحقة تتم عبر CSS عادي.

الخيار `icons` غير متاح بعد، وتمريره يفشل بالخطأ `WAKEB_CAPABILITY_UNSUPPORTED`.

## مفردات الأنماط

الخصائص التي تختار نمطًا مرئيًا تقبل قيم Wakeb فقط، فتعمل القيمة نفسها مع كل المزودات. أول
مجموعة قابلة للنقل هي `variant` في WBadge وWTooltipBtn، و`badgeVariant` و`variant` الخاص
بالعناصر في WBadgeStack:

| القيمة | المعنى | الرسم في Vuetify |
| --- | --- | --- |
| `soft` | خلفية خفيفة اللون (افتراضي WBadge) | `tonal` |
| `solid` | خلفية ممتلئة | `flat` |
| `outline` | حدود دون تعبئة | `outlined` |
| `ghost` | نص فقط (افتراضي WTooltipBtn) | `text` |

عمود Vuetify ربط مبدئي لإصدار Vuetify 3.13، وقد يتغير عند إضافة اختبارات العقد المرئي، أما
قيم Wakeb فتبقى ثابتة.

ما زالت الأسماء القديمة تعمل حتى الإصدار الرئيسي التالي. في وضع التطوير يسجّل كل اسم منها
التحذير `WAKEB_DEPRECATED_VALUE` مرة واحدة لكل تطبيق ومكوّن وخاصية وقيمة:

| القيمة القديمة | البديل | ملاحظة |
| --- | --- | --- |
| `default` و`tonal` | `soft` | كانت `default` تُرسم أصلًا بالشكل `tonal` |
| `flat` | `solid` | |
| `elevated` | `solid` | الارتفاع غير قابل للنقل؛ أضف ظلًا عبر CSS |
| `outlined` | `outline` | |
| `text` و`plain` | `ghost` | لا يُحتفظ بالمظهر الباهت لـ`plain` |

القيمة غير المعروفة ترجع إلى القيمة الافتراضية للمكوّن وتسجّل `WAKEB_UNKNOWN_VALUE` في وضع
التطوير. ويُحذف التحذيران من بناء الإنتاج، لأن الكود محاط بشرط `process.env.NODE_ENV` الذي
يستبدله Vite.

### الـintents والألوان

تقبل خصائص الألوان intent من Wakeb أو لون CSS، ويرفض النوع `WakebColor` أي قيمة أخرى أثناء
الترجمة:

- الـintents: ‏`primary` و`secondary` و`success` و`warning` و`danger` و`info` و`neutral`.
- ألوان CSS: ‏`#hex` و`rgb()` و`rgba()` و`hsl()` و`hsla()` و`hwb()` و`lab()` و`lch()` و`oklab()`
  و`oklch()` و`color()` و`color-mix()` و`var(--…)` (مع قيمة احتياطية أو بدونها)، و`transparent`
  و`currentColor`.

الأسماء المجردة مثل `red` أو `error` غير قابلة للنقل، لأن Vuetify يقرؤها أسماءً من ثيمه أو من
لوحة ألوانه.

تشمل القاعدة هذه الخصائص:

- `color` في WLoading
- `avatarColor` في WAvatarStack وWUserBadge
- `color` في WSegmentedProgress
- `dotColor` في WBadge
- `dotColor` في WBadgeStack، و`color` و`dotColor` في عناصره
- `iconColor` في WAccordion

يحتفظ `iconColor` و`color` العنصر في WDropdown بمفاتيح `colorMap` الخاصة به.

يُحسب الـintent بهذا الترتيب: الـtoken الخاص به (مثل `--wakeb-ui-danger`)، ثم لون ثيم المزوّد
المختار، ثم قيمة احتياطية من Wakeb:

| الـintent | الربط في Vuetify | الربط في PrimeVue | القيمة الاحتياطية |
| --- | --- | --- | --- |
| `primary` | `--v-theme-primary` | `--p-primary-color` | `#087f8c` |
| `secondary` | `--v-theme-secondary` | لا يوجد | `#475467` |
| `success` | `--v-theme-success` | لا يوجد | `#12b76a` |
| `warning` | `--v-theme-warning` | لا يوجد | `#f79009` |
| `danger` | `--v-theme-error` | لا يوجد | `#f04438` |
| `info` | `--v-theme-info` | لا يوجد | `#2e90fa` |
| `neutral` | لا يوجد | لا يوجد | `#667085` |

دون tokens يحتفظ تطبيق Vuetify بألوان ثيمه. تأخذ أحرف الصور الرمزية لونها من
`--wakeb-avatar-text`، ثم `--wakeb-ui-on-primary`، ثم الأبيض.

تتبع أسماء ألوان المزوّد سياسة الإهمال. تحت Vuetify تبقى تُرسم كما كانت، وتسجّل
`WAKEB_DEPRECATED_VALUE` في وضع التطوير. أما تحت المزودات الأخرى فترجع إلى القيمة الافتراضية
للخاصية، وتسجّل `WAKEB_UNKNOWN_VALUE`.

`type` في WBadge مفتاح نمط من Wakeb (`WakebBadgeType`) ترسمه Wakeb CSS، ولم يعد يُرسل إلى
Vuetify بوصفه `color` للشارة. لذلك يتبع نص الشارة وأيقونتها لون نص الشارة. والنوع غير الموجود في
القائمة يُعامل كاسم لون من Vuetify، ويخضع لمعالجة الإهمال نفسها. ويملأ `variant="solid"` الشارة
باللون القوي لنوعها، ويمكن تغييره عبر `--wakeb-badge-solid-bg` و`--wakeb-badge-solid-text`.

### أسماء الـSkeleton

يستخدم `skeletonType` في WBaseSidebar، و`type` في عناصر WPageSkeleton وترويساتها، صيغة
Skeleton في Wakeb.

**الأسماء:** ‏`text` و`paragraph` و`heading` و`avatar` و`image` و`button` و`chip` و`list-item`
و`list-item-avatar` و`list-item-two-line` و`list-item-three-line` و`list-item-avatar-two-line`
و`list-item-avatar-three-line` و`table` و`table-row` و`card`.

**الصيغة:**
- تفصل الفواصل بين الأسماء.
- يمكن أن يتبع أي اسم تكرار موجب بالشكل `@N`، مثل `list-item@3`.
- الحد الأقصى للتكرار 100 لكل عنصر.
- القيمة الفارغة تعرض `text`.

**القيم غير الصالحة:**
- تُتجاهل الأسماء غير المعروفة و`@0` والأجزاء غير الصحيحة، مع `WAKEB_UNKNOWN_VALUE` في وضع
  التطوير.
- أما بقية أسماء Vuetify 3.13 (`article` و`actions` و`sentences` وغيرها) فتبقى تعمل تحت
  Vuetify مع `WAKEB_DEPRECATED_VALUE`.

**الشبكة:** تستخدم صفوف WPageSkeleton شبكة Wakeb ذات الأعمدة الاثني عشر. نقاط توقفها ثابتة:
`sm` عند 600px و`md` عند 960px و`lg` عند 1280px، ولا تغيّرها إعدادات المزوّد.
- تقبل `cols` و`sm` و`md` و`lg` القيم من `1` إلى `12`، أو `'auto'`، أو `true` التي تجعل العمود
  يتمدد.
- قيمة `cols` الفارغة تعني 12.
- تُتجاهل القيم الأخرى مع `WAKEB_UNKNOWN_VALUE`، وتأخذ `cols` في هذه الحالة القيمة 12.

## الأخطاء

| الرمز | السبب | الحل |
| --- | --- | --- |
| `WAKEB_CONFIG_INVALID` | framework أو خيار غير معروف، أو defaults أو theme غير صالحة، أو ملف plugin غير صالح أو مفقود | اتبع الرسالة، فهي تحدد الحقل أو الملف |
| `WAKEB_BUILD_PLUGIN_MISSING` | بُني التطبيق دون `wakebComponents()` | أضفها إلى plugins في Vite وأعد التشغيل |
| `WAKEB_FRAMEWORK_MISMATCH` | قيمة `framework` وقت التشغيل تختلف عن قيمة البناء | أعد تشغيل خادم التطوير أو أعد البناء |
| `WAKEB_PROVIDER_MISSING` | الـpeers الخاصة بالمزود المختار غير مثبتة | نفّذ أمر التثبيت الموجود في الرسالة |
| `WAKEB_CONTEXT_MISSING` | رُسم مكوّن دون `app.use(wakeb)` | ثبّت الـplugin على هذا التطبيق |
| `WAKEB_INSTALL_CONFLICT` | plugin ثانٍ لـWakeb على نفس التطبيق، أو وضع `install` مع مزود مثبت | استخدم plugin واحدًا لكل تطبيق |
| `WAKEB_HOST_PROVIDER_MISSING` | وضع `reuse` دون مزود مثبت | ثبّت المزود قبل Wakeb |
| `WAKEB_COMPONENT_UNSUPPORTED` | المحوّل التجريبي المختار لا يحتوي هذا المكوّن | راجع الجدول التالي |
| `WAKEB_CAPABILITY_UNSUPPORTED` | `framework: 'shadcn'` أو الخيار `icons` في هذا البناء | استخدم Vuetify أو PrimeVue، ومرّر الأيقونات عبر الخصائص |

الأخطاء من النوع `WakebError` ولها الخاصية `code`، ويُصدَّر النوع من `wakeb-components`.
أما تحذيرات وضع التطوير (`WAKEB_DEPRECATED_VALUE` و`WAKEB_UNKNOWN_VALUE`) فهي تحذيرات في
الـconsole وليست أخطاء، وتُحذف من بناء الإنتاج.

## المكونات المدعومة

تحتوي `wakeb.capabilities.components` على المكونات التي يرسمها المحوّل المختار.

| المكوّن | Vuetify | PrimeVue (تجريبي) |
| --- | --- | --- |
| WButton وWDropdown وWModal وWLoading | مدعوم | مدعوم |
| بقية المكونات (17 مكوّنًا) | مدعوم | ليس بعد: `WAKEB_COMPONENT_UNSUPPORTED` |
| shadcn-vue | — | مخطط له (المرحلة M5) |

## حدود الإصدار التجريبي

- **نفس العقد مع DOM مختلف.** تجتاز WButton وWDropdown وWModal نفس اختبارات العقد على
  المزودين، لكن الـmarkup مختلف: يرسم PrimeVue القائمة والنافذة بعناصر الطبقة الخاصة به.
- **سمات خاصة بـVuetify.** تبقى `max-width` في WModal وبقية سمات Vuetify الأصلية واجهة توافق
  مع Vuetify فقط. على PrimeVue استخدم الخاصية `width`.
- **التلميح في PrimeVue.** يفتح تلميح WButton على PrimeVue عند مرور المؤشر فقط، ويبقى للزر
  اسم متاح لقارئ الشاشة من `title`.
- **الأنماط في PrimeVue.** يرسم WButton زر PrimeVue دون أنماطه ويعتمد على tokens ‏Wakeb.
  القائمة والنافذة تحتاجان وضع الأنماط في PrimeVue، والتطبيق الذي يفعّل `unstyled: true`
  عمومًا يجب أن يضبط أنماط هذه الطبقات بنفسه.
- **PrimeVue في أكثر من تطبيق.** يحتفظ PrimeVue بخدمة الـtheme على مستوى الوحدة، فيتشارك
  تطبيقان في الصفحة نفسها أنماط الـtheme. يبقى سياق Wakeb منفصلًا لكل تطبيق.
- **حدود نطاق الـtheme.** تصل سمات الـtheme والاتجاه إلى جذور المكونات وإلى طبقات WModal
  وWDropdown، ولا تصل بعد إلى الطبقات الأخرى (التلميحات، وقوائم WAvatarStack وWBadgeStack،
  وWDrawer). تستخدم WButton وWDropdown وWModal هذه المتغيرات، وتحتفظ بقية المكونات بمتغيراتها
  الخاصة حتى يتم نقلها.
- **غلاف المكوّن.** كل مكوّن مستورد من الجذر غلاف رقيق حول renderer المزود. أدوات الاختبار
  التي تبحث عن المكونات بالاسم، مثل `findAllComponents(WTabs)`، تجد الغلاف والـrenderer معًا.
- **الأنماط.** ما زال `style.css` يحتوي أنماط كل الـrenderers، وتقسيمه حسب المزود مخطط له.
- **WDrawer** يحتاج تخطيط تطبيق Vuetify. طبقة overlay محايدة مخطط لها (المرحلة M4).

## ما لا يغطيه تبديل المزود

تبديل المزود يغيّر طريقة رسم مكونات Wakeb فقط، ولا ينقل بقية التطبيق. قبل التبديل ابحث في
مشروعك عن:

- الاستخدام المباشر لمكونات المزود، مثل `v-data-table` أو `DataTable` في PrimeVue.
- منافذ native مثل `chipAttrs`، أو `wrapperAttrs` بسمات خاصة بالمزود، أو خصائص أصلية مُمررة
  كسمات.
- الأنماط التي تستهدف classes أو DOM المزود: `.v-*` و`.p-*`.
- الـtheme وخيارات الـplugin والأيقونات والقيم الافتراضية العامة الخاصة بالمزود.
- السمات الأصلية التي يفهمها مزود واحد فقط، مثل `max-width` في Vuetify.

بحث مقترح: `rg "v-[a-z-]+|\.v-|\.p-|from 'vuetify|from 'primevue" src`.

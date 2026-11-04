# مزودات الواجهة والإعداد

::: warning إصدار تجريبي للإطار
تشرح هذه الصفحة طبقة المزودات غير المنشورة بعد (المرحلة M1)، وهي ليست جزءًا من 0.7.x.
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

## الأخطاء

| الرمز | السبب | الحل |
| --- | --- | --- |
| `WAKEB_CONFIG_INVALID` | framework أو خيار غير معروف، أو ملف plugin غير صالح أو مفقود | اتبع الرسالة، فهي تحدد الحقل أو الملف |
| `WAKEB_BUILD_PLUGIN_MISSING` | بُني التطبيق دون `wakebComponents()` | أضفها إلى plugins في Vite وأعد التشغيل |
| `WAKEB_FRAMEWORK_MISMATCH` | قيمة `framework` وقت التشغيل تختلف عن قيمة البناء | أعد تشغيل خادم التطوير أو أعد البناء |
| `WAKEB_PROVIDER_MISSING` | الـpeers الخاصة بالمزود المختار غير مثبتة | نفّذ أمر التثبيت الموجود في الرسالة |
| `WAKEB_CONTEXT_MISSING` | رُسم مكوّن دون `app.use(wakeb)` | ثبّت الـplugin على هذا التطبيق |
| `WAKEB_INSTALL_CONFLICT` | plugin ثانٍ لـWakeb على نفس التطبيق، أو وضع `install` مع مزود مثبت | استخدم plugin واحدًا لكل تطبيق |
| `WAKEB_HOST_PROVIDER_MISSING` | وضع `reuse` دون مزود مثبت | ثبّت المزود قبل Wakeb |
| `WAKEB_COMPONENT_UNSUPPORTED` | المحوّل التجريبي المختار لا يحتوي هذا المكوّن | راجع الجدول التالي |
| `WAKEB_CAPABILITY_UNSUPPORTED` | `framework: 'shadcn'` في هذا البناء | استخدم Vuetify أو PrimeVue حاليًا |

الأخطاء من النوع `WakebError` ولها الخاصية `code`، ويُصدَّر النوع من `wakeb-components`.

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

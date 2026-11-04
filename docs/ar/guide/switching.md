# تبديل المزود

::: warning إصدار تجريبي للطبقة
يصف هذا الدليل إصدار المزودات غير المنشور بعد (المراحل من M1 إلى M4، قيد التنفيذ). الإصدار 0.7.x خاص
بـVuetify ولا يوجد فيه ما يُبدَّل.
:::

تحتفظ مكونات Wakeb بواجهة Vue واحدة على كل المزودات. التبديل من Vuetify إلى PrimeVue أو العكس يغيّر
طريقة عرض **مكونات Wakeb**، و**لا** ينقل بقية التطبيق. تعرض هذه الصفحة ما يغطيه التبديل وما لا يغطيه،
وقائمة تحقق تكشف العمل المتبقي في مشروعك.

## ما يغطيه التبديل

عندما تغيّر `framework` في ملف الـplugin وتثبّت peers المزود الجديد:

- يبقى استيراد المكونات كما هو: `import { WButton } from 'wakeb-components'`.
- تبقى الـprops والأحداث وقيمها، والـslots وقيمها، وروابط `v-model` والأنواع العامة كما هي ضمن العقد
  القابل للنقل، لأنها تأتي من عقود محايدة لا ترتبط بمزود؛ راجع
  [العقود المكتوبة بالأنواع](./providers#typed-contracts).
- تبقى القيم القابلة للنقل صالحة: الـvariants (`soft` و`solid` و`outline` و`ghost`) والـintents وألوان
  CSS وأنواع الشارة الخاصة بـWakeb وأسماء Skeleton القابلة للنقل. راجع
  [المزودات والإعداد](./providers).
- تسري `defaults` و`locale` و`direction` ومتغيرات `theme` وأسماء `icons` المسجلة في الـplugin على كل
  المزودات.
- تصل `class` و`style` و`id` و`aria-*` و`data-*` ومستمعات DOM إلى وجهة السمات الموثقة نفسها على كل
  مزود؛ راجع [وجهة السمات](./providers#attribute-targets).
- لا تضم الحزمة إلا مكونات المزود المختار. تغيير `framework` يعيد تشغيل خادم التطوير؛ ولا يُبدَّل المزود
  أبدًا أثناء عمل التطبيق.

يعرض Vuetify وPrimeVue المكونات الـ21 كلها. أما مع `framework: 'shadcn'` فيعرض المحوّل التجريبي
المكونات المذكورة في جدول المكونات المدعومة، ويفشل أي مكوّن آخر بالرمز `WAKEB_COMPONENT_UNSUPPORTED`.
راجع جدول المكونات المدعومة في [المزودات والإعداد](./providers)، أو اقرأ `wakeb.capabilities.components`
وقت التشغيل، قبل التبديل.

التطابق البصري غير مضمون. تختلف بنية DOM وأسماء الأصناف والحركات والانتقالات بين المزودات، وقسم حدود
الإصدار التجريبي في [المزودات والإعداد](./providers) يسرد الفروق المعروفة.

## ما لا يغطيه التبديل

تبديل المزود **لا** يغطي:

- **الاستخدام المباشر لمكونات المزود داخل التطبيق**، مثل `v-data-table` أو `DataTable` من PrimeVue أو
  شيفرة shadcn-vue المنسوخة إلى التطبيق. أعد كتابتها أو احتفظ بها بنفسك؛ فهي ما زالت تحتاج مزودها
  مثبتًا.
- **قيم `providerProps` وأي منفذ آخر غير قابل للنقل.** مفاتيح `providerProps` تخص مزودًا واحدًا، وتحت
  مزود آخر تُتجاهل مع `WAKEB_PROVIDER_PROP_IGNORED`. ينطبق ذلك أيضًا على السمات الأصلية مثل `max-width`
  الخاصة بـVuetify على WModal، وعلى الـprops الأصلية الممررة عبر `chipAttrs` أو `wrapperAttrs`.
- **CSS الذي يستهدف أصناف المزود أو بنية DOM الخاصة به**: `.v-*` و`.p-*` وأصناف Tailwind داخل مخرجات
  Wakeb. استخدم بدلًا منها متغيرات `--wakeb-*` و`--wakeb-ui-*`، فهي واجهة التخصيص الثابتة.
- **الـtheme الخاص بالمزود وخيارات الـplugin الخاصة به ومجموعات أيقوناته وقيمه الافتراضية العامة.** لا
  ينسخ Wakeb أبدًا theme من Vuetify إلى PrimeVue أو العكس. أسماء أيقونات MDI و`$alias` الخاصة بـVuetify
  لا تُعرض إلا تحت Vuetify؛ وتحت PrimeVue يظهر مربع الأيقونة الاحتياطي مع `WAKEB_ICON_UNRESOLVED`.
- **الأسماء القديمة المهجورة التي يقبلها مزود واحد فقط.** أسماء ألوان Vuetify (`error`
  و`red-darken-2`) وأسماء Skeleton الخاصة بـVuetify (`article` و`sentences` وغيرها) وأنواع الشارة خارج
  `WakebBadgeType` تُعرض تحت Vuetify مع `WAKEB_DEPRECATED_VALUE`، وتحت PrimeVue ترجع إلى القيمة
  الافتراضية أو تُتخطى مع `WAKEB_UNKNOWN_VALUE`. أما أسماء الـvariants القديمة (`tonal` و`outlined`
  وغيرها) فتختلف: إنها تعمل على كل المزودات.

لذلك فالتبديل ليس عملية «بلا أي تغيير» إلا إذا لم تجد قائمة التحقق التالية شيئًا.

## قائمة التحقق {#checklist}

نفّذ عمليات البحث التالية من جذر مشروعك قبل التبديل. كل نتيجة عمل يجب مراجعته. تستخدم الأنماط أداة
[ripgrep](https://github.com/BurntSushi/ripgrep)؛ عدّل `src` بحسب مجلدات الشيفرة لديك.

```sh
# 1. مكونات المزود واستيراده
rg -n "<v-[a-z]|<V[A-Z][A-Za-z]+|from ['\"](vuetify|primevue)" src
# 2. providerProps
rg -n -i "provider-?props" src
# 3. حقائب السمات الأصلية والسمات الخاصة بـVuetify على مكونات Wakeb
rg -n -i "chip-?attrs|wrapper-?attrs|max-width" src
# 4. CSS يستهدف أصناف المزود
rg -n "\.(v|p)-[a-z]" -g "*.{css,scss,vue}" src
# 5. props الألوان بأسماء مجردة (راجع كل نتيجة؛ الـintents مقبولة)
rg -n "(color|avatar-?color|dot-?color|icon-?color)=\"[a-z]+(-[a-z]+-[0-9])?\"" src
# 6. أسماء Skeleton الخاصة بـVuetify
rg -n "(actions|article|card-avatar|date-picker|divider|ossein|sentences|subtitle|table-(heading|thead|tbody|tfoot|cell|row-divider))" src
# 7. أسماء أيقونات المزود
rg -n "mdi-|pi-[a-z]" src
# 8. الـvariants المهجورة (تعمل على كل المزودات، لكنها تُحذف في الإصدار الرئيسي التالي)
rg -n "variant=\"(default|tonal|flat|elevated|outlined|text|plain)\"" src
# 9. إعداد المزود في التطبيق
rg -n "createVuetify|app\.use\(PrimeVue" src
```

البحثان 5 و6 يطابقان كلمات عادية أيضًا؛ راجع كل نتيجة يدويًا.

ثم بدّل المزود وتحقق:

1. ثبّت peers المزود الجديد، مثل `npm install primevue @primeuix/themes`. الحد الأدنى والأحدث من
   الإصدارات المختبرة موجودان في [الإصدارات المدعومة](./installation).
2. غيّر النص الحرفي في ملف الـplugin: `createWakebComponents({ framework: 'primevue' })`.
3. إن كان ملف الـplugin يضبط `providerOptions`، فغيّر `kind` إلى المزود الجديد، واحذف `options` أو أعد
   كتابتها، لأنها خيارات أصلية للمزود القديم. القيمة `kind` التي لا تطابق `framework` تفشل بالرمز
   `WAKEB_CONFIG_INVALID`.
4. استبدل إعداد المزود في مدخل التطبيق (البحث 9)، أو احذفه ودع Wakeb يثبّت المزود. راجع
   [أوضاع نسخة المزود](#host-provider-modes).
5. أعد تشغيل خادم التطوير. يعيد Wakeb تشغيله تلقائيًا عند تغيّر ملف الـplugin.
6. افتح كل شاشة في وضع التطوير واقرأ الـconsole. الرموز `WAKEB_PROVIDER_PROP_IGNORED`
   و`WAKEB_UNKNOWN_VALUE` و`WAKEB_ICON_UNRESOLVED` تسمّي كل قيمة لم تنتقل، والرمز
   `WAKEB_COMPONENT_UNSUPPORTED` يسمّي مكونًا لا يدعمه الـadapter الجديد.
7. شغّل `vue-tsc` أو `tsc --strict`، ثم اختباراتك. تحقق من تركيز لوحة المفاتيح في النوافذ والقوائم
   (WModal وWDrawer والقوائم) داخل متصفح حقيقي، لأن إدارة التركيز يملكها المزود.
8. أزل المزود القديم عندما لا يستخدمه أي جزء من التطبيق (البحث 1).

**تقرير التطوير.** تقترح المواصفة تقريرًا واحدًا في وضع التطوير بالقيم غير القابلة للنقل التي استخدمها
التطبيق. هذا التقرير **غير منفّذ بعد**: استخدم تحذيرات الـconsole السابقة، التي تُكتب مرة واحدة لكل
تطبيق ولكل قيمة، مع عمليات البحث.

## أوضاع نسخة المزود {#host-provider-modes}

معظم التطبيقات تثبّت مزودها وتضبط الـtheme الخاص به مسبقًا. يحدد `providerOptions.mode` هل يعيد Wakeb
استخدام تلك النسخة أم يثبّت نسخته:

| الوضع | السلوك |
| --- | --- |
| `auto` (الافتراضي) | يعيد استخدام نسخة المزود المثبتة على التطبيق نفسه، وإلا يثبّت واحدة |
| `reuse` | يتطلب نسخة التطبيق؛ ويفشل بالرمز `WAKEB_HOST_PROVIDER_MISSING` إن لم توجد |
| `install` | يثبّت Wakeb المزود؛ ويفشل بالرمز `WAKEB_INSTALL_CONFLICT` إن كان التطبيق قد ثبّته |

```js
// plugins/wakeb-components.js
import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'primevue',
  providerOptions: { kind: 'primevue', mode: 'reuse' },
})
```

- **ترتيب التثبيت.** ثبّت المزود قبل `app.use(wakeb)`. يجري الاكتشاف عند تثبيت Wakeb، فالمزود الذي يُثبَّت
  بعده لا يُرى.
- **الاكتشاف** يتم لكل تطبيق على حدة. يُكتشف Vuetify عبر خدماته المحقونة للـtheme والقيم الافتراضية
  والأيقونات واللغة، ويُكتشف PrimeVue عبر `app.config.globalProperties.$primevue`. تطبيقان في الصفحة
  نفسها يحصلان على نتيجتين منفصلتين.
- **إعادة الاستخدام لا تمس نسخة التطبيق.** لا يغيّر Wakeb الـtheme أو القيم الافتراضية أو الأيقونات أو
  اللغة في النسخة المعاد استخدامها. تنطبق `theme` و`locale` و`direction` الخاصة بـWakeb على مكونات Wakeb
  فقط.
- **الخيارات الأصلية `options`.** تُستخدم `providerOptions.options` فقط عندما يثبّت Wakeb المزود.
  وتُرفض بالرمز `WAKEB_CONFIG_INVALID` مع `mode: 'reuse'`، ومع `auto` أيضًا عند العثور على نسخة في
  التطبيق، لأنها ستُتجاهل. هذه الخيارات غير قابلة للنقل: أعد كتابتها عند التبديل.
- **القيم الافتراضية عندما يثبّت Wakeb المزود.** يُثبَّت Vuetify مع `ssr: true`، ويُثبَّت PrimeVue مع
  الـpreset ‏Aura.
- **shadcn-vue** غير منفّذ بعد، لذلك لا توجد له أوضاع في هذا الإصدار.

::: warning غير قابل للنقل: `providerProps`
تمرّر `providerProps` على WButton وWDropdown وWModal وWLoading props أصلية إلى المكون الأساسي للمزود
المختار. مفاتيح مزود ما لا تعني شيئًا تحت مزود آخر. كل مثال على `providerProps` غير قابل للنقل ويجب
مراجعته عند التبديل:

```vue
<!-- غير قابل للنقل: Vuetify فقط. تحت PrimeVue يُتجاهل المفتاح مع تحذير. -->
<WModal v-model="open" title="تعديل" :provider-props="{ scrollable: true }" />

<!-- غير قابل للنقل: PrimeVue فقط. تحت Vuetify يُتجاهل المفتاح مع تحذير. -->
<WModal v-model="open" title="تعديل" :provider-props="{ position: 'top' }" />
```

راجع [الخصائص الأصلية](./providers#native-props) لمعرفة المفاتيح التي يتجاهلها Wakeb دائمًا.
:::

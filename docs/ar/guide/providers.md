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
| shadcn-vue (تجريبي) | `npm install wakeb-components reka-ui` |

لا يحتاج shadcn-vue إلى إعداد Tailwind CSS ولا إلى ملف `components.json` ولا إلى أداة shadcn-vue
CLI. يوفّر Wakeb نسخه المعدّلة من مكونات shadcn-vue فوق `reka-ui`، مع أنماط CSS مُعدّة مسبقًا داخل
`style.css`. راجع قسم [shadcn-vue](#shadcn-vue) أدناه.

أقل إصدارات الـpeers المختبرة وأحدثها مذكورة في [الإصدارات المدعومة](./installation#الإصدارات-المدعومة).
PrimeVue 5 غير مدعوم لأن رخصته أصبحت تجارية وتتطلب مفتاح ترخيص.

2. أنشئ الملف `plugins/wakeb-components.js` بجوار `vite.config.js`:

```js
import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'primevue', // 'vuetify' أو 'primevue' أو 'shadcn'
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

لا توجد لـshadcn-vue نسخة على مستوى التطبيق، فمكوناته ملفات مصدرية، ويوفّر Wakeb نسخه الخاصة
منها. مع `framework: 'shadcn'` لا يضيف الوضعان `auto` و`install` إلا سياق Wakeb، ويفشل الوضع
`reuse` بالرمز `WAKEB_HOST_PROVIDER_MISSING`. ويُرفض `providerOptions.options` بالرمز
`WAKEB_CONFIG_INVALID`، لأنه لا يوجد ما يُضبط.

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
- `providerProps`، لأنه غير قابل للنقل ويُضبط لكل نسخة على حدة (راجع [الخصائص الأصلية](#native-props)).
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
| `zIndexOverlay` (رقم) | `--wakeb-ui-z-index-overlay` | ترتيب الطبقات المنقولة: WModal وWDropdown وWExportDropdown وقائمتا WAvatarStack وWBadgeStack وتلميحات Vuetify وWDrawer على PrimeVue |

متغيرات المكونات مثل `--wakeb-button-primary-background` تتقدم على هذه المتغيرات. تقبل
متغيرات الألوان صيغ hex و`rgb()` و`hsl()` و`var(--…)` وأسماء الألوان، ويقبل `radius`
و`spacing` الأطوال. وتُرفض القيم التي قد تخرج من تعريف CSS.

يكتب `theme.mode: 'dark'` السمة `data-wakeb-theme="dark"` ويحوّل متغيرات السطح والنص والنص
الثانوي والحدود إلى قيم داكنة. لا يتبع Wakeb إعداد `prefers-color-scheme` ولا يحفظ الوضع.
تُطبَّق الخيارات عند تثبيت الـplugin، والتغييرات اللاحقة تتم عبر CSS عادي.

### الأيقونات

تقبل خصائص الأيقونات (`icon` و`badgeIcon` و`headerIcon` و`expandIcon` و`collapseIcon`، و`icon`
في عناصر القوائم وصيغ التصدير) قيمة من النوع `SharedIcon`، وهي واحدة مما يلي:

- **اسم** مثل `'$close'` أو `'brand-logo'`، ويُحل بالترتيب الموضح أدناه.
- **بيانات مسار SVG** (`WakebSvgIcon`): مصفوفة من نصوص المسارات أو أزواج `[path, opacity]`
  على مساحة 24×24، مثل `['M7 10l5 5 5-5z']`. والنص الذي يبدأ بـ`svg:` يُقرأ مسارًا واحدًا، مثل
  `'svg:M7 10l5 5 5-5z'`، وبذلك تبقى مدخلات SVG الحالية في Vuetify تعمل.
- **مكوّن Vue** يُرسم كما هو.

ويسجّل الخيار `icons` أسماءً خاصة بهذا التطبيق:

```js
import { h } from 'vue'
import BrandLogo from './BrandLogo.vue'

export default createWakebComponents({
  framework: 'primevue',
  icons: {
    aliases: {
      'brand-logo': BrandLogo,
      $close: ['M6 6l12 12M18 6L6 18'],
    },
    resolve: (name) => (name.startsWith('app-') ? appIcons[name.slice(4)] : undefined),
  },
})
```

| الحقل | النوع | المعنى |
| --- | --- | --- |
| `aliases` | `Record<string, WakebIconDefinition>` | أسماء مربوطة ببيانات مسار SVG أو بمكوّن |
| `resolve` | `(name: string) => WakebIconDefinition \| undefined` | يُستدعى للأسماء غير الموجودة في `aliases`؛ أعد `undefined` لمتابعة الحل |

النوع `WakebIconDefinition` إما بيانات مسار SVG أو مكوّن Vue. لا يُقبل النص قيمةً محلولة، فلا
يمكن أن يشير اسم إلى اسم آخر أو إلى HTML، ولا يرسم Wakeb الأيقونات من نصوص HTML أبدًا. ولا
تحتوي بيانات المسار إلا أوامر مسارات SVG والأرقام. وتُنسخ `aliases` عند إنشاء الـplugin، فلا
يؤثر تعديل الكائن الأصلي بعد ذلك.

يُحل الاسم بالترتيب التالي، وأول تطابق هو المعتمد:

1. البادئة `svg:`: بقية النص مسار SVG واحد.
2. `icons.aliases[name]`.
3. `icons.resolve(name)`.
4. أيقونة مدمجة في Wakeb (الجدول أدناه).
5. مجموعة الأيقونات الخاصة بالمزود المختار:
   - **Vuetify:** يُمرَّر الاسم إلى `VIcon`، فتبقى أسماء `mdi-*` وأسماء `$alias` تعمل وفق إعداد
     الأيقونات وخط الأيقونات في Vuetify لديك.
   - **PrimeVue:** تُرسم أسماء أصناف PrimeIcons (`pi pi-check` أو `pi-check`) في عنصر `<i>`.
     حمّل ملف CSS الخاص بـ`primeicons` بنفسك.
6. أي اسم آخر: مربع Wakeb البديل (أدناه).

الأيقونات المدمجة مسارات SVG بسيطة من Material Design Icons (رخصة Apache-2.0). لا تحتاج إلى
خط أيقونات، وتُرسم بالشكل نفسه مع كل المزودات:

| الاسم | الشكل | يُستخدم افتراضيًا في |
| --- | --- | --- |
| `$expand` | سهم للأسفل | مؤشر `isDropdown` في WButton، و`icon` في WAccordion، و`expandIcon` في WDropdown |
| `$collapse` | سهم للأعلى | `collapseIcon` في WDropdown |
| `$prev` و`$next` | سهم لليسار وسهم لليمين | أسهم WCarousel على PrimeVue |
| `$close` | علامة إغلاق | متاحة للاستخدام |
| `$loading` | ربع قوس (ثابت؛ حرّكه عبر CSS) | متاحة للاستخدام |
| `$complete` | علامة صح | متاحة للاستخدام |
| `$checkboxOn` و`$checkboxOff` | مربع محدد ومربع فارغ | متاحة للاستخدام |
| `$radioOn` و`$radioOff` | دائرة ممتلئة ودائرة فارغة | متاحة للاستخدام |

لأن الأيقونات المدمجة تسبق المزود، أصبح `$expand` و`$collapse` يُرسمان بـSVG من Wakeb تحت
Vuetify أيضًا وبالحجم نفسه. لاستخدام شكلك الخاص سجّل الاسم في `icons.aliases`، أو مرّر اسمًا من
المزود مثل `mdi-chevron-down` تحت Vuetify.

**البديل.** عندما لا يُحل الاسم ولا تملك المزود مجموعة أيقونات مطابقة، يرسم Wakeb إطار مربع
(`svg.wakeb-icon--fallback`) بالحجم واللون المطلوبين، فيحافظ العنصر على حجمه ويبقى قابلًا
للاستخدام. وفي وضع التطوير يسجّل Wakeb أيضًا `WAKEB_ICON_UNRESOLVED` مرة واحدة لكل تطبيق واسم.
وإذا أعادت `resolve` قيمة ليست بيانات مسار SVG ولا مكوّنًا، تُتجاهل مع الرمز نفسه ويستمر الحل
بالأيقونات المدمجة. ويُحذف التحذير من بناء الإنتاج.

**الحدود.**

- أسماء MDI وأسماء alias في Vuetify غير قابلة للنقل؛ فهي تُرسم تحت Vuetify فقط، وتحت PrimeVue
  يظهر مكانها المربع البديل. استخدم بيانات مسار أو مكوّنًا أو alias في `icons` عندما يجب أن تعمل
  الأيقونة مع كل المزودات.
- تستقبل slots الأيقونات (`icon` و`dropdown` و`item-icon` و`header-icon` وغيرها) القيمة التي
  مرّرتها، لا الأيقونة المحلولة.
- الأيقونات زخرفية (`aria-hidden`)، فأعطِ العناصر التي تحتوي أيقونة فقط `ariaLabel` أو `title`.
- تعمل `resolve` عند كل رسم ويجب أن تكون متزامنة. أعد القيمة نفسها للاسم نفسه، من خريطة مثلًا،
  حتى لا تُعاد إنشاء المكونات. ويحتاج تعريف المكوّن إلى دالة `render` أو `setup`، وتُرفض كائنات
  `template` التي تُترجم وقت التشغيل.
- يُقرأ الخيار `icons` مرة واحدة عند التثبيت، وهو خاص بالتطبيق، فيمكن لتطبيقين أو لطلبَي SSR
  استخدام محلِّلات مختلفة.

## مفردات الأنماط

الخصائص التي تختار نمطًا مرئيًا تقبل قيم Wakeb فقط، فتعمل القيمة نفسها مع كل المزودات. أول
مجموعة قابلة للنقل هي `variant` في WBadge وWTooltipBtn، و`badgeVariant` و`variant` الخاص
بالعناصر في WBadgeStack:

| القيمة | المعنى | الرسم في Vuetify | WBadge في PrimeVue | WTooltipBtn في PrimeVue |
| --- | --- | --- | --- | --- |
| `soft` | خلفية خفيفة اللون (افتراضي WBadge) | `tonal` | `.wakeb-badge--soft` | `.wakeb-tooltip-btn--soft` |
| `solid` | خلفية ممتلئة | `flat` | `.wakeb-badge--solid` | `.wakeb-tooltip-btn--solid` |
| `outline` | حدود دون تعبئة | `outlined` | `.wakeb-badge--outline` | `.wakeb-tooltip-btn--outline` |
| `ghost` | نص فقط (افتراضي WTooltipBtn) | `text` | `.wakeb-badge--ghost` | `.wakeb-tooltip-btn--ghost` |

عمود Vuetify ربط مبدئي لإصدار Vuetify 3.13، وقد يتغير عند إضافة اختبارات العقد المرئي، أما
قيم Wakeb فتبقى ثابتة.

لا يوفر PrimeVue 4.5 نمطًا خفيف اللون (tonal) للشارات أو الأزرار، لذلك لا يستخدم عمودا PrimeVue
أي نمط أصلي. يرسم WBadge مكوّن `Tag` من PrimeVue دون أنماطه، ويرسم WTooltipBtn مكوّن `Button`
دون أنماطه، وتتولى Wakeb CSS رسم القيم الأربع (سياسة المظهر في SPEC R23). يتشارك WBadge ملف
أنماط واحدًا مع renderer ‏Vuetify لألوان الأنواع والتعبئة في `solid` ونصف القطر والـpadding
والنقطة، ويضيف المظهرين اللذين يرسمهما VChip تحتها: طبقة سفلية من `currentColor` بنسبة 12% في
`soft`، وحدًّا بعرض 1px من `currentColor` في `outline`. ويحتفظ WTooltipBtn بأبعاد VBtn (ارتفاع
36px، أو دائرة بقطر 48px مع `btnIcon`) وبلون `currentColor`، ويملأ `solid` الزر بـ
`--wakeb-ui-primary` و`--wakeb-ui-on-primary`. لم تُقارن هذه المظاهر في PrimeVue بمظهر Vuetify
في متصفح حقيقي بعد.

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

تحت shadcn-vue يُربط `primary` بالمتغير `--primary`، ويُربط `danger` بالمتغير `--destructive`،
ولا ربط لبقية الـintents. يفترض هذا الربط ثيم shadcn-vue مبنيًا على Tailwind CSS v4، حيث تحمل
المتغيرات ألوانًا كاملة مثل `oklch(…)`. أما ثيم Tailwind v3 فيخزّن قنوات HSL مجردة
(`222 47% 11%`) وهي ليست لونًا، فاضبط عندها `theme.tokens.primary` و`theme.tokens.danger`.

دون tokens يحتفظ تطبيق Vuetify بألوان ثيمه. تأخذ أحرف الصور الرمزية لونها من
`--wakeb-avatar-text`، ثم `--wakeb-ui-on-primary`، ثم الأبيض.

تتبع أسماء ألوان المزوّد سياسة الإهمال. تحت Vuetify تبقى تُرسم كما كانت، وتسجّل
`WAKEB_DEPRECATED_VALUE` في وضع التطوير. أما تحت المزودات الأخرى فترجع إلى القيمة الافتراضية
للخاصية، وتسجّل `WAKEB_UNKNOWN_VALUE`.

`type` في WBadge مفتاح نمط من Wakeb (`WakebBadgeType`) ترسمه Wakeb CSS، ولم يعد يُرسل إلى
Vuetify بوصفه `color` للشارة. لذلك يتبع نص الشارة وأيقونتها لون نص الشارة. والنوع غير الموجود في
القائمة يُعامل كاسم لون من Vuetify، ويخضع لمعالجة الإهمال نفسها. ويملأ `variant="solid"` الشارة
باللون القوي لنوعها، ويمكن تغييره عبر `--wakeb-badge-solid-bg` و`--wakeb-badge-solid-text`.
أما تحت PrimeVue فلا يُقرأ النوع غير الموجود في القائمة كلون: تستخدم الشارة `primary` وتسجّل
`WAKEB_UNKNOWN_VALUE` في وضع التطوير.

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

## وجهة السمات {#attribute-targets}

يرسل كل مكوّن `class` و`style` و`id` و`aria-*` و`data-*` ومستمعي DOM مثل `@mouseenter` إلى
عنصر واحد فقط، وهو وجهة السمات الخاصة به. أما مستمعو الأحداث التي يعلنها المكوّن، مثل `@click`
في WButton أو `@update:modelValue` في WModal، فهي أحداث Vue: تُطلق مرة واحدة ولا تُربط بالـDOM
أيضًا. تُدمج `class` و`style` مع قيم Wakeb، وتتبع السمات الأخرى التي تحمل الاسم نفسه القواعد
التالية.

| المكوّن | وجهة السمات |
| --- | --- |
| WButton | عنصر `<button>` الأصلي على كل المزودين. أما `wrapperAttrs` فتستهدف الـdiv الخارجي للتخطيط. |
| WDropdown | العنصر الجذري `div` على كل المزودين، وليس زر الفتح ولا القائمة المنقولة. |
| WModal | العنصر الذي يحمل `role="dialog"` (ويحمل أيضًا `.wakeb-modal`) على كل المزودين، وهو منقول خارج المكوّن. |
| WLoading | الجذر الذي يحمل `role="status"` على كل المزودين. |
| WTruncatedText | عنصر `<span>` النصي الذي يفتح الـTooltip. |
| WTooltipBtn | عنصر `<button>` الأصلي. أما `wrapperAttrs` فتستهدف الـspan الخارجي. |
| WCarousel | جذر العرض المتتابع (`role="region"`). وكل مؤشر يستقبل `indicatorAttrs`. |
| WDrawer | العنصر الذي يحمل `.wakeb-drawer`: على Vuetify جذر اللوحة، وهو عنصر `<nav>`؛ وعلى PrimeVue وshadcn-vue العنصر المنقول الذي يحمل `role="dialog"`، ولا يوجد إلا أثناء فتح اللوحة. |
| WExportDropdown | طبقة القائمة المنقولة على كل المزودين، ولا توجد إلا أثناء فتح القائمة (للتوافق مع الإصدار الأساسي). وعلى shadcn-vue هي عنصر يغلّف العنصر ذا `role="menu"`. |
| WTree | عنصر `ul` الجذري (`role="tree"`). |
| بقية المكونات | العنصر الجذري. يرسل WBadge القيمة `chipAttrs` إلى الـchip، ويرسل WBadgeStack القيمة `badgeAttrs` إلى كل شارة. |

في WButton وWDropdown وWModal وWLoading تغلب الروابط التي يملكها Wakeb على السمات: قيمة
`type` للزر، ومعالجة التعطيل والتحميل، والاسم الوصفي للنافذة، وقيمتا `role` و`aria-label`
لحالة التحميل. لتغيير هذه القيم استخدم الخصائص المكتوبة (`title` و`ariaLabel` و`label`).
ويُستثنى WButton: قيمة `aria-label` من المستخدم تسمي الزر. أما المكونات التي يرسمها Vuetify
فقط فما زالت تستخدم دمج السمات الافتراضي في Vue، فتحل السمة القادمة من المستخدم محل سمة المكوّن
التي تحمل الاسم نفسه؛ لا تمرر `role` أو قيم `aria-*` يضعها المكوّن أصلًا. وستنتقل إلى القواعد
نفسها عند نقلها.

تتبع WSegmentedProgress وWVerticalSteps وWPageSkeleton هذه القواعد على المزودين: تبقى قيم
`role` و`aria-value*` و`aria-busy` ملكًا لـWakeb. وقيمة `aria-label` من المستخدم هي الخاصية
المكتوبة `ariaLabel` في WSegmentedProgress؛ أما في WVerticalSteps وWPageSkeleton فاستخدم `label`.

تذكر صفحة كل مكوّن وجهة سماته في قسم **وجهة السمات**.

## الخصائص الأصلية: `providerProps` {#native-props}

::: warning غير قابل للنقل
يستقبل `providerProps` خصائص أصلية خاصة بالمزود المختار. المفاتيح نفسها لا تعني شيئًا، أو تعني
شيئًا آخر، تحت مزود آخر، وتبديل المزود لا يترجمها. فضّل الخصائص والـslots والسمات والمتغيرات
القابلة للنقل، واجعل كل استخدام سهل العثور عليه.
:::

تقبل WButton وWDropdown وWModal وWLoading الخاصية `providerProps`، وهي كائن بسيط من الخصائص
والأحداث الأصلية يمرره Wakeb إلى primitive واحد في المزود:

| المكوّن | primitive في Vuetify | primitive في PrimeVue |
| --- | --- | --- |
| WButton | `VBtn` | `Button` |
| WDropdown | `VMenu` | `Menu` |
| WModal | `VDialog` | `Dialog` |
| WLoading | `VProgressCircular` | `ProgressSpinner` |

```vue
<!-- غير قابل للنقل: Vuetify فقط. تحت PrimeVue تُتجاهل هذه المفاتيح مع تحذير. -->
<WModal v-model="open" title="تعديل" :provider-props="{ scrollable: true, onAfterEnter: track }" />

<!-- غير قابل للنقل: PrimeVue فقط. -->
<WModal v-model="open" title="تعديل" :provider-props="{ position: 'top', onShow: track }" />
```

**ما يُتجاهل.** يحذف Wakeb هذه المفاتيح في كل بناء، ويبلّغ عن كل مفتاح مرة واحدة لكل تطبيق في
وضع التطوير بالتحذير `WAKEB_PROVIDER_PROP_IGNORED`:

- السمات القابلة للنقل: `class` و`style` و`id` و`role` و`tabindex` و`aria-*` و`data-*`،
  وكذلك `key` و`ref`. مررها على المكوّن نفسه لتصل إلى وجهة سماته.
- الروابط التي يملكها Wakeb: الـmodels وكل معالج `onUpdate:*`، وحماية التحميل والتعطيل، ونوع
  العنصر، وحصر التركيز وترتيب الطبقات، والأحداث الأصلية التي تكرر حدثًا قابلًا للنقل. وتفصيلها:
  - WButton: `disabled` و`loading` و`type` و`onClick` ومفاتيح الروابط وتغيير العنصر (`href`
    و`to` و`tag` في Vuetify؛ و`as` و`asChild` إضافة إلى `label` و`badge` و`unstyled` و`pt`
    في PrimeVue).
  - WDropdown: `modelValue` و`disabled` و`zIndex` و`activator` في Vuetify؛ و`model` و`popup`
    و`autoZIndex` و`baseZIndex` و`pt` في PrimeVue.
  - WModal: `modelValue` و`persistent` و`maxWidth` و`zIndex` و`activator` و`onAfterLeave`
    و`retainFocus` و`captureFocus` و`contentProps` في Vuetify؛ و`visible` و`modal`
    و`blockScroll` و`draggable` و`closeOnEscape` و`dismissableMask` و`autoZIndex`
    و`baseZIndex` و`pt` و`onAfterHide` في PrimeVue.
  - WLoading: `indeterminate` و`modelValue` و`color` و`size` في Vuetify؛ و`strokeWidth`
    و`pt` في PrimeVue.
- المفاتيح التي لا يعلنها الـprimitive المختار كخاصية أو حدث، ومنها مستمعو DOM العاديون مثل
  `onMouseenter`. اربطها على المكوّن نفسه.

تحت shadcn-vue تكون الـprimitives نسخ Wakeb المعدّلة من مكونات shadcn-vue:

| المكوّن | primitive في shadcn-vue | مفاتيح يملكها Wakeb وتُتجاهل |
| --- | --- | --- |
| WButton | `Button` (`variant` و`size`، إضافة إلى `Primitive` من reka-ui) | `as` و`asChild` و`disabled` و`type` و`onClick` |
| WDropdown | `DropdownMenuContent` (reka-ui) | `forceMount` و`as` و`asChild` و`reference` و`portal` و`onEscapeKeyDown` و`onCloseAutoFocus` |
| WModal | `DialogContent` (reka-ui) | `forceMount` و`disableOutsidePointerEvents` و`as` و`asChild` و`overlayAttrs` و`onEscapeKeyDown` و`onPointerDownOutside` و`onInteractOutside` و`onCloseAutoFocus` و`onAfterLeave` |
| WLoading | `Spinner` (أيقونة `loader-circle` من Lucide) | `size` و`color` |

قيم `variant` في زر shadcn-vue ‏(`default` و`destructive` و`outline` و`secondary` و`ghost`
و`link`) وقيم `size` ‏(`default` و`xs` و`sm` و`lg` و`icon` و`icon-xs` و`icon-sm` و`icon-lg`) قيم
أصلية، وليست جزءًا من مفردات الأنماط في Wakeb. كل ما تفعله أنها تضيف تنسيق `data-variant`
و`data-size` فوق `type` و`size` الخاصين بـWButton:

```vue
<!-- غير قابل للنقل: shadcn-vue فقط. -->
<WButton title="حذف" :provider-props="{ variant: 'destructive', size: 'sm' }" />
```

**الأولوية.** على الـprimitive تغلب روابط Wakeb أولًا، ثم السمات المُمررة على المكوّن، ثم
`providerProps`. الأحداث الأصلية التي يستخدمها Wakeb أيضًا، مثل `onShow` في النافذة، تعمل بجانب
معالج Wakeb ولا تحل محله.

**النطاق.** `providerProps` خاص بكل نسخة. ترفضه `defaults` في الـplugin في TypeScript ووقت
التشغيل (`WAKEB_CONFIG_INVALID`). نوعه `WakebProviderProps` ‏(`Record<string, unknown>`)، لذلك
تبقى تعريفات الجذر محايدة تجاه المزود ولا يفحص TypeScript المفاتيح الأصلية، بل يفحصها التحقق
وقت التشغيل مقابل الـprimitive المختار. لا يصل إلى المكونات الداخلية، مثل زر الفتح داخل
WDropdown أو زر الإغلاق داخل WModal. ولا تقبله المكونات السبعة عشر الأخرى بعد: يرفضه TypeScript،
ويُحذف وقت التشغيل مع التحذير نفسه.

## العقود المكتوبة بالأنواع {#typed-contracts}

يأتي نوع TypeScript لكل مكوّن جذري من عقد محايد تجاه المزود، لا من أي renderer. لذلك تبقى
الخصائص وحمولات الأحداث وحمولات الـslots وروابط `v-model` واحدة أيًّا كان المزود المختار، ولا
يظهر أي نوع من Vuetify أو PrimeVue في ملفات التصريحات.

| النوع | ما يصفه |
| --- | --- |
| `ButtonProps` و`ModalProps` وبقية أنواع `*Props` | الخصائص، وهي مدرجة في [نماذج البيانات](/ar/guide/data-models) |
| `ButtonEmits` و`ModalEmits` وبقية أنواع `*Emits` | اسم كل حدث مع tuple الحمولة الخاصة به، للمكونات العشرة التي تُطلق أحداثًا |
| `ButtonSlots` و`ModalSlots` وبقية أنواع `*Slots` | كل slot وحمولته، لجميع المكونات؛ والنوع `PageSkeletonSlots` فارغ |
| `WakebComponentEmits` و`WakebComponentSlots` | الخرائط نفسها مفهرسة باسم المكوّن، على غرار `WakebComponentProps` |
| `WakebComponent<'WButton'>` | نوع المكوّن العام لواجهة واحدة |
| `WakebFacade<Props, Emits, Slots>` | النوع المساعد الذي يبني نوع المكوّن من العقود الثلاثة |
| `AccordionTriggerProps` | السمات ومعالج النقر التي يمررها slot ‏`header` في WAccordion إلى زر التبديل الخاص بك |

```ts
import type { ModalEmits, TreeSlots, WakebComponentEmits } from 'wakeb-components'

type NodeLevel = Parameters<NonNullable<TreeSlots['node']>>[0]['level'] // number
const onModel = (...[open]: ModalEmits['update:modelValue']) => console.log(open) // boolean
type Selected = WakebComponentEmits['WDropdown']['selectedItem'] // [item: DropdownItem]
```

تستنتج القوالب التي يفحصها `vue-tsc` حمولات الـslots وأنواع المعالجات من هذه العقود؛ فيعطي
`#close-button="{ label }"` في WModal قيمة من النوع `string`، ويتوقع `@node-click` في WTree
معالجًا يستقبل `TreeNode`.

يُفحص كل renderer لكل مزود مقابل عقده، ويفشل البناء إذا صرّح renderer بخاصية أو حمولة حدث أو
حمولة slot مختلفة. وتُفحص الحزمة المعبأة بالطريقة نفسها باستخدام `tsc --strict` و`vue-tsc`، مع
تثبيت مزود واحد فقط.

**حد معروف.** تحمل slots الألواح في WTabs اسم مفتاح كل تبويب، لذا تُكتب بتوقيع فهرس حمولته
`any`. وهي لا تتلقى أي حمولة، أما `tab-label` و`tab-icon` فأنواعهما دقيقة.

## الأخطاء

| الرمز | السبب | الحل |
| --- | --- | --- |
| `WAKEB_CONFIG_INVALID` | framework أو خيار غير معروف، أو defaults أو theme أو icons غير صالحة، أو ملف plugin غير صالح أو مفقود | اتبع الرسالة، فهي تحدد الحقل أو الملف |
| `WAKEB_BUILD_PLUGIN_MISSING` | بُني التطبيق دون `wakebComponents()` | أضفها إلى plugins في Vite وأعد التشغيل |
| `WAKEB_FRAMEWORK_MISMATCH` | قيمة `framework` وقت التشغيل تختلف عن قيمة البناء | أعد تشغيل خادم التطوير أو أعد البناء |
| `WAKEB_PROVIDER_MISSING` | الـpeers الخاصة بالمزود المختار غير مثبتة | نفّذ أمر التثبيت الموجود في الرسالة |
| `WAKEB_CONTEXT_MISSING` | رُسم مكوّن دون `app.use(wakeb)` | ثبّت الـplugin على هذا التطبيق |
| `WAKEB_INSTALL_CONFLICT` | plugin ثانٍ لـWakeb على نفس التطبيق، أو وضع `install` مع مزود مثبت | استخدم plugin واحدًا لكل تطبيق |
| `WAKEB_HOST_PROVIDER_MISSING` | وضع `reuse` دون مزود مثبت | ثبّت المزود قبل Wakeb |
| `WAKEB_COMPONENT_UNSUPPORTED` | المحوّل التجريبي المختار لا يحتوي هذا المكوّن | راجع الجدول التالي |
| `WAKEB_CAPABILITY_UNSUPPORTED` | محجوز لميزة اختيارية موثقة لا يستطيع المحوّل المختار توفيرها. لا يطلقه أي محوّل في هذا البناء، فقد أصبح shadcn-vue محوّلًا تجريبيًا. | اتبع الرسالة، فهي تذكر البديل |

الأخطاء من النوع `WakebError` ولها الخاصية `code`، ويُصدَّر النوع من `wakeb-components`.
أما تحذيرات وضع التطوير (`WAKEB_DEPRECATED_VALUE` و`WAKEB_UNKNOWN_VALUE`
و`WAKEB_ICON_UNRESOLVED` و`WAKEB_PROVIDER_PROP_IGNORED`) فهي تحذيرات في
الـconsole وليست أخطاء، وتُحذف من بناء الإنتاج.

## المكونات المدعومة

تحتوي `wakeb.capabilities.components` على المكونات التي يرسمها المحوّل المختار.

| المكوّن | Vuetify | PrimeVue (تجريبي) |
| --- | --- | --- |
| WButton وWDropdown وWModal وWLoading | مدعوم | مدعوم |
| WSegmentedProgress وWSemiCircleGauge وWVerticalSteps وWPageSkeleton | مدعوم | مدعوم |
| WTabs وWTree وWCarousel | مدعوم | مدعوم (markup أصلي من Wakeb) |
| WExportDropdown وWBaseSidebar وWDrawer | مدعوم | مدعوم |
| WAvatarStack وWBadgeStack وWAccordion | مدعوم | مدعوم |
| WTruncatedText وWTooltipBtn وWBadge وWUserBadge | مدعوم | مدعوم |
| shadcn-vue (تجريبي) | — | المكونات الـ21 كلها. تستخدم WTabs وWTree وWCarousel وWSegmentedProgress وWSemiCircleGauge وWVerticalSteps وWBadge وWUserBadge markup أصليًا من Wakeb؛ ويستخدم WPageSkeleton عظام Skeleton من shadcn-vue على شبكة Wakeb؛ وWAccordion إفصاح من Wakeb بمؤشرات زر shadcn-vue؛ وتستخدم البقية primitives من shadcn-vue فوق reka-ui |

## حدود الإصدار التجريبي

- **نفس العقد مع DOM مختلف.** تجتاز WButton وWDropdown وWModal نفس اختبارات العقد على
  المزودين، لكن الـmarkup مختلف: يرسم PrimeVue القائمة والنافذة بعناصر الطبقة الخاصة به.
- **التبويبات والشجرة والعرض المتتابع على PrimeVue.** تعتمد مكونات Tabs وTree وCarousel في
  PrimeVue نماذج مختلفة (معرفات مولّدة، ولوحات تُركَّب كلها أو تُزال عند إخفائها، وخرائط مفاتيح
  للفتح، وصفحات من عدة عناصر)، لذلك ترسم WTabs وWTree وWCarousel على PrimeVue markup وأنماطًا
  يملكها Wakeb. يأتي التحديد والمعرفات والتعامل مع لوحة المفاتيح واستعادة التركيز ومؤقت العرض
  المتتابع من الكود المشترك نفسه الذي تستخدمه renderers ‏Vuetify، وتعمل مجموعة اختبارات عقد
  واحدة على المزودين. الـDOM مختلف: لا توجد classes ‏`.v-*`، وقائمة `role="tablist"` بسيطة
  بعناصر `<button role="tab">`، والشرائح تتبدل دون حركة انتقال أو إيماءات سحب. زر فتح الفرع
  في WTree على PrimeVue هو WButton الخاص بـPrimeVue.
- **سمات خاصة بـVuetify.** تبقى `max-width` في WModal وبقية سمات Vuetify الأصلية واجهة توافق
  مع Vuetify فقط. على PrimeVue استخدم الخاصية `width`.
- **التلميح في PrimeVue.** تفتح تلميحات WButton وWTooltipBtn وWTruncatedText على PrimeVue عند
  مرور المؤشر وعند التركيز بلوحة المفاتيح، وتُغلق عند فقدان التركيز والنقر ومفتاح Escape. لا
  يدعم توجيه PrimeVue إلا مُشغّلًا واحدًا، لذلك يشغّل Wakeb معالجات المرور الخاصة بالتوجيه عند
  التركيز، ولا تُستدعى مستمعات الفأرة الخاصة بالمستخدم عند التركيز. ويشير العنصر إلى التلميح عبر
  `aria-describedby` بمعرّف من `useId` في Vue. ولأن جهات PrimeVue فيزيائية، تتبع `start` و`end`
  خيار `direction` في الـplugin، لا اتجاه الصفحة.
- **الأنماط في PrimeVue.** يرسم WButton زر PrimeVue دون أنماطه ويعتمد على tokens ‏Wakeb.
  القائمة والنافذة تحتاجان وضع الأنماط في PrimeVue، والتطبيق الذي يفعّل `unstyled: true`
  عمومًا يجب أن يضبط أنماط هذه الطبقات بنفسه.
- **PrimeVue في أكثر من تطبيق.** يحتفظ PrimeVue بخدمة الـtheme على مستوى الوحدة، فيتشارك
  تطبيقان في الصفحة نفسها أنماط الـtheme. يبقى سياق Wakeb منفصلًا لكل تطبيق.
- **حدود نطاق الـtheme.** تصل سمات الـtheme والاتجاه (`data-wakeb-theme` و`dir` ومتغيرات
  `--wakeb-ui-*`) إلى جذور المكونات وإلى كل طبقة منقولة: نافذة WModal، وقائمتا WDropdown
  وWExportDropdown، واللوحة الجانبية WDrawer على PrimeVue، وقائمتا العناصر الإضافية في WAvatarStack وWBadgeStack، وتلميحات WButton
  وWTooltipBtn وWTruncatedText وWAvatarStack. خصائص تنسيق الطبقة مثل `menuStyle`
  و`tooltipStyle` توضع على محتوى الطبقة داخل هذا النطاق، لذا تتقدم عليه. ويحتفظ كل تطبيق في
  الصفحة نفسها بنطاق طبقاته الخاص.
- **حدود ترتيب الطبقات.** يُطبَّق `zIndexOverlay` على كل طبقات Vuetify السابقة وعلى قوائم
  PrimeVue ونافذته ولوحته الجانبية. تستقبل تلميحات WButton وWTooltipBtn وWTruncatedText على
  PrimeVue سمات الـtheme، لكنها تحتفظ بترتيب z-index الخاص بتلميحات PrimeVue. على Vuetify لا
  يُنقل WDrawer: هو عنصر تخطيط في Vuetify يُرسم في مكانه، فتصل سمات النطاق إلى لوحته كجذر،
  ويبقى z-index الخاص به للتخطيط في Vuetify الذي يحدد موضع الخلفية المعتمة أيضًا. أما على
  PrimeVue فيُنقل WDrawer تحت طبقة الخلفية الخاصة به، وهي التي تأخذ `zIndexOverlay`؛ وبدونه
  تتشارك اللوحة وWModal ترتيب z-index الخاص بالنوافذ في PrimeVue، فتظهر النافذة المفتوحة من
  داخل اللوحة فوقها.
- **مستخدمو المتغيرات.** تستخدم WButton وWDropdown وWModal هذه المتغيرات، وتحتفظ بقية المكونات
  بمتغيراتها الخاصة حتى يتم نقلها. والمتغيرات الموجودة على الطبقة متاحة لأنماطك الخاصة بمحتواها.
- **التقدم والمؤشر والخطوات وهيكل الصفحة على PrimeVue.** ترسم WSegmentedProgress
  وWSemiCircleGauge وWVerticalSteps الـmarkup والـCSS نفسيهما من Wakeb على المزودين. وتحتفظ
  WPageSkeleton بالشبكة والصيغة نفسيهما، لكنها ترسم كل اسم Skeleton بأشكال عظام من Wakeb فوق
  `Skeleton` من PrimeVue (دون أنماطه) بدلًا من `VSkeletonLoader` في Vuetify، فتكون أحجام العظام
  متقاربة وليست متطابقة. وتُتجاهل أسماء Skeleton الخاصة بـVuetify تحت PrimeVue.
- **غلاف المكوّن.** كل مكوّن مستورد من الجذر غلاف رقيق حول renderer المزود. أدوات الاختبار
  التي تبحث عن المكونات بالاسم، مثل `findAllComponents(WTabs)`، تجد الغلاف والـrenderer معًا.
- **الأنماط.** ما زال `style.css` يحتوي أنماط كل الـrenderers، وتقسيمه حسب المزود مخطط له.
- **حاضن WDrawer.** على Vuetify يحتاج WDrawer تخطيط تطبيق Vuetify (`VApp` أو `VLayout`). أما
  على PrimeVue فلا يحتاج markup حاضنًا ولا غلافًا حول جذر تطبيقك: طبقة الخلفية المنقولة الخاصة
  بـPrimeVue هي التي تحتضنه.
- **سلوك WDrawer.** تحقق اللوحة على PrimeVue قواعد اللوحة المؤقتة: هي `role="dialog"` مشروطة
  (modal)، تنقل التركيز إلى داخلها وتحصر Tab فيها، وتُغلق بـEscape وبالنقر خارجها ما لم تكن
  `persistent`، وتمنع تمرير الصفحة، وتعيد التركيز إلى العنصر الذي فتحها. يخفي
  `transparentOverlay` لون الخلفية لكنه يبقيها، فتظل الصفحة خلفها غير قابلة للتفاعل. ويتبع
  الجانب المنطقي خيار `direction` في Wakeb. أما لوحة Vuetify فتحتفظ بسلوكها الأصلي: لا إغلاق
  بـEscape، ولا منع للتمرير، والمشروع يدير التركيز عند الفتح والعودة.
- **هيكل التحميل في WBaseSidebar.** على PrimeVue يقبل هيكل التحميل أسماء الهياكل المحمولة فقط
  (SPEC R16) ويرسمها بعناصر `Skeleton` من PrimeVue. الأسماء الخاصة بـVuetify تُتجاوز مع
  التحذير `WAKEB_UNKNOWN_VALUE`.
- **قائمة WExportDropdown.** على PrimeVue تُرسم الصيغ في `Menu` من PrimeVue، وهو المسؤول عن
  الموضع والأسهم وEscape والنقر الخارجي. ويُطبَّق `menuStyle` على القائمة التي تحمل
  `role="menu"`.

## shadcn-vue {#shadcn-vue}

::: warning تجريبي
يرسم محوّل shadcn-vue المكونات الـ21 كلها مع `framework: 'shadcn'`.
:::

shadcn-vue ليس مكتبة مكونات تُثبَّت من npm، بل ملفات مصدرية تنسخها أداة shadcn-vue CLI إلى
التطبيق، وتُنسَّق بـTailwind CSS. يوفّر Wakeb نسخه المعدّلة من مكونات Button وDropdownMenu
وDialog وPopover وSheet وSkeleton وTooltip وSpinner، فلا يحتاج تطبيقك إلى الأداة ولا إلى Tailwind CSS ولا إلى نسخ shadcn-vue
من هذه المكونات:

- **الـpeer.** الـpeer الوحيد هو `reka-ui` ‏(`^2.10.5`)، وهي المكتبة غير المنسقة التي يقوم عليها
  shadcn-vue. توفّر حصر التركيز والإغلاق وتحديد المواضع وأنماط ARIA. لا يضمّها Wakeb إلى حزمته،
  لذا يتشارك التطبيق الذي يستخدم shadcn-vue أصلًا نسخة `reka-ui` نفسها.
- **دون Tailwind وقت التشغيل.** تُرجمت أصناف Tailwind في المكونات المعدّلة مسبقًا إلى قواعد
  `wakeb-sc-*` ذات بادئة خاصة داخل `style.css`. لا تحتوي هذه الأنماط على Preflight ولا على
  إعادة ضبط عامة ولا على متغيرات `--tw-*`، فلا تتعارض مع بناء Tailwind الخاص بتطبيقك.
- **ثيم التطبيق.** يقرأ المحوّل متغيرات ثيم shadcn-vue في تطبيقك عند وجودها: `--background`
  و`--foreground` و`--popover` و`--popover-foreground` و`--accent` و`--accent-foreground`
  و`--muted-foreground` و`--secondary` و`--border` و`--ring` و`--radius` و`--primary`
  و`--destructive`. وتتقدم tokens ‏Wakeb ‏(`--wakeb-ui-*`) عليها، ولكل متغير قيمة احتياطية من
  Wakeb، فتُرسم المكونات أيضًا في تطبيق لا يستخدم shadcn-vue.

**السلوك.**

- **WButton** يرسم زر shadcn-vue. يستخدم التلميح Tooltip من reka-ui، ويفتح عند مرور المؤشر وعند
  التركيز بلوحة المفاتيح، ويشير `aria-describedby` إلى التلميح ما دام مفتوحًا.
- **WDropdown** يرسم DropdownMenu من reka-ui مع slot ‏`activator` الخاص بك. تتنقل مفاتيح الأسهم
  بين العناصر وتتخطى المعطّل منها، ويختار Enter أو Space العنصر، ويغلق Escape أو النقر خارج القائمة
  القائمةَ. يعود التركيز إلى زر الفتح، إلا إذا أُغلقت القائمة لأنك نقرت في مكان آخر.
- **WModal** يرسم Dialog من reka-ui. يحصر التركيز داخله، ويخفي بقية الصفحة عن التقنيات المساعدة
  (`aria-hidden`)، ويُغلق بـEscape وبالنقر خارجه ما لم تُضبط `persistent`، ويعيد التركيز إلى
  العنصر الذي كان مركّزًا قبل فتحه. ويُطلق `afterLeave` بعد انتهاء حركة الإغلاق.
- **WLoading** يرسم Spinner من shadcn-vue (أيقونة `loader-circle` من Lucide). الأيقونة زخرفية،
  ويحتفظ جذر WLoading بالقيمة `role="status"` وبالاسم الوصفي.
- **WTabs وWTree وWCarousel** ترسم الـmarkup والأنماط نفسها التي يملكها Wakeb على PrimeVue، من
  الكود المشترك نفسه. لا يُستخدم أي مكوّن من shadcn-vue هنا: مكوّن Tabs فيه يحدد التبويب بمجرد أن
  ينقل إليه مفتاح سهم التركيز، ولا يحتوي shadcn-vue على Tree، ومكوّن Carousel فيه يحتاج إلى Embla
  ولا يوفّر تشغيلًا تلقائيًا ولا مؤشرات. يحتفظ WTabs بالتفعيل اليدوي: تنقل مفاتيح الأسهم وHome
  وEnd التركيز فقط (وتنعكس الأسهم الأفقية عندما تكون قيمة `direction` المحسوبة لقائمة التبويبات
  `rtl`)، ويحدد Enter أو Space أو النقر التبويب. لقائمة التبويبات موضع Tab واحد، وتُركَّب اللوحة
  عند أول تحديد لها وتبقى مركّبة بعده. ويحتفظ WCarousel بمؤقت التشغيل التلقائي الخاص بـWakeb، الذي
  يتوقف عند مرور المؤشر، وعند وجود التركيز داخل العرض المتتابع أو مؤشراته، وأثناء إخفاء المستند،
  وعندما يفضّل المستخدم تقليل الحركة. وزر فتح الفرع في WTree هو WButton الخاص بـshadcn-vue.
- **WSegmentedProgress وWSemiCircleGauge وWVerticalSteps** ترسم الـmarkup وأنماط CSS نفسها التي
  ترسمها في Vuetify وPrimeVue. فمكوّن Progress في shadcn-vue يرسم مؤشرًا واحدًا دون مسار مقسّم ولا
  slot للنص، ومكوّن Stepper فيه معالج تفاعلي، لذا لا يُستخدم أيّ منهما.
- **WPageSkeleton** يستخدم قواعد هياكل التحميل في Wakeb وأشكال العظام والشبكة، كما في PrimeVue.
  وكل عظمة هي Skeleton من shadcn-vue: تنبض، وتقرأ `--accent` و`--radius`، وتُخفى عن التقنيات
  المساعدة. ويتوقف النبض مع `prefers-reduced-motion`.
- **WAccordion** عنصر إفصاح من Wakeb. العنوان زر HTML أصلي يحمل `aria-expanded` و`aria-controls`،
  والمؤشرات هي WButton (زر shadcn-vue)، واللوحة منطقة (region) يسمّيها `title` عند ضبطه. وتبقى
  اللوحة المغلقة مركّبة في الصفحة، فتُحفظ حالة ما بداخلها. لا يُستخدم Collapsible من reka-ui، لأنه
  يزيل اللوحة المغلقة من الصفحة ما لم يُفرض تركيبها.
- **WExportDropdown** يرسم الصيغ في DropdownMenu من reka-ui كما يفعل WDropdown: تتخطى مفاتيح
  الأسهم الصيغ المعطّلة، ويختار Enter أو Space الصيغة، ويغلق Escape أو النقر خارج القائمة القائمةَ،
  ويعود التركيز إلى زر الفتح. يُطلق الحدث `select` مرة واحدة لكل صيغة متاحة، ولا يُطلق أبدًا ما دامت
  `isLoading` مفعّلة. تصل السمات ونطاق الثيم إلى عنصر يغلّف العنصر ذا `role="menu"`، ولا يوجد هذا
  العنصر إلا أثناء فتح القائمة؛ أما `menuStyle` و`zIndexOverlay` فيصلان إلى القائمة نفسها.
- **WBaseSidebar** يستخدم markup وأنماط Wakeb المشتركة، وأزرار التصفية فيه أزرار WButton من
  shadcn-vue. وأثناء `loading` يرسم أسماء الهياكل القابلة للنقل (SPEC R16) بعظام Skeleton من
  shadcn-vue داخل منطقة واحدة بالدور `role="alert"` واسمها "Loading..."؛ وتُتخطّى الأسماء الخاصة
  بـVuetify مع التحذير `WAKEB_UNKNOWN_VALUE`.
- **WDrawer** يرسم Sheet من shadcn-vue المبني على Dialog من reka-ui. تحمل اللوحة `role="dialog"`
  و`aria-modal="true"`، ويُؤخذ اسمها من `title` ثم من `ariaLabel`. تحصر التركيز داخلها، وتخفي بقية
  الصفحة عن التقنيات المساعدة، وتمنع تمرير الصفحة، وتُغلق بـEscape وبالضغط خارجها ما لم تُضبط
  `persistent`، وتعيد التركيز إلى العنصر الذي فتحها. لا تحتاج إلى مضيف layout. ويتبع الجانب
  الفعلي الخيار `direction` في Wakeb (`end` هو الجانب الأيمن في الصفحات من اليسار إلى اليمين،
  والأيسر في الصفحات من اليمين إلى اليسار). تصل `zIndexOverlay` إلى الطبقة الخلفية وإلى اللوحة معًا،
  ويُبقي `transparentOverlay` الطبقة الخلفية، فتبقى الصفحة محجوبة.
- **WTruncatedText وWTooltipBtn وصور WAvatarStack** تستخدم Tooltip من reka-ui كما في WButton.
  يفتح التلميح عند التركيز بلوحة المفاتيح وعند مرور المؤشر (وتنطبق `openDelay` على مرور المؤشر)،
  ويُغلق عند فقدان التركيز وبـEscape، ويبقى مفتوحًا ما دام المؤشر فوقه. وما دام مفتوحًا يشير
  `aria-describedby` في العنصر المُشغِّل إليه، وتتقدم قيمة `aria-describedby` القادمة من المستخدم.
  يحمل جذر التلميح نطاق الثيم و`zIndexOverlay`، وتنسّق `tooltipStyle` النص داخله. ويرسم WTooltipBtn
  زر shadcn-vue دون `variant` أصلي، فترسم أنماط Wakeb ‏(`wakeb-tooltip-btn--*`) الأنواع القابلة للنقل.
- **WBadge وWUserBadge** يرسمان markup من Wakeb ‏(`data-slot="badge"` و`data-slot="avatar"`)
  تنسّقه أنماط الشارة المشتركة في Wakeb كما في PrimeVue. وترجع أسماء ألوان المزوّد إلى `primary`
  مع `WAKEB_UNKNOWN_VALUE`. والصور الرمزية صور زخرفية عادية، فتُرسم على الخادم أيضًا.
- **قوائم الفائض في WAvatarStack وWBadgeStack** تُرسم داخل Popover من reka-ui بقواعد الفتح نفسها
  في Vuetify: تفتح دائمًا عند مرور المؤشر، ويفتحها WAvatarStack أيضًا عند التركيز ويبقيها مفتوحة
  عند النقر، ويبدّلها زر WBadgeStack بالنقر. ويغلقها Escape أو الضغط خارجها. الـPopover للعرض
  فقط: لا يأخذ التركيز أبدًا، وقيمته `aria-modal="false"`، ويشير `aria-controls` في زر الفتح إلى القائمة.

**الحدود.**

- **الاتجاه في الطبقات.** تكتب reka-ui السمة `dir` على محتوى التلميح والقائمة والنافذة، وتأخذ
  قيمتها من اتجاه `ConfigProvider` في reka-ui، أو `ltr` إن لم يُضبط. اضبط الخيار `direction` في
  Wakeb، أو غلّف التطبيق بـ`ConfigProvider` مع `dir="rtl"` للصفحات من اليمين إلى اليسار. ومواضع
  التلميح المنطقية (`start` و`end`) تتبع `direction` في Wakeb.
- **ربط الثيم.** يحتاج ربط `--primary` و`--destructive` إلى ثيم Tailwind CSS v4 (قيم ألوان
  كاملة). مع ثيم Tailwind v3 اضبط tokens ‏Wakeb.
- **الخصائص الأصلية.** تذهب `providerProps` إلى النسخ المعدّلة المذكورة في
  [الخصائص الأصلية](#native-props)، لا إلى المكونات في مجلد `components/ui` في تطبيقك. وتعديل
  نسخك الخاصة من shadcn-vue لا يغيّر مكونات Wakeb.
- **الـDOM.** يتبع الـmarkup مكونات shadcn-vue ‏(`data-slot` و`data-state` و`data-variant`)، لا
  Vuetify ولا PrimeVue، فلا تنطبق الأنماط التي تستهدف أصناف `.v-*` أو `.p-*`.
- **DOM التبويبات والشجرة والعرض المتتابع.** تستخدم WTabs وWTree وWCarousel أصناف Wakeb
  (`wakeb-tabs` و`tree` و`wakeb-carousel`)، لا سمات `data-slot` ولا أصناف `wakeb-sc-*`؛ ولا يحمل
  markup زر shadcn-vue إلا زر فتح الفرع في WTree. تتبدل الشرائح دون حركة انتقال أو إيماءات سحب.
  ولا تملك هذه المكونات primitive من المزود، لذا تُهمَل `providerProps` مع تحذير
  `WAKEB_PROVIDER_PROP_IGNORED` في وضع التطوير.
- **الأنماط.** يحتوي `style.css` أنماط كل الـrenderers، ومنها قواعد shadcn-vue.
- **شكل هياكل التحميل.** تنبض عظام WPageSkeleton في shadcn-vue بأسلوب shadcn-vue، أما في Vuetify
  وPrimeVue فتتحرك العظام بموجة. والشبكة والأشكال والمقاسات وسمات ARIA واحدة.
- **WDrawer.** يُستخدم الجانبان الأيسر والأيمن فقط من Sheet، فلا موضع علويًا أو سفليًا للوحة.
  ولا يُطلق الدرج عند Escape أو الضغط خارجه إلا `update:modelValue` كما في PrimeVue؛ أما `close`
  فيأتي من زر الإغلاق.
- **WExportDropdown.** القائمة غير modal كما في المزوّدين الآخرين، فلا تصبح الصفحة خلفها خاملة أثناء
  فتحها.
- **ربط التلميح على الخادم.** لا تضيف reka-ui السمة `aria-describedby` إلا ما دام التلميح مفتوحًا،
  لذا لا يحملها WTruncatedText ولا WTooltipBtn في مخرجات الخادم (بينما يرسم Vuetify وPrimeVue المعرّف).
- **تُغلق التلميحات عند التمرير.** تغلق reka-ui التلميح المفتوح عندما يُمرَّر أي حاوٍ يضم العنصر
  المُشغِّل. فإذا أدى نقل التركيز بلوحة المفاتيح إلى العنصر إلى تمرير الصفحة لإظهاره، يُفتح التلميح ثم
  يُغلق؛ أعد التركيز عليه أو مرّر المؤشر فوقه لترى النص. أما Vuetify وPrimeVue فيُبقيان التلميح مفتوحًا.
- **مرور المؤشر.** تفتح التلميحات وقوائم الفائض أيضًا مع حدث `mouseenter` العادي، فتعمل دون
  أحداث pointer، وتحدد منطقة السماح في reka-ui متى يُغلق التلميح الذي فُتح بمرور المؤشر.

**الترخيص.** يخضع shadcn-vue لرخصة MIT ‏(Copyright (c) 2023 unovue)، وتخضع أيقونة Lucide المضمّنة
لرخصة ISC ‏(Copyright (c) 2026 Lucide Icons and Contributors). تحتوي الحزمة نصوص الترخيص في
`THIRD-PARTY-NOTICES.txt`. وتخضع `reka-ui` لرخصة MIT ويثبّتها تطبيقك. احتفظ بالملف
`THIRD-PARTY-NOTICES.txt` عند إعادة توزيع الحزمة.

## ما لا يغطيه تبديل المزود

تبديل المزود يغيّر طريقة رسم مكونات Wakeb فقط، ولا ينقل بقية التطبيق. قبل التبديل ابحث في
مشروعك عن:

- الاستخدام المباشر لمكونات المزود، مثل `v-data-table` أو `DataTable` في PrimeVue.
- قيم `providerProps`. مفاتيحها تخص مزودًا واحدًا، وتُتجاهل تحت مزود آخر مع التحذير
  `WAKEB_PROVIDER_PROP_IGNORED`.
- منافذ native مثل `chipAttrs`، أو `wrapperAttrs` بسمات خاصة بالمزود، أو خصائص أصلية مُمررة
  كسمات.
- الأنماط التي تستهدف classes أو DOM المزود: `.v-*` و`.p-*`.
- الـtheme وخيارات الـplugin والأيقونات والقيم الافتراضية العامة الخاصة بالمزود.
- السمات الأصلية التي يفهمها مزود واحد فقط، مثل `max-width` في Vuetify.

بحث مقترح: `rg "v-[a-z-]+|\.v-|\.p-|from 'vuetify|from 'primevue|provider-?props" src`.
وفي وضع التطوير شغّل التطبيق على المزود الجديد وابحث في الـconsole عن
`WAKEB_PROVIDER_PROP_IGNORED`: فهو يذكر كل مفتاح أصلي لا يقبله المزود الجديد.

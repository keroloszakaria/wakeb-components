# سجل التغييرات

## 0.8.0-alpha.0 (إصدار تجريبي للإطار، غير منشور)

تغيير غير متوافق: الاستيراد من جذر الحزمة يتطلب الآن ملف plugin والدالة `wakebComponents()` من `wakeb-components/vite`. استمر على 0.7.x لاستخدام Vuetify وحده دون تكامل في البناء.

- إضافة `createWakebComponents({ framework })` وتكامل البناء `wakeb-components/vite` ورموز أخطاء `WakebError` وبيانات `capabilities`.
- يقرأ تكامل البناء قيمة framework من ملف الـplugin دون تشغيله، ولا يضم إلا renderers المزود المختار. الصيغ غير المدعومة تفشل برسالة واضحة.
- أوضاع المزود `auto` و`reuse` و`install` تعيد استخدام نسخة Vuetify أو PrimeVue في التطبيق دون تغيير الـtheme أو القيم الافتراضية.
- محوّل PrimeVue 4 تجريبي، بدأ بـWButton وWDropdown وWModal وWLoading (ويغطي الآن المكونات الـ21 كلها، انظر أدناه).
- لم يعد `SharedIcon` يشير إلى أنواع Vuetify.
- قيم `defaults` لكل مكوّن في الـplugin، تتقدم عليها الخصائص الممررة، وتُرفض فيها خصائص البيانات والـmodel ودوال الاستدعاء.
- نصوص مدمجة بالعربية مع `locale: 'ar'`، والخيار `direction`، والخيار `theme` مع `mode` ومتغيرات `--wakeb-ui-*` المقتصرة على كل تطبيق وطبقاته.
- تغيير غير متوافق: تستخدم WBadge وWTooltipBtn وWBadgeStack قيم `variant` القابلة للنقل `soft` و`solid` و`outline` و`ghost`. الأسماء القديمة تعمل مع تحذير `WAKEB_DEPRECATED_VALUE` في وضع التطوير، ويفقد `elevated` الارتفاع ويفقد `plain` مظهره الباهت.
- تغيير غير متوافق: تقبل خصائص الألوان intent من Wakeb أو لون CSS (`WakebColor`). يُحسب الـintent عبر tokens ‏`--wakeb-ui-*` ثم ثيم المزوّد، فيحتفظ تطبيق Vuetify غير المضبوط بألوانه. وفي `color` الخاصة بـWLoading و`avatarColor` الخاصة بـWAvatarStack وWUserBadge تبقى أسماء ألوان Vuetify تعمل تحت Vuetify مع تحذير `WAKEB_DEPRECATED_VALUE`، ويظل TypeScript يقبلها عبر النوع `WakebDeprecatedColor` الموسوم بـ`@deprecated`. أما خصائص الألوان الأخرى فلا تقبل إلا `WakebColor`.
- تغيير غير متوافق: ترسم Wakeb CSS وحدها `type` في WBadge، ولم يعد يُرسل إلى Vuetify كلون للشارة، ويملأ `solid` الشارة بلون النوع. وتظل الأنواع غير الموجودة في قائمة Wakeb تجتاز فحص الأنواع عبر النوع `WakebDeprecatedBadgeType` الموسوم بـ`@deprecated`، ويستقبلها Vuetify لونًا للشارة مع `WAKEB_DEPRECATED_VALUE`. أُضيفت tokens للـintents والمتغيرات `--wakeb-avatar-text` و`--wakeb-badge-solid-bg` و`--wakeb-badge-solid-text`.
- تغيير غير متوافق: يتبع `skeletonType` في WBaseSidebar وأنواع WPageSkeleton صيغة Skeleton في Wakeb. الحد الأقصى للتكرار 100، وتُتجاهل الأسماء غير المعروفة مع `WAKEB_UNKNOWN_VALUE`.
- تغيير غير متوافق: تستخدم صفوف WPageSkeleton شبكة Wakeb ذات الأعمدة الاثني عشر بنقاط توقف ثابتة (sm عند 600px وmd عند 960px وlg عند 1280px) بدل VRow وVCol من Vuetify، فلم تعد إعدادات نقاط التوقف في المزوّد تغيّر التخطيط.
- يصل نطاق الـtheme و`zIndexOverlay` الآن إلى كل طبقة منقولة: تلميحات WButton وWTooltipBtn وWTruncatedText وWAvatarStack، وقائمتا العناصر الإضافية في WAvatarStack وWBadgeStack، وقائمة WExportDropdown. وتبقى الأسبقية لـ`menuStyle` و`tooltipStyle`.
- أيقونات مملوكة لـWakeb: خيار `icons` في الـplugin (`aliases` و`resolve`) خاص بكل تطبيق، وأيقونات SVG مدمجة للأسهم والإغلاق والتحميل والإتمام ومربعات الاختيار وأزرار الراديو، ومربع بديل مع تحذير التطوير `WAKEB_ICON_UNRESOLVED` خارج Vuetify. تحت Vuetify تبقى الأسماء الأخرى تُرسم عبر `VIcon`، أما `$expand` و`$collapse` فأصبحا يستخدمان أيقونة Wakeb.
- منفذ `providerProps` غير القابل للنقل في WButton وWDropdown وWModal وWLoading يمرر الخصائص الأصلية إلى primitive المزود المختار، وتُحذف المفاتيح التي يملكها Wakeb مع تحذير التطوير `WAKEB_PROVIDER_PROP_IGNORED`. توثّق صفحة كل مكوّن وجهة سماته، ويحتفظ WLoading الآن بـ`role="status"` واسمه الوصفي.
- تغيير غير متوافق: أصبح نطاق peer لـ`vue` هو `^3.5.40` لأن التعريفات المولّدة تحتاجه، وأصبح `vite` peer إلزاميًا. يشغّل `npm run check:peers` مصفوفة إصدارات الـpeers المقفلة؛ راجع «الإصدارات المدعومة» في دليل التثبيت.
- أنواع المكونات العامة تأتي من عقود محايدة للمزود (`*Emits` و`*Slots` و`WakebComponent` و`WakebFacade`). يُفحص كل renderer مقابل عقده، ويرفض المستهلك المُحزَّم حمولات الأحداث والـslots الخاطئة تحت `tsc --strict` و`vue-tsc`.
- renderers لـPrimeVue لكل المكونات الـ21. تستخدم WTabs وWTree وWCarousel markup يملكه Wakeb، وتستخدم البقية primitives من PrimeVue. السلوك المشترك في composables محايدة للمزود، وتعمل مجموعة اختبارات عقد وSSR واحدة على كل المزودات.
- لا يحتاج WDrawer على PrimeVue إلى layout حاضن: يحصر التركيز، ويُغلق بـEscape وبالنقر خارجه ما لم يكن `persistent`، ويمنع تمرير الصفحة، ويعيد التركيز إلى زر الفتح، ويأخذ `zIndexOverlay`.
- إصلاح: على كل المزودات، يغلق Escape داخل نافذة أو قائمة فُتحت من WDrawer تلك الطبقة وحدها، ويغلق Escape التالي اللوحة. كان Drawer في PrimeVue يغلق الاثنين بضغطة واحدة، وكذلك لوحة Vuetify إذا عاد التركيز إلى body.
- تغيير غير متوافق: لم يعد WDrawer على Vuetify يحتاج `VApp` أو `VLayout`؛ فهو يرسم حاضن `VLayout` يملكه Wakeb ويُنقل إلى حاوية الطبقات في Vuetify، ولا يحرّك تخطيط التطبيق أبدًا. وأصبح عنصر `<div role="dialog" aria-modal="true">` مشروطًا (بدل `<nav>`) يُغلق بـEscape ما لم يكن `persistent`، ويمنع تمرير الصفحة، وينقل التركيز إلى داخله ثم يعيده إلى زر الفتح، ويُبقي طبقة خلفية شفافة مع `transparentOverlay`، ويأخذ ترتيبًا أقل بواحد من `zIndexOverlay` (والقيمة الافتراضية 2000) فتظهر فوقه الطبقات المفتوحة منه، أو أعلى بواحد من طبقات Vuetify المفتوحة عند فتحه.
- تلميحات PrimeVue، ومنها تلميح WButton، تفتح عند التركيز بلوحة المفاتيح وعند مرور المؤشر، وترتبط بعنصرها عبر `aria-describedby`.
- تأخذ تلميحات WButton وWTooltipBtn وWTruncatedText وWAvatarStack على PrimeVue قيمة `zIndexOverlay` بدلًا من z-index تلميحات PrimeVue، وتحتفظ بنمط `pt.directives.tooltip.root` العام بدلًا من استبداله. وتبقى الأسبقية لـ`tooltipStyle`، ولا يُضاف شيء دون `zIndexOverlay`.
- مزود shadcn-vue التجريبي (`framework: 'shadcn'`) للمكونات الـ21 كلها فوق الـpeer الاختياري `reka-ui` ‏(`^2.10.5`): يستخدم primitives من shadcn-vue حيث تحافظ على العقد، وmarkup يملكه Wakeb للتبويبات والشجرة والعرض المتتابع والتقدم والمقياس والخطوات والشارات، مع CSS مُعدّ مسبقًا ذي بادئة خاصة، دون إعداد Tailwind ولا إعادة ضبط عامة، ومع ملف إشعارات الأطراف الثالثة. وأُضيفت خلايا shadcn-vue إلى مصفوفة الـpeers.
- تغيير غير متوافق: يملك Wakeb التشغيل التلقائي في WCarousel على كل المزودات؛ يتوقف عند مرور المؤشر أو التركيز أو إخفاء الصفحة أو تفضيل تقليل الحركة، وينظف مؤقته عند الإزالة.
- لوحة WAccordion التي لها عنوان أصبحت `region` مسماة.
- أصبحت `customHTML` في عناصر WTabs مهجورة: ما زالت تُرسم، وتكتب `WAKEB_DEPRECATED_VALUE` مرة واحدة لكل تطبيق. استخدم الـslot ‏`tab-label`.
- التوثيق: دليل انتقال من 0.7 مع قائمة تحقق، ودليل تبديل المزود (بما فيه ما لا يغطيه التبديل وأوضاع نسخة المزود)، وذكر حدود التبديل في صفحة التثبيت.

## غير منشور (0.7.x)

- إصلاح WSegmentedProgress بحيث لا يؤثر طول النص على نسبة الجزء الممتلئ.
- WDropdown: المطابقة الدقيقة للقيمة تكسب على الاسم، والبيانات الجديدة تحدّث الاسم المعروض، و`null` يمسح الاختيار، والصفوف بأدوار menu، والروابط المعطلة بلا `href`.
- أدوار menu في WExportDropdown. قوائم الزيادة المعلوماتية في WAvatarStack وWBadgeStack لم تعد تُعلن كقوائم أوامر، وشكل الأيقونة الدائري يصل للقائمة المنقولة.
- ربط تبويبات WTabs باللوحات بمعرّفات فريدة، وWTree يعيد التركيز لعنصر ظاهر عند اختفاء العنصر المركّز.
- تحميل WButton يمنع click وإرسال الفورم في الوضعين، ومتغيرات حالات الزر الثانوي ومتغيرات الخلفية واللون الموثقة أصبحت تعمل.
- WModal يعرض الرأس بالوصف وحده، ويحترم max-width الأصلية عند غياب width.
- بناء التوثيق يبني المكتبة قبل تجهيز ملف التنزيل ويتأكد أن متغيرات CSS الموثقة مستخدمة، والتحقق من النشر يقارن بإيصال البناء المحلي والـcommit.
- تحديث Vite إلى 6.4.5.

## 0.7.0

إضافة WModal وWDrawer لحاويات النوافذ مع تحميل مستقل وslots وإغلاق ومتغيرات CSS. Aware يحتفظ بـAddEditModal وGenericForm وschema والتحقق والصلاحيات وزخرفة الرأس وربط الثيم. يستمر سلوك Dialog الأصلي للتركيز وEscape والتمرير، وسلوك Drawer الأصلي.

## 0.6.0

- إضافة WCarousel وWExportDropdown وWBaseSidebar بخصائص typed وتحكم في الشرائح وصيغ تصدير وslots مستقلة عن الفورم.
- إبقاء صلاحيات Aware وGenericForm والترجمة وSvgIcon وtokens التدرج ومعنى المؤشرات القديم في adapters.
- اختبارات فعلية للتشغيل التلقائي والقوائم وSkeleton والتوافق وتوثيق تفاعلي بالعربي والإنجليزي.

## 0.5.0

- إضافة WTabs وWTree وWDropdown بخصائص typed وslots، مع فصل الترجمة والتوجيه عن الحزمة.
- الحفاظ على اختيار Aware وخطوط الشجرة وحالة التعديل والأيقونات وترتيب أحداث القائمة عبر adapters.
- تنقل بالكيبورد للشجرة واختبارات Vuetify ومستهلك SSR ومتصفح وأمثلة حية بالعربي والإنجليزي.

## 0.4.0

- إضافة WBadgeStack وWUserBadge وWTooltipBtn بخصائص typed وslots للصورة والأيقونة، مع الترجمة من المشروع.
- الحفاظ على تخصيص عناصر Aware وقائمة الزيادة وأيقونات الاكتشاف والأحرف والإجراءات وخصائص Tooltip القديمة عبر adapters.
- إضافة اختبارات Vuetify فعلية للزيادة وTooltip والصور والتوافق، وتوثيق تفاعلي بالعربي والإنجليزي.

## 0.3.0

إضافة WButton وWBadge ثم WAccordion، مع الحفاظ على عقود Aware والأيقونات وloading وisLoading. اختبارات الأحداث والفورم والـslots والكيبورد وSSR وتوثيق CSS وtyped APIs.

## 0.2.0

إضافة WAvatarStack وWLoading وWPageSkeleton وWVerticalSteps، مع نماذج بيانات typed وstyles للـoverlay وslots للأيقونات. واجهات 0.1 مستمرة كما هي.

## 0.1.1

نشر أول ثلاثة مكونات على npm. التثبيت باستخدام `wakeb-components@0.1.1`.

## 0.1.0

ثلاثة مكونات عرض، وprops وslots typed، ومتغيرات مستقلة، وVue وVuetify كـpeers، والتحقق من تثبيت الحزمة والمتصفح وSSR.

# الانتقال من Aware

تحافظ أول دفعة على مسارات التطبيق الحالية كـadapters صغيرة:

| المسار الحالي | المكون المشترك |
| --- | --- |
| components/common/TruncatedText.vue | WTruncatedText |
| components/common/SegmentedProgress.vue | WSegmentedProgress |
| components/common/SemiCircleGauge.vue | WSemiCircleGauge |
| `components/common/AvatarStack.vue` | `WAvatarStack` |
| `components/common/Loading.vue` | `WLoading` |
| `components/common/PageSkeleton.vue` | `WPageSkeleton` |
| `components/common/VerticalSteps.vue` | `WVerticalSteps` |

تربط adapters ألوان Aware بمتغيرات الحزمة وتحافظ على props الافتراضية.
لا تحتاج الشاشات الحالية تغيير الاستيراد. تستورد المشاريع الجديدة المكونات
بالاسم من wakeb-components وتختار ألوانها وثيمها.

يظل حصر النسب واختصار النص ورسم المقاسات الصحيحة كما كان. المكون العام
يحمي أيضًا من المقاسات والسمك غير الصالح، ويدمج أحداث المستهلك مع أحداث
Vuetify للوصول بالكيبورد. هذه تحسينات دفاعية موثقة ولا تغير منطق العمل.

تظل الأزرار وbadges والنماذج والجداول وlayouts والصلاحيات والبيانات والثيم
في Aware. تحتاج الدفعة التالية مراجعة مستقلة لاعتمادياتها وواجهتها العامة.


دفعة 0.2 تضيف تحسينات دفاعية: max والتكرار لا يقبلان السالب أو القيم غير المحدودة، وأسماء المستخدمين غير الصالحة تستخدم نصًا بديلًا. أيقونات الخطوات في Aware تبقى SvgIcon عبر slots. ألوان قائمة الصور تُمرر عبر menuStyle لأن Vuetify ينقلها خارج حاوية المكون. لا توجد ترجمة أو store داخل الحزمة.

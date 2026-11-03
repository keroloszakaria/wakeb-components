# Wakeb UI Abstraction Framework — specification

Status: **proposed implementation contract; no framework implementation shipped by this change**.

## ملخص القرار

- اسم الباكدج يظل `wakeb-components`، واستيراد المكونات يظل من الجذر.
- الدالة العامة هي `createWakebComponents`، وليست `useWakebComponents`.
- المستخدم يختار `framework: 'vuetify' | 'primevue' | 'shadcn'` داخل `plugins/wakeb-components.js`.
- نفس Props وEmits وSlots وv-model والأنواع والسلوك الموثق تعمل على المحركات المدعومة.
- منطق العرض المشترك داخل الباكدج؛ منطق البيزنس والـAPI والـrouting والصلاحيات داخل المشروع.
- لا يطلب من المستخدم استيراد adapter أو نسخ مكونات shadcn إلى مشروعه.
- تبديل المحرك يتم عند بدء التطبيق وبعد إعادة تشغيل dev server أو إعادة البناء، وليس live runtime switching.
- الباكدج عامة لمشاريعنا وللناس؛ الهدف تبديل الـframework بسهولة والباكدج تظبط الفروقات بين المحركات.
- قيم الشكل (variant، intent، size، color) ملك Wakeb، وكل adapter يترجمها؛ قيم Vuetify القديمة تفضل aliases مهجورة لمدة major واحد.
- لو التطبيق مثبّت Vuetify أو PrimeVue بنفسه، Wakeb تستخدم نفس الـinstance ومتغيّرش الثيم بتاعه.
- التبديل بيغطي مكونات Wakeb بس، مش الاستخدام المباشر للمكتبة في التطبيق (R25).
- الإصدار الجديد breaking من 0.7؛ الـAPI ثابت بين المحركات، مش ثابت من 0.7. إصلاحات 0.7 تنزل كـ 0.7.x منفصلة.
- دعم Nuxt بعد أول إصدار مستقر.

## قرار تقني مهم

اختيار المحرك بنص فقط لا يكفي لضمان عمل build مع تثبيت مكتبة واحدة؛ قد يحاول bundler حل dynamic imports للمكتبات غير المثبتة. لذلك التصميم الأول يستهدف **Vue + Vite**، ويضيف تكامل بناء صغيرًا من `wakeb-components/vite` مرة واحدة. هذا التكامل يقرأ اسم المحرك من ملف الـplugin، ولا يطلب تكراره في vite.config. صفحات التطبيق تظل تستورد من جذر الباكدج.

هذا قرار تصميم مقترح، وليس خاصية متاحة حاليًا. أول مرحلة تنفيذ يجب أن تثبت إمكانية resolver/package exports داخل مستهلك packed مستقل قبل توسيع المكونات. إذا فشل الإثبات، يُراجع التصميم بدل الادعاء بأن optional peers وحدها تعالج المشكلة.

## Documents

1. [Normative specification](./SPEC.md): product scope, API, architecture, component contracts, styling, accessibility, migration and errors.
2. [Implementation plan](./IMPLEMENTATION.md): sequenced work packages and deliverables.
3. [Acceptance and verification](./ACCEPTANCE.md): traceable requirements and executable verification expectations.
4. [Existing API baseline](./baseline.json): machine-readable snapshot of current exports, type definitions and bilingual component metadata. It records existing behavior, not approval of known bugs or a promise of provider-specific parity.

`MUST` / `MUST NOT` are release requirements. `SHOULD` requires a documented reason if not followed. These files specify future behavior; examples must not be presented as currently available APIs.

## Release boundary

The first technical milestone proves Vuetify and PrimeVue on WButton, WDropdown and WModal. WDropdown is used instead of inventing a WSelect export. The full framework release requires all existing public components on all three declared providers, including shadcn. Partial milestones are alpha-only and must publish an explicit coverage matrix; they must not advertise complete interchangeability.

No implementation, dependency installation, npm publication, deployment, or change to AGENTS.md is authorized by this documentation change. Future work must follow repository quality gates and Jervis DevOps publication rules.

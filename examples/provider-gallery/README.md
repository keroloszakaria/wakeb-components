# Three-provider component gallery

The same 21 examples run in three isolated Vite consumers. Each installs the packed
`wakeb-components` archive, Vue, Vite and only its selected provider's optional peers. The
examples use the root public API, typed-contract prop names, local synthetic data and no Aware
aliases, stores, routing or theme tokens.

From the repository root, using the installed Node version:

```sh
npm ci
npm exec --call "node scripts/gallery-server.mjs"
```

The command builds and packs the library, prepares temporary consumers outside the repository
and leaves the three servers running until Ctrl+C. No package is published.

| Provider | Local URL |
| --- | --- |
| Vuetify | http://127.0.0.1:41801/ |
| PrimeVue | http://127.0.0.1:41802/ |
| shadcn-vue | http://127.0.0.1:41803/ |

Use the header controls to change language, switch light/dark mode or reset the examples.
`?lang=ar&theme=dark` selects a state directly. Provider links preserve the language and theme.
Changing language or theme deliberately unmounts and remounts the example app, because plugin
configuration is set per app; its demo data resets. Drawer/dialog state and focus/scroll cleanup
are part of the gallery smoke test. Export and action controls only record events.

After `npm run check`, `--tested-package` reuses and verifies the archive referenced by
`.audit/browser/consumers.json`, rather than building another one:

```sh
npm exec --call "node scripts/gallery-server.mjs --tested-package"
```

If those temporary files were removed, use the default command to build fresh consumers.
With the gallery servers running, execute the 12-context gallery check:

```sh
npm exec --call "playwright test --config playwright.gallery.config.ts"
```

The matrix is three providers × Arabic/English × light/dark, with no retries or skips. It checks
all 21 cards, busy state, progress controls, accordion, tabs, selection, modal/drawer and nested
Escape behavior, plus real language/theme/reset controls. Browser errors and Vue/Wakeb warnings
fail the run. Reports, archive/peer receipts and full-page screenshots live in `.audit/gallery`.
Each case also checks the gallery at 390px and 1440px, including horizontal overflow.
This gallery is a client-rendered playground; the separate 480-case browser suite verifies
SSR/hydration and mobile/wide layouts. It does not promise identical provider DOM or typography.

## العربية

المعرض يعرض المكوّنات الـ21 بنفس الأمثلة على Vuetify وPrimeVue وshadcn-vue، داخل ثلاثة
مشروعات Vite مستقلة خارج المستودع. كل مشروع يثبت الحزمة المجمعة واعتماديات مزوده فقط.
البيانات وهمية ومحلية، ولا يعتمد المعرض على Aware أو مخازنه أو الراوتر أو متغيرات ثيمه.

شغّل الأمر الأول من جذر المستودع ثم افتح روابط الجدول. تتيح أزرار أعلى الصفحة تبديل اللغة
والفاتح/الداكن وإعادة الأمثلة، مع روابط انتقال بين المزودات تحفظ اللغة والثيم. يمكن اختيار
حالة مباشرة، مثل `?lang=ar&theme=dark`. تغيير اللغة أو الثيم يعيد تطبيق الأمثلة وبياناته من
البداية، ويزيل الحوارات واللوحات المفتوحة. لا ترسل أزرار التصدير والإجراءات أي طلبات عمل؛
بل تسجل الأحداث أسفل الصفحة.

بعد تشغيل `npm run check` يمكن إضافة `--tested-package` لإعادة استخدام الحزمة المختبرة
بعد التحقق من بصمتها. الأمر الافتراضي يبني حزمة جديدة إذا حُذفت الملفات المؤقتة.

يتحقق أمر Playwright أعلاه من 12 حالة: ثلاثة مزودات × عربي/إنجليزي × فاتح/داكن، بدون
إعادة محاولات أو تخطٍ. تشمل الفحوص البطاقات الـ21 والتحميل والتحكم في القيم والتبويبات
والأكورديون والاختيار والحوارات واللوحات وEscape المتداخل، وأزرار تبديل اللغة والثيم وإعادة
الأمثلة. تُفشل أخطاء المتصفح وتحذيرات Vue وWakeb الاختبار. النتائج والصور في `.audit/gallery`.
ويفحص كل سيناريو التخطيط بعرض 390px و1440px، بما فيه غياب التمرير الأفقي.
المعرض يستخدم rendering من العميل؛ اختبارات SSR/hydration والمقاسات المختلفة موجودة في
مصفوفة المتصفح المستقلة ذات 480 حالة. اختلاف DOM والخطوط بين المزودات ليس وعدًا بالتطابق البصري.

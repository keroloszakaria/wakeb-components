# العرض من الخادم SSR

تستخدم الحزمة Vue useId لعرّافات SVG مستقلة، ولا تقرأ window أو document
أو storage أو خدمات التطبيق في setup الخاص بها. يحتوي Vuetify على CSS
imports ويحتاج معالجة من bundler الخاص بـSSR.

يتحقق المستهلك المستقل من إعداد Vite التالي:

```ts
export default {
  ssr: { noExternal: ['wakeb-components', 'vuetify'] }
}
```

ثبّت نفس Vuetify plugin في نسختي الخادم والمتصفح، واستورد CSS في مدخل
المتصفح. حافظ على IDs الخاصة بـVue ونفس props الأولية أثناء hydration.
هذه حزمة ESM لـVue، وليست module لـNode require المباشر. لم نتحقق من
تكاملات SSR خاصة بأطر أخرى خارج مستهلك Vite الموضح.

في تطبيق SSR، فعّل وضع SSR في Vuetify على الخادم والمتصفح معًا. يؤجل ذلك
تركيب overlays حتى اكتمال hydration، ويحافظ على تطابق HTML الأولي:

```ts
import { createVuetify } from 'vuetify'
const vuetify = createVuetify({ ssr: true })
```

## إصدار المزودات التجريبي: التحقق من hydration في المتصفح

في `0.8.0-alpha.0` استخدم خيارات `createWakebComponents` نفسها على الخادم والمتصفح، مع تكامل
`wakebComponents()` في Vite الموضح في [المزودات والإعداد](./providers). يضيف التكامل إعداد تجميع
SSR الخاص بالمزود المختار. يفعّل Wakeb خيار `ssr: true` عندما يثبّت Vuetify بنفسه؛ وعند إعادة استخدام
plugin خاص بتطبيقك، فعّل هذا الخيار بنفسك في نسختي الخادم والمتصفح.

أنشئ تطبيق Vue وplugin خاصًا بـWakeb لكل طلب SSR. حافظ على تطابق props الأولية واللغة والاتجاه
والثيم أثناء hydration. عند عرض أكثر من جذر Vue في المستند نفسه، عيّن `app.config.idPrefix`
مختلفًا لكل تطبيق، مع استخدام القيمة نفسها على الخادم والمتصفح لذلك الجذر؛ مثل `'dashboard-'`
للجذر الأول و`'settings-'` للثاني. احتفظ بمخرجات Teleport في سياق SSR داخل حواضن الطبقات المطابقة
عند تركيب صفحة HTML.

يشغّل `npm run test:browser` اختبارات hydration فعلية في Chromium باستخدام أرشيف الحزمة، مع
Vuetify وPrimeVue وshadcn-vue كل على حدة. يتحقق من مراجع IDs المتكررة والطلبات المتزامنة وجذرين
بإعدادات مستقلة، وحالات Modal وDrawer المفتوحة والمغلقة أوليًا، والتركيز بعد hydration والتنظيف عند
إزالة التطبيق. تفشل الاختبارات عند تحذيرات Vue في وضع التطوير أو أخطاء المتصفح، دون إسكات
الاختلافات. راجع [التحقق والمساهمة](./contributing) للأوامر ومسارات الأدلة. يشمل هذا التحقق مستهلكي
Vue وVite المرفقين في Chromium، ولا يثبت تكامل Nuxt أو المتصفحات الأخرى.

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

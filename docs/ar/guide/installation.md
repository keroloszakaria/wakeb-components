# التثبيت

يتوفر الإصدار الأول مع التوثيق ولم يُنشر على npm بعد. ثبّت الأرشيف المحدد
الإصدار داخل مشروع Vue3.5 وVuetify3:

```sh
npm install https://wakeb-components.surge.sh/downloads/wakeb-components-0.1.0.tgz
```

استورد CSS مرة واحدة في مدخل التطبيق، واحتفظ بإعداد Vuetify الحالي:

```ts
import 'vuetify/styles'
import 'wakeb-components/style.css'
```

في تطبيق جديد تحتاج أيضًا تسجيل Vuetify كـplugin:

```ts
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import App from './App.vue'

createApp(App).use(createVuetify()).mount('#app')
```

```vue
<script setup lang="ts">
import { WTruncatedText, WSegmentedProgress, WSemiCircleGauge } from 'wakeb-components'
</script>
<template>
  <WTruncatedText label="أساس مشترك لكل فريق ومشروع" :length="20" />
  <WSegmentedProgress :value="65" label="65%" />
  <WSemiCircleGauge :value="75" label="75%" sub-label="الجودة" />
</template>
```

Vue وVuetify هما peers، وWakeb Utils0.1.1 يُثبت من npm. الحزمة ESM لمشاريع
Vue التي تستخدم bundler. التطوير على Node22.14+. للعمل دون اتصال، احفظ
<a href="/downloads/wakeb-components-0.1.0.tgz" download>الأرشيف</a> داخل المشروع وثبّته محليًا.
احفظ package.json وملف القفل معًا.

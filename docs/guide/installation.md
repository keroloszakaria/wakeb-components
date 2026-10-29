# Installation

Install the public npm package in a Vue 3.5 + Vuetify 3.13.2+ project:

```sh
npm install wakeb-components@0.7.0
```

Import CSS once in your application entry and keep your existing Vuetify setup:

```ts
import 'vuetify/styles'
import 'wakeb-components/style.css'
```

A new application also installs Vuetify as a Vue plugin:

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
  <WTruncatedText label="A shared foundation for every team" :length="20" />
  <WSegmentedProgress :value="65" label="65%" />
  <WSemiCircleGauge :value="75" label="75%" sub-label="Quality" />
</template>
```

Vue and Vuetify are external peers; Wakeb Utils 0.1.1 is resolved from npm.
The package is ESM for Vue bundlers. Development uses Node 22.14+.
For offline use, copy <a href="/downloads/wakeb-components-0.7.0.tgz" download>the archive</a>
into your project and install that file. Commit the manifest and lockfile together.

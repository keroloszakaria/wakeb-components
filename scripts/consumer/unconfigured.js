// Bundled without wakebComponents(): the published resolver must fail with a stable code.
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { WButton, createWakebComponents } from 'wakeb-components'

export const renderPage = () =>
  renderToString(createSSRApp({ render: () => h(WButton, { title: 'x' }) }).use(createWakebComponents({ framework: 'vuetify' })))

import { bridge } from '@uapp/bridge'
import { createUApp } from '@uapp/core'

const app = createUApp(bridge)
app.mount('#app')

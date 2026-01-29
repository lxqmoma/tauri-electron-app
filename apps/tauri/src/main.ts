import { WebBridge } from '@uapp/bridge'
import { TauriBridge } from '@uapp/bridge/tauri'
import { createUApp } from '@uapp/core'

const isTauri = !!(window as any).__TAURI_INTERNALS__ || !!(window as any).__TAURI__
const bridge = isTauri ? new TauriBridge() : new WebBridge()

const app = createUApp(bridge)
app.mount('#app')

<script setup lang="ts">
import type { IPlatformBridge } from '@uapp/bridge'
import { bridge as defaultBridge } from '@uapp/bridge'
import { inject, onMounted, ref } from 'vue'

const platformInfo = ref<any>(null)
const appVersion = ref('')

const bridge = inject<IPlatformBridge>('bridge', defaultBridge)

onMounted(async () => {
  platformInfo.value = await bridge.system.getPlatformInfo()
  appVersion.value = await bridge.system.getAppVersion()
})

async function handleOpenFile() {
  const result = await bridge.file.openDialog({
    title: '打开配置',
    filters: [{ name: 'JSON', extensions: ['json'] }],
  })
  if (result) {
    await bridge.dialog.message({
      title: '选择文件',
      message: `你选择了: ${Array.isArray(result) ? result.join(', ') : result}`,
    })
  }
}

function handleGreet() {
  bridge.dialog.message({
    title: 'Hello',
    message: `Welcome to UApp on ${platformInfo.value?.name}`,
  })
}
</script>

<template>
  <div class="home-container">
    <div class="content">
      <h1>UApp ({{ platformInfo?.name || 'Loading...' }})</h1>
      <p>Version: {{ appVersion }}</p>

      <div class="card">
        <el-button type="primary" @click="handleGreet">
          打招呼
        </el-button>
        <el-button type="success" @click="handleOpenFile">
          打开文件
        </el-button>
      </div>

      <div class="debug-info">
        <h3>Platform Info:</h3>
        <pre>{{ JSON.stringify(platformInfo, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .content {
    text-align: center;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);

    .card {
      margin: 20px 0;
      gap: 10px;
      display: flex;
      justify-content: center;
    }

    .debug-info {
      margin-top: 20px;
      text-align: left;
      background: #f8f9fa;
      padding: 10px;
      border-radius: 4px;

      pre {
        margin: 0;
        font-size: 12px;
      }
    }
  }
}
</style>

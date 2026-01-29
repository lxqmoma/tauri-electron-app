<script setup lang="ts">
import { isElectron } from '@renderer/utils/env'
import { reactive } from 'vue'

const versions = reactive(
  isElectron()
    ? { ...window.electron.process.versions }
    : { electron: 'N/A', chrome: 'N/A', node: 'N/A' },
)
</script>

<template>
  <ul class="versions">
    <li class="electron-version">
      Electron v{{ versions.electron }}
    </li>
    <li class="chrome-version">
      Chromium v{{ versions.chrome }}
    </li>
    <li class="node-version">
      Node v{{ versions.node }}
    </li>
  </ul>
</template>

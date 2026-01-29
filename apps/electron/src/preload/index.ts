/* eslint-disable node/prefer-global/process */
import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose IPC renderer to the renderer process.
// Read more at https://www.electronjs.org/docs/latest/tutorial/context-isolation
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  }
  catch (error) {
    console.error(error)
  }
}
else {
  window.electron = electronAPI
  window.api = api
}

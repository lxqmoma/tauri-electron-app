/* eslint-disable node/prefer-global/process */
import fs from 'node:fs/promises'
import { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  }
  else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// IPC Handlers
function registerIpcHandlers() {
  // File
  ipcMain.handle('file:read', async (_, path) => {
    return await fs.readFile(path, 'utf-8')
  })

  ipcMain.handle('file:exists', async (_, path) => {
    try {
      await fs.access(path)
      return true
    }
    catch {
      return false
    }
  })

  ipcMain.handle('file:write', async (_, path, content) => {
    await fs.writeFile(path, content, 'utf-8')
  })

  // Dialog
  ipcMain.handle('dialog:open', async (_, options) => {
    const { filePaths } = await dialog.showOpenDialog({
      title: options?.title,
      defaultPath: options?.defaultPath,
      filters: options?.filters,
      properties: [
        options?.multiple ? 'multiSelections' : 'openFile',
        options?.directory ? 'openDirectory' : 'openFile',
      ],
    })
    return options?.multiple ? filePaths : filePaths[0] || null
  })

  ipcMain.handle('dialog:save', async (_, options) => {
    const { filePath } = await dialog.showSaveDialog({
      title: options?.title,
      defaultPath: options?.defaultPath,
      filters: options?.filters,
    })
    return filePath || null
  })

  ipcMain.handle('dialog:message', async (_, options) => {
    await dialog.showMessageBox({
      title: options?.title,
      message: options?.message,
      type: options?.type || 'info',
    })
  })

  ipcMain.handle('dialog:confirm', async (_, options) => {
    const { response } = await dialog.showMessageBox({
      title: options?.title,
      message: options?.message,
      type: options?.type || 'info',
      buttons: [options?.okLabel || 'Yes', options?.cancelLabel || 'No'],
      defaultId: 0,
      cancelId: 1,
    })
    return response === 0
  })

  // System
  ipcMain.handle('app:version', () => app.getVersion())
  ipcMain.handle('app:info', () => ({
    name: 'electron',
    version: process.versions.electron,
    os: process.platform,
    arch: process.arch,
  }))
  ipcMain.handle('shell:open', (_, url) => shell.openExternal(url))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.u')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * 检测当前是否在 Electron 环境中运行
 */
export function isElectron(): boolean {
  return typeof window !== 'undefined' && !!window.electron?.process?.versions
}

/**
 * 获取 Electron 进程版本信息
 * 在 Web 环境中返回 undefined
 */
export function getElectronVersions() {
  if (isElectron()) {
    return window.electron.process.versions
  }
  return undefined
}

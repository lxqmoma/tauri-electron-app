# UApp (uapp)

[English](./README.md) | **中文**

UApp 是一个跨平台的App，旨在 Web、Windows 和 macOS 环境下提供一致的体验。本项目采用 **Monorepo** 架构，最大化地实现了跨平台代码复用。

## 🏗 项目架构

本项目使用 `pnpm` workspaces 进行管理：

### `apps/` (宿主应用)

- **`web`**: 纯浏览器版本，使用 Vite 构建。
- **`electron`**: 面向 Windows 7+ (及 Linux/macOS) 的桌面版本，使用 Electron + Vite 构建。
- **`tauri`**: 面向 Windows 10+ 和 macOS 的现代化桌面版本，使用 Tauri 2.x + Vite 构建。

### `packages/` (共享库)

- **`core`**: 包含核心应用逻辑、Vue 视图、组件、路由和状态管理 (Pinia)。**几乎所有的 UI 代码都可以在这里找到。**
- **`bridge`**: 跨平台抽象层 (Bridge 模式)。它提供了一个统一的接口来访问系统能力 (文件读写、对话框等)，并在运行时自动适配 Web、Electron 或 Tauri 环境。
- **`schema`**: 使用 Zod 定义的共享数据校验 Schema。
- **`utils`**: 通用工具函数。

## 🛠 技术栈

- **核心框架**: Vue 3, TypeScript, Vite
- **状态管理**: Pinia + pinia-plugin-persistedstate
- **UI 框架**: Element Plus (自动引入)
- **路由**: Vue Router
- **工具库**: VueUse, ofetch, dayjs, mitt, Zod
- **跨平台容器**: Electron (electron-vite), Tauri 2.x

## 🚀 快速开始

### 环境依赖

- **Node.js**: >= 20.0.0
- **pnpm**: >= 9.0.0
- **Rust**: 开发 Tauri 应用必需 (通过 [rustup](https://rustup.rs/) 安装)

### 安装

```bash
# 安装所有包的依赖
pnpm install
```

### 开发模式

启动特定平台的开发环境：

```bash
# Web 浏览器开发
pnpm dev:web

# Electron 应用开发
pnpm dev:electron

# Tauri 应用开发
pnpm dev:tauri
```

### 构建 (Build)

构建生产环境版本：

```bash
# 构建 Web 版本 (输出: apps/web/dist)
pnpm build:web

# 构建 Windows Electron 版本 (输出: apps/electron/dist)
pnpm build:electron:win

# 构建 Tauri 应用 (输出: apps/tauri/src-tauri/target/release/bundle)
# 自动检测当前系统 (macOS 生成 dmg/app, Windows 生成 exe/msi)
pnpm build:tauri
```

## 📂 目录结构

```
uapp/
├── apps/
│   ├── electron/    # Electron 宿主
│   ├── tauri/       # Tauri 宿主
│   └── web/         # Web 宿主
├── packages/
│   ├── bridge/      # 平台适配层 (Web/Electron/Tauri)
│   ├── core/        # 核心共享 Vue 应用
│   ├── schema/      # Zod 定义
│   └── utils/       # 工具函数
├── package.json     # Workspace 配置
├── pnpm-workspace.yaml
└── README.md
```

## 🔌 Bridge 使用指南

项目使用全局 `bridge` 对象来调用系统 API。详细定义请查看 `packages/bridge`。

```typescript
import { bridge } from '@uapp/bridge'

// 示例：打开文件对话框 (在 Web*, Electron, Tauri 下均可工作)
const result = await bridge.file.openDialog({
  title: '打开文件',
  filters: [{ name: 'JSON', extensions: ['json'] }],
})

// *在 Web 端，会自动模拟文件上传点击行为。
```

## ⚠️ 注意事项

- **Tauri**: 如果添加了新的插件，请确保在 `apps/tauri/src-tauri/capabilities` 中配置了相应的权限。
- **Electron**: 使用 `electron-vite` 进行构建优化。

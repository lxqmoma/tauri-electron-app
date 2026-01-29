# U App

**English** | [中文](./README.zh-Hans.md)

UApp is a cross-platform application designed to provide a consistent experience across Web, Windows, and macOS environments. This project adopts a **Monorepo** architecture to maximize cross-platform code reuse.

## 🏗 Project Architecture

This project is managed using `pnpm` workspaces:

### `apps/` (Host Applications)

- **`web`**: Pure browser version, built with Vite.
- **`electron`**: Desktop version for Windows 7+ (and Linux/macOS), built with Electron + Vite.
- **`tauri`**: Modern desktop version for Windows 10+ and macOS, built with Tauri 2.x + Vite.

### `packages/` (Shared Libraries)

- **`core`**: Contains core application logic, Vue views, components, routing, and state management (Pinia). **Almost all UI code can be found here.**
- **`bridge`**: Cross-platform abstraction layer (Bridge implementation). It provides a unified interface to access system capabilities (file I/O, dialogs, etc.) and automatically adapts to Web, Electron, or Tauri environments at runtime.
- **`schema`**: Shared data validation schemas defined using Zod.
- **`utils`**: General utility functions.

## 🛠 Tech Stack

- **Core Framework**: Vue 3, TypeScript, Vite
- **State Management**: Pinia + pinia-plugin-persistedstate
- **UI Framework**: Element Plus (with auto-import)
- **Routing**: Vue Router
- **Utils**: VueUse, ofetch, dayjs, mitt, Zod
- **Cross-Platform Containers**: Electron (electron-vite), Tauri 2.x

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 20.0.0
- **pnpm**: >= 9.0.0
- **Rust**: Required for developing Tauri applications (install via [rustup](https://rustup.rs/))

### Installation

```bash
# Install dependencies for all packages
pnpm install
```

### Development Mode

Start the development environment for a specific platform:

```bash
# Web Browser Development
pnpm dev:web

# Electron App Development
pnpm dev:electron

# Tauri App Development
pnpm dev:tauri
```

### Build

Build for production:

```bash
# Build Web Version (Output: apps/web/dist)
pnpm build:web

# Build Windows Electron Version (Output: apps/electron/dist)
pnpm build:electron:win

# Build Tauri App (Output: apps/tauri/src-tauri/target/release/bundle)
# Automatically detects current system (dmg/app for macOS, exe/msi for Windows)
pnpm build:tauri
```

## 📂 Directory Structure

```
uapp/
├── apps/
│   ├── electron/    # Electron Host
│   ├── tauri/       # Tauri Host
│   └── web/         # Web Host
├── packages/
│   ├── bridge/      # Platform Adapter Layer (Web/Electron/Tauri)
│   ├── core/        # Core Shared Vue Application
│   ├── schema/      # Zod Definitions
│   └── utils/       # Utility Functions
├── package.json     # Workspace Config
├── pnpm-workspace.yaml
└── README.md
```

## 🔌 Bridge Usage Guide

The project uses a global `bridge` object to call system APIs. For detailed definitions, please check `packages/bridge`.

```typescript
import { bridge } from '@uapp/bridge'

// Example: Open File Dialog (Works in Web*, Electron, and Tauri)
const result = await bridge.file.openDialog({
  title: 'Open File',
  filters: [{ name: 'JSON', extensions: ['json'] }],
})

// *On the Web, it automatically simulates file upload click behavior.
```

## ⚠️ Notes

- **Tauri**: If new plugins are added, ensure appropriate permissions are configured in `apps/tauri/src-tauri/capabilities`.
- **Electron**: Uses `electron-vite` for build optimization.

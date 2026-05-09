# 前端开发项目示例

## 📖 项目介绍

这是一个基于现代前端技术栈构建的 Web 应用示例，旨在展示如何高效集成 Vue 3 全家桶。项目采用了最新的 Vue 3.5+ 和 TypeScript 开发，并通过 Docker 实现了标准化的容器化部署。

### 核心功能与特性

- **现代化架构**: 基于 Vue 3 Composition API 和 `<script setup>` 语法。
- **类型安全**: 全面使用 TypeScript，提供良好的开发体验和代码健壮性。
- **状态管理**: 集成 Pinia 进行高效、直观的全局状态管理。
- **网络请求**: 封装 Axios，支持统一的拦截器和错误处理。
- **样式方案**: 使用 Sass/SCSS 进行样式预处理。
- **代码规范**: 配置了 ESLint 和 Prettier，确保代码风格统一。
- **容器化**: 提供完整的 Docker 和 Docker Compose 配置，支持一键启动。

## 📂 项目目录结构

```text
project/
├── docker-compose.yml        # Docker 服务编排配置，定义服务启动参数
├── README.md                 # 项目说明文档
└── frontend/                 # 前端应用源代码目录
    ├── Dockerfile            # 前端镜像构建脚本
    ├── index.html            # Vite 入口 HTML 文件
    ├── package.json          # 项目依赖与脚本配置
    ├── pnpm-lock.yaml        # 依赖版本锁定文件
    ├── tsconfig.json         # TypeScript 配置文件
    ├── vite.config.ts        # Vite 构建工具配置
    ├── public/               # 静态资源目录
    └── src/                  # 源代码主目录
        ├── api/              # API 接口定义 (如 demo.ts)
        ├── stores/           # Pinia 状态管理 (如 counter.ts)
        ├── utils/            # 通用工具函数 (如 http.ts 请求封装)
        ├── views/            # 页面视图组件 (如 HomeView.vue)
        ├── router.ts         # 路由配置
        ├── main.ts           # 应用入口文件
        └── App.vue           # 根组件
```

## 🚀 项目部署与运行

本项目支持 **Docker 容器化运行** 和 **本地开发运行** 两种模式。

### 方式一：Docker 容器化部署（推荐）

这种方式无需在本地配置 Node.js 环境，适合快速预览和部署。

**前提条件**: 请确保本地已安装 [Docker Desktop](https://www.docker.com/products/docker-desktop/)。

1.  **进入项目根目录**:
    ```bash
    cd project
    ```

2.  **启动服务**:
    ```bash
    docker compose up -d --build
    ```
    *   `-d`: 后台运行
    *   `--build`: 强制重新构建镜像（首次运行或代码变更后推荐使用）

3.  **访问应用**:
    打开浏览器访问: [http://localhost:3000](http://localhost:3000)

4.  **停止服务**:
    ```bash
    docker compose down
    ```

### 方式二：本地开发模式

适合开发调试，支持热更新。

**前提条件**: 请确保安装 Node.js (v18+) 和 pnpm。

1.  **进入前端目录**:
    ```bash
    cd project/frontend
    ```

2.  **安装依赖**:
    ```bash
    pnpm install
    ```

3.  **启动开发服务器**:
    ```bash
    pnpm dev
    ```

4.  **访问应用**:
    默认地址通常为 [http://localhost:5173](http://localhost:5173) (请以终端实际输出为准)。

5.  **代码检查与修复**:
    ```bash
    pnpm lint
    ```

6.  **构建生产版本**:
    ```bash
    pnpm build
    ```

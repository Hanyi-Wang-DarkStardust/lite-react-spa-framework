# 🚀 lite-react-spa: 为 React SPA 打造的轻量级简易框架

## 背景

许多面向用户的 WebApp 选择使用 SPA (Single-page application) 的模式进行开发，对于重首屏性能与可交互的用户产品来说有着较为优秀的表现。

当前，React 项目构建的 SPA 工程中，大多采用 react-router 等工具仓库管理与注册路由与页面。同时通过 React-Dom 原生提供的 render 方法进行项目启动与渲染。

然而，传统的 React SPA 应用方式却有如下几点弊端

1. 缺少统一的生命周期管理，无法统一上报、监控、与管理页面跳转。

2. 没有完善的路由守卫支持，不同于 Vue，当前缺少完备的针对 react-router 的路由守卫方案。

3. 全局状态管理框架众多，难以选择。

针对以上问题， lite-react-spa 工程以 monorepo 的形式提供简易路由守卫、启动服务、与基于 redux 且可支持异步 Action 的全局状态管理框架与工具。

## lite-react-spa 提供能力与 NPM 包

下表包含维护中或计划中的 NPM 包，如有开发意向可以直接联系维护者协同共建

| 包名                          | 简介                                                   | 状态        | 维护人             |
| ----------------------------- | ------------------------------------------------------ | ----------- | ------------------ |
| @lite-react-spa/router  | 提供项目路由注册、路由守卫服务                         | 🚀 准备中   | Hanyi Wang          |
| @lite-react-spa/startup | 提供项目启动、生命周期管理等启动流程服务               | 🚀 准备中   | Hanyi Wang          |

## 开始开发

本仓库采用 mono-repo 的形式，采用 pnpm + workspace + nx + changeset 构建仓库以及版本管理。针对具体功能可以在子包内部进行开发，发包方式如下：

### 1. 正式版包

```bash
# 根据 prompt 选择生成 changeset 类型
pnpm changeset add

# 合并 changesets，修改 package.json
pnpm changeset version

# 根据新版本 package.json 发布
pnpm changeset publish
```

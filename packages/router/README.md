## @lite-react-spa/router ———— NavigationGuard React Hook 版路由守卫

为 React 单页应用（SPA）设计的高可用轻量导航守卫框架

### 背景

导航守卫主要用来通过跳转或取消的方式守卫导航，但不同于 Vue-router，React 套件中并未提供导航守卫能力。

本组件库旨在为基于 React 以及 react-router 的单页应用（SPA）设计一套高可用、轻量、即插即用的导航守卫组件。提供多种方式的植入路由导航中：全局的，单路由独享，或者组件级。

### 提供什么能力

1. **全局守卫**: 路由跳转开始前的回调函数。当一个导航触发时，全局前置守卫按照创建顺序调用

2. **单路由独享守卫**: 仅在进入路由时触发，路由内的 query、hash 等变化不会触发

3. **兼顾性能**: 支持路由页面懒加载

### 我是否需要使用路由守卫？

#### 什么情况下使用路由守卫？

1. 页面状态的跳转完全取决于监听数据时。例如应用默认进入正文页面，如果网络请求回包数据显示用户没有权限，则自动跳转到空白页；
   重新获取权限且收到 websocket 数据推送时，再返回正文页面。

2. 非法路由页面重定向。例如用户随意输入一个未注册的 pathname，需要回到默认页面。

3. 不可变数据场景下的路由判断。例如 未登录的用户无法进入某页面、非文档创建者无法进入收集表设置页面 等。
   未登录用户、是否为文档创建者等字段在页面打开期间是不会改变的，故从一而终的数据更适合路由守卫来接管页面的跳转。

#### 什么情况下不用路由守卫？

1. 事件触发式路由跳转，例如点击后跳转页面等。此类操作应该由逻辑层操控，无需 APP 层接管。

2. 一次性数据驱动，即非完全基于某一数据变化而跳转的场景。例如打开页面后进行一次网络请求获取是否填写过收集表，如果填写过，则跳转到另一个页面。
   这种场景下并非每次进入页面都需要判断，只需要保证第一次数据变化时路由跳转，而后该数据变化不影响路由，这种场景下建议在数据层实现跳转逻辑。
   因为路由守卫勾子函数具备通用型，如果 APP 层收归此场景，则需要大量的流程控制代码来应对各种边界场景。将使得路由组件过于重量，违背了启动流程轻量化的设计理念。

### 使用方法

```typescript
// main.ts
import React from "react";
import { HashRouter } from "react-router-dom";
import { NavigationGuard } from "@lite-react-spa/router";
import { routeConfig } from "./route-config";

const Component: React.FC<{}> = () => {
  return (
    <HashRouter>
      <NavigationGuard
        routes={routeConfig}
        guardedPath="XXXXX"
        beforeEnterRoute={({ pathname, observedData, prevPathname }) => {
          const { isCreator } = observedData;
          weblog.report(pathname, isCreator, prevPathname);
        }}
      />
    </HashRouter>
  );
};
```

其中可配置的路由选项如下：

```typescript
// route-config.ts
import { rootComponent, fillInstance } from "./components";

export const routeConfig = [
  {
    path: "/",
    componentOptions: {
      component: rootComponent,
    },
    children: [
      {
        path: "/",
        index: true,
        redirectTo: "login-page",
      },
      {
        path: "login-page",
        componentOptions: {
          component: LoginPage,
        },
      },
      {
        path: "shopping-cart",
        componentOptions: {
          importFunc: () => import("@/components/shopping-cart"),
        },
        beforeEnterThisRoute: () => {
          const hasLogin = getCookie('login');
          if (!hasLogin) return "login-page";
          return;
        },
      },
    ],
  },
];
```

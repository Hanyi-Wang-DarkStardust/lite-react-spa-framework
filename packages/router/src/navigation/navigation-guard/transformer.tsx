import {
  KVPair, PossibleComponentType, RouteElement, RouteHooksType,
} from '@router/common/types';
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { GuardComponent } from '../guard';

/**
 * 获取路由组件，同时绑定订阅数据，路由守卫组件
 * @param componentOptions 组件选项，支持懒加载或直接传入
 * @param observedData 需要监听的数据
 * @param beforeEnterRoute 全局路由守卫勾子
 * @param beforeEnterThisRoute 页面级路由守卫勾子
 */
function generateRouteComponent(
  componentOptions: PossibleComponentType,
  hasLeafGuards: boolean,
  observedData?: KVPair,
  beforeEnterRoute?: RouteHooksType,
  beforeEnterThisRoute?: RouteHooksType,
): JSX.Element {
  const { component, importFunc } = componentOptions;

  let innerElement;
  if (component) {
    innerElement = component;
  } else {
    const Element = React.lazy(importFunc!);
    innerElement = (
      <React.Suspense fallback={<></>}>
        <Element />
      </React.Suspense>
    );
  }

  return <GuardComponent
    observedData={observedData}
    beforeEnterRoute={beforeEnterRoute}
    hasLeafGuards={hasLeafGuards}
    beforeEnterThisRoute={beforeEnterThisRoute}>
    {innerElement}
  </GuardComponent>;
}


/**
 * 解析自定义路由配置列表并生成标准化的 RouteObject 列表
 * @param routes 自定义路由配置列表
 * @param observedData 可订阅数据源，通常可订阅 store，根据数据变化触发钩子函数
 * @param beforeEnterRoute 全局级别守卫
 */
export function transformRoutes(
  routes: Array<RouteElement>,
  observedData?: KVPair,
  beforeEnterRoute?: RouteHooksType,
): Array<RouteObject> {
  const list: Array<RouteObject> = [];

  routes?.forEach((routeComponent: RouteElement) => {
    const {
      path,
      index,
      redirectTo,
      componentOptions,
      children,
      beforeEnterThisRoute,
    } = routeComponent;
    // 处理没有传入 path 字段的兜底场景
    if (typeof path === 'undefined') return;

    const routeObj: RouteObject = {
      path,
      index,
      element: null,
    };

    // 重定向场景
    if (redirectTo) {
      routeObj.element = <Navigate to={redirectTo} replace={true}/>;
    } else if (componentOptions) {
      // 常规场景，包括组件懒加载与常规加载
      routeObj.element = generateRouteComponent(
        componentOptions,
        !!children,
        observedData,
        beforeEnterRoute,
        beforeEnterThisRoute,
      );
    }

    // 有子路由配置，且非 index 路由，则递归构建 RouteObject
    if (children && !index) {
      routeObj.children = transformRoutes(
        children,
        observedData,
        beforeEnterRoute,
      );
    }
    list.push(routeObj);
  });
  return list;
}

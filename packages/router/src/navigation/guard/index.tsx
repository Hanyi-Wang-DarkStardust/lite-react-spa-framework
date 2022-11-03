import type { IGuardComponent, RouteHooksResType } from '@router/common/types';
import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * 路由地址与路由组件缓存器
 */
const routerCache = (function () {
  let pathname = '';
  let component: JSX.Element | null = null;

  function setCache(element: JSX.Element, path: string) {
    pathname = path;
    component = element;
  }

  function getCache() {
    return { component, pathname };
  }

  return {
    setCache,
    getCache,
  };
}());

/**
 * 获取重定向的 Navigate 组件，或直接返回组件
 */
function getElementByHookResult(
  component: JSX.Element,
  pathname: string,
  previousPath: string,
  hookRes: RouteHooksResType,
): {
    component: JSX.Element,
    shouldUpdateFlow: boolean;
  } {
  // 路由拦截 hook 返回 false 的场景：返回前一个 path
  if (hookRes === false && previousPath && pathname !== previousPath) {
    return {
      component: <Navigate to={previousPath} replace={true} />,
      shouldUpdateFlow: false,
    };
  }

  // 路由拦截 hook 返回 path 的场景：重定向到 path
  if (typeof hookRes === 'string' && hookRes !== pathname) {
    return {
      component: <Navigate to={hookRes} replace={true} />,
      shouldUpdateFlow: true,
    };
  }

  // 常规渲染，不拦截路由
  return { component, shouldUpdateFlow: true };
}

/**
 * 路由组件 HOC 组件
 * @description 路由守卫组件的实际组件，外层路由守卫的实现单元
 */
export const GuardComponent: React.FC<IGuardComponent> = (props: IGuardComponent) => {
  const {
    hasLeafGuards = false,
    children,
    observedData = {},
    beforeEnterRoute,
    beforeEnterThisRoute,
  } = props;
  const location = useLocation();
  const { pathname } = location;

  const {
    component: cachedElement,
    pathname: prevPathname,
  } = routerCache.getCache();

  // 命中缓存的组件（已经加载的组件），或者组册的路由下存在子路由
  // 有子路由的路由不能被渲染，只能渲染子路由中的 index 路由
  const shouldDirectlyReturned = useMemo(
    () => cachedElement === children || hasLeafGuards,
    [children, cachedElement, hasLeafGuards],
  );

  // 判断直接返回的场景：
  // 1. 命中缓存或有子路由，2. 没有设置全局与当前页面级别的 hooks
  if (shouldDirectlyReturned || !(beforeEnterRoute || beforeEnterThisRoute)) {
    routerCache.setCache(children, pathname);
    return children;
  }

  // 执行全局级别 hook
  const pathRes = beforeEnterRoute?.({ pathname, observedData, prevPathname });
  // 执行页面级别 hook
  const currPathRes = beforeEnterThisRoute?.({ pathname, observedData, prevPathname });

  const {
    component, shouldUpdateFlow,
  } = getElementByHookResult(children, pathname, prevPathname, currPathRes || pathRes);

  if (shouldUpdateFlow) {
    routerCache.setCache(component, pathname);
  }
  return component;
};

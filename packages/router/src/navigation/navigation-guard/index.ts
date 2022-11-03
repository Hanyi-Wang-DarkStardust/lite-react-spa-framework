import { INavigationGuard } from '@router/common/types';
import React, { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';
import { transformRoutes } from './transformer';

/**
 * 路由守卫 HOC 组件
 * @description 支持自定义路由配置列表、全局级与页面级勾子函数。
 * 可实现页面渲染前自动跳转或执行逻辑
 */
export const NavigationGuard: React.FC<INavigationGuard> = (props: INavigationGuard) => {
  const {
    routes,
    beforeEnterRoute,
    guardedPath,
    observedData,
  } = props;

  // 自动添加非法路径重定向配置
  routes.push({
    path: '*',
    redirectTo: guardedPath,
  });

  // 获取 RouteObject 列表，提供给 useRoutes 方法组装路由组件
  const normalizedRoutes = useMemo(
    () => transformRoutes(routes, observedData, beforeEnterRoute),
    [routes, observedData, beforeEnterRoute],
  );

  // 组装路由组件并返回
  return useRoutes(normalizedRoutes);
};

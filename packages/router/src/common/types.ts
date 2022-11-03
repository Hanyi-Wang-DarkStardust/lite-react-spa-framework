import { ComponentType } from 'react';

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends Record<string, unknown> ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;


export type KVPair<T = any> = { [key: string]: T };

/**
 * 组件选项类型
 * @description 一定为 component 与懒加载函数二选一
 */
export type PossibleComponentType = XOR<{
  component: JSX.Element | null
}, {
  importFunc: (() => Promise<{ default: ComponentType<any>; }>)
}>;

/**
 * 路由守卫配置项
 */
export type RouteElement = {
  /**
   * 页面路径
   */
  path: string;

  /**
   * 重定向路径
   * @description 此选项优先级高于 componentOptions ，即优先走重定向逻辑
   */
  redirectTo?: string;

  /**
   * 当前页面是否为 index 路由
   */
  index?: boolean;

  /**
   * 组件选项类型
   * @description 目前支持常规组件与懒加载函数
   */
  componentOptions?: PossibleComponentType;

  /**
   * 页面级别守卫 hook
   * @description 在进入当前页面后，渲染组件前，会立即调用。
   * 可支持在在渲染组件前跳转路由
   */
  beforeEnterThisRoute?: RouteHooksType;

  /**
   * 子路由配置
   */
  children?: Array<RouteElement>;
};

/**
 * 守卫 hook 函数类型
 */
export type RouteHooksType = (param: {
  /** 当前 pathname */
  pathname: string,
  /** 监测数据 */
  observedData: KVPair,
  /** 前一个路由的 pathname */
  prevPathname: string,
}) => RouteHooksResType;

/**
 * NavigationGuard props 类型
 */
export interface INavigationGuard {
  /**
   * 自定义路由配置
   */
  routes: Array<RouteElement>;

  /**
   * 默认重定向 path
   * @description 输入不合法的路由时将自动重定向到该 path
   */
  guardedPath: string;

  /**
   * 可订阅数据
   * 通常可订阅 store ，例如 react-redux 中通过 connect 绑定 observedData 注入 redux store
   * 进而可在绑定 store 变化的时候通知路由守卫组件，重新执行 hooks
   */
  observedData?: KVPair;

  /**
   * 全局级别守卫 hook
   * @description 每次进入一个新的路由，都会调用
   */
  beforeEnterRoute?: RouteHooksType;
}

/**
 * GuardComponent props 类型
 */
export interface IGuardComponent {
  /**
   * 子组件
   */
  children: JSX.Element;

  /**
   * children component 是否存在 GuardComponent
   */
  hasLeafGuards: boolean;

  /**
   * 页面携带的数据
   * 可绑定数据服务，实现监听数据变化的能力
   */
  observedData?: KVPair;

  /**
   * 全局级别守卫 hook
   */
  beforeEnterRoute?: RouteHooksType

  /**
   * 页面级别守卫 hook
   */
  beforeEnterThisRoute?: RouteHooksType;
}

/**
 * 守卫 hook 返回值类型
 * @description 支持如下返回结果：
 * 1. return void/true: 不拦截当前路由
 * 2. return false: 拦截路由并返回前一个路由页面
 * 3. return path: 拦截路由并重定向到 path 路由页面
 */
export type RouteHooksResType = void | string | boolean;

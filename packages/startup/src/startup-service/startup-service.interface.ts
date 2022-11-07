import { IPlugin } from '../plugin-system/plugins.interface';
import { IInitializer } from './initializer.interface';

/**
 * Startup Service 实例接口
 */
export interface IStartupService {
  /**
   * 注册自定义插件
   * @param plugin 自定义插件，可读写插件 storage 系统
   */
  use(...plugins: Array<IPlugin>): this;

  /**
   * 注册项目启动时期的数据获取方法。
   * 通常在此处传入用于网络请求获取应用需要加载的首屏数据
   * @param initializerArray 自定义 initializer
   */
  useInitializer(...initializerArray: Array<IInitializer>): this;

  /**
   * 注册自定义 React 组件
   * @param element 挂载的路由元素
   */
  registerRoutes(element: JSX.Element): this;

  /**
   * 启动 APP 并开始渲染
   * 根据传入的 DOM 节点 ID 渲染，通常为根结点 ID
   * 如果不传，则直接返回封装后的组件
   * @param containerID 需要挂载的 DOM 节点 ID
   */
  start(containerID?: string): Promise<void | JSX.Element>;
}

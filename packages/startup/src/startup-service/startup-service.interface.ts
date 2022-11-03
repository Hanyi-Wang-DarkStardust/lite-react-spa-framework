import type { History } from 'history';
import { IPlugin } from '../plugin-system/plugins.interface';
import { IAppDataFetcher } from './data-fetch-service.interface';

/**
 * Startup Service 实例化参数
 */
export type StartupConfig = {
  /**
   * 【可选】获取数据的服务
   * 为数据获取生命周期提供数据支持。将先通过 dataFetcher 获取数据，后提供给数据获取生命周期执行
   */
  dataFetcher?: IAppDataFetcher;

  /**
   * 【可选】需要注册并暴露给全局的 history 对象
   */
  history?: History;
};

/**
 * Startup Service 实例接口
 */
export interface IStartupService {
  /**
   * APP 内部储存的挂载组件，可以被插件修改
   */
  element: JSX.Element | null;

  /**
   * 注册自定义插件
   * @param plugin 自定义插件，可读写插件 storage 系统
   */
  use(...plugins: Array<IPlugin>): this

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

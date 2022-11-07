import { IStartupService } from '@startup/startup-service/startup-service.interface';
import { EAppLifeCycle } from '@startup/common/enum';

export type PluginExecParam<T extends Record<string, unknown> = any> = {
  /**
   * 启动服务实例
   */
  app: IStartupService;

  /**
   * 数据服务的数据信息
   * 例如拉取数据的回包结果（包括 data 与 error）
   */
  extraData?: T;
};

/**
 * 插件执行函数类型
 */
export type PluginExecutor = (execParam: PluginExecParam) =>  void | Promise<void>;

/**
 * 启动服务生命周期插件接口
 */
export interface IPlugin {
  /**
   * 插件执行时机
   */
  hookType: EAppLifeCycle;

  /**
   * 插件执行函数
   */
  execute: PluginExecutor;

  /**
   * 执行优先级
   * 数值越高优先级越高，同等级情况下按注册顺序执行，不传则为最低优先级
   */
  priority?: number;
}


import { checkParameters } from '@startup/common/decorators';
import {
  DATA_LIFE_CYCLES, isValidLifeCycle, isValidPlugin, LIFE_CYCLE_CANDIDATES,
} from '../common/lifecycle-utils';
import { IStartupService } from '../startup-service/startup-service.interface';
import { EAppLifeCycle } from './lifecycle.interface';
import { IPlugin } from './plugins.interface';

/**
 * 插件系统，用于统一管理插件注册、生命周期调用等
 */
export class PluginSystem {
  private pluginsMap = new Map<EAppLifeCycle, Array<IPlugin>>();

  constructor(private readonly appService: IStartupService) {
    this.pluginsMap = LIFE_CYCLE_CANDIDATES.reduce((memoMap, key) => {
      memoMap.set(key, []);
      return memoMap;
    }, this.pluginsMap);
  }

  /**
   * 注册插件
   * 检查插件合法性，添加到插件队列中，同时根据优先级为插件队列排序
   * @param plugin 自定义插件
   */
  @checkParameters(isValidPlugin)
  public use(plugin: IPlugin) {
    if (!this.hasRegisteredPlugin(plugin)) {
      console.warn('[STARTUP SERVICE] plugin has been registered');
      return;
    }

    const hooksArray = this.get(plugin.hookType);
    hooksArray.push(plugin);

    this.sortByPriority(hooksArray);
  }

  /**
   * 根据生命周期获取注册的插件队列
   * @param lifeCycle 生命周期
   * @returns 注册在对应生命周期下的插件队列
   */
  @checkParameters(isValidLifeCycle)
  public get(lifeCycle: EAppLifeCycle): Array<IPlugin> {
    return this.pluginsMap.get(lifeCycle) ?? [];
  }

  /**
   * 执行对应生命周期下注册的所有插件
   * @param lifeCycle 生命周期
   * @param extraData
   */
  @checkParameters(isValidLifeCycle)
  public async applyLifecycle(lifeCycle: EAppLifeCycle, extraData?: any) {
    const plugins = this.get(lifeCycle);
    const isDataFetchPlugin = DATA_LIFE_CYCLES.includes(lifeCycle);

    for (const plugin of plugins) {
      await this.executePluginHooks(plugin, isDataFetchPlugin, extraData);
    }
  }

  /**
   * 智能执行 plugin 的 execute 方法
   * @param plugin 需要执行的插件
   * @param isDataFetchPlugin 是否为数据生命周期相关的插件
   * @param extraData 数据生命周期插件的额外数据，仅数据生命周期生效。默认为 null
   */
  private async executePluginHooks(plugin: IPlugin, isDataFetchPlugin: boolean, extraData?: any) {
    // 常规生命周期只需要暴露 appService 实例
    if (!isDataFetchPlugin) {
      return await plugin.execute({ app: this.appService });
    }
    // 数据生命周期需要额外将回报数据提供给插件
    return await plugin.execute({
      app: this.appService,
      extraData: extraData ?? null,
    });
  }

  /**
   * 根据插件的优先级对插件数组进行排序
   * 此方法有副作用，将会修改传入的 plugins 数组
   * @param plugins 插件数组
   */
  private sortByPriority(plugins: Array<IPlugin>) {
    plugins.sort((prev, curr) => {
      const prevPriority = prev.priority || 0;
      const currPriority = curr.priority || 0;
      return currPriority - prevPriority;
    });
  }

  /**
   * 判断当前 plugin 是否注册过
   * @param plugin 插件
   * @returns 是否重复注册
   */
  private hasRegisteredPlugin(plugin: IPlugin) {
    // 已经注册过的 plugin 不再重复注册
    const registeredPlugins = this.get(plugin.hookType);

    return !registeredPlugins?.find((registeredPlugin: IPlugin) => registeredPlugin === plugin);
  }
}

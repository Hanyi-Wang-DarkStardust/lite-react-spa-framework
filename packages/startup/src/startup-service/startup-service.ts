import { getWrappedRoot, renderAtNode } from '@startup/common/app-root';
import { EAppLifeCycle, EInitializerType } from '@startup/common/enum';
import { PluginSystem } from '@startup/plugin-system/plugin-system';
import { IPlugin } from '@startup/plugin-system/plugins.interface';
import { IInitializer } from './initializer.interface';
import { IStartupService } from './startup-service.interface';


export class StartupService implements IStartupService {
  private element: JSX.Element | null = null;
  private initializers: Array<IInitializer> = [];
  /**
   * 插件系统实例
   */
  private pluginSystem = new PluginSystem(this);

  public use(...plugins: Array<IPlugin>): this {
    // 依次注册进入插件系统中
    plugins.forEach((plugin) => {
      this.pluginSystem.use(plugin);
    });

    return this;
  }

  public useInitializer(...initializerArray: Array<IInitializer>) {
    initializerArray.forEach((initializer) => {
      if (!this.initializers.includes(initializer)) {
        this.initializers.push(initializer);
      }
    });

    return this;
  }

  public registerRoutes(routeComponent: JSX.Element): this {
    if (!routeComponent) {
      throw new TypeError('You must pass in Routes Component as an argument.');
    }

    // 给 this.element 变量注册路由组件
    this.element = routeComponent;
    return this;
  }

  public async start(containerID?: string) {
    // 合法性检查
    if (!this.element) {
      throw new TypeError('Cannot found Routes Component, please execute registerRoutes() first.');
    }

    const { pluginSystem } = this;
    // 执行 Bootstrap 生命周期
    await pluginSystem.applyLifecycle(EAppLifeCycle.Bootstrap);

    // 启动数据服务，拉取数据
    for (const initializer of this.initializers) {
      const { initType, executor } = initializer;
      if (initType === EInitializerType.Immediate) {
        await this.initDataFetch(executor);
      } else {
        this.initDataFetch(executor);
      }
    }

    // 如果没有传入 DOM 节点 ID，直接返回封装后的组件
    if (!containerID) {
      return getWrappedRoot(this.element, this.handleRootDidMount.bind(this));
    }

    // 根据 DOM 节点 ID 挂载组件
    const container = document.getElementById(containerID) as HTMLElement;
    return renderAtNode(
      this.element,
      container,
      this.handleRootDidMount.bind(this), // didMount 后，执行 PageMounted 生命周期
    );
  }

  private handleRootDidMount() {
    this.pluginSystem.applyLifecycle(EAppLifeCycle.PageMounted);
  }

  private async initDataFetch(executor?: IInitializer['executor']) {
    if (!executor) {
      console.warn('[STARTUP SERVICE] 未检测到 dataFetcher，将跳过 DataLoadFinish 与 DataLoadException 生命周期');
      return;
    }

    const result = await executor();

    if (result.error) {
      return await this.pluginSystem.applyLifecycle(EAppLifeCycle.DataLoadException, result.error);
    }

    if (result.data) {
      return await this.pluginSystem.applyLifecycle(EAppLifeCycle.DataLoadFinish, result.data);
    }

    console.error('[STARTUP SERVICE] 数据获取错误');
  }
}

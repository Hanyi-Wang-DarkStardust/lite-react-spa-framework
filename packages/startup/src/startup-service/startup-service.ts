import { getWrappedRoot, renderAtNode } from '@startup/common/app-root';
import { EAppLifeCycle } from '@startup/plugin-system/lifecycle.interface';
import { PluginSystem } from '@startup/plugin-system/plugin-system';
import { IPlugin } from '@startup/plugin-system/plugins.interface';
import { EDataFetcherExecType } from './data-fetch-service.interface';
import { IStartupService, StartupConfig } from './startup-service.interface';


export class StartupService implements IStartupService {
  public element: JSX.Element | null = null;

  /**
   * 插件系统实例
   */
  private pluginSystem = new PluginSystem(this);

  public constructor(private readonly startupConfig: StartupConfig) {
  }

  public use(...plugins: Array<IPlugin>): this {
    // 依次注册进入插件系统中
    plugins.forEach((plugin: IPlugin) => {
      this.pluginSystem.use(plugin);
    });

    return this;
  }

  public registerRoutes(routeComponent: JSX.Element): this {
    // 给 this.element 变量注册路由组件
    this.element = routeComponent;
    return this;
  }

  public async start(containerID?: string) {
    const { pluginSystem } = this;
    // 执行 Bootstrap 生命周期
    await pluginSystem.applyLifecycle(EAppLifeCycle.Bootstrap);

    // 启动数据服务，拉取数据
    if (this.startupConfig.dataFetcher) {
      const { fetchType } = this.startupConfig.dataFetcher;
      if (fetchType === EDataFetcherExecType.Immediate) {
        await this.initDataFetch();
      } else {
        this.initDataFetch();
      }
    }

    // 如果没有传入 DOM 节点 ID，直接返回封装后的组件
    if (!containerID) {
      return getWrappedRoot(this.element!, this.handleRootDidMount.bind(this));
    }

    // 根据 DOM 节点 ID 挂载组件
    const container = document.getElementById(containerID) as HTMLElement;
    return renderAtNode(
      this.element!,
      container,
      this.handleRootDidMount.bind(this), // didMount 后，执行 PageMounted 生命周期
    );
  }

  private handleRootDidMount() {
    this.pluginSystem.applyLifecycle(EAppLifeCycle.PageMounted);
  }

  private async initDataFetch() {
    const { dataFetcher } = this.startupConfig;
    if (!dataFetcher) {
      console.warn('[STARTUP SERVICE] 未检测到 dataFetcher，将跳过 DataLoadFinish 与 DataLoadException 生命周期');
      return;
    }

    const result = await dataFetcher.serviceDataFetcher();

    if (result.error) {
      return await this.pluginSystem.applyLifecycle(EAppLifeCycle.DataLoadException, result.error);
    }

    if (result.data) {
      return await this.pluginSystem.applyLifecycle(EAppLifeCycle.DataLoadFinish, result.data);
    }

    console.error('[STARTUP SERVICE] 数据获取错误');
  }
}

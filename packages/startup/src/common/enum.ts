/**
 * 数据获取服务加载类型
 */
export enum EInitializerType {
  /**
   * 同步拉取数据
   * 会保证获取到数据之后才走下一步
   */
  Immediate = 'Immediate',

  /**
   * 异步拉取数据
   * 不保证执行顺序
   */
  Lazy = 'Lazy',
}


/**
 * 插件执行时机枚举
 */
export enum EAppLifeCycle {
  /**
   * 启动前执行
   */
  Bootstrap = 'onBootstrap',

  /**
   * 页面挂载完成
   */
  PageMounted = 'onPageDidMount',

  /**
   * 数据加载完成
   */
  DataLoadFinish = 'onDataLoadFinish',

  /**
   * 数据加载失败
   */
  DataLoadException = 'onDataLoadException',
}

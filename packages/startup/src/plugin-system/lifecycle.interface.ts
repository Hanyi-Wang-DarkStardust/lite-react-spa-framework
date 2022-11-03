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

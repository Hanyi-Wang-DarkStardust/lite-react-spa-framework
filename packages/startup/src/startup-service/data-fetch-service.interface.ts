/**
 * 数据获取服务加载类型
 */
export enum EDataFetcherExecType {
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
 * Service Data 接口返回数据格式
 * 需要接入方根据该格式返回结果
 */
export type ServiceDataResponse<T, E> = {
  data?: T;

  error?: E;
};

/**
 * 数据获取服务接口，提供从远端获取数据的能力
 */
export interface IAppDataFetcher<T = Record<string, unknown>, E = Error> {
  /**
   * 数据获取服务调用模式
   */
  fetchType: EDataFetcherExecType;

  /**
   * 拉取数据的函数
   * 必须为异步函数，通过 Promise 返回 data 与 error
   */
  serviceDataFetcher: () => Promise<ServiceDataResponse<T, E>>;
}

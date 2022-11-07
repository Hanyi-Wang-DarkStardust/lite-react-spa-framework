import { EInitializerType } from '@startup/common/enum';

/**
 * Service Data 接口返回数据格式
 * 需要接入方根据该格式返回结果
 */
export type IntializerRsp<T, E> = {
  data?: T;

  error?: E;
};

/**
 * 数据获取服务接口，提供从远端获取数据的能力
 */
export interface IInitializer<T = Record<string, unknown>, E = Error> {
  /**
   * 数据获取服务调用模式
   */
  initType: EInitializerType;

  /**
   * 拉取数据的函数
   * 必须为异步函数，通过 Promise 返回 data 与 error
   */
  executor: () => Promise<IntializerRsp<T, E>>;
}

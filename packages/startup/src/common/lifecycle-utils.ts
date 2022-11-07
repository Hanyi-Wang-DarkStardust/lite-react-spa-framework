import { isFunction } from '@startup/common/utils';
import { EAppLifeCycle } from '@startup/common/enum';
import { IPlugin } from '../plugin-system/plugins.interface';

/**
 * 目前支持的生命周期
 */
export const LIFE_CYCLE_CANDIDATES: Array<EAppLifeCycle> = [
  EAppLifeCycle.Bootstrap,
  EAppLifeCycle.PageMounted,
  EAppLifeCycle.DataLoadFinish,
  EAppLifeCycle.DataLoadException,
];

/**
 * 获取数据初始化相关的生命周期
 */
export const DATA_LIFE_CYCLES = [
  EAppLifeCycle.DataLoadFinish,
  EAppLifeCycle.DataLoadException,
];

/**
 * 判断生命周期是否合法
 * @param lifeCycle 生命周期
 * @returns 是否合法
 */
export function isValidLifeCycle(lifeCycle: EAppLifeCycle) {
  if (!lifeCycle || !LIFE_CYCLE_CANDIDATES.includes(lifeCycle)) {
    return false;
  }
  return true;
}

/**
 * 判断插件是否合法
 * @param plugin 插件
 * @returns 是否合法
 */
export function isValidPlugin(plugin: IPlugin) {
  if (!isValidLifeCycle(plugin.hookType)) {
    return false;
  }
  if (!isFunction(plugin.execute)) {
    return false;
  }
  return true;
}

import { StartupService } from '../startup-service/startup-service';
import type { IStartupService } from '../startup-service/startup-service.interface';
import { CreateOptions } from './startup-service-facade.interface';

const STARTUP_SERVICE_INDEX = '__FORM_STARTUP_SERVICE__';
const SERVICE_MEM_CACHE = new Map<string, IStartupService>();

/**
 * 获取 startup Service 实例
 * 同时执行自定义 setupApp 逻辑
 */
function createStartupServiceAndExecuteSetup(createOptions: CreateOptions = {}) {
  const { setupApp, ...startupConfig } = createOptions;
  const startupApp = new StartupService(startupConfig);

  setupApp?.(startupApp);

  return startupApp;
}

/**
 * 获取 startup Service 实例，支持单例与多实例模式
 * @param createOptions 创建 StartupService 实例的选项
 * @param singleton 是否需要生成单例
 * @returns startupService 实例
 */
export function createStartupService(createOptions: CreateOptions = {}, singleton = false) {
  if (!singleton) {
    return createStartupServiceAndExecuteSetup(createOptions);
  }

  if (SERVICE_MEM_CACHE.has(STARTUP_SERVICE_INDEX)) {
    return SERVICE_MEM_CACHE.get(STARTUP_SERVICE_INDEX);
  }

  const startupService = createStartupServiceAndExecuteSetup(createOptions);
  return startupService;
}

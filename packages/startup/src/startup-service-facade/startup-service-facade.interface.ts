import { IStartupService } from '../startup-service/startup-service.interface';

/**
 * 创建 StartupService 实例的选项
 */
export type CreateOptions = {
  /**
   * 外观模式下创建 startup Service 后执行的逻辑
   */
  setupApp?: (app: IStartupService) => void;
};


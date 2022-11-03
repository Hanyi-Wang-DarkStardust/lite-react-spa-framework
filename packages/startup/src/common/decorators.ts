/**
 * 检查函数参数是否均满足条件
 * @param rules 判断是否满足条件的判断函数，对应每一个函数传入参数。null 或不传表示不校验
 */
export function checkParameters(...rules: Array<((arg: any) => boolean) | null>) {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = function (...args: any[]) {
      const ruleLength = rules.length;
      args.forEach((arg: any, index: number) => {
        if (index >= ruleLength) return;
        const ruleFunc = rules[index];
        if (!ruleFunc) return;

        let isSuccess;
        try {
          isSuccess = ruleFunc(arg);
        } catch {
          isSuccess = false;
        }
        if (!isSuccess) {
          throw new Error('Function parameter check failed');
        }
      });
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

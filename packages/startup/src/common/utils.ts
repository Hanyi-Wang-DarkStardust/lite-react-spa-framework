/**
 * 判断是否为函数
 */
export function isFunction(o: any) {
  return typeof o === 'function';
}

function isObject(o: Record<string, unknown>) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

/**
 * 判断是否为 Plain Object
 */
export function isPlainObject(o: Record<string, unknown>) {
  if (isObject(o) === false) return false;

  const ctor = o.constructor;
  if (ctor === undefined) return true;

  const prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  if (Object.prototype.hasOwnProperty.call(prot, 'isPrototypeOf') === false) {
    return false;
  }

  return true;
}

/**
 * 判断是否可以通过 id 找到对应的 DOM 元素
 */
export function isValidDomId(containerID: string) {
  const container = document.getElementById(containerID);
  return !!container;
}

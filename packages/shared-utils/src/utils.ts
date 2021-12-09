/**
 * 重写对象上面的某个属性
 *
 * @export
 * @param {Object} source 需要被重写的对象
 * @param {string} name 需要被重写对象的key
 * @param {(...args: any[]) => any} replacement 以原有的函数作为参数，执行并重写原有函数
 * @param {boolean} [isForced=false] 是否强制重写（可能原先没有该属性）
 */
export function replaceOld<T extends object>(source: T, name: keyof T, replacement: (original: T[keyof T]) => any, isForced = false): void {
  if (source === undefined) return;
  if (name in source || isForced) {
    const original = source[name];
    const wrapped = replacement(original);
    if (typeof wrapped === "function") {
      source[name] = wrapped;
    }
  }
}

export function isType(type: string) {
  return function (value: any): boolean {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  };
}

export const variableTypeDetection = {
  isNumber: isType("Number"),
  isString: isType("String"),
  isBoolean: isType("Boolean"),
  isNull: isType("Null"),
  isUndefined: isType("Undefined"),
  isSymbol: isType("Symbol"),
  isFunction: isType("Function"),
  isObject: isType("Object"),
  isArray: isType("Array"),
  isProcess: isType("process"),
  isWindow: isType("Window"),
};

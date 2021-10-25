import { globalVar, ToStringTypes } from "@/constants";
import { logger } from "./logger";
import { nativeToString } from "./is";

export const defaultFunctionName = "<anonymous>";
/**
 * 需要获取函数名，匿名则返回<anonymous>
 * ../param {unknown} fn 需要获取函数名的函数本体
 * ../returns 返回传入的函数的函数名
 */
export function getFunctionName(fn: unknown): string {
  if (!fn || typeof fn !== "function") {
    return defaultFunctionName;
  }
  return fn.name || defaultFunctionName;
}

export function generateUUID(): string {
  let d = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

export function toStringAny(target: any, type: ToStringTypes): boolean {
  return nativeToString.call(target) === `[object ${type}]`;
}

export function toStringValidateOption(
  target: any,
  targetName: string,
  expectType: ToStringTypes
): boolean {
  if (toStringAny(target, expectType)) return true;
  typeof target !== "undefined" &&
    logger.error(
      `${targetName}期望传入:${expectType}类型，当前是:${nativeToString.call(
        target
      )}类型`
    );
  return false;
}

export function validateOptionsAndSet(
  this: any,
  targetArr: [any, string, ToStringTypes][]
) {
  targetArr.forEach(
    ([target, targetName, expectType]) =>
      toStringValidateOption(target, targetName, expectType) &&
      (this[targetName] = target)
  );
}

/**
 * 获取当前的时间戳
 *
 * @export
 * @return {*}  {number}
 */
export function getTimestamp(): number {
  return Date.now();
}

export function silentConsoleScope(callback: Function) {
  globalVar.isLogAddBreadcrumb = false;
  callback();
  globalVar.isLogAddBreadcrumb = true;
}

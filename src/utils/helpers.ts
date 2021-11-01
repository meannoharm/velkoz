import { globalVar, ToStringTypes } from "@/constants";
import { logger } from "./logger";
import { nativeToString, variableTypeDetection } from "./is";

import type { IAnyObject } from "@/types";

export function getLocationHref(): string {
  if (typeof document === "undefined" || document.location == null) return "";
  return document.location.href;
}

export function getUrlWithEnv(): string {
  return getLocationHref();
}

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
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export function toStringAny(target: any, type: ToStringTypes): boolean {
  return nativeToString.call(target) === `[object ${type}]`;
}

export function toStringValidateOption(target: any, targetName: string, expectType: ToStringTypes): boolean {
  if (toStringAny(target, expectType)) return true;
  typeof target !== "undefined" && logger.error(`${targetName}期望传入:${expectType}类型，当前是:${nativeToString.call(target)}类型`);
  return false;
}

/**
 * 添加事件监听器
 *
 * @export
 * @param {{ addEventListener: Function }} target 目标对象
 * @param {TotalEventName} eventName 目标对象上的事件名
 * @param {Function} handler 回调函数
 * @param {(boolean | unknown)} [opitons=false] useCapture默认为false
 */
export function on(
  target: { addEventListener: Function },
  eventName: TotalEventName,
  handler: Function,
  opitons: boolean | unknown = false
): void {
  target.addEventListener(eventName, handler, opitons);
}

/**
 * 重写对象上面的某个属性
 *
 * @export
 * @param {IAnyObject} source 需要被重写的对象
 * @param {string} name 需要被重写对象的key
 * @param {(...args: any[]) => any} replacement 以原有的函数作为参数，执行并重写原有函数
 * @param {boolean} [isForced=false] 是否强制重写（可能原先没有该属性）
 */
export function replaceOld(source: IAnyObject, name: string, replacement: (...args: any[]) => any, isForced = false): void {
  if (source === undefined) return;
  if (name in source || isForced) {
    const original = source[name];
    const wrapped = replacement(original);
    if (typeof wrapped === "function") {
      source[name] = wrapped;
    }
  }
}

export function validateOptionsAndSet(this: any, targetArr: [any, string, ToStringTypes][]) {
  targetArr.forEach(
    ([target, targetName, expectType]) => toStringValidateOption(target, targetName, expectType) && (this[targetName] = target)
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

export function silentConsoleScope(callback: (...argument: any) => any) {
  globalVar.isLogAddBreadcrumb = false;
  callback();
  globalVar.isLogAddBreadcrumb = true;
}

/**
 *将传入的字符串的首字母改为大写，其他不变
 *
 * @export
 * @param {string} str 原字符
 * @return {*}  {string}
 * @example xhr => Xhr
 */
export function firstStrtoUppercase(str: string): string {
  return str.replace(/\b(\w)(\w*)/g, function ($0: string, $1: string, $2: string) {
    return `${$1.toUpperCase()}${$2}`;
  });
}

export function unknownToString(target: unknown): string {
  if (variableTypeDetection.isString(target)) {
    return target as string;
  }
  if (variableTypeDetection.isUndefined(target)) {
    return "undefined";
  }
  return JSON.stringify(target);
}

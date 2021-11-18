import { EventTypes } from "@/constants";
import { Logger } from "./logger";
import { variableTypeDetection } from "./is";
import type { DeviceInfo } from "@/types";

/**
 *velkez的全局变量
 *
 * @export
 * @interface VelKozSupport
 */
export interface VelKozSupport {
  logger: Logger;
  replaceFlag: { [key in EventTypes]?: boolean };
  record?: any[];
  deviceInfo?: DeviceInfo;
}

interface VelKozGlobal {
  console: Console;
  __VelKoz__: VelKozSupport;
}

export const isNodeEnv = variableTypeDetection.isProcess(typeof process !== "undefined" ? process : 0);

export const isBrowserEnv = variableTypeDetection.isWindow(typeof window !== "undefined" ? window : 0);

/**
 * 获取全局变量
 *
 * ../returns Global scope object
 */
export function getGlobal() {
  if (isBrowserEnv) return window as VelKozGlobal & Window;
  if (isNodeEnv) return process as VelKozGlobal & NodeJS.Process;
  return window as VelKozGlobal & Window;
}

const _global = getGlobal();
const _support = getGlobalVelKozSupport();

/**
 * 获取全局变量___VelKoz__的引用地址
 *
 * @return {*}  {VelKozSupport}
 */
function getGlobalVelKozSupport(): VelKozSupport {
  _global.__VelKoz__ = _global.__VelKoz__ || ({} as VelKozSupport);
  return _global.__VelKoz__;
}

export { _global, _support };

export function supportsHistory(): boolean {
  // borrowed from: https://github.com/angular/angular.js/pull/13945/files
  const { chrome } = _global as any;
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  const hasHistoryApi = "history" in _global && !!_global.history.pushState && !!_global.history.replaceState;
  return !isChromePackagedApp && hasHistoryApi;
}

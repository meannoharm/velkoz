

import { EventTypes } from '@/constants'
import { Logger } from './logger'
import { variableTypeDetection } from './is'
import type { DeviceInfo } from '@/types'

/**
 *velkez的全局变量
 *
 * @export
 * @interface VelKezSupport
 */
export interface VelKezSupport {
  logger: Logger
  replaceFlag: { [key in EventTypes]?: boolean }
  record?: any[]
  deviceInfo?: DeviceInfo
}

interface VelKezGlobal {
  console?: Console
  __VelKez__?: VelKezSupport
}

export const isNodeEnv = variableTypeDetection.isProcess(typeof process !== 'undefined' ? process : 0)

export const isBrowserEnv = variableTypeDetection.isWindow(typeof window !== 'undefined' ? window : 0)

/**
 * 获取全局变量
 *
 * ../returns Global scope object
 */
export function getGlobal() {
  if (isBrowserEnv) return window as VelKezGlobal & Window
  if (isNodeEnv) return process as VelKezGlobal & NodeJS.Process
  return window as VelKezGlobal & Window
}

const _global = getGlobal()
const _support = getGlobalVelKezSupport()

/**
 * 获取全局变量___VelKez__的引用地址
 *
 * @return {*}  {VelKezSupport}
 */
function getGlobalVelKezSupport(): VelKezSupport {
  _global.__VelKez__ = _global.__VelKez__ || ({} as VelKezSupport)
  return _global.__VelKez__
}

export { _global, _support }

export function supportsHistory(): boolean {
  // borrowed from: https://github.com/angular/angular.js/pull/13945/files
  const chrome = (_global as any).chrome
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime
  const hasHistoryApi = 'history' in _global && !!_global.history.pushState && !!_global.history.replaceState
  return !isChromePackagedApp && hasHistoryApi
}

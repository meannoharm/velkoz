import { name, version } from '../../package.json'

export const SDK_NAME = name
export const SDK_VERSION = version

/**
 *浏览器需要监听的事件类型
 *
 * @export
 * @enum {number}
 */
export const enum BrowserEventTypes {
  XHR = 'xhr',
  FETCH = 'fetch',
  CONSOLE = 'console',
  DOM = 'dom',
  HISTORY = 'history',
  ERROR = 'error',
  HASHCHANGE = 'hashchange',
  UNHANDLEDREJECTION = 'unhandledrejection',
  CUSTOMER = 'Customer'
}

export const enum BrowserBreadcrumbTypes {
  ROUTE = 'Route',
  CLICK = 'UI.Click',
  CONSOLE = 'Console',
  XHR = 'Xhr',
  FETCH = 'Fetch',
  UNHANDLEDREJECTION = 'Unhandledrejection',
  RESOURCE = 'Resource',
  CODE_ERROR = 'Code Error',
  CUSTOMER = 'Customer'
}


/**
 * 上报错误类型
 */
 export const enum ErrorTypes {
  UNKNOWN = 'UNKNOWN',
  UNKNOWN_FUNCTION = 'UNKNOWN_FUNCTION',
  JAVASCRIPT = 'JAVASCRIPT',
  LOG = 'LOG',
  HTTP = 'HTTP',
  VUE = 'VUE',
  REACT = 'REACT',
  RESOURCE = 'RESOURCE',
  PROMISE = 'PROMISE',
  ROUTE = 'ROUTE'
}

/**
 * 用户行为栈事件类型
 */
export type BreadcrumbTypes = BrowserBreadcrumbTypes | BaseBreadcrumbTypes

export const enum BaseBreadcrumbTypes {
  VUE = 'Vue',
  REACT = 'React'
}

/**
 * 用户行为类型
 */
export const enum BREADCRUMBCATEGORYS {
  HTTP = 'http',
  USER = 'user',
  DEBUG = 'debug',
  EXCEPTION = 'exception',
  LIFECYCLE = 'lifecycle'
}

/**
 * 所有重写事件类型整合
 */
export type EventTypes = BrowserEventTypes | BaseEventTypes

export const MitoLog = 'Mito.log'
export const MitoLogEmptyMsg = 'empty.msg'
export const MitoLogEmptyTag = 'empty.tag'

export const enum BaseEventTypes {
  VUE = 'vue'
}

export const enum HttpTypes {
  XHR = 'xhr',
  FETCH = 'fetch'
}

export const enum MethodTypes {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE'
}

export const enum HTTP_CODE {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_EXCEPTION = 500
}

export const enum ToStringTypes {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  RegExp = 'RegExp',
  Null = 'Null',
  Undefined = 'Undefined',
  Symbol = 'Symbol',
  Object = 'Object',
  Array = 'Array',
  process = 'process',
  Window = 'Window',
  Function = 'Function'
}

export const ERROR_TYPE_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/
const globalVar = {
  isLogAddBreadcrumb: true,
  crossOriginThreshold: 1000
}

export { globalVar }

export const enum TrackActionType {
  PAGE = 'PAGE',
  EVENT = 'EVENT',
  VIEW = 'VIEW',
  DURATION = 'DURATION',
  DURATION_VIEW = 'DURATION_VIEW',
  OTHER = 'OTHER'
}

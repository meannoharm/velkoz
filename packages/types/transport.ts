import { ErrorTypes } from "@/constants";
import { BreadcrumbPushData } from "./breadcrumb";
import { HttpTransformedType } from "./http";

export interface DeviceInfo {
  //网络类型: 4g,3g,5g,wifi
  netType: string;
  clientWidth: number;
  clientHeight: number;
  // 像素密度倍率(计算屏幕实际宽高 可使用此参数： 例 height = clientHeight * radio)
  ratio: number;
}

/**
 * SDK版本信息、apikey、trackerId
 *
 * @export
 * @interface AuthInfo
 */
export interface AuthInfo {
  apikey?: string;
  sdkVersion: string;
  sdkName: string;
  trackerId?: string;
}

export interface TransportDataType {
  authInfo?: AuthInfo;
  breadcrumb?: BreadcrumbPushData[];
  data?: ReportDataType;
  record?: any[];
  deviceInfo?: DeviceInfo;
}

export interface BaseTransformType {
  type?: ErrorTypes;
  message?: string;
  time?: number;
  name?: string;
  level?: string;
  url: string;
}

export interface ReportDataType extends Partial<HttpTransformedType> {
  stack?: any;
  errorId?: number;
  // vue
  componentName?: string;
  propsData?: any;
  // logError 手动报错 MITO.log
  customTag?: string;
}

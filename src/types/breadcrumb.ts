import { Severity } from "@/utils";
import { ReportDataType } from "./transport";
import { TNumStrObj } from "./common";
import { BREADCRUMBCATEGORYS, BreadcrumbTypes } from "@/constants";
import { ConsoleCollectType, RouteChangeCollectType } from "./basePlugin";

export interface BreadcrumbPushData {
  /**
   * 事件类型
   */
  type: BreadcrumbTypes;
  // string for click dom
  data:
    | ReportDataType
    | RouteChangeCollectType
    | ConsoleCollectType
    | TNumStrObj;
  /**
   * 分为user action、debug、http、
   */
  category?: BREADCRUMBCATEGORYS;
  time: number;
  level: Severity;
}

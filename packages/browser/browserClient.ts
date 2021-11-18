import { Breadcrumb, BaseClient } from "@/core";
import {
  BrowserBreadcrumbTypes,
  BrowserEventTypes,
  ErrorTypes,
  EventTypes,
  VelkozLog,
  VelkozLogEmptyMsg,
  VelkozLogEmptyTag,
} from "@/constants";
import {
  extractErrorStack,
  firstStrtoUppercase,
  getBreadcrumbCategoryInBrowser,
  getLocationHref,
  getTimestamp,
  isError,
  Severity,
  unknownToString,
} from "@/utils";
import { BrowserOptions } from "./browserOptions";
import { BrowserTransport } from "./browserTransport";
import type { LogTypes } from "@/types";
import type { BrowserOptionsFieldsTypes } from "./types";

export class BrowserClient extends BaseClient<BrowserOptionsFieldsTypes, EventTypes> {
  transport: BrowserTransport;
  options: BrowserOptions;
  breadcrumb: Breadcrumb<BrowserOptionsFieldsTypes>;
  constructor(options: BrowserOptionsFieldsTypes = {}) {
    super(options);
    this.options = new BrowserOptions(options);
    this.transport = new BrowserTransport(options);
    this.breadcrumb = new Breadcrumb(options);
  }
  /**
   * 判断当前插件是否启用，用于browser的option
   *
   * @param {BrowserEventTypes} name
   * @return {*}
   * @memberof BrowserClient
   */
  isPluginEnable(name: BrowserEventTypes): boolean {
    const silentField = `silent${firstStrtoUppercase(name)}`;
    return !this.options[silentField];
  }
  log(data: LogTypes) {
    const { message = VelkozLogEmptyMsg, tag = VelkozLogEmptyTag, level = Severity.Critical, ex = "" } = data;
    let errorInfo = {};
    if (isError(ex)) {
      errorInfo = extractErrorStack(ex, level);
    }
    const error = {
      type: ErrorTypes.LOG,
      level,
      message: unknownToString(message),
      name: VelkozLog,
      customTag: unknownToString(tag),
      time: getTimestamp(),
      url: getLocationHref(),
      ...errorInfo,
    };
    const breadcrumbStack = this.breadcrumb.push({
      type: BrowserBreadcrumbTypes.CUSTOMER,
      category: getBreadcrumbCategoryInBrowser(BrowserBreadcrumbTypes.CUSTOMER),
      data: message,
      level: Severity.fromString(level.toString()),
    });
    this.transport.send(error, breadcrumbStack);
  }
}

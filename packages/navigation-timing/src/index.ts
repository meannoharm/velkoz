import { Action, LevelType } from "@velkoz/shared-utils";
import type Velkoz from "@velkoz/core";

export interface NavigationTimingDetail {
  [key: string]: number;
}

export default class NavigationTiming {
  static pluginName = "navigation-timing";
  constructor(public velkoz: Velkoz) {
    this.init(velkoz);
  }

  private init(velkoz: Velkoz) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const timing = window.performance.timing;
        console.log("DNS查询耗时：", timing.domainLookupEnd - timing.domainLookupStart);
        console.log("TCP链接耗时：", timing.connectEnd - timing.connectStart);
        console.log("request耗时：", timing.responseEnd - timing.responseStart);
        console.log("解析DOM树耗时：", timing.domComplete - timing.domInteractive);
        console.log("白屏时间：", timing.domLoading - timing.fetchStart);
        console.log("domready时间：", timing.domContentLoadedEventEnd - timing.fetchStart);
        console.log("onload时间：", timing.loadEventEnd - timing.fetchStart);
        velkoz.pushException(
          new Action(LevelType.INFO, {
            DNSLookUpTime: timing.domainLookupEnd - timing.domainLookupStart,
            TCPConnectTime: timing.connectEnd - timing.connectStart,
            requestTime: timing.responseEnd - timing.responseStart,
            compileDOMTreeTime: timing.domComplete - timing.domInteractive,
            blankScreenTime: timing.domLoading - timing.fetchStart,
            domReadyTime: timing.domContentLoadedEventEnd - timing.fetchStart,
            onloadTime: timing.loadEventEnd - timing.fetchStart,
          })
        );
      }, 0);
    });
  }
}

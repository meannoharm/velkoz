import { InfoAction } from "@velkoz/shared-utils";
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
        const infoObj = {
          DNSLookUpTime: timing.domainLookupEnd - timing.domainLookupStart,
          TCPConnectTime: timing.connectEnd - timing.connectStart,
          requestTime: timing.responseEnd - timing.responseStart,
          compileDOMTreeTime: timing.domComplete - timing.domInteractive,
          blankScreenTime: timing.domLoading - timing.fetchStart,
          domReadyTime: timing.domContentLoadedEventEnd - timing.fetchStart,
          onloadTime: timing.loadEventEnd - timing.fetchStart,
        };
        console.log(infoObj);
        velkoz.pushException(new InfoAction("NavigationTiming", infoObj));
      }, 0);
    });
  }
}

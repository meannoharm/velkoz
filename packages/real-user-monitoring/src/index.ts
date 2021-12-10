import type Velkoz from "@velkoz/core";
import { getLCP, getFID, getCLS } from "web-vitals";
import ttiPolyfill from "tti-polyfill";
import type { Metric } from "web-vitals";

declare const window: Window & { PerformanceLongTaskTiming: any; __tti: any };

type TTIMetric = {
  name: string;
  value: number | null;
};

// First Contentful Paint
window.performance.getEntriesByType("paint");

// collect the longtask
if (window.PerformanceLongTaskTiming) {
  window.__tti = { e: [] };
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // observe the longtask to get the time to interactive (TTI)
      if (entry.entryType === "longtask") {
        window.__tti.e.concat(entry);
      }
    }
  });
  observer.observe({ entryTypes: ["longtask"] });
}

export default class RealUserMonitoring {
  static pluginName = "real-user-monitoring";
  private velkoz: Velkoz;

  constructor(velkoz: Velkoz) {
    this.velkoz = velkoz;
    this.init();
  }

  private init() {
    // Largest Contentful Paint
    getLCP((data) => this.put(data));
    // First Input Delay
    getFID((data) => this.put(data));
    // Cumulative Layout Shift
    getCLS((data) => this.put(data));

    ttiPolyfill.getFirstConsistentlyInteractive().then((value) => {
      this.put({
        name: "TTI",
        value,
      });
    });
  }

  private put(data: Metric | TTIMetric) {
    console.log(data);
    this.velkoz.pushException("INFO", "RealUserMonitoring", data);
  }
}

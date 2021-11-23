import { getLCP, getFID, getCLS } from "web-vitals";

// Largest Contentful Paint
getLCP((data) => console.log("LCP", data));
// First Input Delay
getFID((data) => console.log("FID", data));
// Cumulative Layout Shift
getCLS((data) => console.log("CLS", data));

// First Contentful Paint
window.performance.getEntriesByType("paint");

// collect the longtask
if (PerformanceLongTaskTiming) {
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

ttiPolyfill.getFirstConsistentlyInteractive().then((tti) => {
  console.log("TTI", tti);
});

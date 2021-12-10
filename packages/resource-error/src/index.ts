import type Velkoz from "@velkoz/core";

export default class ResourceError {
  static pluginName = "resource-error";
  constructor(public velkoz: Velkoz) {
    window.addEventListener("error", function (event) {
      // 脚本加载错误
      if (event.target && (event.target.src || event.target.href)) {
        velkoz.pushException("ERROR", "ResourceError", {
          filename: event.target.src || event.target.href,
          tagName: event.target.tagName,
        });
      }
    });
  }
}

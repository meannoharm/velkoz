import { ErrorAction } from "@velkoz/shared-utils";
import type Velkoz from "@velkoz/core";

export default class JsError {
  static pluginName = "js-error";
  constructor(public velkoz: Velkoz) {
    window.onerror = (errorMsg, url, lineNumber, columnNumber, errorObj) => {
      const errorStack = errorObj ? errorObj.stack : null;
      velkoz.pushException(
        new ErrorAction("CodeError", {
          errorMsg,
          url,
          lineNumber,
          columnNumber,
          errorStack,
        })
      );
    };

    // 未处理的 Promise rejection
    window.onunhandledrejection = (e) => {
      let errorMsg = "",
        errorStack = "";
      if (typeof e.reason === "object") {
        errorMsg = e.reason.message;
        errorStack = e.reason.stack;
      } else {
        errorMsg = e.reason;
      }
      velkoz.pushException(
        new ErrorAction("Unhandledrejection", {
          errorMsg,
          errorStack,
        })
      );
    };
  }
}

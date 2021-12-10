import type Velkoz from "@velkoz/core";

export default class JsError {
  static pluginName = "js-error";
  constructor(public velkoz: Velkoz) {
    window.onerror = (errorMsg, url, lineNumber, columnNumber, errorObj) => {
      const errorStack = errorObj ? errorObj.stack : null;
      velkoz.pushException("ERROR", "CodeError", {
        errorMsg,
        url,
        lineNumber,
        columnNumber,
        errorStack,
      });
    };

    // 未处理的 Promise rejection
    window.onunhandledrejection = (e) => {
      let errorMsg = "";
      let errorStack = "";
      if (typeof e.reason === "object") {
        errorMsg = e.reason.message;
        errorStack = e.reason.stack;
      } else {
        errorMsg = e.reason;
      }
      velkoz.pushException("ERROR", "Unhandledrejection", {
        errorMsg,
        errorStack,
      });
    };
  }
}

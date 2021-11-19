window.onerror = (errorMsg, url, lineNumber, columnNumber, errorObj) => {
  let errorStack = errorObj ? errorObj.stack : null;
  // 这里进行上报
  console.log(errorMsg, url, lineNumber, columnNumber, errorStack)
};

window.onunhandledrejection = (e) => {
  let errorMsg = "", errorStack = "";
  if (typeof e.reason === "object") {
    errorMsg = e.reason.message;
    errorStack = e.reason.stack;
  } else {
    errorMsg = e.reason;
  }
  // 这里进行上报
  console.log(errorMsg, errorStack)
}

import { replaceOld, ErrorAction, variableTypeDetection } from "@velkoz/shared-utils";
import type Velkoz from "@velkoz/core";

export const enum HttpTypes {
  XHR = "xhr",
  FETCH = "fetch",
}

export interface VelkozNetworkErrorPayload {
  request: {
    httpType?: HttpTypes;
    traceId?: string;
    method?: string;
    url?: string;
    data?: any;
  };
  response: {
    status?: number;
    data?: any;
  };
  // for wx
  errMsg?: string;
  elapsedTime?: number;
  time: number;
}

export type VelkozXMLHttpRequest = XMLHttpRequest & {
  payload: VelkozNetworkErrorPayload;
};

export default class NetworkError {
  static pluginName = "network-error";
  constructor(public velkoz: Velkoz) {
    this.init(velkoz);
  }
  private init(velkoz: Velkoz) {
    // 重写XMLHttpRequest捕捉xhr错误
    const originalXhrProto = XMLHttpRequest.prototype;
    replaceOld<XMLHttpRequest>(originalXhrProto, "open", (original) => {
      return function (this: VelkozXMLHttpRequest, ...args: any[]): void {
        this.payload = {
          request: {
            httpType: HttpTypes.XHR,
            method: variableTypeDetection.isString(args[0]) ? args[0].toUpperCase() : args[0],
            url: args[1],
          },
          response: {},
          time: Date.now(),
        };
        original.apply(this, args);
      };
    });
    replaceOld<XMLHttpRequest>(originalXhrProto, "send", (original) => {
      return function (this: VelkozXMLHttpRequest, ...args: any[]): void {
        const { request } = this.payload;
        this.addEventListener("loadend", function (this: VelkozXMLHttpRequest) {
          const { responseType, response, status } = this;
          request.data = args[0];
          const eTime = Date.now();
          if (["", "json", "text"].indexOf(responseType) !== -1) {
            this.payload.response.data = typeof response === "object" ? JSON.stringify(response) : response;
          }
          this.payload.response.status = status;
          this.payload.elapsedTime = eTime - this.payload.time;
          velkoz.pushException(new ErrorAction("NetworkError", this.payload));
        });
        original.apply(this, args);
      };
    });

    if ("fetch" in window) {
      // 重写fetch捕捉fetch错误
      replaceOld<Window>(window, "fetch", (originalFetch) => {
        return function (url: string, config: Partial<Request> = {}): void {
          const sTime = Date.now();
          const method = (config && config.method) || "GET";
          const payload: VelkozNetworkErrorPayload = {
            request: {
              httpType: HttpTypes.FETCH,
              url,
              method,
              data: config && config.body,
            },
            time: sTime,
            response: {},
          };
          const headers = new Headers(config.headers || {});
          Object.assign(headers, {
            setRequestHeader: headers.set,
          });
          return originalFetch.apply(window, [url, config]).then(
            (res: Response) => {
              const resClone = res.clone();
              const eTime = Date.now();
              payload.elapsedTime = eTime - sTime;
              payload.response.status = resClone.status;
              resClone.text().then((data) => {
                payload.response.data = data;
                velkoz.pushException(new ErrorAction("NetworkError", payload));
              });
              return res;
            },
            (err: Error) => {
              const eTime = Date.now();
              payload.elapsedTime = eTime - sTime;
              payload.response.status = 0;
              velkoz.pushException(new ErrorAction("NetworkError", payload));
              throw err;
            }
          );
        };
      });
    }
  }
}

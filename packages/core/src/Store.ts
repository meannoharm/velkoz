import { v4 as uuidV4 } from "uuid";
import type Velkoz from "./Velkoz";

export type ActionType = "INFO" | "ERROR" | "OPERATION";

export interface Action<T = any> {
  type: ActionType;
  kind: string;
  payload: T;
}

export class WholeAction<T = any> {
  id: string;
  type: ActionType;
  kind: string;
  payload: T;
  time: number;
  host: string;
  pathname: string;
  search: string;
  userAgent: string;

  constructor(action: Action<T>) {
    this.id = uuidV4();
    this.type = action.type;
    this.kind = action.kind;
    this.payload = action.payload;
    this.time = new Date().valueOf();
    this.host = location.host;
    this.pathname = location.pathname;
    this.search = location.search;
    this.userAgent = navigator.userAgent;
  }
}

export default class Store {
  stack: WholeAction[];
  velkoz: Velkoz;
  constructor(velkoz: Velkoz) {
    this.stack = [];
    this.velkoz = velkoz;
  }

  public dispatch<T>(action: Action<T>) {
    this.stack.push(new WholeAction(action));
  }

  public getStore() {
    return this.stack;
  }

  private sendByImage(url: string, data) {
    let img = document.createElement("img");
    const params = [];
    Object.keys(data).forEach((key) => {
      params.push(`${key}=${encodeURIComponent(data[key])}`);
    });
    img.onload = () => (img = null);
    img.src = `${url}?${params.join("&")}`;
  }

  private sendByBeacon(url: string, data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      let value = data[key];
      if (typeof value !== "string") {
        // formData只能append string 或 Blob
        value = JSON.stringify(value);
      }
      formData.append(key, value);
    });
    navigator.sendBeacon(url, formData);
  }

  private storeToLocalStorage() {}

  public reportData() {}
}

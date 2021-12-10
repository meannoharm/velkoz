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
}

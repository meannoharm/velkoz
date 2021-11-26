export enum LevelType {
  INFO = "INFO",
  ERROR = "ERROR",
}

export class Action<T = unknown> {
  level: LevelType;
  type: string;
  payload: T;
  time: number;
  host: string;
  pathname: string;
  search: string;
  userAgent: string;

  constructor(level: LevelType, type: string, payload: T) {
    this.level = level;
    this.type = type;
    this.payload = payload;
    this.time = new Date().valueOf();
    this.host = location.host;
    this.pathname = location.pathname;
    this.search = location.search;
    this.userAgent = navigator.userAgent;
  }
}

export class ErrorAction<T> extends Action<T> {
  constructor(type: string, data: T) {
    super(LevelType.ERROR, type, data);
  }
}

export class InfoAction<T> extends Action<T> {
  constructor(type: string, data: T) {
    super(LevelType.INFO, type, data);
  }
}

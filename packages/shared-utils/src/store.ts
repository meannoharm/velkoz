import type { Action } from "@velkoz/shared-utils";
import { isNotExist } from "./utils";

export const KEY = "__velkoz_storage_key__";

export class Store {
  get(): Action[] {
    const dataJSON = localStorage.getItem(KEY);
    if (!dataJSON) {
      return [];
    } else {
      return JSON.parse(dataJSON);
    }
  }

  set(data: Action[]) {
    // 值是数组，不能直接存储，需要转换 JSON.stringify
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  update(data: Action) {
    const dataJSON = localStorage.getItem(KEY);
    let log: Action[] = [];
    if (dataJSON) {
      log = JSON.parse(dataJSON);
    }
    log.push(data);
    this.set(log);
  }

  delete() {
    localStorage.removeItem(KEY);
  }
}

export const store = new Store();

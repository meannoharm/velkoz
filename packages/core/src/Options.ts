import { ActionType } from "./Store";

export interface DefOptions {
  token: string;
  url: string;
  match: string[];
  type: ActionType[];
  autoPush: boolean;
}

/**
 * @param {string} token ;
 * @param {string[]} url 推送后台地址;
 * @param {string[]} match 需要采集的url;
 * @param {LevelType[]} level 需要采集等级;
 * @param {boolean} autoPush 自动推送;
 */
export type Options = Partial<DefOptions>;

export class OptionsConstructor implements DefOptions {
  token: string;
  url: string;
  match: string[];
  type: ActionType[];
  autoPush: boolean;

  constructor() {
    this.url = "";
    this.token = "";
    this.match = [];
    this.type = [];
    this.autoPush = true;
  }

  merge(options?: Options) {
    if (!options) return this;
    Object.assign(this, options);
    return this;
  }
}

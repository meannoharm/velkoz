import { ActionType } from "./Store";

export interface DefOptions {
  token: string;
  url: string;
  match: string[];
  type: ActionType[];
  autoPush: boolean;
}

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

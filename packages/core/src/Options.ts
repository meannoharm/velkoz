import { LevelType } from "@velkoz/shared-utils";

export interface DefOptions {
  token: string;
  url: string;
  match: string[];
  level: LevelType[];
  autoPush: boolean;
}

export type Options = DefOptions;

export class OptionsConstructor implements DefOptions {
  token: string;
  url: string;
  match: string[];
  level: LevelType[];
  autoPush: boolean;

  constructor() {
    this.url = "";
    this.token = "";
    this.match = [];
    this.level = [LevelType.ERROR];
    this.autoPush = true;
  }

  merge(options?: Options) {
    if (!options) return this;
    Object.assign(this, options);
    return this;
  }
}

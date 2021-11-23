import { LevelType } from "@velkoz/shared-utils";

export interface CustomOptions {}

export interface DefOptions {
  token: string;
  url: string;
  match: string[];
  level: LevelType[];
  autoPush: boolean;
}

export interface Options extends DefOptions, CustomOptions {}
export class CustomOptions {}
export class OptionsConstructor extends CustomOptions implements DefOptions {
  token: string;
  url: string;
  match: string[];
  level: LevelType[];
  autoPush: boolean;

  constructor() {
    super();
    this.url = "";
    this.token = "";
    this.match = [];
    this.level = [LevelType.ERROR];
    this.autoPush = true;
  }

  merge(options?: Options) {
    if (!options) return this;
    for (const key in options) {
      this[key] = options[key];
    }
    return this;
  }
}

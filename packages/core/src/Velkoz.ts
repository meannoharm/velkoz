import { warn, isUndef, EventEmitter, store } from "@velkoz/shared-utils";
import { Options, OptionsConstructor } from "./Options";
import type { Action, LevelType } from "@velkoz/shared-utils";

interface PluginCtor {
  pluginName: string;
  new (scroll: VelkozConstructor): any;
}

interface PluginItem {
  name: string;
  ctor: PluginCtor;
}

interface PluginsMap {
  [key: string]: boolean;
}

export default class VelkozConstructor<O = Record<string, unknown>> extends EventEmitter {
  static plugins: PluginItem[] = [];
  static pluginsMap: PluginsMap = {};
  private options: OptionsConstructor;
  private plugins: { [name: string]: any };

  static use(ctor: PluginCtor) {
    const name = ctor.pluginName;
    const installed = VelkozConstructor.plugins.some((plugin) => ctor === plugin.ctor);
    if (installed) return VelkozConstructor;
    if (isUndef(name)) {
      warn(`Plugin Class must specify plugin's name in static property by 'pluginName' field.`);
      return VelkozConstructor;
    }
    VelkozConstructor.pluginsMap[name] = true;
    VelkozConstructor.plugins.push({
      name,
      ctor,
    });
    return VelkozConstructor;
  }

  constructor(options?: Options & O) {
    super(["pluginInstall", "beforeCapture", "afterCapture"]);

    this.plugins = {};
    this.options = new OptionsConstructor().merge(options);
    this.applyPlugins();
    // 注册上报事件
    if (this.options.autoPush) {
      this.registerReport();
    }
  }

  private applyPlugins() {
    VelkozConstructor.plugins.forEach((item: PluginItem) => {
      const ctor = item.ctor;
      if (typeof ctor === "function") {
        this.plugins[item.name] = new ctor(this);
      }
    });
  }

  private isDomainFilter = () => {
    const href = window.location.href;
    return this.options.match.filter((item) => item.includes(href)).length > 0 ? true : false;
  };

  private isLevelFilter = (type: LevelType) => {
    return this.options.level.filter((ex) => {
      return type.indexOf(ex) !== -1;
    }).length > 0
      ? true
      : false;
  };

  public pushException(action: Action) {
    if (this.isDomainFilter()) return;
    if (this.isLevelFilter(action.level)) return;
    this.trigger("captureBefore", action);
    // 存入前端缓存，等待推送
    store.update(action);
  }

  private registerReport() {
    const { url, autoPush } = this.options;
    function logData() {
      const log = store.get();
      navigator.sendBeacon(url, JSON.stringify(log));
    }
    if (autoPush && url) {
      window.addEventListener("unload", logData, false);
    }
  }
}

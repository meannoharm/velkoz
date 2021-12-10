import { warn, isUndef, EventEmitter } from "@velkoz/shared-utils";
import Store from "./Store";
import { Options, OptionsConstructor } from "./Options";
import type { WholeAction, ActionType } from "./Store";

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

export default class VelkozConstructor extends EventEmitter {
  static plugins: PluginItem[] = [];
  static pluginsMap: PluginsMap = {};

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

  private options: OptionsConstructor;
  private plugins: { [name: string]: any };
  // 隔离插件报错
  private pluginState: { [name: string]: boolean };
  private store: Store;

  /**
   * @param options
   * @param {string} token ;
   * @param {string[]} url 推送后台地址;
   * @param {string[]} match 需要采集的url;
   * @param {LevelType[]} level 需要采集等级;
   * @param {boolean} autoPush 自动推送;
   */
  constructor(options?: Options) {
    super(["pluginInstall", "beforeCapture", "afterCapture"]);

    this.plugins = {};
    this.options = new OptionsConstructor().merge(options);
    this.applyPlugins();
    this.store = new Store(this);
  }

  private applyPlugins() {
    VelkozConstructor.plugins.forEach((item: PluginItem) => {
      const ctor = item.ctor;
      if (typeof ctor === "function") {
        try {
          this.plugins[item.name] = new ctor(this);
          this.pluginState[item.name] = true;
        } catch (e) {
          this.pluginState[item.name] = false;
        } finally {
          this.trigger("pluginInstall", this.plugins[item.name]);
        }
      }
    });
  }

  private isDomainFilter = () => {
    const href = window.location.href;
    return this.options.match.filter((item) => item.includes(href)).length > 0 ? true : false;
  };

  private isTypeFilter = (type: ActionType) => {
    return this.options.type.filter((ex) => {
      return type.includes(ex);
    }).length > 0
      ? false
      : true;
  };

  public pushException<T>(type: ActionType, kind: string, payload: T) {
    if (this.options.match && this.options.match.length > 0 && this.isDomainFilter()) return;
    if (this.options.type && this.options.type.length > 0 && this.isTypeFilter(type)) return;
    const action = {
      type,
      kind,
      payload,
    };
    this.trigger("beforeCapture", action);
    // 存入前端缓存，等待推送
    this.store.dispatch<T>(action);
    this.trigger("afterCapture", action);
  }

  public getStore(): WholeAction[] {
    return this.store.getStore();
  }

  public getPluginStats(): { [name: string]: boolean } {
    return JSON.parse(JSON.stringify(this.pluginState));
  }
}

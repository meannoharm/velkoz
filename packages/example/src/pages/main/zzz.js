/*!
 * Velkoz / core
 * (c) 2021 gao
 * Released under the MIT License.
 */
function warn(msg) {
  console.log(`[Velkoz warn]: ${msg}`);
}

function isUndef(v) {
  return v === undefined || v === null;
}

class EventEmitter {
  events;
  eventTypes;
  constructor(names) {
    this.events = {};
    this.eventTypes = {};
    this.registerType(names);
  }
  on(type, fn, context = this) {
    this.hasType(type);
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push([fn, context]);
    return this;
  }
  once(type, fn, context = this) {
    this.hasType(type);
    const magic = (...args) => {
      this.off(type, magic);
      const ret = fn.apply(context, args);
      if (ret === true) {
        return ret;
      }
    };
    magic.fn = fn;
    this.on(type, magic);
    return this;
  }
  off(type, fn) {
    if (!type && !fn) {
      this.events = {};
      return this;
    }
    if (type) {
      this.hasType(type);
      if (!fn) {
        this.events[type] = [];
        return this;
      }
      const events = this.events[type];
      if (!events) {
        return this;
      }
      let count = events.length;
      while (count--) {
        if (events[count][0] === fn || (events[count][0] && events[count][0].fn === fn)) {
          events.splice(count, 1);
        }
      }
      return this;
    }
  }
  trigger(type, ...args) {
    this.hasType(type);
    const events = this.events[type];
    if (!events) {
      return;
    }
    const len = events.length;
    const eventsCopy = [...events];
    let ret;
    for (let i = 0; i < len; i++) {
      const event = eventsCopy[i];
      const [fn, context] = event;
      if (fn) {
        ret = fn.apply(context, args);
        if (ret === true) {
          return ret;
        }
      }
    }
  }
  registerType(names) {
    names.forEach((type) => {
      this.eventTypes[type] = type;
    });
  }
  destroy() {
    this.events = {};
    this.eventTypes = {};
  }
  hasType(type) {
    const types = this.eventTypes;
    const isType = types[type] === type;
    if (!isType) {
      warn(
        `EventEmitter has used unknown event type: "${type}", should be oneof [` +
          `${Object.keys(types).map((_) => JSON.stringify(_))}` +
          `]`
      );
    }
  }
}

var LevelType;
(function (LevelType) {
  LevelType["INFO"] = "INFO";
  LevelType["ERROR"] = "ERROR";
})(LevelType || (LevelType = {}));

const KEY = "__velkoz_store__";
class Store {
  get() {
    const dataJSON = localStorage.getItem(KEY);
    if (!dataJSON) {
      return [];
    } else {
      return JSON.parse(dataJSON);
    }
  }
  set(data) {
    // 值是数组，不能直接存储，需要转换 JSON.stringify
    localStorage.setItem(KEY, JSON.stringify(data));
  }
  update(data) {
    const dataJSON = localStorage.getItem(KEY);
    let log = [];
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
const store = new Store();

class OptionsConstructor {
  token;
  url;
  match;
  level;
  autoPush;
  constructor() {
    this.url = "";
    this.token = "";
    this.match = [];
    this.level = [LevelType.ERROR];
    this.autoPush = true;
  }
  merge(options) {
    if (!options) return this;
    Object.assign(this, options);
    return this;
  }
}

class VelkozConstructor extends EventEmitter {
  static plugins = [];
  static pluginsMap = {};
  options;
  plugins;
  static use(ctor) {
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
  constructor(options) {
    super(["pluginInstall", "beforeCapture", "afterCapture"]);
    this.plugins = {};
    this.options = new OptionsConstructor().merge(options);
    this.applyPlugins();
    // 注册上报事件
    if (this.options.autoPush) {
      this.registerReport();
    }
  }
  applyPlugins() {
    VelkozConstructor.plugins.forEach((item) => {
      const ctor = item.ctor;
      if (typeof ctor === "function") {
        this.plugins[item.name] = new ctor(this);
      }
    });
  }
  isDomainFilter = () => {
    const href = window.location.href;
    return this.options.match.filter((item) => item.includes(href)).length > 0 ? true : false;
  };
  isLevelFilter = (type) => {
    return this.options.level.filter((ex) => {
      return type.indexOf(ex) !== -1;
    }).length > 0
      ? true
      : false;
  };
  pushException(action) {
    if (this.isDomainFilter()) return;
    if (this.isLevelFilter(action.level)) return;
    this.trigger("beforeCapture", action);
    // 存入前端缓存，等待推送
    store.update(action);
  }
  // 页面会在卸载时提交本次log
  registerReport() {
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

export { VelkozConstructor as default };

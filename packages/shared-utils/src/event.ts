import { warn } from "./debug";

type AnyFunction = (...arg: any) => any;

interface Events {
  [name: string]: [WithFnFunction, unknown][];
}

interface EventTypes {
  [type: string]: string;
}

interface WithFnFunction extends Function {
  fn?: AnyFunction;
}

export class EventEmitter {
  events: Events;
  eventTypes: EventTypes;
  constructor(names: string[]) {
    this.events = {};
    this.eventTypes = {};
    this.registerType(names);
  }

  on(type: string, fn: AnyFunction, context: unknown = this) {
    this.hasType(type);
    if (!this.events[type]) {
      this.events[type] = [];
    }

    this.events[type].push([fn, context]);
    return this;
  }

  once(type: string, fn: AnyFunction, context: unknown = this) {
    this.hasType(type);
    const magic = (...args: any[]) => {
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

  off(type?: string, fn?: AnyFunction) {
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

  trigger(type: string, ...args: any[]) {
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

  registerType(names: string[]) {
    names.forEach((type: string) => {
      this.eventTypes[type] = type;
    });
  }

  destroy() {
    this.events = {};
    this.eventTypes = {};
  }

  private hasType(type: string) {
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

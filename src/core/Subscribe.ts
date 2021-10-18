import { getFunctionName, logger } from "@/utils";

type MonitorCallback = (data: any) => void;
/**
 * 发布订阅类
 *
 * @export
 * @class Subscribe
 * @template T 事件枚举
 */
export default class Subscribe<T> {
  dep: Map<T, MonitorCallback[]> = new Map();
  // 订阅
  watch(eventName: T, callBack: (data: any) => any) {
    const fns = this.dep.get(eventName);
    if (fns) {
      this.dep.set(eventName, fns.concat(callBack));
      return;
    }
    this.dep.set(eventName, [callBack]);
  }
  // 发布
  notify<D = any>(eventName: T, data: D) {
    const fns = this.dep.get(eventName);
    if (!eventName || !fns) return;
    fns.forEach((fn) => {
      try {
        fn(data);
      } catch (e) {
        logger.error(
          `Subscribe.notify：监听事件的回调函数发生错误\neventName:${eventName}\nName: ${getFunctionName(
            fn
          )}\nError: ${e}`
        );
      }
    });
  }
}

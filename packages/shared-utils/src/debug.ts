export function warn(msg: string) {
  console.log(`[Velkoz warn]: ${msg}`);
}

export function assert(condition: string | boolean, msg: string) {
  if (!condition) {
    throw new Error("[Velkoz] " + msg);
  }
}

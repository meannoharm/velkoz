export * from "./types";
import { BrowserClient } from "./browserClient";
import fetch from "./plugins/fetch";
import xhr from "./plugins/xhr";

import type { BrowserOptionsFieldsTypes } from "./types";
import type { BasePluginType } from "@/types";

function createBrowserInstance(options: BrowserOptionsFieldsTypes = {}, plugins: BasePluginType[] = []) {
  const browserClient = new BrowserClient(options);
  const browserPlugins = [fetch, xhr];
  browserClient.use([...browserPlugins, ...plugins]);
  return browserClient;
}

const init = createBrowserInstance;
export { createBrowserInstance, init, BrowserClient };

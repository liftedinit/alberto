import processShim from "process"
import { Buffer } from "buffer"

;(globalThis as any).process = Object.assign(
  {}, // don’t mutate the imported object
  processShim,
  {
    env: (processShim as any).env ?? {},
    version:
      typeof (processShim as any).version === "string"
        ? (processShim as any).version
        : "",
    nextTick:
      typeof (processShim as any).nextTick === "function"
        ? (processShim as any).nextTick
        : (cb: Function, ...args: any[]) => queueMicrotask(() => cb(...args)),
  },
)

if (!(globalThis as any).Buffer) (globalThis as any).Buffer = Buffer
if (!(globalThis as any).global) (globalThis as any).global = globalThis

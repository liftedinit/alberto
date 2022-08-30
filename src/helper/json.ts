import { AnonymousIdentity, WebAuthnIdentity } from "@liftedinit/many-js"
import { base64ToArrayBuffer } from "./convert"

export function replacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    }
  }
  return value
}

export function reviver(key: string, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === Map.name) {
      return new Map(value.value)
    } else if (
      value instanceof Object &&
      value.type === "Buffer" &&
      value.data
    ) {
      return Buffer.from(value.data)
    } else if (value.dataType === AnonymousIdentity.name) {
      return new AnonymousIdentity()
    } else if (value.dataType === WebAuthnIdentity.name) {
      return new WebAuthnIdentity(
        value.cosePublicKey,
        base64ToArrayBuffer(value.rawId),
      )
    }
  }
  return value
}

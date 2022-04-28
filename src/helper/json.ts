import {
  Ed25519KeyPairIdentity,
  WebAuthnIdentity,
  Identity,
  AnonymousIdentity,
} from "many-js"
import { base64ToArrayBuffer } from "./convert"

export function replacer(key: string, value: any) {
  // console.log("replacer value", value)
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    }
  } else if (value instanceof Identity) {
    return {
      dataType: value.constructor.name,
      value: value.toJson(),
    }
  } else {
    return value
  }
}

export function reviver(key: string, value: any) {
  // console.log("reviver value", value)
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value)
    } else if (value.dataType === WebAuthnIdentity.name) {
      return new WebAuthnIdentity(
        value.value.cosePublicKey,
        base64ToArrayBuffer(value.value.rawId),
      )
    } else if (value.dataType === Ed25519KeyPairIdentity.name) {
      return new Ed25519KeyPairIdentity(
        value.value.publicKey,
        value.value.privateKey,
      )
    } else if (value.dataType === AnonymousIdentity.name) {
      return new AnonymousIdentity()
    } else if (
      value instanceof Object &&
      value.type === "Buffer" &&
      value.data
    ) {
      return Buffer.from(value.data)
    }
  }
  return value
}

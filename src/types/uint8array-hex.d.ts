declare interface Uint8ArrayConstructor {
  fromHex(hex: string): Uint8Array;
  fromBase64?(b64: string): Uint8Array;
}
declare interface Uint8Array {
  toHex(): string;
  toBase64?(): string;
}
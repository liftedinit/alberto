export const hexToArrBuf = (hex: string) => {
  const buf = Buffer.from(hex, "hex")
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

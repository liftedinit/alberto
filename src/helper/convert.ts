export const Uint8Array2Hex = (input: Uint8Array) => {
  return Buffer.from(input).toString('hex');
}

export const Hex2Base64 = (input: string) => {
  return Buffer.from(input, 'hex').toString('base64')
}
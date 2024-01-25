export const bufferToNumber = (buffer: Uint8Array): number => {
  const BUFFER_SIZE = 8
  if (buffer.length > BUFFER_SIZE) {
    throw new Error(
      `Buffer length must not exceed ${BUFFER_SIZE} bytes for a 64-bit integer`,
    )
  }

  let paddedBuffer = buffer
  if (buffer.length < BUFFER_SIZE) {
    paddedBuffer = new Uint8Array(BUFFER_SIZE)
    paddedBuffer.set(buffer, BUFFER_SIZE - buffer.length) // This will right-align the original buffer in the fullBuffer
  }

  let number = 0

  for (const element of paddedBuffer) {
    number = number * 256 + element
  }

  return number
}

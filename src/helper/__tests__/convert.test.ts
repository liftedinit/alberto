import {base64UrlToArrayBuffer, arrayBufferToBase64Url} from "../convert"

function testCodecRoundTrip<
    T extends BufferSource,
    E = string
>(
    encoder: (arg: T) => E,
    decoder: (arg: E) => T,
) {
  for (let i = 0; i < 100; i++) {
    // Generate a random [50, 100[ buffer.
    let buffer = new Uint8Array(Math.floor(Math.random() * 50 + 50))
    for (let j = 0; j < buffer.byteLength; j++) {
      buffer[j] = Math.random() * 256
    }

    let encoded: E = encoder(buffer.buffer as T)
    let decoded: T = decoder(encoded)

    expect(Buffer.from(decoded)).toEqual(Buffer.from(buffer))
  }
}

describe("base64url", () => {
  it("should work with round-trip random data", () => {
    testCodecRoundTrip(arrayBufferToBase64Url, base64UrlToArrayBuffer)
  })

  it("should work with golden values", () => {
    expect(new TextDecoder().decode(base64UrlToArrayBuffer("SGVsbG8gV29ybGQ")))
        .toBe("Hello World")

    expect(new TextDecoder().decode(base64UrlToArrayBuffer("SGVsbG8gV29ybGQgMQ")))
        .toBe("Hello World 1")
    expect(new TextDecoder().decode(base64UrlToArrayBuffer("SGVsbG8gV29ybGQgMTI")))
        .toBe("Hello World 12")
    expect(new TextDecoder().decode(base64UrlToArrayBuffer("SGVsbG8gV29ybGQgMTIz")))
        .toBe("Hello World 123")
    expect(new TextDecoder().decode(base64UrlToArrayBuffer("SGVsbG8gV29ybGQgMTIzNA")))
        .toBe("Hello World 1234")
    expect(new TextDecoder().decode(base64UrlToArrayBuffer("SGVsbG8gV29ybGQgMTIzNDU")))
        .toBe("Hello World 12345")
  })
})

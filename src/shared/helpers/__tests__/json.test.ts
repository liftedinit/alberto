import { reviver } from "../json"
import { AnonymousIdentity, WebAuthnIdentity } from "@liftedinit/many-js"

describe("reviver", () => {
  it("should work with golden data (backward compatible)", async () => {
    const anon = { dataType: "r" }
    expect(reviver("", anon)).toBeInstanceOf(AnonymousIdentity)

    const webauthn = {
      dataType: "c",
      rawId:
        "Zv3c95lE/tNOOr4qndQb5DhNO3V2T8dImaD1EbwqmMf7XsnI7Iw2NPaw7PP7aj56nixK5YTLxXNxFwDRfZumxQ==",
      cosePublicKey: Buffer.from(
        "a501020326200121582052b2fe3ebdc42f0ab320a40e74204841ab9ab2a82f9f6e10989388fe025a432f2258209e98ff563dd618542c209f8cafc0abc1a4376ba023bea9afdc6e8c01bafe4d97"
          .match(/.{1,2}/g)!
          .map(byte => parseInt(byte, 16)),
      ),
    }

    const webauthnDe = reviver("", webauthn)
    expect(webauthnDe).toBeInstanceOf(WebAuthnIdentity)
    let address = await webauthnDe.getAddress()
    // Mock `Buffer` only here so base32encode works as expected.
    // This _should_ be in `setupTests.ts` but I could not make it work.
    const oldBuffer = global.Buffer
    global.Buffer = require("buffer").Buffer

    expect(address.toString()).toEqual(
      "mahgrwinlmcbpl6pglk34hwfruvikyu4wooba2xol3yqns5qhp",
    )
    global.Buffer = oldBuffer
  })
})

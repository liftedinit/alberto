import { MockAccount, MockEd25519KeyPairIdentity } from "./types"
import { act } from "react"
import { useAccountsStore } from "../features/accounts"
import { Ed25519KeyPairIdentity } from "@liftedinit/many-js"

export const setupMnemonicMock = () => {
  vi.spyOn(Ed25519KeyPairIdentity, "getMnemonic").mockReturnValue(
    "one two three four five six seven eight nine ten eleven twelve",
  )

  vi.spyOn(Ed25519KeyPairIdentity, "fromMnemonic").mockImplementation(() => {
    const mockPublicKey = Buffer.from("mocked public key").buffer
    const mockPrivateKey = Buffer.from("mocked private key").buffer
    const mockIdentity = new MockEd25519KeyPairIdentity(
      mockPublicKey,
      mockPrivateKey,
    )

    mockIdentity.getAddress = vi.fn().mockReturnValue("mocked address")
    mockIdentity.sign = vi.fn()
    mockIdentity.verify = vi.fn()
    mockIdentity.toJSON = vi.fn()
    mockIdentity.getProtectedHeader = vi.fn()
    mockIdentity.getUnprotectedHeader = vi.fn()
    mockIdentity.getCoseKey = vi.fn()

    return mockIdentity
  })
}

export function addAccountToStore(account: MockAccount) {
  useAccountsStore.setState(s => {
    const nextId = s.nextId + 1
    return {
      ...s,
      activeId: s.nextId,
      nextId: nextId,
      byId: new Map([
        ...s.byId.entries(),
        [
          s.nextId,
          {
            address: account.address,
            name: account.name,
            identity: account.identity,
          },
        ],
      ]),
    }
  })
}

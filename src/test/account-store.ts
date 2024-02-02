import { MockAccount, MockEd25519KeyPairIdentity } from "./types"
import { act } from "react-dom/test-utils"
import { useAccountsStore } from "../features/accounts"
import { Ed25519KeyPairIdentity } from "@liftedinit/many-js"

export const setupMnemonicMock = () => {
  jest
    .spyOn(Ed25519KeyPairIdentity, "getMnemonic")
    .mockReturnValue(
      "one two three four five six seven eight nine ten eleven twelve",
    )

  jest.spyOn(Ed25519KeyPairIdentity, "fromMnemonic").mockImplementation(() => {
    const mockPublicKey = Buffer.from("mocked public key").buffer
    const mockPrivateKey = Buffer.from("mocked private key").buffer
    const mockIdentity = new MockEd25519KeyPairIdentity(
      mockPublicKey,
      mockPrivateKey,
    )

    mockIdentity.getAddress = jest.fn().mockReturnValue("mocked address")
    mockIdentity.sign = jest.fn()
    mockIdentity.verify = jest.fn()
    mockIdentity.toJSON = jest.fn()
    mockIdentity.getProtectedHeader = jest.fn()
    mockIdentity.getUnprotectedHeader = jest.fn()
    mockIdentity.getCoseKey = jest.fn()

    return mockIdentity
  })
}

export function addAccountToStore(account: MockAccount) {
  act(() =>
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
    }),
  )
}

export const mockUseAccountsStore = () => {
  const mockById = new Map([
    [
      0,
      {
        name: "mockAcc",
        identity: new ArrayBuffer(0),
        address: "mqd7vxcf3l4aklypotgjmwy36y2kk2metkqidcizo4jnfttiaaaaqkt",
      },
    ],
  ])
  const mockGetId = jest.fn().mockReturnValue(1)
  const mockSetActiveId = jest.fn().mockResolvedValue(1)
  useAccountsStore.mockImplementation(() => ({
    getId: mockGetId,
    setActiveId: mockSetActiveId,
    byId: mockById,
  }))
}

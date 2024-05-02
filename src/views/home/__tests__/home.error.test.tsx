import { screen } from "@testing-library/react"
import { mockErrorNetwork } from "test/network-store"
import { addAccountToStore } from "test/account-store"
import { renderChildren } from "test/render"
import { Home } from "views/home"
import { MockEd25519KeyPairIdentity } from "test/types"
const mockAccount1 = {
  name: "test",
  address: "m111",
  identity: new MockEd25519KeyPairIdentity(
    new ArrayBuffer(0),
    new ArrayBuffer(0),
  ),
}

// TODO: After multiple attempts, I don't know how to have this mock scoped to a single test.
jest.mock("features/network/network-provider", () => {
  return {
    ...jest.requireActual("features/network/network-provider"),
    useNetworkContext: () => ({
      query: mockErrorNetwork(),
    }),
  }
})

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {})
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe("Home Error Tests", () => {
  it("should display an error message", async () => {
    addAccountToStore(mockAccount1)
    renderChildren(<Home />)
    expect(
      await screen.findByText(/an unexpected error occurred/i),
    ).toBeInTheDocument()
  })
})

import { screen } from "@testing-library/react"
import { mockErrorNetwork } from "test/network-store"
import { addAccountToStore } from "test/account-store"
import { renderChildren } from "test/render"
import { Home } from "views/home"
import { MockEd25519KeyPairIdentity } from "test/types"
import { act } from "react"
const mockAccount1 = {
  name: "test",
  address: "m111",
  identity: new MockEd25519KeyPairIdentity(
    new ArrayBuffer(0),
    new ArrayBuffer(0),
  ),
}

// TODO: After multiple attempts, I don't know how to have this mock scoped to a single test.
vi.mock("features/network/network-provider", async () => {
  const actual = await vi.importActual("features/network/network-provider")
  return {
    ...actual,
    useNetworkContext: () => ({
      query: mockErrorNetwork(),
    }),
  }
})

vi.mock("@chakra-ui/media-query", () => {
  const actual = vi.importActual("@chakra-ui/media-query")
  return {
    ...actual,
    useBreakpointValue: vi.fn((values: any) => {
      if (Array.isArray(values)) return values[0]
      if (values && typeof values === "object") {
        return values.base ?? values.sm ?? values.md ?? values.lg ?? values.xl
      }
      return values
    }),
  }
})

beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation(() => {})
})

afterAll(() => {
  vi.restoreAllMocks()
})

describe("Home Error Tests", () => {
  it("should display an error message", async () => {
    act(() => addAccountToStore(mockAccount1))
    renderChildren(<Home />)
    expect(
      await screen.findByText(/an unexpected error occurred/i),
    ).toBeInTheDocument()
  })
})

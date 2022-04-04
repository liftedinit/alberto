import { render, screen, within } from "test/test-utils"
import * as useIsBaseBreakpoint from "hooks/useIsBaseBreakpoint"
import { useBalances } from "features/balances/queries"
import { Home } from "views/_home"

jest.mock("features/balances/queries", () => ({
  useBalances: jest.fn(),
}))

const mockUseIsBaseBreakpoint = jest.spyOn(
  useIsBaseBreakpoint,
  "useIsBaseBreakpoint",
)

describe("home page", () => {
  beforeEach(() => {
    useBalances.mockImplementation(() => ({
      isFetching: false,
      isError: false,
      errors: [],
      data: {
        ownedAssetsWithBalance: [
          { symbol: "ABC", balance: BigInt(1000000), identity: "oabc" },
          { symbol: "GHI", balance: BigInt(5000000), identity: "ocba" },
        ],
      },
    }))
  })
  it("should render tabs for balances and history", async () => {
    mockUseIsBaseBreakpoint.mockImplementation(() => true)
    setupHome()

    const tabs = screen.getByRole("tablist")

    const historyTab = within(tabs).getByText(/assets/i)
    expect(historyTab).toBeInTheDocument()

    const symbolsTab = within(tabs).getByText(/transactions/i)
    expect(symbolsTab).toBeInTheDocument()
  })
  it("should list the balances of each token the account holds", async () => {
    setupHome()
    expect(screen.getByText(/abc/i)).toBeInTheDocument()
    expect(
      screen.getByText(BigInt(1000000).toLocaleString()),
    ).toBeInTheDocument()

    expect(screen.getByText(/ghi/i)).toBeInTheDocument()
    expect(
      screen.getByText(BigInt(5000000).toLocaleString()),
    ).toBeInTheDocument()
  })
  it("should display the error message", async () => {
    useBalances.mockImplementation(() => ({
      isFetching: false,
      isError: true,
      errors: ["something went wrong"],
      data: [
        { name: "ABC", value: BigInt(1000000) },
        { name: "GHI", value: BigInt(5000000) },
      ],
    }))
    setupHome()
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })
})

function setupHome() {
  render(<Home />)
}

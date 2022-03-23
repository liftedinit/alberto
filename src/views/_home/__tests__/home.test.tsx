import { render, screen, within } from "test/test-utils"
import * as useIsBaseBreakpoint from "hooks/useIsBaseBreakpoint"
import { useLedgerInfo } from "features/network"

import { Home } from "views/_home"

const mockUseIsBaseBreakpoint = jest.spyOn(
  useIsBaseBreakpoint,
  "useIsBaseBreakpoint",
)

describe("home page", () => {
  it("should render bottom menu tabs for base screen layout", async () => {
    // base is the smallest screen width
    mockUseIsBaseBreakpoint.mockImplementation(() => true)
    render(<Home />)

    const menuTabs = screen.getByTestId("menu-tabs")
    expect(menuTabs).toBeInTheDocument()

    const historyTab = within(menuTabs).queryByText(/history/i)
    expect(historyTab).toBeInTheDocument()

    const symbolsTab = within(menuTabs).queryByText(/symbols/i)
    expect(symbolsTab).toBeInTheDocument()
  })
  it("should render main menu tabs for screen sizes above the base width", async () => {
    mockUseIsBaseBreakpoint.mockImplementation(() => false)
    render(<Home />)

    const mainTabs = screen.getByTestId("main-tabs")
    expect(mainTabs).toBeInTheDocument()

    const historyTab = within(mainTabs).getByText(/history/i)
    expect(historyTab).toBeInTheDocument()

    const symbolsTab = within(mainTabs).getByText(/symbols/i)
    expect(symbolsTab).toBeInTheDocument()
  })
})

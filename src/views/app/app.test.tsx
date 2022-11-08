import { render, screen, waitForElementToBeRemoved } from "test/test-utils"
import { App } from "views"

describe("App", () => {
  it("first renders the splash page", async () => {
    render(<App />)

    const albertText = screen.getByTestId("splash-screen")
    expect(albertText).toBeInTheDocument()
  })
  it("should render the layout grid after the splash screen", async () => {
    render(<App />)
    await waitForElementToBeRemoved(screen.queryByTestId("splash-screen"))
    expect(screen.queryByTestId("splash-screen")).not.toBeInTheDocument()
    expect(screen.getByTestId("layout-grid")).toBeInTheDocument()
  })
})

import { App } from "views"
import { renderChildren } from "../../test/render"
import { screen, waitForElementToBeRemoved } from "@testing-library/react"

describe("App", () => {
  it("first renders the splash page", async () => {
    renderChildren(<App />)

    const albertText = screen.getByTestId("splash-screen")
    expect(albertText).toBeInTheDocument()
  })
  it("should render the layout grid after the splash screen", async () => {
    renderChildren(<App />)
    await waitForElementToBeRemoved(screen.queryByTestId("splash-screen"))
    expect(screen.queryByTestId("splash-screen")).not.toBeInTheDocument()
    expect(screen.getByTestId("layout-grid")).toBeInTheDocument()
  })
})

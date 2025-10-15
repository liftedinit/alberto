import { App } from "views"
import { renderChildren } from "test/render"
import { screen, waitForElementToBeRemoved } from "@testing-library/react"
import { act } from "react"

describe("App", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    })
  })

  it("first renders the splash page", async () => {
    renderChildren(<App />)

    const albertText = screen.getByTestId("splash-screen")
    expect(albertText).toBeInTheDocument()
  })

  it("renders the layout grid after the splash screen", async () => {
    renderChildren(<App />)

    await waitForElementToBeRemoved(() => screen.getByTestId("splash-screen"))
    expect(await screen.findByTestId("layout-grid")).toBeInTheDocument()
  })
})

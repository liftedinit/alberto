import { App } from "views"
import { renderChildren } from "test/render"
import { screen, waitFor } from "@testing-library/react"
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
    vi.useFakeTimers()

    renderChildren(<App />)

    // Verify splash screen is shown initially
    expect(screen.getByTestId("splash-screen")).toBeInTheDocument()

    // Advance timers past the 1 second splash delay
    await act(async () => {
      vi.advanceTimersByTime(1100)
    })

    // Now the layout should be visible
    await waitFor(() => {
      expect(screen.getByTestId("layout-grid")).toBeInTheDocument()
    })

    vi.useRealTimers()
  })
})

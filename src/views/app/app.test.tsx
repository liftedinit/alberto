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
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }),
    })
  })

  it("first renders the splash page", async () => {
    renderChildren(<App />)

    const albertText = screen.getByTestId("splash-screen")
    expect(albertText).toBeInTheDocument()
  })

  it("renders the layout grid after the splash screen", async () => {
    jest.useFakeTimers() // if App uses setTimeout to dismiss splash
    renderChildren(<App />)

    act(() => {
      jest.runAllTimers() // advance past splash delay
    })

    // If there’s an animation/transition gate, you may need this:
    // fireEvent.transitionEnd(document.querySelector('[data-testid="splash-screen"]')!)

    // drive timers forward if needed
    // act(() => {
    //   jest.runOnlyPendingTimers()
    // or: jest.advanceTimersByTime(3000)
    // })

    // Now assert the layout
    expect(await screen.findByTestId("layout-grid")).toBeInTheDocument()
    jest.useRealTimers()
  })
})

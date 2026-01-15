;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
import "@testing-library/jest-dom"
import { cleanup } from "@testing-library/react"

// Cleanup after each test
afterEach(() => {
  cleanup()
})

const matchMediaStub = (query: string) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList
}

vi.stubGlobal("matchMedia", matchMediaStub)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: matchMediaStub,
})

if (
  typeof globalThis.TextEncoder === "undefined" ||
  typeof globalThis.TextDecoder === "undefined"
) {
  const { TextEncoder, TextDecoder } = await import("node:util")
  globalThis.TextEncoder = globalThis.TextEncoder ?? TextEncoder
  globalThis.TextDecoder = globalThis.TextDecoder ?? TextDecoder
}

require("./test/web3authMock")

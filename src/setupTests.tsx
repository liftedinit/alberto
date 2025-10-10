import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "util"

require("./test/web3authMock")

jest.mock("react-dom/test-utils", () => {
  const React = require("react")
  return { act: React.act }
})

global.TextEncoder = TextEncoder
// @ts-ignore
global.TextDecoder = TextDecoder

import { parseNumberToBigInt, amountFormatter } from "../common"

function setupParseNumberToBigInt(
  expectedBigInt: bigint,
  numStr: string,
  maxDigits?: number,
) {
  const actual7 = parseNumberToBigInt(parseFloat(numStr), maxDigits)
  expect(actual7).toEqual(expectedBigInt)
}

describe("parseNumberToBigInt", () => {
  it("should output the correct bigint", () => {
    setupParseNumberToBigInt(BigInt(1000000000), "1.0")
    setupParseNumberToBigInt(BigInt(1000005599), "1.000005599")
    setupParseNumberToBigInt(BigInt(1000000), ".001")
    setupParseNumberToBigInt(BigInt(1), ".000000001")
    setupParseNumberToBigInt(BigInt(1), ".00001", 5)
    setupParseNumberToBigInt(BigInt(10000), ".1", 5)
    setupParseNumberToBigInt(BigInt(1005490), "10.0549", 5)
  })
})

function setupAmountFormatter(
  expectedStr: string,
  bigIntToFormat: bigint,
  minDigits?: number,
  maxDigits?: number,
) {
  expect(amountFormatter(bigIntToFormat, minDigits, maxDigits)).toEqual(
    expectedStr,
  )
}
describe("amountFormatter", () => {
  it("should format the amount properly", () => {
    setupAmountFormatter("0.000000001", BigInt(1))
    setupAmountFormatter("1", BigInt(1000000000))
    setupAmountFormatter("120.000000005", BigInt(120000000005))
    setupAmountFormatter("1.5", BigInt(150000), undefined, 5)
    setupAmountFormatter("155.55559", BigInt(15555559), undefined, 5)
    setupAmountFormatter("9,155.55559", BigInt(915555559), undefined, 5)
  })
})

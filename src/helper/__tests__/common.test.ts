import { parseNumberToBigInt, amountFormatter } from "../common"

describe("parseNumberToBigInt", () => {
  it("should output the correct bigint", () => {
    const expected1 = BigInt(1000000000)
    const actual1 = parseNumberToBigInt(parseFloat("1.0"))
    expect(actual1).toEqual(expected1)

    const expected2 = BigInt(1000005599)
    const actual2 = parseNumberToBigInt(parseFloat("1.000005599"))
    expect(actual2).toEqual(expected2)

    const expected3 = BigInt(1000000)
    const actual3 = parseNumberToBigInt(parseFloat(".001"))
    expect(actual3).toEqual(expected3)

    const expected4 = BigInt(1)
    const actual4 = parseNumberToBigInt(parseFloat(".000000001"))
    expect(actual4).toEqual(expected4)
  })
})

describe("amountFormatter", () => {
  it("should format the amount properly", () => {
    const expected1 = "0.000000001"
    const actual1 = amountFormatter(BigInt(1))
    expect(actual1).toEqual(expected1)

    const expected2 = "1"
    const actual2 = amountFormatter(BigInt(1000000000))
    expect(actual2).toEqual(expected2)

    const expected3 = "120.000000005"
    const actual3 = amountFormatter(BigInt(120000000005))
    expect(actual3).toEqual(expected3)
  })
})

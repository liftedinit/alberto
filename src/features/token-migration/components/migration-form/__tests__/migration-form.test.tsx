import { MigrationForm } from "features/token-migration"
import { renderChildren } from "test/render"
import { useTransactionsList } from "features/transactions"
import { screen } from "@testing-library/react"
import { useCombinedAccountInfo } from "features/accounts/queries"
import { IdTypes } from "../types"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"
import { useBalances } from "features/balances"

jest.mock("features/accounts/queries", () => {
  return {
    ...jest.requireActual("features/accounts/queries"),
    useCombinedAccountInfo: jest.fn(),
  }
})

jest.mock("features/transactions", () => {
  return {
    ...jest.requireActual("features/transactions"),
    useTransactionsList: jest.fn(),
  }
})

jest.mock("features/balances", () => {
  return {
    ...jest.requireActual("features/balances"),
    useBalances: jest.fn(),
  }
})

const mockUserAddr = "mah7vxcf3l4aklypotgjmwy36y2kk2metkqidcizo4jnfttild"
const mockAccountAddr =
  "mqd7vxcf3l4aklypotgjmwy36y2kk2metkqidcizo4jnfttiaaaaqkt"
const mockDestinationAddr = "manifest194dewhjkvt4rw8ccwnz36ljfuhe8r4kzs84sl9"
const mockCombinedAccountInfo = new Map([
  // A User
  [
    mockUserAddr,
    {
      idType: IdTypes.USER,
      address: mockUserAddr,
      id: 1,
      name: "mockUser",
    },
  ],
  // An Account
  [
    mockAccountAddr,
    {
      idType: IdTypes.ACCOUNT,
      address: mockAccountAddr,
      name: "mockAccount",
    },
  ],
])
const mockEmptyCombinedAccountInfo = new Map()

const createAsset = (identity: string, symbol: string, balance: bigint) => ({
  identity,
  symbol,
  balance,
})

const mockBalances = {
  data: {
    ownedAssetsWithBalance: [createAsset("1", "MFX", BigInt(2000000000))],
  },
  isLoading: false,
  isError: false,
  errors: undefined,
}

const advanceToNextStep = async (acc: string) => {
  const options = screen.getAllByTestId("form-option")
  expect(options.length).toBe(2)
  const addressField = screen.getByTestId("address")
  await act(async () => await userEvent.selectOptions(addressField, [acc]))
  const nextBtn = screen.getByTestId("next-btn")
  await act(async () => await userEvent.click(nextBtn))
}

const advanceFromAddressToAmountStep = async () => {
  await advanceToNextStep(mockUserAddr)
}

const advanceFromAddressToUserAddressStep = async () => {
  await advanceToNextStep(mockAccountAddr)
}

const advanceFromAmountToDestinationStep = async () => {
  const options = screen.getAllByTestId("symbol-option")
  expect(options.length).toBe(1)

  const symbolField = screen.getByTestId("assetSymbol")
  await act(async () => await userEvent.selectOptions(symbolField, ["MFX"]))

  const amountField = screen.getByTestId("assetAmount")
  await act(async () => await userEvent.type(amountField, "1"))

  const nextBtn = screen.getByTestId("next-btn")
  await act(async () => await userEvent.click(nextBtn))
}

const advanceFromDestinationAddrToConfirmationStep = async () => {
  const destinationField = screen.getByTestId("destinationAddress")
  await act(
    async () => await userEvent.type(destinationField, mockDestinationAddr),
  )
  const nextBtn = screen.getByTestId("next-btn")
  await act(async () => await userEvent.click(nextBtn))
}

const backAStep = async () => {
  const backBtn = screen.getByTestId("back-btn")
  await act(async () => await userEvent.click(backBtn))
}

const setupMock = () => {
  useTransactionsList.mockImplementation(() => ({
    data: {
      transactions: [],
    },
    isLoading: false,
    isError: false,
    error: undefined,
  }))
  useCombinedAccountInfo.mockImplementation(() => mockCombinedAccountInfo)
  useBalances.mockImplementation(() => mockBalances)
}

const restoreMock = () => {
  useTransactionsList.mockRestore()
  useCombinedAccountInfo.mockRestore()
}

beforeEach(setupMock)
afterEach(restoreMock)

describe("MigrationForm - User flow", () => {
  it("should render the form", () => {
    renderChildren(<MigrationForm />)
    expect(screen.getByTestId("address")).toBeInTheDocument()
    expect(screen.getByTestId("next-btn")).toBeInTheDocument()
  })
  it("should advance to the amount/asset step", async () => {
    renderChildren(<MigrationForm />)
    await advanceFromAddressToAmountStep()
    expect(screen.getByTestId("assetSymbol")).toBeInTheDocument()
  })
  it("should advance to the destination address step", async () => {
    renderChildren(<MigrationForm />)
    await advanceFromAddressToAmountStep()
    await advanceFromAmountToDestinationStep()
    expect(screen.getByTestId("destinationAddress")).toBeInTheDocument()
  })
  it("should advance to the confirmation step", async () => {
    renderChildren(<MigrationForm />)
    await advanceFromAddressToAmountStep()
    await advanceFromAmountToDestinationStep()
    await advanceFromDestinationAddrToConfirmationStep()
    expect(screen.getByTestId("confirmation-box")).toBeInTheDocument()
  })
  it("start to finish to start", async () => {
    renderChildren(<MigrationForm />)
    await advanceFromAddressToAmountStep()
    await advanceFromAmountToDestinationStep()
    await advanceFromDestinationAddrToConfirmationStep()
    expect(screen.getByTestId("confirmation-box")).toBeInTheDocument()

    await backAStep()
    expect(screen.getByTestId("destinationAddress")).toBeInTheDocument()
    await backAStep()
    expect(screen.getByTestId("assetSymbol")).toBeInTheDocument()
    await backAStep()
    expect(screen.getByTestId("address")).toBeInTheDocument()
  })
})

describe("MigrationForm - User flow - Error handling", () => {
  it("should display an error message when the user address is not selected", async () => {
    useCombinedAccountInfo.mockImplementation(
      () => mockEmptyCombinedAccountInfo,
    )
    renderChildren(<MigrationForm />)
    const nextBtn = screen.getByTestId("next-btn")
    await act(async () => await userEvent.click(nextBtn))
    expect(screen.getByTestId("error-address")).toBeInTheDocument()
  })
  it("should display an error message when the asset symbol is not selected", async () => {
    renderChildren(<MigrationForm />)
    await advanceFromAddressToAmountStep()
    const nextBtn = screen.getByTestId("next-btn")
    await act(async () => await userEvent.click(nextBtn))
    expect(screen.getByTestId("error-assetAmount")).toBeInTheDocument()
  })
  it("should display an error message when the asset symbol is selected and the asset amount is not selected", async () => {
    renderChildren(<MigrationForm />)
    await advanceFromAddressToAmountStep()
    const symbolField = screen.getByTestId("assetSymbol")
    await act(async () => await userEvent.selectOptions(symbolField, ["MFX"]))
    const nextBtn = screen.getByTestId("next-btn")
    await act(async () => await userEvent.click(nextBtn))
    expect(screen.getByTestId("error-assetAmount")).toBeInTheDocument()
  })
  it("should display an error message when the asset symbol is selected and the balance is over the maximum", async () => {
    renderChildren(<MigrationForm />)
    await advanceFromAddressToAmountStep()
    const amountField = screen.getByTestId("assetAmount")
    await act(async () => await userEvent.type(amountField, "5"))
    const nextBtn = screen.getByTestId("next-btn")
    await act(async () => await userEvent.click(nextBtn))
    expect(screen.getByTestId("error-assetAmount")).toBeInTheDocument()
  })
  it("should display an error message when the destination address is not entered", async () => {
    renderChildren(<MigrationForm />)
    await advanceFromAddressToAmountStep()
    await advanceFromAmountToDestinationStep()
    const nextBtn = screen.getByTestId("next-btn")
    await act(async () => await userEvent.click(nextBtn))
    expect(screen.getByTestId("error-destinationAddress")).toBeInTheDocument()
  })
  it("should display an error message when the destination address is not valid", async () => {
    renderChildren(<MigrationForm />)
    await advanceFromAddressToAmountStep()
    await advanceFromAmountToDestinationStep()
    const destinationField = screen.getByTestId("destinationAddress")
    await act(
      async () => await userEvent.type(destinationField, "invalidDestination"),
    )
    const nextBtn = screen.getByTestId("next-btn")
    await act(async () => await userEvent.click(nextBtn))
    expect(screen.getByTestId("error-destinationAddress")).toBeInTheDocument()
  })
})

describe("MigrationForm - Account flow", () => {
  it("should advance to the user address step", async () => {
    renderChildren(<MigrationForm />)
    await advanceFromAddressToUserAddressStep()
    expect(screen.getByTestId("userAddress")).toBeInTheDocument()
  })
  // TODO
  // it("should advance to the amount/asset step", async () => {
  //   renderChildren(<MigrationForm />)
  //   await advanceFromAddressToUserAddressStep()
  //   expect(screen.getByTestId("assetSymbol")).toBeInTheDocument()
  // })
})

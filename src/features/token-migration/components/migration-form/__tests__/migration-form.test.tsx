import { MigrationForm } from "features/token-migration"
import { renderChildren } from "test/render"
import { useCreateSendTxn, useTransactionsList } from "features/transactions"
import { screen } from "@testing-library/react"
import { useCombinedAccountInfo } from "features/accounts/queries"
import { IdTypes } from "../types"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"
import { useBalances } from "features/balances"
import { useAccountsStore } from "features/accounts"
import { randomUUID } from "crypto"
import { createMockTxList } from "test/transactions"
import { ILLEGAL_IDENTITY } from "@liftedinit/many-js"
import { useGetBlock } from "features/network/queries"
import { createMockBlock } from "test/block"
import { useNavigate } from "react-router-dom"
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
    useCreateSendTxn: jest.fn(() => ({
      mutateAsync: jest.fn(),
    })),
  }
})

jest.mock("features/balances", () => {
  return {
    ...jest.requireActual("features/balances"),
    useBalances: jest.fn(),
  }
})

jest.mock("features/accounts", () => {
  return {
    ...jest.requireActual("features/accounts"),
    useAccountsStore: jest.fn(() => ({
      getId: jest.fn(),
    })),
  }
})

jest.mock("crypto", () => ({
  ...jest.requireActual("crypto"),
  randomUUID: jest.fn(),
}))

jest.mock("features/network/queries", () => {
  return {
    ...jest.requireActual("features/network/queries"),
    useGetBlock: jest.fn(),
  }
})

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}))

const mockUserAddr = "mah7vxcf3l4aklypotgjmwy36y2kk2metkqidcizo4jnfttild"
const mockAccountAddr =
  "mqd7vxcf3l4aklypotgjmwy36y2kk2metkqidcizo4jnfttiaaaaqkt"
const mockDestinationAddr = "manifest194dewhjkvt4rw8ccwnz36ljfuhe8r4kzs84sl9"
const mockById = new Map([
  [
    0,
    {
      name: "mockAcc",
      identity: new ArrayBuffer(0),
      address: mockAccountAddr,
    },
  ],
])
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
const mockTx = createMockTxList(["6a9900000001"], "m111", ILLEGAL_IDENTITY, [
  "mockUUID",
  mockDestinationAddr,
])

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
}

const advanceFromDestinationAddrToConfirmationStep = async () => {
  const destinationField = screen.getByTestId("destinationAddress")
  await act(
    async () => await userEvent.type(destinationField, mockDestinationAddr),
  )
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

  const mockMutateAsync = jest.fn(() => {
    return Promise.resolve(true)
  })
  useCreateSendTxn.mockReturnValue({ mutateAsync: mockMutateAsync })

  const mockGetId = jest.fn()
  const mockSetActiveId = jest.fn()
  useAccountsStore.mockImplementation(() => ({
    getId: mockGetId,
    setActiveId: mockSetActiveId,
    byId: mockById,
  }))
  mockGetId.mockReturnValue(1)
  mockSetActiveId.mockReturnValue(1)

  randomUUID.mockReturnValue("mockUUID")

  useGetBlock.mockImplementation(() => createMockBlock(["01234"]))
}

beforeEach(setupMock)
afterEach(jest.resetAllMocks)

const advanceStep = async (
  testId: string,
  action?: () => void | PromiseLike<void>,
) => {
  if (action) {
    await act(async () => await action())
  }
  const nextBtn = screen.getByTestId("next-btn")
  await act(async () => await userEvent.click(nextBtn))
  if (testId) {
    expect(screen.getByTestId(testId)).toBeInTheDocument()
  }
}

const backStep = async (
  testId: string,
  action?: () => void | PromiseLike<void>,
) => {
  if (action) {
    await act(async () => await action())
  }
  const backBtn = screen.getByTestId("back-btn")
  await act(async () => await userEvent.click(backBtn))
  if (testId) {
    expect(screen.getByTestId(testId)).toBeInTheDocument()
  }
}

describe("MigrationForm - User flow", () => {
  it("should render the form", () => {
    renderChildren(<MigrationForm />)
    expect(screen.getByTestId("address")).toBeInTheDocument()
    expect(screen.getByTestId("next-btn")).toBeInTheDocument()
  })
  it("should advance to the amount/asset step", async () => {
    renderChildren(<MigrationForm />)
    await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
  })
  it("should advance to the destination address step", async () => {
    renderChildren(<MigrationForm />)
    await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
    await advanceStep("destinationAddress", advanceFromAmountToDestinationStep)
  })
  it("should advance to the confirmation step", async () => {
    renderChildren(<MigrationForm />)
    await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
    await advanceStep("destinationAddress", advanceFromAmountToDestinationStep)
    await advanceStep(
      "confirmation-box",
      advanceFromDestinationAddrToConfirmationStep,
    )
  })
  it("should process the transaction", async () => {
    const navigate = jest.fn()
    useNavigate.mockReturnValue(navigate)
    useTransactionsList.mockImplementation(() => mockTx)

    renderChildren(<MigrationForm />)
    await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
    await advanceStep("destinationAddress", advanceFromAmountToDestinationStep)
    await advanceStep(
      "confirmation-box",
      advanceFromDestinationAddrToConfirmationStep,
    )
    const nextBtn = screen.getByTestId("next-btn")
    await act(async () => await userEvent.click(nextBtn))

    expect(navigate).toHaveBeenCalledWith(
      "/token-migration-portal/migration-history/6a9900000001",
    )
  })
  it("start to finish to start", async () => {
    renderChildren(<MigrationForm />)
    await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
    await advanceStep("destinationAddress", advanceFromAmountToDestinationStep)
    await advanceStep(
      "confirmation-box",
      advanceFromDestinationAddrToConfirmationStep,
    )

    await backStep("destinationAddress")
    await backStep("assetSymbol")
    await backStep("address")
  })
})

describe("MigrationForm - User flow - Error handling", () => {
  it("should display an error message when the user address is not selected", async () => {
    useCombinedAccountInfo.mockReturnValue(mockEmptyCombinedAccountInfo)
    renderChildren(<MigrationForm />)
    await advanceStep("error-address")
  })
  it("should display an error message when the asset symbol is not selected", async () => {
    renderChildren(<MigrationForm />)
    await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
    await advanceStep("error-assetAmount")
  })
  it("should display an error message when the asset symbol is selected and the asset amount is not selected", async () => {
    renderChildren(<MigrationForm />)
    await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
    const symbolField = screen.getByTestId("assetSymbol")
    await act(async () => await userEvent.selectOptions(symbolField, ["MFX"]))
    await advanceStep("error-assetAmount")
  })
  it("should display an error message when the asset symbol is selected and the balance is over the maximum", async () => {
    renderChildren(<MigrationForm />)
    await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
    const amountField = screen.getByTestId("assetAmount")
    await act(async () => await userEvent.type(amountField, "5"))
    await advanceStep("error-assetAmount")
  })
  it("should display an error message when the destination address is not entered", async () => {
    renderChildren(<MigrationForm />)
    await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
    await advanceStep("destinationAddress", advanceFromAmountToDestinationStep)
    await advanceStep("error-destinationAddress")
  })
  it("should display an error message when the destination address is not valid", async () => {
    renderChildren(<MigrationForm />)
    await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
    await advanceStep("destinationAddress", advanceFromAmountToDestinationStep)
    const destinationField = screen.getByTestId("destinationAddress")
    await act(
      async () => await userEvent.type(destinationField, "invalidDestination"),
    )
    await advanceStep("error-destinationAddress")
  })
})

describe("MigrationForm - Account flow", () => {
  it("should advance to the user address step", async () => {
    renderChildren(<MigrationForm />)
    await advanceStep("userAddress", advanceFromAddressToUserAddressStep)
  })
  // TODO
  // it("should advance to the amount/asset step", async () => {
  //   renderChildren(<MigrationForm />)
  //   await advanceFromAddressToUserAddressStep()
  //   expect(screen.getByTestId("assetSymbol")).toBeInTheDocument()
  // })
})

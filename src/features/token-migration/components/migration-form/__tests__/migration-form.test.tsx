import { MigrationForm } from "features/token-migration"
import { renderChildren } from "test/render"
import { useTransactionsList } from "features/transactions"
import { screen } from "@testing-library/react"
import { useCombinedAccountInfo } from "features/accounts/queries"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"
import {
  createMockMultisigSubmitTxList,
  createMockSendTxList,
} from "test/transactions"
import { ILLEGAL_IDENTITY } from "@liftedinit/many-js"
import { useNavigate } from "react-router-dom"
import {
  mockUseAccountsStore,
  mockUseBalance,
  mockUseBlock,
  mockUseCombinedAccountInfo,
  mockUseCreateSendTransaction,
  mockUseGetAccountInfo,
  mockEmptyUseTransactionList,
  mockUserAddr,
  mockAccountAddr,
  mockDestinationAddr,
  mockAsset,
  mockSendEventId,
  mockMultisigEventId,
  mockUuid,
  mockToken,
} from "features/token-migration/test-utils/mocks"

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
    useMultisigSubmitTransaction: jest.fn(() => ({
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
    useGetAccountInfo: jest.fn(),
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

const advanceFromUserAddressToAmountStep = async () => {
  const options = screen.getAllByTestId("user-option")
  expect(options.length).toBe(1)
  const addressField = screen.getByTestId("userAddress")
  await act(
    async () => await userEvent.selectOptions(addressField, [mockUserAddr]),
  )
}

const advanceFromAmountToDestinationStep = async () => {
  const options = screen.getAllByTestId("symbol-option")
  expect(options.length).toBe(1)

  const symbolField = screen.getByTestId("assetSymbol")
  await act(
    async () => await userEvent.selectOptions(symbolField, [mockAsset.symbol]),
  )

  const amountField = screen.getByTestId("assetAmount")
  await act(async () => await userEvent.type(amountField, "1"))
}

const advanceFromDestinationAddrToConfirmationStep = async () => {
  const destinationField = screen.getByTestId("destinationAddress")
  await act(
    async () => await userEvent.type(destinationField, mockDestinationAddr),
  )
}

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
    expect(await screen.findByTestId(testId)).toBeInTheDocument()
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

describe("MigrationForm", () => {
  afterEach(jest.clearAllMocks)

  describe("User flow", () => {
    beforeEach(() => {
      mockEmptyUseTransactionList()
      mockUseCreateSendTransaction()
      mockUseBlock()
      mockUseCombinedAccountInfo()
    })
    it("should render the form", async () => {
      renderChildren(<MigrationForm />)
      expect(await screen.findByTestId("address")).toBeInTheDocument()
      expect(await screen.findByTestId("next-btn")).toBeInTheDocument()
    })
    it("should advance to the amount/asset step", async () => {
      mockUseBalance()
      renderChildren(<MigrationForm />)
      await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
    })
    it("should advance to the destination address step", async () => {
      mockUseBalance()
      renderChildren(<MigrationForm />)
      await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
      await advanceStep(
        "destinationAddress",
        advanceFromAmountToDestinationStep,
      )
    })
    it("should advance to the confirmation step", async () => {
      mockUseBalance()
      renderChildren(<MigrationForm />)
      await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
      await advanceStep(
        "destinationAddress",
        advanceFromAmountToDestinationStep,
      )
      await advanceStep(
        "confirmation-box",
        advanceFromDestinationAddrToConfirmationStep,
      )
      expect(screen.queryByTestId("account-info")).not.toBeInTheDocument()
    })
    it("should process the transaction", async () => {
      mockUseBalance()
      mockUseAccountsStore()
      const navigate = jest.fn()
      const mockN = useNavigate as jest.Mock
      mockN.mockReturnValue(navigate)

      const mockT = useTransactionsList as jest.Mock
      mockT.mockReturnValue(
        createMockSendTxList(
          [mockSendEventId],
          mockUserAddr,
          ILLEGAL_IDENTITY,
          [mockUuid, mockDestinationAddr],
        ),
      )

      renderChildren(<MigrationForm />)
      await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
      await advanceStep(
        "destinationAddress",
        advanceFromAmountToDestinationStep,
      )
      await advanceStep(
        "confirmation-box",
        advanceFromDestinationAddrToConfirmationStep,
      )
      const nextBtn = screen.getByTestId("next-btn")
      await act(async () => await userEvent.click(nextBtn))

      expect(navigate).toHaveBeenCalledWith(
        `/token-migration-portal/migration-history/${mockSendEventId}`,
      )
    })
    it("start to finish to start", async () => {
      mockUseBalance()
      renderChildren(<MigrationForm />)
      await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
      await advanceStep(
        "destinationAddress",
        advanceFromAmountToDestinationStep,
      )
      await advanceStep(
        "confirmation-box",
        advanceFromDestinationAddrToConfirmationStep,
      )

      await backStep("destinationAddress")
      await backStep("assetSymbol")
      await backStep("address")
    })
  })
  describe("Account flow", () => {
    beforeEach(() => {
      mockEmptyUseTransactionList()
      mockUseCreateSendTransaction()
      mockUseBlock()
      mockUseCombinedAccountInfo()
      mockUseGetAccountInfo()
      mockUseAccountsStore()
    })
    it("should advance to the user address step", async () => {
      renderChildren(<MigrationForm />)
      await advanceStep("userAddress", advanceFromAddressToUserAddressStep)
    })
    it("should advance to the amount/asset step", async () => {
      mockUseBalance()
      renderChildren(<MigrationForm />)
      await advanceStep("userAddress", advanceFromAddressToUserAddressStep)
      await advanceStep("assetSymbol", advanceFromUserAddressToAmountStep)
    })
    it("should advance to the destination address step", async () => {
      mockUseBalance()
      renderChildren(<MigrationForm />)
      await advanceStep("userAddress", advanceFromAddressToUserAddressStep)
      await advanceStep("assetSymbol", advanceFromUserAddressToAmountStep)
      await advanceStep(
        "destinationAddress",
        advanceFromAmountToDestinationStep,
      )
      await advanceStep(
        "confirmation-box",
        advanceFromDestinationAddrToConfirmationStep,
      )
      expect(await screen.findByTestId("account-info")).toBeInTheDocument()
    })
    it("should process the transaction", async () => {
      mockUseBalance()
      const navigate = jest.fn()
      const mockN = useNavigate as jest.Mock
      mockN.mockReturnValue(navigate)
      const mockSendTx = createMockSendTxList(
        [mockSendEventId],
        mockUserAddr,
        ILLEGAL_IDENTITY,
        [mockUuid, mockDestinationAddr],
      )
      const mockMultisigSubmitTx = createMockMultisigSubmitTxList(
        [mockMultisigEventId],
        mockAccountAddr,
        mockToken,
        mockUserAddr,
        mockSendTx,
      )

      const mockT = useTransactionsList as jest.Mock
      mockT.mockReturnValue(mockMultisigSubmitTx)

      renderChildren(<MigrationForm />)
      await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
      await advanceStep(
        "destinationAddress",
        advanceFromAmountToDestinationStep,
      )
      await advanceStep(
        "confirmation-box",
        advanceFromDestinationAddrToConfirmationStep,
      )
      const nextBtn = screen.getByTestId("next-btn")
      await act(async () => await userEvent.click(nextBtn))

      expect(navigate).toHaveBeenCalledWith(
        `/token-migration-portal/migration-history/${mockMultisigEventId}`,
      )
    })
  })
  describe("Error handling", () => {
    beforeEach(() => {
      mockEmptyUseTransactionList()
      mockUseCreateSendTransaction()
      mockUseBlock()
      mockUseCombinedAccountInfo()
    })
    it("should display an error message when the user address is not selected", async () => {
      const mock = useCombinedAccountInfo as jest.Mock
      mock.mockReturnValue(new Map())
      renderChildren(<MigrationForm />)
      await advanceStep("error-address")
    })
    it("should display an error message when the asset symbol is not selected", async () => {
      mockUseBalance()
      renderChildren(<MigrationForm />)
      await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
      await advanceStep("error-assetAmount")
    })
    it("should display an error message when the asset symbol is selected and the asset amount is not selected", async () => {
      mockUseBalance()
      renderChildren(<MigrationForm />)
      await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
      const symbolField = screen.getByTestId("assetSymbol")
      await act(async () => await userEvent.selectOptions(symbolField, ["MFX"]))
      await advanceStep("error-assetAmount")
    })
    it("should display an error message when the asset symbol is selected and the balance is over the maximum", async () => {
      mockUseBalance()
      renderChildren(<MigrationForm />)
      await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
      const amountField = screen.getByTestId("assetAmount")
      await act(async () => await userEvent.type(amountField, "5"))
      await advanceStep("error-assetAmount")
    })
    it("should display an error message when the destination address is not entered", async () => {
      mockUseBalance()
      renderChildren(<MigrationForm />)
      await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
      await advanceStep(
        "destinationAddress",
        advanceFromAmountToDestinationStep,
      )
      await advanceStep("error-destinationAddress")
    })
    it("should display an error message when the destination address is not valid", async () => {
      mockUseBalance()
      renderChildren(<MigrationForm />)
      await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
      await advanceStep(
        "destinationAddress",
        advanceFromAmountToDestinationStep,
      )
      const destinationField = screen.getByTestId("destinationAddress")
      await act(
        async () =>
          await userEvent.type(destinationField, "invalidDestination"),
      )
      await advanceStep("error-destinationAddress")
    })
  })
})

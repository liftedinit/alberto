import { MigrationForm } from "features/token-migration"
import { renderChildren } from "test/render"
import { useTransactionsList } from "features/transactions"
import { screen, fireEvent } from "@testing-library/react"
import { useCombinedAccountInfo } from "features/accounts/queries"
import userEvent from "@testing-library/user-event"
import { act } from "react"
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
  createMockMultisigSubmitTxList,
  createMockSendTxList,
  mockUseMigrationWhitelist,
} from "features/token-migration/test-utils/mocks"

vi.mock("features/accounts/queries", () => ({
  useCombinedAccountInfo: vi.fn(),
}))

vi.mock("features/transactions", () => ({
  useTransactionsList: vi.fn(),
  useCreateSendTxn: vi.fn(() => ({
    mutateAsync: vi.fn(),
  })),
  useMultisigSubmitTransaction: vi.fn(() => ({
    mutateAsync: vi.fn(),
  })),
}))

vi.mock("features/balances", () => ({
  useBalances: vi.fn(),
}))

vi.mock("features/accounts", async () => {
  const actual = await vi.importActual<typeof import("features/accounts")>("features/accounts")
  return {
    ...actual,
    useAccountsStore: vi.fn(() => ({
      getId: vi.fn(),
    })),
    useGetAccountInfo: vi.fn(),
    useMultisigSubmit: vi.fn(() => ({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
    })),
  }
})

vi.mock("crypto", async () => {
  const actual = await vi.importActual<typeof import("crypto")>("crypto")
  return {
    ...actual,
    randomUUID: vi.fn(() => mockUuid),
  }
})

vi.mock("features/network/queries", () => ({
  useGetBlock: vi.fn(),
}))

vi.mock("features/token-migration/queries", () => ({
  useMigrationWhitelist: vi.fn(),
}))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

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

  // Use fireEvent for select to trigger onChange handler
  await act(async () => {
    fireEvent.change(symbolField, { target: { value: mockAsset.identity } })
  })

  // Wait for the balance to be displayed (indicates state has updated)
  await screen.findByText(/Balance:\s*2/i)

  // Click the "Max" button to set the value via Formik's setFieldValue
  // This ensures validation uses the updated currentMaxAmount
  const maxButton = screen.getByRole("button", { name: /max/i })
  await act(async () => await userEvent.click(maxButton))
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
  afterEach(vi.clearAllMocks)

  describe("User flow", () => {
    beforeEach(() => {
      mockEmptyUseTransactionList()
      mockUseCreateSendTransaction()
      mockUseBlock()
      mockUseCombinedAccountInfo()
      mockUseMigrationWhitelist()
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
    }, 15000)
    it("should advance to the destination address step", async () => {
      mockUseBalance()
      renderChildren(<MigrationForm />)
      await advanceStep("assetSymbol", advanceFromAddressToAmountStep)
      await advanceStep(
        "destinationAddress",
        advanceFromAmountToDestinationStep,
      )
    }, 15000)
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
    }, 15000)
    it("should process the transaction", async () => {
      mockUseBalance()
      mockUseAccountsStore()
      const navigate = vi.fn()
      const mockN = useNavigate as vi.Mock
      mockN.mockReturnValue(navigate)

      const mockT = useTransactionsList as vi.Mock
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
      expect(nextBtn).toBeDisabled()
      const checkbox = screen.getByRole("checkbox")
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).not.toBeChecked()
      await act(async () => await userEvent.click(checkbox))
      expect(checkbox).toBeChecked()
      expect(nextBtn).toBeEnabled()
      await act(async () => await userEvent.click(nextBtn))

      expect(navigate).toHaveBeenCalledWith(
        `/token-migration-portal/migration-history/${mockSendEventId}`,
      )
    }, 15000)
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
    }, 15000)
  })
  describe("Account flow", () => {
    beforeEach(() => {
      mockEmptyUseTransactionList()
      mockUseCreateSendTransaction()
      mockUseBlock()
      mockUseCombinedAccountInfo()
      mockUseGetAccountInfo()
      mockUseAccountsStore()
      mockUseMigrationWhitelist()
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
    }, 15000)
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
    }, 15000)
    it("should process the transaction", async () => {
      mockUseBalance()
      const navigate = vi.fn()
      const mockN = useNavigate as vi.Mock
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

      const mockT = useTransactionsList as vi.Mock
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
      expect(nextBtn).toBeDisabled()
      const checkbox = screen.getByRole("checkbox")
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).not.toBeChecked()
      await act(async () => await userEvent.click(checkbox))
      expect(checkbox).toBeChecked()
      expect(nextBtn).toBeEnabled()
      await act(async () => await userEvent.click(nextBtn))

      expect(navigate).toHaveBeenCalledWith(
        `/token-migration-portal/migration-history/${mockMultisigEventId}`,
      )
    }, 15000)
  })
  describe("Error handling", () => {
    beforeEach(() => {
      mockEmptyUseTransactionList()
      mockUseCreateSendTransaction()
      mockUseBlock()
      mockUseCombinedAccountInfo()
      mockUseMigrationWhitelist()
    })
    it("should display an error message when the user address is not selected", async () => {
      const mock = useCombinedAccountInfo as vi.Mock
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
      await act(async () => {
        fireEvent.change(symbolField, { target: { value: mockAsset.identity } })
      })
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

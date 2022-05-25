import {
  render,
  screen,
  within,
  waitForElementToBeRemoved,
  fireEvent,
  userEvent,
} from "test/test-utils"
import { toast } from "components"
import { useBalances } from "features/balances/queries"
import { useSendToken } from "features/transactions/queries"
import { useAddressText } from "components/address-text"
import { SendAsset } from "views"
import { amountFormatter } from "helper/common"

jest.mock("components/address-text", () => {
  return {
    ...jest.requireActual("components/address-text"),
    useAddressText: jest.fn(),
  }
})
jest.mock("features/balances/queries")
jest.mock("features/transactions/queries")

const ownedAssetsWithBalance = [
  { symbol: "ABC", balance: BigInt(1000000), identity: "mabc" },
  { symbol: "DEF", balance: BigInt(2000000), identity: "mdef" },
  { symbol: "GHI", balance: BigInt(3000000), identity: "mghi" },
]
describe("<SendAsset />", () => {
  beforeEach(async () => {
    toast.closeAll()
    const toasts = screen.queryAllByRole("listitem")
    await Promise.all(toasts.map(toasts => waitForElementToBeRemoved(toasts)))
    useBalances.mockImplementation(() => ({
      isFetching: false,
      isError: false,
      errors: [],
      data: { ownedAssetsWithBalance },
    }))
    useSendToken.mockImplementation(() => ({
      sendToken: jest.fn((_, opts) => {
        opts?.onSuccess()
      }),
    }))
    useAddressText.mockImplementation(val => {
      return "m111"
    })
  })
  it("should show a list of owned tokens and balance when selecting a token", () => {
    setupSendAsset()
    const selectTokenBtn = screen.getByRole("button", { name: /select token/i })
    userEvent.click(selectTokenBtn)
    const tokensList = screen.getAllByRole("button", { name: /select asset/i })
    expect(tokensList.length).toBe(3)
    ownedAssetsWithBalance.forEach(asset => {
      expect(
        screen.getByText(new RegExp(asset.symbol, "i")),
      ).toBeInTheDocument()
      expect(
        screen.getByText(amountFormatter(asset.balance)),
      ).toBeInTheDocument()
    })
  })
  it("should be able to send tokens", async () => {
    setupSendAsset()
    const toInput = screen.getByRole("textbox", { name: /to/i })
    const nextBtn = screen.getByRole("button", { name: /next/i })
    const amountInput = screen.getByRole("textbox", { name: /amount/i })
    const selectTokenBtn = screen.getByRole("button", { name: /select token/i })
    userEvent.click(selectTokenBtn)
    const assets = screen.getAllByLabelText(/select asset/i)
    const firstAsset = assets[0]
    const { symbol: selectedAssetSymbol } = ownedAssetsWithBalance[0]
    const form = screen.getByRole("form")
    userEvent.click(firstAsset)
    expect(
      within(form).getByText(new RegExp(selectedAssetSymbol, "i")),
    ).toBeInTheDocument()
    expect(
      within(form).getByText(new RegExp("balance: 0.001", "i")),
    ).toBeInTheDocument()

    fireEvent.change(toInput, {
      target: { value: "oaffbahksdwaqeenayy2gxke32hgb7aq4ao4wt745lsfs6wijp" },
    })
    fireEvent.change(amountInput, {
      target: { value: "5" },
    })
    userEvent.click(nextBtn)
    const confirmCheckbox = screen.getByRole("checkbox", {
      name: /confirm transaction/i,
    })
    const sendBtn = screen.getByRole("button", { name: /send/i })
    expect(sendBtn).toBeDisabled()
    userEvent.click(confirmCheckbox)
    expect(sendBtn).not.toBeDisabled()
    userEvent.click(sendBtn)
    expect(await screen.findByText(/next/i)).toBeInTheDocument()
    expect(toInput).toHaveValue("")
    expect(amountInput).toHaveValue("")
    expect(selectTokenBtn).toBeInTheDocument()
  })
})

function setupSendAsset() {
  render(<SendAsset />)
}

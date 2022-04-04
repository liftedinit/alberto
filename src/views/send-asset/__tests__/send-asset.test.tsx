import { render, screen, within, fireEvent, userEvent } from "test/test-utils"
import { useBalances } from "features/balances/queries"
import { useCreateTransaction } from "features/transactions/queries"
import { SendAsset } from "views"

jest.mock("features/balances/queries", () => ({
  useBalances: jest.fn(),
}))

jest.mock("features/transactions/queries", () => ({
  useCreateTransaction: jest.fn(),
}))

const ownedAssetsWithBalance = [
  { symbol: "ABC", balance: BigInt(1000000), identity: "oabc" },
  { symbol: "DEF", balance: BigInt(2000000), identity: "odef" },
  { symbol: "GHI", balance: BigInt(3000000), identity: "oghi" },
]
describe("<SendAsset />", () => {
  beforeEach(() => {
    useBalances.mockImplementation(() => ({
      isFetching: false,
      isError: false,
      errors: [],
      data: { ownedAssetsWithBalance },
    }))
    useCreateTransaction.mockImplementation(() => ({
      createTransaction: jest.fn((_, opts) => {
        opts?.onSuccess()
      }),
    }))
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
        screen.getByText(new RegExp(asset.balance.toLocaleString(), "i")),
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
    const { symbol: selectedAssetSymbol, balance: selectedAssetBalance } =
      ownedAssetsWithBalance[0]
    const form = screen.getByRole("form")
    userEvent.click(firstAsset)
    expect(
      within(form).getByText(new RegExp(selectedAssetSymbol, "i")),
    ).toBeInTheDocument()
    expect(
      within(form).getByText(
        new RegExp("balance: " + selectedAssetBalance.toLocaleString(), "i"),
      ),
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

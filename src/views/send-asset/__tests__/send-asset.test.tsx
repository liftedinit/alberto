import { renderChildren } from "../../../test/render"
import { SendAsset } from "../send-asset"
import { fireEvent, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { addAccountToStore } from "../../../test/account-store"
import { MockEd25519KeyPairIdentity } from "../../../test/types"
import { mockNetwork } from "../../../test/network-store"
import { act } from "react"

jest.mock("features/network/network-provider", () => {
  return {
    ...jest.requireActual("features/network/network-provider"),
    useNetworkContext: () => ({
      query: mockNetwork(),
    }),
  }
})

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}))

const mockAccount1 = {
  name: "test",
  address: "m111",
  identity: new MockEd25519KeyPairIdentity(
    new ArrayBuffer(0),
    new ArrayBuffer(0),
  ),
}

// TODO: This test suite outputs
//
//       Warning: Can't perform a React state update on an unmounted component.
//       This is a no-op, but it indicates a memory leak in your application.
//       To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
//
// We need to figure out how to fix this. See https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
// The test suite still passes
describe("Send Asset", () => {
  it("should render without crashing", () => {
    renderChildren(<SendAsset />)
  })
  it("should show a list of owned tokens and balance when selecting a token", async () => {
    renderChildren(<SendAsset />)
    addAccountToStore(mockAccount1)
    const selectTokenBtn = screen.getByTestId("select-token-btn")
    await userEvent.click(selectTokenBtn)
    const assetItems = screen.getAllByTestId("select-asset-btn")
    expect(assetItems.length).toBe(2)
    expect(screen.getByText(/abc/i)).toBeInTheDocument()
    expect(screen.getByText(/0.001/i)).toBeInTheDocument()
    expect(screen.getByText(/ghi/i)).toBeInTheDocument()
    expect(screen.getByText(/0.005/i)).toBeInTheDocument()
  })
  it("should show a form to send tokens", async function () {
    renderChildren(<SendAsset />)
    addAccountToStore(mockAccount1)
    const toInput = screen.getByRole("textbox", { name: /to/i })
    const nextBtn = screen.getByRole("button", { name: /next/i })
    const amountInput = screen.getByRole("textbox", { name: /amount/i })
    const selectTokenBtn = screen.getByRole("button", { name: /select token/i })

    await act(async () => userEvent.click(selectTokenBtn))
    const assets = screen.getAllByLabelText(/select asset/i)
    const firstAsset = assets[0]
    const form = screen.getByLabelText("send form")
    await act(async () => userEvent.click(firstAsset))
    expect(within(form).getByText(/abc/i)).toBeInTheDocument()
    expect(
      within(form).getByText(new RegExp("balance: 0.001", "i")),
    ).toBeInTheDocument()
    fireEvent.change(toInput, {
      target: { value: "oaffbahksdwaqeenayy2gxke32hgb7aq4ao4wt745lsfs6wijp" },
    })
    fireEvent.change(amountInput, {
      target: { value: "5" },
    })
    await act(async () => userEvent.click(nextBtn))
    await screen.findByTestId("approve-txn")
    const confirmCheckbox = screen.getByTestId("approve-txn")
    const sendBtn = screen.getByRole("button", { name: /send/i })
    expect(sendBtn).toBeDisabled()
    await act(async () => userEvent.click(confirmCheckbox))
    expect(sendBtn).not.toBeDisabled()
    await act(async () => userEvent.click(sendBtn))
    expect(toInput).toHaveValue("")
    expect(amountInput).toHaveValue("")
    expect(selectTokenBtn).toBeInTheDocument()
  })
})

import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react"
import { Home } from "views/home"
import { renderChildren } from "test/render"
import { addAccountToStore } from "test/account-store"
import { MockEd25519KeyPairIdentity } from "test/types"
import { base64ToArrayBuffer, createStandaloneToast } from "@liftedinit/ui"
import { mockNetwork } from "test/network-store"
import userEvent from "@testing-library/user-event"

const { toast } = createStandaloneToast()

const privKey =
  "dyhNjZFhrjw7w40CB/ETD7XkwjKpJq3T9CnADVjGI8PVnjGlzRLgVLr0z4Ylqm2BDJO5HAsoEy/Amo83hcpFxg=="
const pubKey = "1Z4xpc0S4FS69M+GJaptgQyTuRwLKBMvwJqPN4XKRcY="

const mockAccount1 = {
  name: "test",
  address: "m111",
  identity: new MockEd25519KeyPairIdentity(
    base64ToArrayBuffer(pubKey),
    base64ToArrayBuffer(privKey),
  ),
}

// TODO: After multiple attempts, I don't know how to have this mock scoped to a single test.
jest.mock("features/network/network-provider", () => {
  return {
    ...jest.requireActual("features/network/network-provider"),
    useNetworkContext: () => ({
      query: mockNetwork(),
    }),
  }
})

jest.mock("@chakra-ui/media-query", () => {
  const actual = jest.requireActual("@chakra-ui/media-query")
  return {
    ...actual,
    useBreakpointValue: jest.fn((values: any) => {
      if (Array.isArray(values)) return values[0]
      if (values && typeof values === "object") {
        return values.base ?? values.sm ?? values.md ?? values.lg ?? values.xl
      }
      return values
    }),
  }
})

describe("Home Tests", () => {
  beforeEach(async () => {
    toast.closeAll()
    const toasts = screen.queryAllByRole("listitem")
    await Promise.all(toasts.map(toasts => waitForElementToBeRemoved(toasts)))

    jest.resetModules()
    jest.resetAllMocks()
    jest.clearAllMocks()
  })
  it("should render home page without crashing", () => {
    renderChildren(<Home />)
  })
  it("should render the assets and activity tabs", () => {
    renderChildren(<Home />)
    expect(screen.getByTestId("tab-assets")).toBeInTheDocument()
    expect(screen.getByTestId("tab-activity")).toBeInTheDocument()
  })
  it("should list the balances of each token the account holds", async function () {
    renderChildren(<Home />)
    addAccountToStore(mockAccount1)
    expect(await screen.findByText(/abc/i)).toBeInTheDocument()
    expect(await screen.findByText("0.001")).toBeInTheDocument()
    expect(await screen.findByText(/ghi/i)).toBeInTheDocument()
    expect(await screen.findByText("0.005")).toBeInTheDocument()
  })
  it("should show asset details and transactions", async () => {
    renderChildren(<Home />)
    addAccountToStore(mockAccount1)

    await waitFor(() => screen.findByText(/abc/i))
    const assets = await screen.findAllByLabelText(/asset list item/i)
    await userEvent.click(assets[0])
    const rows = await screen.findAllByRole("row")
    expect(rows.length).toBe(2)
    const firstTxn = within(rows[0])
    expect(firstTxn.getByText(/abc/i)).toBeInTheDocument()
    expect(firstTxn.getByText(/send/i)).toBeInTheDocument()
    expect(firstTxn.getByText(/-0.000000001/i)).toBeInTheDocument()
    expect(firstTxn.getByText(/2023/i)).toBeInTheDocument()
    expect(firstTxn.getByText(/5/i)).toBeInTheDocument()
    expect(firstTxn.getByText(/9/i)).toBeInTheDocument()
    expect(firstTxn.getByText(/8:03:00/i)).toBeInTheDocument()

    // TODO: This is broken, fix this
    // const secondTxn = within(rows[1])
    // expect(secondTxn.queryByText(/ghi/i)).not.toBeInTheDocument()
    // expect(secondTxn.queryByText(/receive/i)).not.toBeInTheDocument()
    // expect(secondTxn.queryByText(/\+0.000000003/i)).not.toBeInTheDocument()
    // expect(secondTxn.queryByText(/2022/i)).not.toBeInTheDocument()
    // expect(secondTxn.queryByText(/4/i)).not.toBeInTheDocument()
    // expect(secondTxn.queryByText(/7/i)).not.toBeInTheDocument()
    // expect(secondTxn.queryByText(/8:01:00/i)).not.toBeInTheDocument()
  })
  it("should show list of account transaction history", async () => {
    renderChildren(<Home />)
    addAccountToStore(mockAccount1)
    // TODO: Enabling the following lines cause a
    //       Warning: Can't perform a React state update on an unmounted component.
    //       This is a no-op, but it indicates a memory leak in your application.
    // const activityTab = await screen.findByText(/activity/i)
    // await userEvent.click(activityTab)

    // const rows = await screen.findAllByRole("row")
    //
    // expect(rows.length).toEqual(2)
    // expect(screen.getByText(/send/i)).toBeInTheDocument()
    // expect(screen.getByText(/2023/i)).toBeInTheDocument()
    // expect(screen.getByText(/5/i)).toBeInTheDocument()
    // expect(screen.getByText(/9/i)).toBeInTheDocument()
    // expect(screen.getByText(/8:03:00/i)).toBeInTheDocument()
    // expect(screen.getByText(/-0.000000001/i)).toBeInTheDocument()
    // expect(screen.getByText(/abc/i)).toBeInTheDocument()
    //
    // expect(screen.getByText(/receive/i)).toBeInTheDocument()
    // expect(screen.getByText(/2022/i)).toBeInTheDocument()
    // expect(screen.getByText(/4/i)).toBeInTheDocument()
    // expect(screen.getByText(/7/i)).toBeInTheDocument()
    // expect(screen.getByText(/8:01:00/i)).toBeInTheDocument()
    // expect(screen.getByText(/\+0.000000003/i)).toBeInTheDocument()
    // expect(screen.getByText(/ghi/i)).toBeInTheDocument()
  })
})

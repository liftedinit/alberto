import {
  act,
  render,
  screen,
  within,
  waitFor,
  userEvent,
} from "test/test-utils"
import * as useIsBaseBreakpoint from "@liftedinit/ui"
import { useNetworkContext } from "features/network/network-provider"
import { useAccountsStore } from "features/accounts"
import { Home } from "views/home"
import {
  AnonymousIdentity,
  Ed25519KeyPairIdentity,
  Event,
} from "@liftedinit/many-js"
import { base64ToArrayBuffer } from "@liftedinit/ui"

jest.mock("features/network/network-provider", () => {
  return {
    ...jest.requireActual("features/network/network-provider"),
    useNetworkContext: jest.fn(),
  }
})

jest.mock("@liftedinit/ui/address-text", () => {
  return {
    ...jest.requireActual("@liftedinit/ui/address-text"),
    useAddressText: jest.fn(),
  }
})

const mockUseIsBaseBreakpoint = jest.spyOn(
  useIsBaseBreakpoint,
  "useIsBaseBreakpoint",
)

const mockLedgerInfo = {
  symbols: new Map([
    ["mabc", "ABC"],
    ["mdef", "DEF"],
    ["mghi", "GHI"],
  ]),
}

const mockListData = {
  count: 4,
  events: [
    {
      id: Buffer.from("1"),
      type: "send",
      from: "m111",
      to: "m888",
      time: makeTimeInSecs("2022-04-08T08:03:00"),
      symbolAddress: "mabc",
      amount: BigInt(1),
    },
    {
      id: Buffer.from("2"),
      type: "send",
      from: "m888",
      to: "ma111",
      time: makeTimeInSecs("2022-04-08T08:01:00"),
      symbolAddress: "mghi",
      amount: BigInt(3),
    },
  ],
}

const mockBalanceData = {
  balances: new Map([
    ["mabc", BigInt(1000000)],
    ["mghi", BigInt(5000000)],
  ]),
}

function getMockNetwork() {
  return {
    url: "mock/api",
    events: {
      list: jest.fn().mockImplementation(async () => {
        return mockListData
      }),
    },
    ledger: {
      info: jest.fn().mockImplementation(async () => {
        return mockLedgerInfo
      }),

      balance: jest.fn().mockImplementation(async () => {
        return mockBalanceData
      }),
    },
  }
}

let mockNetwork = getMockNetwork()
describe("home page", () => {
  beforeEach(() => {
    mockNetwork = getMockNetwork()
    useNetworkContext.mockImplementation(() => {
      return [mockNetwork]
    })
  })
  it("should render tabs for assets balance and transaction history", async () => {
    mockUseIsBaseBreakpoint.mockImplementation(() => true)
    const { assetsTab, activityTab } = setupHome()
    expect(assetsTab).toBeInTheDocument()
    expect(activityTab).toBeInTheDocument()
  })
  it("should list the balances of each token the account holds", async function () {
    setupHome()

    expect(screen.getByText(/abc/i)).toBeInTheDocument()
    expect(screen.getByText("0.001")).toBeInTheDocument()

    expect(screen.getByText(/ghi/i)).toBeInTheDocument()
    expect(screen.getByText("0.005")).toBeInTheDocument()
  })
  it("should display an error message", async () => {
    mockNetwork.ledger.balance = jest.fn().mockImplementation(async arg => {
      throw "an unexpected error occurred"
    })
    setupHome()
    expect(
      await screen.findByText(/an unexpected error occurred/i),
    ).toBeInTheDocument()
  })
  it("should show asset details and transactions", async () => {
    mockNetwork.events.list = jest.fn().mockImplementationOnce(async () => {
      return {
        count: 2,
        events: [
          {
            id: Buffer.from("1"),
            type: "send",
            from: "m111",
            to: "m888",
            time: makeTimeInSecs("2022-04-08T08:03:00"),
            symbolAddress: "mabc",
            amount: BigInt(1),
          },
          {
            id: Buffer.from("2"),
            type: "send",
            from: "m888",
            to: "m111",
            time: makeTimeInSecs("2022-04-08T08:01:00"),
            symbolAddress: "mabc",
            amount: BigInt(3),
          },
        ] as unknown as Event[],
      }
    })

    setupHome()
    await waitFor(() => screen.findByText(/abc/i))
    const assets = await screen.findAllByLabelText(/asset list item/i)
    userEvent.click(assets[0])
    expect(screen.getByText(/0.001 abc/i)).toBeInTheDocument()
    await waitFor(() =>
      expect(mockNetwork.events.list).toHaveBeenCalledTimes(1),
    )
    const rows = await screen.findAllByRole("row")
    expect(rows.length).toBe(2)

    const firstTxn = within(rows[0])
    expect(firstTxn.getByText(/abc/i)).toBeInTheDocument()
    expect(firstTxn.getByText(/send/i)).toBeInTheDocument()
    expect(firstTxn.getByText(/-0.000000001/i)).toBeInTheDocument()
    expect(firstTxn.getByText(/4\/8\/2022, 8:03:00 AM/i)).toBeInTheDocument()

    const secondTxn = within(rows[1])
    expect(secondTxn.getByText(/abc/i)).toBeInTheDocument()
    expect(secondTxn.getByText(/receive/i)).toBeInTheDocument()
    expect(secondTxn.getByText(/\+0.000000003/i)).toBeInTheDocument()
    expect(secondTxn.getByText(/4\/8\/2022, 8:01:00 AM/i)).toBeInTheDocument()
  })
  it("should show list of account transaction history", async () => {
    const { activityTab } = setupHome()
    userEvent.click(activityTab)

    await waitFor(() =>
      expect(mockNetwork.events.list).toHaveBeenCalledTimes(1),
    )

    const rows = screen.getAllByRole("row")

    expect(rows.length).toEqual(2)
    expect(screen.getByText(/send/i)).toBeInTheDocument()
    expect(screen.getByText(/4\/8\/2022, 8:03:00 AM/i)).toBeInTheDocument()
    expect(screen.getByText(/-0.000000001/i)).toBeInTheDocument()
    expect(screen.getByText(/abc/i)).toBeInTheDocument()

    expect(screen.getByText(/receive/i)).toBeInTheDocument()
    expect(screen.getByText(/4\/8\/2022, 8:01:00 AM/i)).toBeInTheDocument()
    expect(screen.getByText(/\+0.000000003/i)).toBeInTheDocument()
    expect(screen.getByText(/ghi/i)).toBeInTheDocument()
  })
})

const privKeyB64 =
  "dyhNjZFhrjw7w40CB/ETD7XkwjKpJq3T9CnADVjGI8PVnjGlzRLgVLr0z4Ylqm2BDJO5HAsoEy/Amo83hcpFxg=="
const pubKeyB64 = "1Z4xpc0S4FS69M+GJaptgQyTuRwLKBMvwJqPN4XKRcY="

const privateKey = base64ToArrayBuffer(privKeyB64)
const pubKey = base64ToArrayBuffer(pubKeyB64)
function setupHome() {
  render(<Home />)
  act(() =>
    useAccountsStore.setState(s => {
      return {
        ...s,
        activeId: 1,
        byId: new Map([
          [0, { name: "anon", identity: new AnonymousIdentity() }],
          [
            1,
            {
              name: "test",
              address: "m111",
              identity: new Ed25519KeyPairIdentity(pubKey, privateKey),
            },
          ],
        ]),
      }
    }),
  )
  const tabs = screen.getByRole("tablist")
  const assetsTab = within(tabs).getByText(/assets/i)
  const activityTab = within(tabs).getByText(/activity/i)

  return {
    assetsTab,
    activityTab,
  }
}

function makeTimeInSecs(dateStr: string) {
  return new Date(dateStr).getTime() / 1000
}

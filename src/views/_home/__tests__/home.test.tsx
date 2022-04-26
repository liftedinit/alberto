import {
  act,
  render,
  screen,
  within,
  waitFor,
  userEvent,
} from "test/test-utils"
import * as useIsBaseBreakpoint from "hooks/useIsBaseBreakpoint"
import { useNetworkContext } from "features/network/network-provider"
import { useAccountsStore } from "features/accounts"
import { displayId } from "helper/common"

import { Home } from "views/_home"
import { Ed25519KeyPairIdentity, Transaction } from "many-js"

jest.mock("features/network/network-provider", () => {
  return {
    ...jest.requireActual("features/network/network-provider"),
    useNetworkContext: jest.fn(),
  }
})

jest.mock("helper/common", () => {
  const actual = jest.requireActual("helper/common")
  return {
    ...actual,
    displayId: jest.fn(),
  }
})

jest.mock("helper/common")

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
  transactions: [
    {
      id: 1,
      type: "send",
      from: "m111",
      to: "m888",
      time: new Date("2022-04-08T08:03:00"),
      symbolAddress: "mabc",
      amount: BigInt(1),
    },
    {
      id: 2,
      type: "send",
      from: "m888",
      to: "ma111",
      time: new Date("2022-04-08T08:01:00"),
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
    ledger: {
      info: jest.fn().mockImplementation(async () => {
        return mockLedgerInfo
      }),
      list: jest.fn().mockImplementation(async () => {
        return mockListData
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
    displayId.mockImplementation(() => {
      return {
        short: "<m111>",
        full: "m111",
      }
    })
    mockNetwork = getMockNetwork()
    useNetworkContext.mockImplementation(() => {
      return mockNetwork
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
    useNetworkContext.mockImplementationOnce(() => {
      const mock = getMockNetwork()
      return {
        url: mock.url,
        ledger: {
          ...mock.ledger,
          balance: jest.fn().mockImplementation(async () => {
            throw "an unexpected error occurred"
          }),
        },
      }
    })
    setupHome()
    expect(
      await screen.findByText(/an unexpected error occurred/i),
    ).toBeInTheDocument()
  })
  it("should show asset details and transactions", async () => {
    mockNetwork.ledger.list = jest.fn().mockImplementationOnce(async () => {
      return {
        count: 2,
        transactions: [
          {
            id: 1,
            type: "send",
            from: "m111",
            to: "m888",
            time: new Date("2022-04-08T08:03:00"),
            symbolAddress: "mabc",
            amount: BigInt(1),
          },
          {
            id: 2,
            type: "send",
            from: "m888",
            to: "m111",
            time: new Date("2022-04-08T08:01:00"),
            symbolAddress: "mabc",
            amount: BigInt(3),
          },
        ] as unknown as Transaction[],
      }
    })

    setupHome()
    await waitFor(() => screen.findByText(/abc/i))
    const assets = await screen.findAllByLabelText(/asset list item/i)
    userEvent.click(assets[0])
    expect(screen.getByText(/0.001 abc/i)).toBeInTheDocument()
    await waitFor(() =>
      expect(mockNetwork.ledger.list).toHaveBeenCalledTimes(1),
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
      expect(mockNetwork.ledger.list).toHaveBeenCalledTimes(1),
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

function setupHome() {
  render(<Home />)
  act(() =>
    useAccountsStore.setState(s => {
      return {
        ...s,
        activeId: 1,
        byId: new Map([
          ...Array.from(s.byId),
          [
            1,
            {
              name: "test-account",
              identity: new Ed25519KeyPairIdentity(
                new Uint8Array(Buffer.from("pubKey")),
                new Uint8Array(Buffer.from("privateKey")),
              ),
              // keys: {
              //   privateKey: new Uint8Array(Buffer.from("privKey")),
              //   publicKey: new Uint8Array(Buffer.from("pubKey")),
              // },
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

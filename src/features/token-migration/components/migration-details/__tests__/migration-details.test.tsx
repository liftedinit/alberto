import { renderChildren } from "test/render"
import { MigrationDetails } from "features/token-migration/components/migration-details"
import { screen } from "@testing-library/react"
import { hexToArrBuf } from "test/buffer"
import { useParams } from "react-router-dom"
import { useSingleTransactionList } from "features/transactions/queries"
import { useGetBlock } from "features/network/queries"

const mockEventId = "6a9900000001"
const mockTxHash = "012345"
const blockHeight = 27291

const createMockEvent = (eventId: string) => {
  return {
    id: hexToArrBuf(eventId),
    type: "send",
    time: 1234567890,
    amount: BigInt(123),
    from: "m111",
    to: "m222",
    symbolAddress: "mabc",
    _id: eventId,
    _time: 1234567890000,
  }
}
const createMockSingleTxList = (transactions: any[]) => {
  return {
    data: {
      count: transactions.length,
      transactions,
    },
    isLoading: false,
    isError: false,
    error: undefined,
  }
}

const createMockTxList = (eventId: string[]) => {
  const transactions = eventId.map(id => createMockEvent(id))
  return createMockSingleTxList(transactions)
}

const createMockTx = (txHash: string) => {
  return {
    transactionIdentifier: {
      hash: hexToArrBuf(txHash),
    },
  }
}
const createMockBlockResult = (transactions: any[]) => {
  return {
    data: {
      transactions,
    },
    isLoading: false,
    isError: false,
    error: undefined,
  }
}
const createMockBlock = (txHashs: string[]) => {
  const transactions = txHashs.map(hash => createMockTx(hash))
  return createMockBlockResult(transactions)
}

const mockSingleTxListError = {
  data: undefined,
  isLoading: false,
  isError: true,
  error: "this is an error",
}

const mockBlockError = {
  data: {
    transactions: [],
  },
  isLoading: false,
  isError: true,
  error: "this is another error",
}

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}))

jest.mock("features/transactions/queries", () => {
  return {
    ...jest.requireActual("features/transactions/queries"),
    useSingleTransactionList: jest.fn(),
  }
})

jest.mock("features/network/queries", () => {
  return {
    ...jest.requireActual("features/network/queries"),
    useGetBlock: jest.fn(),
  }
})

// TODO: Test New Chain details when implemented
describe("MigrationDetails", () => {
  beforeEach(() => {
    useParams.mockImplementation(() => ({ eventId: mockEventId }))
    useGetBlock.mockImplementation(() => createMockBlock([mockTxHash]))
    useSingleTransactionList.mockImplementation(() =>
      createMockTxList([mockEventId]),
    )
  })
  afterEach(() => {
    useParams.mockRestore()
    useGetBlock.mockRestore()
    useSingleTransactionList.mockRestore()
  })
  it("renders MigrationDetails with MANY migration details", () => {
    renderChildren(<MigrationDetails />)
    expect(screen.getByTestId("migration-details")).toBeInTheDocument()
    expect(screen.getByText(mockEventId)).toBeInTheDocument()
    expect(screen.getByText(blockHeight)).toBeInTheDocument()
    expect(screen.getByText(mockTxHash)).toBeInTheDocument()
  })
  it("renders an error message when eventId is invalid", () => {
    useParams.mockImplementation(() => ({ eventId: "invalid_id" }))
    renderChildren(<MigrationDetails />)
    expect(screen.getByText("Invalid event id")).toBeInTheDocument()
  })
  it("renders an error message when transactionList query fails", () => {
    useSingleTransactionList.mockImplementation(() => mockSingleTxListError)
    renderChildren(<MigrationDetails />)
    expect(
      screen.getByText("Unable to fetch transaction: this is an error"),
    ).toBeInTheDocument()
  })
  it("renders an error message when block query fails", () => {
    useGetBlock.mockImplementation(() => mockBlockError)
    renderChildren(<MigrationDetails />)
    expect(
      screen.getByText("No transactions found in the block."),
    ).toBeInTheDocument()
  })
  it("renders an error message when eventNumber is out of bounds", () => {
    useParams.mockImplementation(() => ({ eventId: "6a9900000005" }))
    useSingleTransactionList.mockImplementation(() =>
      createMockTxList(["6a9900000005"]),
    )

    renderChildren(<MigrationDetails />)
    expect(
      screen.getByText(
        "Event number 5 is out of bounds for the transactions array.",
      ),
    ).toBeInTheDocument()
  })
})

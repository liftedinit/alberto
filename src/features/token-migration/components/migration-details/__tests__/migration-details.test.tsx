import { renderChildren } from "test/render"
import { MigrationDetails } from "features/token-migration/components/migration-details"
import { screen } from "@testing-library/react"
import { hexToArrBuf } from "test/buffer"
import { useParams } from "react-router-dom"
import { useSingleTransactionList } from "features/transactions/queries"
import { useGetBlock } from "features/network/queries"

const blockHeight = 27291

const createMockData = () => {
  const mockId = "6a9900000001"
  const mockHash = "012345"
  const mockHash2 = "012344"
  const mockTxHash = "012341"

  return {
    eventId: mockId,
    txHash: mockTxHash,
    arrBufId: hexToArrBuf(mockId),
    arrBufHash: hexToArrBuf(mockHash),
    arrBufHash2: hexToArrBuf(mockHash2),
    arrBufTxHash: hexToArrBuf(mockTxHash),
  }
}
const mockData = createMockData()

const mockSingleTxList = {
  data: {
    count: 1,
    transactions: [
      {
        id: mockData.arrBufId,
        type: "send",
        time: 1234567890,
        amount: BigInt(123),
        from: "m111",
        to: "m222",
        symbolAddress: "mabc",
        _id: mockData.eventId,
        _time: 1234567890000,
      },
    ],
  },
  isLoading: false,
  isError: false,
  error: undefined,
}

const mockSingleTxListError = {
  data: undefined,
  isLoading: false,
  isError: true,
  error: "this is an error",
}

const mockBlock = {
  data: {
    blockIdentifier: {
      hash: mockData.arrBufHash,
      height: blockHeight,
    },
    parentBlockIdentifier: {
      hash: mockData.arrBufHash2,
      height: blockHeight - 1,
    },
    totalTxs: 1,
    transactions: [
      {
        transactionIdentifier: {
          hash: mockData.arrBufTxHash,
        },
      },
    ],
  },
  isLoading: false,
  isError: false,
  error: undefined,
}

const mockBlockError = {
  data: {
    transactions: [],
  },
  isLoading: false,
  isError: true,
  error: "this is another error",
}

const mockBlockError2 = {
  data: {
    transactions: [
      {
        transactionIdentifier: {
          hash: mockData.arrBufTxHash,
        },
      },
    ],
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
    useParams.mockImplementation(() => ({ eventId: mockData.eventId }))
    useGetBlock.mockImplementation(() => mockBlock)
    useSingleTransactionList.mockImplementation(() => mockSingleTxList)
  })
  afterEach(() => {
    useParams.mockRestore()
    useGetBlock.mockRestore()
    useSingleTransactionList.mockRestore()
  })
  it("renders MigrationDetails with MANY migration details", () => {
    renderChildren(<MigrationDetails />)
    expect(screen.getByTestId("migration-details")).toBeInTheDocument()
    expect(screen.getByText(mockData.eventId)).toBeInTheDocument()
    expect(screen.getByText(blockHeight)).toBeInTheDocument()
    expect(screen.getByText(mockData.txHash)).toBeInTheDocument()
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
  // TODO: Fix
  // it("renders an error message when eventNumber is out of bounds", () => {
  //   useParams.mockImplementation(() => ({ eventId: "6a9900000005" }))
  //   renderChildren(<MigrationDetails />)
  //   expect(
  //     screen.getByText(
  //       "Event number 5 is out of bounds for the transactions array.",
  //     ),
  //   ).toBeInTheDocument()
  // })
})

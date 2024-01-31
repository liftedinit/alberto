import { renderChildren } from "test/render"
import { MigrationDetails } from "features/token-migration/components/migration-details"
import { screen } from "@testing-library/react"
import { hexToArrBuf } from "test/buffer"

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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    eventId: mockData.eventId,
  }),
}))

jest.mock("features/transactions/queries", () => {
  return {
    ...jest.requireActual("features/transactions/queries"),
    useSingleTransactionList: () => ({
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
    }),
  }
})

jest.mock("features/network/queries", () => {
  return {
    ...jest.requireActual("features/network/queries"),
    useGetBlock: () => ({
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
    }),
  }
})

// TODO: Test New Chain details when implemented
describe("MigrationDetails", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("renders MigrationDetails with MANY migration details", () => {
    renderChildren(<MigrationDetails />)
    expect(screen.getByTestId("migration-details")).toBeInTheDocument()
    expect(screen.getByText(mockData.eventId)).toBeInTheDocument()
    expect(screen.getByText(blockHeight)).toBeInTheDocument()
    expect(screen.getByText(mockData.txHash)).toBeInTheDocument()
  })
})

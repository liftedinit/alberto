import { renderChildren } from "test/render"
import { MigrationDetails } from "features/token-migration/components/migration-details"
import { screen, waitFor } from "@testing-library/react"
import { useParams } from "react-router-dom"
import { useSingleTransactionList } from "features/transactions/queries"
import { useGetBlock } from "features/network/queries"
import { mockBlockError } from "test/block"
import {
  createMockSendTxList,
  mockBlockHeight,
  mockFetchTalib,
  mockFetchTalibError,
  mockHash,
  mockHash2,
  mockInvalidEventId,
  mockLongBlockHeight,
  mockLongEventId,
  mockSendEventId,
  mockSingleTxListError,
  mockUseBlock,
  mockUseParams,
  mockUserAddr,
  mockUserAddr2,
  mockUseSingleSendTransactionList,
} from "features/token-migration/test-utils/mocks"

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

global.fetch = jest.fn()

describe("MigrationDetails", () => {
  beforeEach(() => {
    mockUseParams({ eventId: mockSendEventId })
    mockUseBlock(mockHash)
    mockUseSingleSendTransactionList(
      [mockSendEventId],
      mockUserAddr,
      mockUserAddr2,
    )
  })
  afterEach(jest.clearAllMocks)
  it("renders MigrationDetails with MANY and MANIFEST migration details", async () => {
    mockFetchTalib()
    renderChildren(<MigrationDetails />)
    expect(screen.getByTestId("migration-details")).toBeInTheDocument()
    expect(screen.getByText(mockSendEventId)).toBeInTheDocument()
    expect(screen.getByText(mockBlockHeight)).toBeInTheDocument()
    expect(screen.getByText(mockHash)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(mockHash2)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText("Completed")).toBeInTheDocument()
    })
  })
  it("renders MigrationDetails with long event id and big block height", () => {
    mockUseParams({ eventId: mockLongEventId })
    mockUseSingleSendTransactionList(
      [mockLongEventId],
      mockUserAddr,
      mockUserAddr2,
    )
    renderChildren(<MigrationDetails />)
    expect(screen.getByTestId("migration-details")).toBeInTheDocument()
    expect(screen.getByText(mockLongEventId)).toBeInTheDocument()
    expect(screen.getByText(mockLongBlockHeight)).toBeInTheDocument()
    expect(screen.getByText(mockHash)).toBeInTheDocument()
  })
  it("renders an error message when eventId is invalid", () => {
    const mock = useParams as jest.Mock
    mock.mockImplementation(() => ({ eventId: "invalid_id" }))
    renderChildren(<MigrationDetails />)
    expect(screen.getByText("Invalid event id")).toBeInTheDocument()
  })
  it("renders an error message when transactionList query fails", () => {
    const mock = useSingleTransactionList as jest.Mock
    mock.mockImplementation(() => mockSingleTxListError)
    renderChildren(<MigrationDetails />)
    expect(
      screen.getByText("Unable to fetch transaction: this is an error"),
    ).toBeInTheDocument()
  })
  it("renders an error message when block query fails", () => {
    const mock = useGetBlock as jest.Mock
    mock.mockImplementation(() => mockBlockError)
    renderChildren(<MigrationDetails />)
    expect(
      screen.getByText("No transactions found in the block."),
    ).toBeInTheDocument()
  })
  it("renders an error message when eventNumber is out of bounds", () => {
    const mockP = useParams as jest.Mock
    mockP.mockImplementation(() => ({ eventId: mockInvalidEventId }))
    const mockT = useSingleTransactionList as jest.Mock
    mockT.mockImplementation(() =>
      createMockSendTxList([mockInvalidEventId], mockUserAddr, mockUserAddr2),
    )

    renderChildren(<MigrationDetails />)
    expect(
      screen.getByText(
        "Event number 5 is out of bounds for the transactions array.",
      ),
    ).toBeInTheDocument()
  })
  it("renders an error message when MANIFEST polling fails", async () => {
    mockFetchTalibError()
    renderChildren(<MigrationDetails />)
    await waitFor(() => {
      expect(screen.getByText("this is an error")).toBeInTheDocument()
    })
  })
})

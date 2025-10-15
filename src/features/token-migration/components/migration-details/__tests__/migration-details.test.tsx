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

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useParams: vi.fn(),
  }
})

vi.mock("features/transactions/queries", async () => {
  const actual = await vi.importActual("features/transactions/queries")
  return {
    ...actual,
    useSingleTransactionList: vi.fn(),
  }
})

vi.mock("features/network/queries", async () => {
  const actual = await vi.importActual("features/network/queries")
  return {
    ...actual,
    useGetBlock: vi.fn(),
  }
})

global.fetch = vi.fn()

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
  afterEach(vi.clearAllMocks)
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
    const mock = useParams as vi.Mock
    mock.mockImplementation(() => ({ eventId: "invalid_id" }))
    renderChildren(<MigrationDetails />)
    expect(screen.getByText("Invalid event id")).toBeInTheDocument()
  })
  it("renders an error message when transactionList query fails", () => {
    const mock = useSingleTransactionList as vi.Mock
    mock.mockImplementation(() => mockSingleTxListError)
    renderChildren(<MigrationDetails />)
    expect(
      screen.getByText("Unable to fetch transaction: this is an error"),
    ).toBeInTheDocument()
  })
  it("renders an error message when block query fails", () => {
    const mock = useGetBlock as vi.Mock
    mock.mockImplementation(() => mockBlockError)
    renderChildren(<MigrationDetails />)
    expect(
      screen.getByText("No transactions found in the block."),
    ).toBeInTheDocument()
  })
  it("renders an error message when eventNumber is out of bounds", () => {
    const mockP = useParams as vi.Mock
    mockP.mockImplementation(() => ({ eventId: mockInvalidEventId }))
    const mockT = useSingleTransactionList as vi.Mock
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

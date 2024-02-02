import { renderChildren } from "test/render"
import { MigrationDetails } from "features/token-migration/components/migration-details"
import { screen } from "@testing-library/react"
import { useParams } from "react-router-dom"
import { useSingleTransactionList } from "features/transactions/queries"
import { useGetBlock } from "features/network/queries"
import { createMockSendTxList, mockSingleTxListError } from "test/transactions"
import { mockBlockError } from "test/block"
import {
  mockUseBlock,
  mockUseParams,
  mockUseSingleSendTransactionList,
} from "features/token-migration/test-utils/mocks"

const mockEventId = "6a9900000001"
const mockTxHash = "012345"
const blockHeight = 27291

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
    mockUseParams({ eventId: mockEventId })
    mockUseBlock(mockTxHash)
    mockUseSingleSendTransactionList([mockEventId], "m111", "m222")
  })
  afterEach(jest.clearAllMocks)
  it("renders MigrationDetails with MANY migration details", () => {
    renderChildren(<MigrationDetails />)
    expect(screen.getByTestId("migration-details")).toBeInTheDocument()
    expect(screen.getByText(mockEventId)).toBeInTheDocument()
    expect(screen.getByText(blockHeight)).toBeInTheDocument()
    expect(screen.getByText(mockTxHash)).toBeInTheDocument()
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
    mockP.mockImplementation(() => ({ eventId: "6a9900000005" }))
    const mockT = useSingleTransactionList as jest.Mock
    mockT.mockImplementation(() =>
      createMockSendTxList(["6a9900000005"], "m111", "m222"),
    )

    renderChildren(<MigrationDetails />)
    expect(
      screen.getByText(
        "Event number 5 is out of bounds for the transactions array.",
      ),
    ).toBeInTheDocument()
  })
})

import { renderChildren } from "test/render"
import { MigrationList } from "../migration-list"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  mockUseCombinedAccountInfo,
  mockUseGetMultisigTxnInfo,
  mockUseTransactionList,
} from "features/token-migration/test-utils/mocks"
import { act } from "react"

vi.mock("features/transactions", async () => {
  const actual = await vi.importActual<any>("features/transactions")
  return {
    ...actual,
    useTransactionsList: vi.fn(),
  }
})

vi.mock("features/accounts/queries", async () => {
  const actual = await vi.importActual<any>("features/accounts/queries")
  return {
    ...actual,
    useCombinedAccountInfo: vi.fn(),
  }
})

vi.mock("features/accounts/api/get-multisig-txn-info", () => ({
  useGetMultisigTxnInfo: vi.fn(),
}))

const mockUserAddr = "mah7vxcf3l4aklypotgjmwy36y2kk2metkqidcizo4jnfttild"

describe("MigrationList", () => {
  afterEach(vi.clearAllMocks)

  beforeEach(() => {
    mockUseTransactionList()
    mockUseCombinedAccountInfo()
    mockUseGetMultisigTxnInfo()
  })
  it("renders", () => {
    renderChildren(<MigrationList />)
  })
  it("select account", async () => {
    renderChildren(<MigrationList />)
    const options = screen.getAllByTestId("address-option")
    expect(options).toHaveLength(2)
    const addressField = screen.getByTestId("account-select")
    await act(
      async () => await userEvent.selectOptions(addressField, [mockUserAddr]),
    )
  })
})

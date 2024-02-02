import { useAccountsStore, useGetAccountInfo } from "features/accounts"
import { IdTypes } from "features/token-migration/components/migration-form/types"
import { useCombinedAccountInfo } from "features/accounts/queries"
import { useBalances } from "features/balances"
import { createMockTx, createMockSendTxList } from "test/transactions"
import { useGetBlock } from "features/network/queries"
import {
  useCreateSendTxn,
  useSingleTransactionList,
  useTransactionsList,
} from "features/transactions"
import { useParams } from "react-router-dom"

const mockUserAddr = "mah7vxcf3l4aklypotgjmwy36y2kk2metkqidcizo4jnfttild"
const mockAccountAddr =
  "mqd7vxcf3l4aklypotgjmwy36y2kk2metkqidcizo4jnfttiaaaaqkt"
export const mockUseAccountsStore = () => {
  const mockById = new Map([
    [
      0,
      {
        name: "mockUser",
        identity: new ArrayBuffer(0),
        address: mockUserAddr,
      },
    ],
  ])
  const mockGetId = jest.fn().mockReturnValue(1)
  const mockSetActiveId = jest.fn().mockResolvedValue(1)
  const mock = useAccountsStore as unknown as jest.Mock
  mock.mockImplementation(() => ({
    getId: mockGetId,
    setActiveId: mockSetActiveId,
    byId: mockById,
  }))
}
export const mockUseCombinedAccountInfo = () => {
  const mockCombinedAccountInfo = new Map([
    // A User
    [
      mockUserAddr,
      {
        idType: IdTypes.USER,
        address: mockUserAddr,
        id: 1,
        name: "mockUser",
      },
    ],
    // An Account
    [
      mockAccountAddr,
      {
        idType: IdTypes.ACCOUNT,
        address: mockAccountAddr,
        name: "mockAccount",
      },
    ],
  ])
  const mock = useCombinedAccountInfo as unknown as jest.Mock
  mock.mockImplementation(() => mockCombinedAccountInfo)
}
export const mockUseGetAccountInfo = () => {
  const mock = useGetAccountInfo as unknown as jest.Mock
  mock.mockImplementation(() => ({
    data: {
      accountInfo: {
        description: "mockAccount",
        roles: new Map([[mockUserAddr, "foobar"]]),
      },
    },
    isSuccess: true,
  }))
}
export const mockUseBalance = () => {
  const createAsset = (identity: string, symbol: string, balance: bigint) => ({
    identity,
    symbol,
    balance,
  })

  const mockBalances = {
    data: {
      ownedAssetsWithBalance: [createAsset("1", "MFX", BigInt(2000000000))],
    },
    isLoading: false,
    isError: false,
    errors: undefined,
  }

  const mock = useBalances as unknown as jest.Mock
  mock.mockImplementation(() => mockBalances)
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
export const createMockBlock = (txHashs: string[]) => {
  const transactions = txHashs.map(hash => createMockTx(hash))
  return createMockBlockResult(transactions)
}
export const mockUseBlock = (hash: string = "012345") => {
  const mock = useGetBlock as unknown as jest.Mock
  mock.mockImplementation(() => createMockBlock([hash]))
}
export const mockUseCreateSendTransaction = () => {
  const mock = useCreateSendTxn as unknown as jest.Mock
  mock.mockReturnValue({
    mutateAsync: jest.fn().mockResolvedValue(true),
  })
}

export const mockUseTransactionList = () => {
  const mock = useTransactionsList as unknown as jest.Mock
  mock.mockImplementation(() => ({
    data: {
      transactions: [],
    },
    isLoading: false,
    isError: false,
    error: undefined,
  }))
}
export const mockUseParams = (params: Record<string, string>) => {
  const mock = useParams as unknown as jest.Mock
  mock.mockImplementation(() => params)
}

export const mockUseSingleSendTransactionList = (
  eventIds: string[],
  from: string,
  to: string,
) => {
  const mock = useSingleTransactionList as unknown as jest.Mock
  mock.mockImplementation(() => createMockSendTxList(eventIds, from, to))
}

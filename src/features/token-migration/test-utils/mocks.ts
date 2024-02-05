import {
  useAccountsStore,
  useGetAccountInfo,
  useGetMultisigTxnInfo,
} from "features/accounts"
import { IdTypes } from "features/token-migration/components/migration-form/types"
import { useCombinedAccountInfo } from "features/accounts/queries"
import { useBalances } from "features/balances"
import {
  createMockTx,
  createMockSendTxList,
  createMockSendEvent,
  createMockMultisigSubmitEvent,
} from "test/transactions"
import { useGetBlock } from "features/network/queries"
import {
  useCreateSendTxn,
  useSingleTransactionList,
  useTransactionsList,
} from "features/transactions"
import { useParams } from "react-router-dom"
import { ILLEGAL_IDENTITY } from "@liftedinit/many-js"

const mockUserName = "mockUser"
const mockAccountName = "mockAccount"
const mockRole = "foobar"
export const mockAsset = {
  identity: "1",
  symbol: "MFX",
  balance: BigInt(2000000000),
}
export const mockBlockHeight = 27291
export const mockHash = "012345"
const mockIdentity = new ArrayBuffer(0)
export const mockUserAddr = "mah7vxcf3l4aklypotgjmwy36y2kk2metkqidcizo4jnfttild"
export const mockUserAddr2 =
  "magvnquj3jvni3du234yuldy3i5jxjqtyxrxjspb47l5wylaim"
export const mockAccountAddr =
  "mqd7vxcf3l4aklypotgjmwy36y2kk2metkqidcizo4jnfttiaaaaqkt"
export const mockDestinationAddr =
  "manifest194dewhjkvt4rw8ccwnz36ljfuhe8r4kzs84sl9"
export const mockSendEventId = "6a9900000001"
export const mockInvalidEventId = "6a9900000005"
export const mockUuid = "09b10a35-74e4-4936-b428-efa16c097578"
const mockSendTx = createMockSendEvent(
  mockSendEventId,
  mockUserAddr,
  ILLEGAL_IDENTITY,
  [mockUuid, mockDestinationAddr],
)
export const mockToken = "010101"
export const mockMultisigEventId = "6a9900000002"
const mockMultiSigTx = createMockMultisigSubmitEvent(
  mockMultisigEventId,
  mockAccountAddr,
  mockToken,
  mockUserAddr,
  mockSendTx,
)

const createMock = (hook: unknown, implementation: any) => {
  const mock = hook as jest.Mock
  mock.mockImplementation(() => implementation)
}

export const mockUseAccountsStore = () => {
  const mockById = new Map([
    [
      0,
      {
        name: mockUserName,
        identity: mockIdentity,
        address: mockUserAddr,
      },
    ],
  ])
  const mockGetId = jest.fn().mockReturnValue(1)
  const mockSetActiveId = jest.fn().mockResolvedValue(1)
  createMock(useAccountsStore, {
    getId: mockGetId,
    setActiveId: mockSetActiveId,
    byId: mockById,
  })
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
        name: mockUserName,
      },
    ],
    // An Account
    [
      mockAccountAddr,
      {
        idType: IdTypes.ACCOUNT,
        address: mockAccountAddr,
        name: mockAccountName,
      },
    ],
  ])
  createMock(useCombinedAccountInfo, mockCombinedAccountInfo)
}
export const mockUseGetAccountInfo = () => {
  createMock(useGetAccountInfo, {
    data: {
      accountInfo: {
        description: mockAccountName,
        roles: new Map([[mockUserAddr, mockRole]]),
      },
    },
    isSuccess: true,
  })
}
export const mockUseBalance = () => {
  createMock(useBalances, {
    data: {
      ownedAssetsWithBalance: [mockAsset],
    },
    isLoading: false,
    isError: false,
    errors: undefined,
  })
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
export const mockUseBlock = (hash: string = mockHash) => {
  createMock(useGetBlock, createMockBlock([hash]))
}
export const mockUseCreateSendTransaction = () => {
  createMock(useCreateSendTxn, {
    mutateAsync: jest.fn().mockResolvedValue(true),
  })
}

export const mockEmptyUseTransactionList = () => {
  createMock(useTransactionsList, {
    data: {
      transactions: [],
    },
    isLoading: false,
    isError: false,
    error: undefined,
  })
}

export const mockUseTransactionList = () => {
  createMock(useTransactionsList, {
    data: {
      transactions: [mockSendTx, mockMultiSigTx],
    },
    isLoading: false,
    isError: false,
    error: undefined,
  })
}

export const mockUseGetMultisigTxnInfo = () => {
  createMock(useGetMultisigTxnInfo, {
    data: {
      info: [mockMultiSigTx],
    },
    isLoading: false,
    isError: false,
    error: undefined,
  })
}

export const mockUseParams = (params: Record<string, string>) =>
  createMock(useParams, params)

export const mockUseSingleSendTransactionList = (
  eventIds: string[],
  from: string,
  to: string,
) =>
  createMock(useSingleTransactionList, createMockSendTxList(eventIds, from, to))

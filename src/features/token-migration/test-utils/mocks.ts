import {
  useAccountsStore,
  useGetAccountInfo,
  useGetMultisigTxnInfo,
} from "features/accounts"
import { IdTypes } from "features/token-migration/components/migration-form/types"
import { useCombinedAccountInfo } from "features/accounts/queries"
import { useBalances } from "features/balances"
import { useGetBlock } from "features/network/queries"
import {
  useCreateSendTxn,
  useSingleTransactionList,
  useTransactionsList,
} from "features/transactions"
import { useParams } from "react-router-dom"
import { EventType, ILLEGAL_IDENTITY } from "@liftedinit/many-js"
import { hexToArrBuf } from "../../../test/buffer"

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
export const mockHash2 = "6789ab"
export const mockDateTime = "2021-09-01T00:00:00Z"
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
export const mockLongEventId = "568bd900000001"
export const mockLongBlockHeight = 5671899
export const mockUuid = "09b10a35-74e4-4936-b428-efa16c097578"
export const createMockSendEvent = (
  eventId: string,
  from: string,
  to: string,
) => {
  return {
    id: hexToArrBuf(eventId),
    type: EventType.send,
    time: 1234567890,
    amount: BigInt(123),
    from,
    to,
    memo: [mockUuid, mockDestinationAddr],
    symbolAddress: "mabc",
    _id: eventId,
    _time: 1234567890000,
  }
}
export const createMockMultisigSubmitEvent = (
  eventId: string,
  account: string,
  token: string,
  submitter: string,
  transaction: any,
) => {
  return {
    // BaseEvent
    id: hexToArrBuf(eventId),
    type: EventType.accountMultisigSubmit,
    time: 1234567890,

    // MultisigEvent
    account,
    token: hexToArrBuf(token),

    // MultisigSubmitEvent
    executeAutomatically: true,
    memo: [mockUuid, mockDestinationAddr],
    submitter,
    threshold: 1,
    expireDate: 2234567890,
    transaction,

    // ProcessedEvent
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
export const createMockSendTxList = (
  eventId: string[],
  from: string,
  to: string,
) => {
  const transactions = eventId.map(id => createMockSendEvent(id, from, to))
  return createMockSingleTxList(transactions)
}
export const createMockMultisigSubmitTxList = (
  eventId: string[],
  account: string,
  token: string,
  submitter: string,
  transaction: any,
) => {
  const transactions = eventId.map(id =>
    createMockMultisigSubmitEvent(id, account, token, submitter, transaction),
  )
  return createMockSingleTxList(transactions)
}
export const createMockTx = (txHash: string) => {
  return {
    transactionIdentifier: {
      hash: hexToArrBuf(txHash),
    },
  }
}
export const mockSingleTxListError = {
  data: undefined,
  isLoading: false,
  isError: true,
  error: "this is an error",
}
const mockSendTx = createMockSendEvent(
  mockSendEventId,
  mockUserAddr,
  ILLEGAL_IDENTITY,
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

export const mockFetchTalib = () => {
  createMock(
    fetch,
    Promise.resolve(
      new Response(
        JSON.stringify({
          status: 4,
          uuid: mockUuid,
          manifestAddress: mockDestinationAddr,
          manifestDateTime: mockDateTime,
          manifestHash: mockHash2,
          error: undefined,
        }),
      ),
    ),
  )
}

export const mockFetchTalibError = () => {
  createMock(
    fetch,
    Promise.resolve(
      new Response(
        JSON.stringify({
          status: 5,
          uuid: mockUuid,
          manifestAddress: mockDestinationAddr,
          manifestDateTime: undefined,
          manifestHash: undefined,
          error: "this is an error",
        }),
      ),
    ),
  )
}

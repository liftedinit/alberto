import { hexToArrBuf } from "./buffer"
import { EventType } from "@liftedinit/many-js"

export const createMockSendEvent = (
  eventId: string,
  from: string,
  to: string,
  memo?: string[],
) => {
  return {
    id: hexToArrBuf(eventId),
    type: EventType.send,
    time: 1234567890,
    amount: BigInt(123),
    from,
    to,
    memo,
    symbolAddress: "mabc",
    _id: eventId,
    _time: 1234567890000,
  }
}

const createMockMultisigSubmitEvent = (
  eventId: string,
  account: string,
  token: string,
  submitter: string,
  transaction: any,
  memo?: string[],
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
    memo,
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
  memo?: string[],
) => {
  const transactions = eventId.map(id =>
    createMockSendEvent(id, from, to, memo),
  )
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

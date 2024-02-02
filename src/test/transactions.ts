import { hexToArrBuf } from "./buffer"

const createMockEvent = (
  eventId: string,
  from: string,
  to: string,
  memo?: string[],
) => {
  return {
    id: hexToArrBuf(eventId),
    type: "send",
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
export const createMockTxList = (
  eventId: string[],
  from: string,
  to: string,
  memo?: string[],
) => {
  const transactions = eventId.map(id => createMockEvent(id, from, to, memo))
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

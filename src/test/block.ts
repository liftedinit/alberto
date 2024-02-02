import { createMockTx } from "./transactions"

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
export const mockBlockError = {
  data: {
    transactions: [],
  },
  isLoading: false,
  isError: true,
  error: "this is another error",
}

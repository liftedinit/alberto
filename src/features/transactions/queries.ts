import React from "react"
import { useLedgerInfo, useNetworkContext } from "features/network"
import { BoundType, OrderType } from "many-js"
import type { ListFilterArgs, Transaction } from "many-js"
import { useMutation, useQuery, useQueryClient } from "react-query"

export function useSendToken() {
  const [, network] = useNetworkContext()
  const queryClient = useQueryClient()
  const m = useMutation(
    async (variables: { to: string; amount: bigint; symbol: string }) => {
      const { to, amount, symbol } = variables
      return network?.ledger.send(to, amount, symbol)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["balances"])
        queryClient.invalidateQueries(["transactions", "list"])
      },
    },
  )
  return {
    isSuccess: m.isSuccess,
    isLoading: m.isLoading,
    isError: m.isError,
    sendToken: m.mutate,
  }
}

export function useTransactionsList({
  address,
  filter = {},
  count: reqCount = 11,
}: {
  address: string
  filter?: ListFilterArgs
  count?: number
}) {
  const [network] = useNetworkContext()
  const [txnIds, setTxnIds] = React.useState<Uint8Array[]>([])

  const filters = {
    ...filter,
    ...(txnIds.length > 0
      ? {
          txnIdRange: [
            undefined,
            { boundType: BoundType.inclusive, value: txnIds[0] },
          ],
        }
      : {}),
    accounts: address,
  }

  const ledgerInfo = useLedgerInfo({ address })

  const q = useQuery({
    queryKey: ["transactions", "list", filters, address, network?.url],
    queryFn: async () =>
      await network?.ledger?.list({
        filters,
        count: reqCount,
        order: OrderType.descending,
      }),
    enabled: !!network?.url && !!address,
    keepPreviousData: true,
  })

  const transactionsWithSymbols = (q?.data?.transactions ?? []).map(
    (t: Transaction) => ({
      ...t,
      symbol: ledgerInfo?.data?.symbols?.get(t.symbolAddress) ?? "",
    }),
  )
  const respCount = transactionsWithSymbols.length
  const hasNextPage = respCount === reqCount
  const visibleTransactionsWithSymbols = hasNextPage
    ? transactionsWithSymbols.slice(0, respCount - 1)
    : transactionsWithSymbols

  return {
    isPreviousData: q.isPreviousData,
    error: q.error,
    isError: q.isError,
    isLoading: q.isLoading || q.isFetching,
    hasNextPage,
    currPageCount: txnIds.length,
    prevBtnProps: {
      disabled: txnIds.length === 0,
      onClick: () => {
        setTxnIds(s => s.slice(1))
      },
    },
    nextBtnProps: {
      disabled: !hasNextPage,
      onClick: () => {
        const lastTxn = transactionsWithSymbols[reqCount - 1]
        setTxnIds(s => [lastTxn.id, ...s])
      },
    },
    data: {
      count: q?.data?.count ?? 0,
      transactions: visibleTransactionsWithSymbols,
    },
  }
}

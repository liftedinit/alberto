import React from "react"
import { useLedgerInfo } from "features/network"
import { Network } from "many-js"
import type { ListFilterArgs, Transaction } from "many-js"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { BoundType } from "many-js/dist/network/modules/ledger/ledger"

export function useSendToken({ network }: { network?: Network }) {
  const queryClient = useQueryClient()
  const m = useMutation(
    async (variables: { to: string; amount: bigint; symbol: string }) => {
      // todo: precision decimal places
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
  network,
  accountPublicKey,
  filter = {},
  count: reqCount = 4,
}: {
  network?: Network
  accountPublicKey: string
  filter?: ListFilterArgs
  count?: number
}) {
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
    accounts: accountPublicKey,
  }

  const ledgerInfo = useLedgerInfo({ network, accountPublicKey })

  const q = useQuery({
    queryKey: ["transactions", "list", filters, accountPublicKey, network?.url],
    queryFn: async () =>
      await network?.ledger?.list({ filters, count: reqCount }),
    enabled: !!network?.url && !!accountPublicKey,
    keepPreviousData: true,
  })

  const transactionsWithSymbols = (q?.data?.transactions ?? []).map(
    (t: Transaction) => ({
      ...t,
      symbol: ledgerInfo?.data?.symbols?.get(t.symbolIdentity) ?? "",
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

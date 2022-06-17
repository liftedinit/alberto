import React from "react"
import { useNetworkContext } from "features/network"
import { BoundType, OrderType } from "many-js"
import { ListFilterArgs, Transaction } from "many-js"
import { useMutation, useQuery, useQueryClient } from "react-query"

export function useCreateSendTxn() {
  const [, network] = useNetworkContext()
  const queryClient = useQueryClient()
  return useMutation<
    unknown,
    Error,
    { to: string; amount: bigint; symbol: string }
  >(
    async (vars: {
      from?: string
      to: string
      amount: bigint
      symbol: string
    }) => {
      const res = network?.ledger.send(vars)
      return res
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["balances"])
        queryClient.invalidateQueries(["transactions", "list"])
      },
    },
  )
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

  const q = useQuery({
    queryKey: ["transactions", "list", address, filters, network?.url],
    queryFn: async () =>
      await network?.ledger?.list({
        filters,
        count: reqCount,
        order: OrderType.descending,
      }),
    enabled: !!network?.url && !!address,
    keepPreviousData: true,
  })

  const txnsWithId = (q?.data?.transactions ?? []).map((t: Transaction) => ({
    ...t,
    _id: Buffer.from(t.id).toString("base64"),
  }))
  const respCount = txnsWithId.length
  const hasNextPage = respCount === reqCount
  const visibleTxnsWithId = hasNextPage
    ? txnsWithId.slice(0, respCount - 1)
    : txnsWithId
  return {
    isPreviousData: q.isPreviousData,
    error: q.error,
    isError: q.isError,
    isLoading: q.isFetching,
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
        const lastTxn = txnsWithId[reqCount - 1]
        setTxnIds(s => [lastTxn.id, ...s])
      },
    },
    data: {
      count: q?.data?.count ?? 0,
      transactions: visibleTxnsWithId ?? [],
    },
  }
}
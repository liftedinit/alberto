import React from "react"
import { useNetworkContext } from "features/network"
import { BoundType, EventsListResponse, OrderType } from "many-js"
import { ListFilterArgs, Event } from "many-js"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { arrayBufferToBase64 } from "helper/convert"

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
        queryClient.invalidateQueries(["events", "list"])
      },
    },
  )
}

export function useTransactionsList({
  address,
  filter = {},
  count: reqCount = 11,
}: {
  address?: string
  filter?: Omit<ListFilterArgs, "txnIdRange"> & {
    txnIdRange?: { boundType: BoundType; value: ArrayBuffer }[]
  }
  count?: number
}) {
  const [network] = useNetworkContext()
  const [txnIds, setTxnIds] = React.useState<ArrayBuffer[]>([])

  const filters = {
    accounts: address,
    ...(txnIds.length > 0
      ? {
          txnIdRange: [
            undefined,
            { boundType: BoundType.inclusive, value: txnIds[0] },
          ],
        }
      : {}),
    ...filter,
  }

  const q = useQuery<EventsListResponse, Error>({
    queryKey: ["events", "list", address, filters, network?.url],
    queryFn: async () =>
      await network?.events?.list({
        filters,
        count: reqCount,
        order: OrderType.descending,
      }),
    enabled: !!network?.url,
    keepPreviousData: true,
  })

  const txnsWithId = (q?.data?.events ?? []).map((t: Event) => ({
    ...t,
    _id: arrayBufferToBase64(t.id),
  }))
  const respCount = txnsWithId.length
  const hasNextPage = respCount === reqCount
  const visibleTxnsWithId = hasNextPage
    ? txnsWithId.slice(0, respCount - 1)
    : txnsWithId
  return {
    isPreviousData: q.isPreviousData,
    error: q?.error?.message,
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

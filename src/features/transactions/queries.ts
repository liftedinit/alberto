import React from "react"
import { useNetworkContext, useNetworkStore } from "features/network"
import {
  AnonymousIdentity,
  BoundType,
  Event,
  EventsListResponse,
  ListFilterArgs,
  ListOrderType,
  Network,
} from "@liftedinit/many-js"
import { useMutation, useQueries, useQuery, useQueryClient } from "react-query"
import { arrayBufferToBase64 } from "@liftedinit/ui"

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
        order: ListOrderType.descending,
      }),
    enabled: !!network?.url,
    keepPreviousData: true,
  })

  const activeNetwork = useNetworkStore(state => state.getActiveNetwork())
  const legacyNetworksParams = useNetworkStore(state =>
    state.getLegacyNetworks(),
  )
  const legacyNetworks = legacyNetworksParams.map(legacyNetworkParam => {
    const url = legacyNetworkParam?.url || ""
    return new Network(url, new AnonymousIdentity())
  })
  const queries = legacyNetworks.map(legacyNetwork => ({
    queryKey: ["events", "list", address, filters, legacyNetwork?.url],
    queryFn: async () =>
      await legacyNetwork?.events?.list({
        filters,
        count: reqCount,
        order: ListOrderType.descending,
      }),
    enabled:
      activeNetwork?.name?.toLowerCase() === "manifest" && !!legacyNetwork?.url,
    keepPreviousData: true,
  }))

  const results = useQueries<EventsListResponse[]>({ queries: queries })

  const qData = Array.isArray(q.data) ? q.data : []
  const resultsData = results.map(result => result.data ?? []).flat()
  const allData = [...qData, ...resultsData]

  const txnsWithId = allData.map((t: Event) => ({
    ...t,
    time: t.time * 1000,
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
      count: allData.length,
      transactions: visibleTxnsWithId ?? [],
    },
  }
}

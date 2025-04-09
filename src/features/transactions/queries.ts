import { useNetworkContext } from "features/network"
import {
  BoundType,
  Event,
  ListOrderType,
  Memo,
  Network,
} from "@liftedinit/many-js"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useMemo, useState } from "react"
import { arrayBufferToBase64 } from "@liftedinit/ui"

const PAGE_SIZE = 11
const MAX_PAGE_SIZE = 100

export function useCreateSendTxn() {
  const { command: network } = useNetworkContext()
  const queryClient = useQueryClient()
  return useMutation<
    unknown,
    Error,
    { from?: string; to: string; amount: bigint; symbol: string; memo?: Memo }
  >(
    async (vars: {
      from?: string
      to: string
      amount: bigint
      symbol: string
      memo?: Memo
    }) => {
      return network?.ledger.send(vars)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["balances"])
        queryClient.invalidateQueries(["events", "list"])
        queryClient.invalidateQueries(["block", "get"])
      },
    },
  )
}

const processRawEvents = (events?: Event[]) => {
  return (events?.map((t: Event) => ({
    ...t,
    time: t.time * 1000,
    _id: arrayBufferToBase64(t.id),
  })) || []) as ProcessedEvent[]
}

// Check if a transaction exists in the given network
// This is a workaround for https://github.com/liftedinit/many-rs/issues/404
const hasEvent = async (network: Network, id: ArrayBuffer) => {
  try {
    const response = await network.events?.list({
      count: 1,
      filters: {
        txnIdRange: [
          { boundType: BoundType.inclusive, value: id },
          { boundType: BoundType.inclusive, value: id },
        ],
      },
      order: ListOrderType.descending,
    })
    return response?.events?.length === 1
  } catch (err) {
    throw err
  }
}

const fetchEvents = async ({
  network,
  txFrom,
  count = PAGE_SIZE,
  filters = {},
}: {
  network: Network
  txFrom?: ArrayBuffer
  count?: number
  filters?: Record<any, any>
}): Promise<Event[]> => {
  let mergedFilters = { ...filters }

  try {
    // If we have a transaction id, check if it exists in the current network
    if (txFrom) {
      // If it exists, create a filter that will look for this transaction
      // This is a workaround for https://github.com/liftedinit/many-rs/issues/404
      if (await hasEvent(network, txFrom)) {
        mergedFilters = {
          ...mergedFilters,
          txnIdRange: [
            undefined,
            { boundType: BoundType.inclusive, value: txFrom },
          ],
        }
      }
    }

    const response = await network.events?.list({
      count,
      filters: mergedFilters,
      order: ListOrderType.descending,
    })

    return [...(response?.events || [])]
  } catch (error) {
    throw error
  }
}

interface IndexedEvents {
  events: Event[]
  indices: number[]
}

interface PageState {
  lastTxn: ArrayBuffer[]
  lastNetworkId: number[]
}

export type ProcessedEvent = Event & { _id: string; time: number }

export function useTransactionsList({
  count = PAGE_SIZE,
  filters,
  predicate,
  keymod,
}: {
  count?: number
  filters: Record<any, any>
  predicate?: (e: Event) => boolean
  keymod?: any // Some data what will modify the useQuery cache
}) {
  const [pageData, setPageData] = useState<PageState>({
    lastTxn: [],
    lastNetworkId: [],
  })

  const { query: activeNetwork, legacy } = useNetworkContext()
  const legacyNetworks = useMemo(() => legacy, [legacy])

  if (!activeNetwork) throw new Error("activeNetwork is undefined")

  const networks = [activeNetwork, ...(legacyNetworks ?? [])]

  const fetchData = async () => {
    let accumulatedData: Event[] = []
    let accumulatedIndex: number[] = []
    let txFrom = pageData.lastTxn?.[0]
    const lastNetworkId = pageData.lastNetworkId?.[0] || 0

    for (let i = lastNetworkId; i < networks.length; i++) {
      const network = networks[i]
      const data = await fetchEvents({
        network,
        txFrom,
        count,
        filters,
      })
      // TODO: Fix the use-case where filteredData is empty but there are still valid transactions on the current network
      const filteredData = predicate ? data.filter(predicate) : data
      const indices = Array(filteredData.length).fill(i)
      accumulatedIndex = [...accumulatedIndex, ...indices]
      accumulatedData = [...accumulatedData, ...filteredData]
      if (accumulatedData.length >= count) break
    }

    return {
      events: accumulatedData,
      indices: accumulatedIndex,
    } as IndexedEvents
  }

  const { data, isError, error, isLoading } = useQuery<IndexedEvents, Error>(
    [
      "events",
      "list",
      filters,
      activeNetwork,
      legacyNetworks,
      keymod,
      pageData,
    ],
    fetchData,
    {
      enabled: Object.keys(filters).length > 0,
    },
  )

  const result = processRawEvents(data?.events)

  const hasNextPage = result.length >= count

  return {
    isError,
    error: error?.message,
    isLoading,
    hasNextPage,
    currPageCount: result.slice(0, count - 1).length,
    prevBtnProps: {
      disabled: pageData.lastTxn?.length === 0,
      onClick: () => {
        setPageData(s => ({
          lastTxn: s.lastTxn.slice(1),
          lastNetworkId: s.lastNetworkId.slice(1),
        }))
      },
    },
    nextBtnProps: {
      disabled: !hasNextPage,
      onClick: () => {
        const lastTxn = result[count - 1]
        const lastNetworkId = data?.indices[count - 1] || 0
        setPageData(s => ({
          lastTxn: [lastTxn.id, ...s.lastTxn],
          lastNetworkId: [lastNetworkId, ...s.lastNetworkId],
        }))
      },
    },
    data: {
      count: result.length,
      transactions: result.slice(0, count - 1),
    },
  }
}

export function useSingleTransactionList({ txId }: { txId?: ArrayBuffer }) {
  const { query: activeNetwork, legacy } = useNetworkContext()
  const legacyNetworks = useMemo(() => legacy, [legacy])

  if (!activeNetwork) throw new Error("activeNetwork is undefined")

  const networks = [activeNetwork, ...(legacyNetworks ?? [])]

  const { data, isError, error, isLoading } = useQuery<Event[], Error>(
    ["events", "list", txId],
    async () => {
      if (!txId) return []
      for (const network of networks) {
        const events = await fetchEvents({
          network,
          txFrom: txId,
          count: 1,
        })
        if (events.length === 1) {
          return events
        }
      }

      return []
    },
  )

  const result = processRawEvents(data)

  return {
    isError,
    error: error?.message,
    isLoading,
    data: {
      count: result.length,
      transactions: result,
    },
  }
}

export function useAllTransactionsList({
  filters = {},
  count = MAX_PAGE_SIZE,
}: {
  filters?: Record<any, any>
  count?: number
}) {
  const { query: activeNetwork, legacy } = useNetworkContext()

  if (!activeNetwork) throw new Error("activeNetwork is undefined")

  const legacyNetworks = useMemo(() => legacy, [legacy])
  const networks = [activeNetwork, ...(legacyNetworks ?? [])]

  const fetchData = async () => {
    let accumulatedData: Event[] = []
    let hasNextPage = true
    let txFrom: ArrayBuffer | undefined = undefined

    for (const network of networks) {
      while (hasNextPage) {
        const data = await fetchEvents({
          network,
          txFrom,
          filters,
          count,
        })
        accumulatedData = [...accumulatedData, ...data]
        hasNextPage = data.length === count
        txFrom = accumulatedData[accumulatedData.length - 1]?.id
      }
      hasNextPage = true
      txFrom = undefined
    }

    return accumulatedData
  }

  const { data, isError, error, isLoading } = useQuery<Event[], Error>(
    ["list", filters, activeNetwork, legacyNetworks],
    fetchData,
  )

  const result = processRawEvents(data)

  return {
    isError,
    error: error?.message,
    isLoading,
    data: {
      count: result.length,
      transactions: result,
    },
  }
}

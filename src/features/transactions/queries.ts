import { useNetworkContext } from "features/network"
import { BoundType, Event, ListOrderType, Network } from "@liftedinit/many-js"
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
    { to: string; amount: bigint; symbol: string }
  >(
    async (vars: {
      from?: string
      to: string
      amount: bigint
      symbol: string
    }) => {
      return network?.ledger.send(vars)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["balances"])
        queryClient.invalidateQueries(["events", "list"])
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
  accounts,
  count = PAGE_SIZE,
}: {
  network: Network
  txFrom?: ArrayBuffer
  accounts?: string[]
  count?: number
}): Promise<Event[]> => {
  let filters = {}

  if (accounts) {
    filters = {
      ...filters,
      accounts,
    }
  }

  try {
    // If we have a transaction id, check if it exists in the current network
    if (txFrom) {
      // If it exists, create a filter that will look for this transaction
      // This is a workaround for https://github.com/liftedinit/many-rs/issues/404
      if (await hasEvent(network, txFrom)) {
        filters = {
          ...filters,
          txnIdRange: [
            undefined,
            { boundType: BoundType.inclusive, value: txFrom },
          ],
        }
      }
      // If it doesn't exist, return the accumulated data and check on the next network
      else {
        return []
      }
    }

    const response = await network.events?.list({
      count,
      filters,
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
  accounts,
  count = PAGE_SIZE,
}: {
  accounts?: string[]
  count?: number
}) {
  const [pageData, setPageData] = useState<PageState>({
    lastTxn: [],
    lastNetworkId: [],
  })

  const { query: activeNetwork, legacy } = useNetworkContext()
  const legacyNetworks = useMemo(() => legacy, [legacy])
  const accountsMemo = useMemo(() => accounts, [accounts])

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
        accounts: accountsMemo,
        count,
      })
      const indices = Array(data.length).fill(i)
      accumulatedIndex = [...accumulatedIndex, ...indices]
      accumulatedData = [...accumulatedData, ...data]
      if (accumulatedData.length >= count) break
    }

    return {
      events: accumulatedData,
      indices: accumulatedIndex,
    } as IndexedEvents
  }

  const { data, isError, error, isLoading } = useQuery<IndexedEvents, Error>(
    ["events", "list", accounts, activeNetwork, legacyNetworks, pageData],
    fetchData,
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

export function useSingleTransactionList(txId: ArrayBuffer | undefined) {
  const { query: activeNetwork, legacy } = useNetworkContext()
  const legacyNetworks = useMemo(() => legacy, [legacy])
  const accountsMemo = useMemo(() => accounts, [accounts])

  if (!activeNetwork) throw new Error("activeNetwork is undefined")

  const networks = [activeNetwork, ...(legacyNetworks ?? [])]

  const { data, isError, error, isLoading } = useQuery<Event[], Error>(
    ["list", txId],
    async () => {
      try {
        if (!txId) return []

        const networks = [activeNetwork, ...(legacyNetworks ?? [])]
        for (const network of networks) {
          const response = await network.events?.list({
            count: 1,
            filters: {
              txnIdRange: [
                { boundType: BoundType.inclusive, value: txId },
                { boundType: BoundType.inclusive, value: txId },
              ],
            },
            order: ListOrderType.descending,
          })
          if (response?.events?.length === 1) {
            return response.events
          }
        }
        return []
      } catch (err) {
        throw err
      }
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

export function useTransactionsList(
  address: string,
  symbol: string | undefined,
) {
  const [pageData, setPageData] = useState<ArrayBuffer[]>([])

  const { query: activeNetwork, legacy } = useNetworkContext()

  if (!activeNetwork) throw new Error("activeNetwork is undefined")

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

  const fetchEvents = async (
    network: Network,
    accumulatedData: Event[] = [],
    txFrom: ArrayBuffer | undefined,
  ) => {
    if (accumulatedData.length >= PAGE_SIZE) return accumulatedData
    let filters = {}

    if (symbol !== undefined) {
      filters = {
        ...filters,
        accounts: [address, symbol],
      }
    } else {
      filters = {
        ...filters,
        accounts: address,
      }
    }

    try {
      // If we have a transaction id, check if it exists in the current network
      if (txFrom) {
        // If it exists, create a filter that will look for this transaction
        // This is a workaround for https://github.com/liftedinit/many-rs/issues/404
        if (await hasEvent(network, txFrom)) {
          filters = {
            ...filters,
            txnIdRange: [
              undefined,
              { boundType: BoundType.inclusive, value: txFrom },
            ],
          }
        }
        // If it doesn't exist, return the accumulated data and check on the next network
        else {
          return [...accumulatedData]
        }
      }

      const response = await network.events?.list({
        count: PAGE_SIZE - accumulatedData.length, // Fetch only the remaining required amount
        filters,
        order: ListOrderType.descending,
      })

      return [...accumulatedData, ...(response?.events || [])]
    } catch (error) {
      throw error
    }
  }
}

export function useAllTransactionsList({
  accounts,
  count = MAX_PAGE_SIZE,
}: {
  accounts?: string[]
  count: number
}) {
  const { query: activeNetwork, legacy } = useNetworkContext()

  if (!activeNetwork) throw new Error("activeNetwork is undefined")

  const legacyNetworks = useMemo(() => legacy, [legacy])
  const accountsMemo = useMemo(() => accounts, [accounts])
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
          accounts: accountsMemo,
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
    ["list", accounts, activeNetwork, legacyNetworks],
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

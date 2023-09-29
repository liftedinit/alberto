import { useNetworkContext } from "features/network"
import { BoundType, Event, ListOrderType, Network } from "@liftedinit/many-js"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useMemo, useState } from "react"
import { arrayBufferToBase64 } from "@liftedinit/ui"

const PAGE_SIZE = 11

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

export function useSingleTransactionList(txId: ArrayBuffer | undefined) {
  const { query: activeNetwork, legacy: legacyNetworks } = useNetworkContext()

  if (activeNetwork === undefined) {
    throw new Error("activeNetwork is undefined")
  }

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

  const result =
    data?.map((t: Event) => ({
      ...t,
      time: t.time * 1000,
      _id: arrayBufferToBase64(t.id),
    })) || []

  return {
    isError,
    error: error?.message,
    isLoading,
    data: {
      count: result?.length || 0,
      transactions: result?.slice(1) || [],
    },
  }
}

export function useTransactionsList(
  address: string,
  symbol: string | undefined,
) {
  const [pageData, setPageData] = useState<ArrayBuffer[]>([])

  const { query: activeNetwork, legacy } = useNetworkContext()
  const legacyNetworks = useMemo(() => legacy, [legacy])

  if (activeNetwork === undefined) {
    throw new Error("activeNetwork is undefined")
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

  const fetchData = async () => {
    let txFrom = pageData[0]
    let accumulatedData: Event[] = []

    accumulatedData = await fetchEvents(activeNetwork, accumulatedData, txFrom)

    // If not enough data, loop over legacyNetworks
    for (const network of legacyNetworks ?? []) {
      if (accumulatedData.length >= PAGE_SIZE) break

      accumulatedData = await fetchEvents(network, accumulatedData, txFrom)
    }

    return accumulatedData
  }

  const { data, isError, error, isLoading } = useQuery<Event[], Error>(
    ["list", address, activeNetwork, legacyNetworks, pageData],
    fetchData,
  )

  const result =
    data?.map((t: Event) => ({
      ...t,
      time: t.time * 1000,
      _id: arrayBufferToBase64(t.id),
    })) || []

  const hasNextPage = result.length === PAGE_SIZE

  return {
    isError,
    error: error?.message,
    isLoading,
    hasNextPage,
    currPageCount: result.slice(0, PAGE_SIZE - 1).length,
    prevBtnProps: {
      disabled: pageData.length === 0,
      onClick: () => {
        setPageData(s => s.slice(1))
      },
    },
    nextBtnProps: {
      disabled: !hasNextPage,
      onClick: () => {
        const lastTxn = result[PAGE_SIZE - 1]
        setPageData(s => [lastTxn.id, ...s])
      },
    },
    data: {
      count: data?.length || 0,
      transactions: result?.slice(0, PAGE_SIZE - 1) || [],
    },
  }
}

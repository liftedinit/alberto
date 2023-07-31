import { useNetworkContext } from "features/network"
import {
  BoundType,
  Event,
  ListFilterArgs,
  ListOrderType,
} from "@liftedinit/many-js"
import { useMutation, useQueryClient } from "react-query"
import { arrayBufferToBase64 } from "@liftedinit/ui"
import React, { useEffect } from "react"

const PAGE_SIZE = 11
type EventWithID = Event & {
  _id: string
}

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

interface TransactionsListArgs {
  address?: string
  filter?: Omit<ListFilterArgs, "txnIdRange"> & {
    txnIdRange?: ({ boundType: BoundType; value: ArrayBuffer } | undefined)[]
  }
  count?: number
}

// TODO: Aggregating data from multiple backends should be handled (and cached) by another system.
//       We should only query this other system from the frontend.
export function useTransactionsList({
  address,
  filter = {},
  count: reqCount = PAGE_SIZE,
}: TransactionsListArgs) {
  const [data, setData] = React.useState<EventWithID[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [txnIds, setTxnIds] = React.useState<ArrayBuffer[]>([])
  const [activeNetwork, , legacyNetworks] = useNetworkContext()

  const filterRef = React.useRef(filter)

  // `useCallback` will return a memoized version of the callback that only changes if one of the dependencies has changed.
  const fetchQueries = React.useCallback(async () => {
    try {
      setLoading(true)
      const backends = [
        ...(activeNetwork ? [activeNetwork] : []),
        ...(legacyNetworks || []),
      ]
      let resultData: EventWithID[] = []

      // Filter by account address and any filter given by the user
      const filters = {
        accounts: address,
        ...filterRef.current,
      }

      let checkTx = txnIds.length > 0 // Flag to check if txnIds[0] exists in the current backend
      let counter = reqCount

      // TODO: An optimization would be to not query the first backend if we're already on the next one
      for (const backend of backends) {
        let response

        // Filter by txnIds[0] iif it exists in the current backend
        if (txnIds.length > 0 && checkTx) {
          filters.txnIdRange = [
            undefined,
            { boundType: BoundType.inclusive, value: txnIds[0] },
          ]
        }

        try {
          response = await backend.events?.list({
            count: counter,
            order: ListOrderType.descending,
            filters,
          })
        } catch (err) {
          // If the event is not found, continue to the next backend
          if ((err as Error)?.message.startsWith("Event not found")) {
            continue
          }
        }

        resultData = resultData.concat(
          response?.events.map((t: Event) => ({
            ...t,
            time: t.time * 1000,
            _id: arrayBufferToBase64(t.id),
          })) || [],
        )

        // At this point the current backend has some data. Do we have enough?
        if (
          response?.events.length === reqCount ||
          resultData.length === reqCount
        ) {
          // We have enough data for the current page, break
          break
        }

        // At this point we have some data but not enough for the current page
        // Try to get the remaining data from the next backend
        counter = reqCount - resultData.length
        delete filters.txnIdRange // Remove the filter, if any
        checkTx = false // We're reaching the next backend; we don't need to check for txnIds[0] anymore
      }
      setData(resultData)
      setLoading(false)
    } catch (err) {
      setError(err as Error)
      setLoading(false)
    }
  }, [address, reqCount, activeNetwork, legacyNetworks, txnIds])

  useEffect(() => {
    fetchQueries()
  }, [fetchQueries])

  const hasNextPage = data.length === PAGE_SIZE
  const visibleTxnsWithId = hasNextPage ? data.slice(0, PAGE_SIZE - 1) : data

  return {
    error: error?.message,
    isError: error,
    isLoading: loading,
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
        const lastTxn = data[PAGE_SIZE - 1]
        setTxnIds(s => [lastTxn.id, ...s])
      },
    },
    data: {
      count: data.length,
      transactions: visibleTxnsWithId ?? [],
    },
  }
}

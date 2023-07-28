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
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(Error)
  const [txnIds, setTxnIds] = React.useState<ArrayBuffer[]>([])
  const [activeNetwork, , legacyNetworks] = useNetworkContext()

  const filterRef = React.useRef(filter)

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true)
        const backends = [
          ...(activeNetwork ? [activeNetwork] : []),
          ...(legacyNetworks || []),
        ]
        let resultData: Event[] = []

        // Filter by account address and any filter given by the user
        const filters = {
          accounts: address,
          ...filterRef.current,
        }

        let checkTx = false // Flag to check if txnIds[0] exists in the current backend

        // txnIds[0] is the last (hidden) transaction from the previous page / the first transaction of the next page
        // Create a filter that will look that this transaction exists in the current endpoint
        // This is a workaround for https://github.com/liftedinit/many-rs/issues/404
        if (txnIds.length > 0) {
          filters.txnIdRange = [
            { boundType: BoundType.inclusive, value: txnIds[0] },
            { boundType: BoundType.inclusive, value: txnIds[0] },
          ]
          checkTx = true
        }

        let counter = reqCount
        for (const backend of backends) {
          // Get the data from the current endpoint
          let response = await backend.events?.list({
            count: counter,
            order: ListOrderType.descending,
            filters,
          })
          const response_length = response?.events.length

          // The current backend has no data; try the next one
          if (response_length === 0 && checkTx) {
            continue
          } else if (response_length === 1 && checkTx) {
            // txnIds[0] exists in the current backend; query the backend again for the remaining transactions
            checkTx = false
            filters.txnIdRange = [
              undefined,
              { boundType: BoundType.inclusive, value: txnIds[0] },
            ]
            response = await backend.events?.list({
              count: counter,
              order: ListOrderType.descending,
              filters,
            })
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
        }
        setData(resultData)
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }
    fetchQueries()
  }, [address, reqCount, activeNetwork, legacyNetworks, txnIds])

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

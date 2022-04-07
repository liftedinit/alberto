import { useLedgerInfo } from "features/network"
import { Network } from "many-js"
import type { ListFilterArgs, Transaction } from "many-js"
import { useMutation, useQuery, useQueryClient } from "react-query"

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
}: {
  network?: Network
  accountPublicKey: string
  filter?: ListFilterArgs
}) {
  const filters = {
    ...filter,
    accounts: accountPublicKey,
  }

  const ledgerInfo = useLedgerInfo({ network, accountPublicKey })

  const q = useQuery({
    queryKey: ["transactions", "list", filters, accountPublicKey, network?.url],
    queryFn: async () => await network?.ledger?.list({ filters }),
    enabled: !!network?.url && !!accountPublicKey,
  })

  const transactionsWithSymbols = (q?.data?.transactions ?? []).map(
    (t: Transaction) => ({
      ...t,
      symbol: ledgerInfo?.data?.symbols?.get(t.symbolIdentity) ?? "",
    }),
  )

  return {
    error: q.error,
    isError: q.isError,
    isLoading: q.isLoading || q.isFetching,
    data: {
      count: q?.data?.count ?? 0,
      transactions: transactionsWithSymbols,
    },
  }
}

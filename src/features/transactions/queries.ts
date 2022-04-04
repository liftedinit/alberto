import { Account } from "features/accounts"
import { Network } from "many-js"
import { useMutation, useQueryClient } from "react-query"

export function useSendToken({
  network,
  account,
}: {
  network?: Network
  account?: Account
}) {
  const queryClient = useQueryClient()
  const m = useMutation(
    async (variables: { to: string; amount: bigint; symbol: string }) => {
      // todo: precision decimal places
      const { to, amount, symbol } = variables
      return network?.ledger.send(to, amount, symbol)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["balances", network?.url, account])
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

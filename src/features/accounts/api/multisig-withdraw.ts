import { useMutation, useQueryClient } from "react-query"
import { useNetworkContext } from "features/network"

export function useMultisigWithdraw(token: ArrayBuffer) {
  const queryClient = useQueryClient()
  const { command: n } = useNetworkContext()
  return useMutation<undefined, Error>(
    async () => {
      return await n?.account.multisigWithdraw(token)
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(["multisigTxnInfo", token])
        queryClient.invalidateQueries(["events", "list"])
      },
    },
  )
}

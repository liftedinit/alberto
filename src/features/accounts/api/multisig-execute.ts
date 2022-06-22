import { useMutation, useQueryClient } from "react-query"
import { useNetworkContext } from "features/network"

export function useMultisigExecute(token: ArrayBuffer) {
  const [, n] = useNetworkContext()
  const queryClient = useQueryClient()
  return useMutation<undefined, Error>(
    async () => {
      return await n?.account.multisigExecute(token)
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(["multisigTxnInfo", token])
        queryClient.invalidateQueries(["events", "list"])
      },
    },
  )
}

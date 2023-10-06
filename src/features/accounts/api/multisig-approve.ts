import { useMutation, useQueryClient } from "react-query"
import { useNetworkContext } from "features/network"

export function useMultisigApprove(token: ArrayBuffer) {
  const queryClient = useQueryClient()
  const { command: n } = useNetworkContext()
  return useMutation<undefined, Error>(
    async () => {
      return await n?.account.multisigApprove(token)
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(["multisigTxnInfo", token])
        queryClient.invalidateQueries(["events", "list"])
      },
    },
  )
}

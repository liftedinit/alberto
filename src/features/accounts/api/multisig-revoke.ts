import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNetworkContext } from "features/network"

export function useMultisigRevoke(token: ArrayBuffer) {
  const queryClient = useQueryClient()
  const { command: n } = useNetworkContext()
  return useMutation<undefined, Error>({
    mutationFn: async () => {
      return await n?.account.multisigRevoke(token)
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["multisigTxnInfo", token] })
      queryClient.invalidateQueries({ queryKey: ["events", "list"] })
    },
  })
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNetworkContext } from "features/network"

export function useMultisigExecute(token: ArrayBuffer) {
  const { command: n } = useNetworkContext()
  const queryClient = useQueryClient()
  return useMutation<undefined, Error>({
    mutationFn: async () => {
      return await n?.account.multisigExecute(token)
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["multisigTxnInfo", token] })
      queryClient.invalidateQueries({ queryKey: ["events", "list"] })
    },
  })
}

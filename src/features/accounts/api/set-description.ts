import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNetworkContext } from "features/network"

export function useSetDescription(account: string) {
  const queryClient = useQueryClient()
  const { command: n } = useNetworkContext()
  return useMutation<null, Error, { description: string }>({
    mutationFn: async ({ description }) =>
      await n?.account.setDescription(account, description),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["accountinfo", account] })
    },
  })
}

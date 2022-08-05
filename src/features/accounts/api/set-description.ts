import { useMutation, useQueryClient } from "react-query"
import { useNetworkContext } from "features/network"

export function useSetDescription(account: string) {
  const queryClient = useQueryClient()
  const [, n] = useNetworkContext()
  return useMutation<null, Error, { description: string }>(
    async ({ description }) =>
      await n?.account.setDescription(account, description),
    {
      onSuccess() {
        queryClient.invalidateQueries(["accountinfo", account])
      },
    },
  )
}

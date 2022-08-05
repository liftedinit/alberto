import { useMutation, useQueryClient } from "react-query"
import { useNetworkContext } from "features/network"

export function useRemoveRoles(account: string) {
  const [, n] = useNetworkContext()
  const qc = useQueryClient()
  return useMutation<undefined, Error, { roles: Map<string, string[]> }>(
    async vars => await n?.account.removeRoles(account, vars.roles),
    {
      onSuccess: () => {
        qc.invalidateQueries(["accountinfo", account])
      },
    },
  )
}

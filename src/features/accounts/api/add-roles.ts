import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNetworkContext } from "features/network"

export function useAddRoles(account: string) {
  const { command: n } = useNetworkContext()
  const qc = useQueryClient()
  return useMutation<undefined, Error, { roles: Map<string, string[]> }>({
    mutationFn: async vars => await n?.account.addRoles(account, vars.roles),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accountinfo", account] })
    },
  })
}

import { useMutation } from "@tanstack/react-query"
import { useNetworkContext } from "features/network"
import { AccountFeature } from "@liftedinit/many-js"

export function useAddFeatures(address?: string) {
  const { command: n } = useNetworkContext()
  return useMutation<
    unknown,
    Error,
    { features?: AccountFeature[]; roles?: Map<string, string[]> }
  >({
    mutationFn: async ({ features, roles }) => {
      return await n?.account.addFeatures({
        account: address,
        features: features,
        roles: roles,
      })
    },
  })
}

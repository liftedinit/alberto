import { useMutation } from "@tanstack/react-query"
import { useNetworkContext } from "features/network"
import { RecoverOptions } from "../types"

/**
 * get webauthn account data from k-v store during import/recovery
 */
export function useGetWebauthnCredential() {
  const { query } = useNetworkContext()
  return useMutation({
    mutationFn: async ({ getFrom, value }: { getFrom: RecoverOptions; value: string }) => {
      const getFn =
        getFrom === RecoverOptions.phrase
          ? query?.idStore.getFromRecallPhrase
          : query?.idStore.getFromAddress
      return await getFn(value)
    },
  })
}

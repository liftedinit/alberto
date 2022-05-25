import { useMutation } from "react-query"
import { useNetworkContext } from "features/network"
import { RecoverOptions } from "../types"

/**
 * get webauthn account data from k-v store during import/recovery
 */
export function useGetWebauthnCredential() {
  const [queryNetwork] = useNetworkContext()
  return useMutation(
    async ({ getFrom, value }: { getFrom: RecoverOptions; value: string }) => {
      const getFn =
        getFrom === RecoverOptions.phrase
          ? queryNetwork?.idStore.getFromRecallPhrase
          : queryNetwork?.idStore.getFromAddress
      const res = await getFn(value)
      return res
    },
  )
}

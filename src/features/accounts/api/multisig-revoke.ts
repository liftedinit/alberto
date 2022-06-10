import { useMutation } from "react-query"
import { useNetworkContext } from "features/network"

export function useMultisigRevoke() {
  const [, n] = useNetworkContext()
  return useMutation<undefined, Error, ArrayBuffer>(
    async (token: ArrayBuffer) => {
      return await n?.account.multisigRevoke(token)
    },
  )
}

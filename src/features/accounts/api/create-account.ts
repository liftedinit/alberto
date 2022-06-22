import { useMutation } from "react-query"
import { useNetworkContext } from "features/network"

export function useCreateAccount() {
  const [, n] = useNetworkContext()
  return useMutation(async () => {
    const res = await n?.account.create()
    return res
  })
}

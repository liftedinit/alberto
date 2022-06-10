import { useQuery } from "react-query"
import { useNetworkContext } from "features/network"
import { MultisigInfoResponse } from "many-js"

export function useGetMultisigTxnInfo(token?: ArrayBuffer) {
  const [n] = useNetworkContext()

  return useQuery<MultisigInfoResponse>({
    queryKey: ["multisigTxnInfo", token],
    queryFn: async () => {
      const res = await n?.account.multisigInfo(token)
      return res
    },
    enabled: !!token,
  })
}

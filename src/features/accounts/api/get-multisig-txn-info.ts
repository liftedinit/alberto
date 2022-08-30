import { useQuery } from "react-query"
import { useNetworkContext } from "features/network"
import { MultisigInfoResponse } from "@liftedinit/many-js"

export function useGetMultisigTxnInfo(token?: ArrayBuffer) {
  const [n] = useNetworkContext()

  return useQuery<MultisigInfoResponse, Error>({
    queryKey: ["multisigTxnInfo", token],
    queryFn: async () => {
      const res = await n?.account.multisigInfo(token)
      return res
    },
    enabled: !!token,
  })
}

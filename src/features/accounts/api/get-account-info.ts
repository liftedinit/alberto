import { useQuery } from "react-query"
import { useNetworkContext } from "features/network"
import type { GetAccountInfoResponse } from "many-js"

export function useGetAccountInfo(address?: string) {
  const [n] = useNetworkContext()

  return useQuery<GetAccountInfoResponse>({
    queryKey: ["accountinfo", address],
    queryFn: async () => {
      const res = await n?.account.info(address)
      return res
    },
    enabled: !!address,
  })
}

import { useQuery, useMutation } from "react-query"
import { LedgerInfo } from "many-js"
import { useNetworkContext } from "./network-provider"

export function useLedgerInfo({ address }: { address: string }) {
  const [network] = useNetworkContext()
  return useQuery<LedgerInfo, Error>({
    queryKey: ["ledger.info", address, network?.url],
    queryFn: async () => await network?.ledger.info(),
    enabled: !!network?.url && !!address,
    initialData: { symbols: new Map() } as LedgerInfo,
  })
}

// @ts-ignore
export function useFetchLedgerInfo() {
  const [, network] = useNetworkContext()
  return useMutation(async () => {
    return await network?.ledger.info()
  })
}

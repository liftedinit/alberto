import { useQuery, useMutation } from "react-query"
import { LedgerInfo } from "many-js"
import { useNetworkContext } from "."

export function useLedgerInfo({
  accountPublicKey,
}: {
  accountPublicKey: string
}) {
  const [network] = useNetworkContext()
  return useQuery<LedgerInfo | undefined>({
    queryKey: ["ledger.info", accountPublicKey, network?.url],
    queryFn: async () => await network?.ledger.info(),
    enabled: !!network?.url && !!accountPublicKey,
  })
}

// @ts-ignore
export function useFetchLedgerInfo() {
  const [, network] = useNetworkContext()
  return useMutation(async () => {
    // todo: precision decimal places
    return network?.ledger.info()
  })
}

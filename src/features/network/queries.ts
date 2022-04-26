import { useQuery, useMutation } from "react-query"
import { Network, LedgerInfo } from "many-js"

export function useLedgerInfo({
  network,
  accountPublicKey,
}: {
  network?: Network
  accountPublicKey: string
}) {
  return useQuery<LedgerInfo | undefined>({
    queryKey: ["ledger.info", accountPublicKey, network?.url],
    queryFn: async () => await network?.ledger.info(),
    enabled: !!network?.url && !!accountPublicKey,
  })
}

// @ts-ignore
export function useFetchLedgerInfo({ network }) {
  return useMutation(async () => {
    // todo: precision decimal places
    return network?.ledger.info()
  })
  // return useMutation()
}

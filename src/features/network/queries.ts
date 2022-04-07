import { useQuery } from "react-query";
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

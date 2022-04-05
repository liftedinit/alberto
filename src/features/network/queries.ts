import { useQuery } from "react-query";
import { Network, LedgerInfo } from "many-js";
import { Account } from "features/accounts"

export function useLedgerInfo({
  network,
  account,
}: {
  network?: Network
  account?: Account
}) {
  return useQuery<LedgerInfo | undefined>({
    queryKey: ["ledger.info", network?.url, account],
    queryFn: async () => await network?.ledger.info(),
    enabled: !!network?.url && !!account,
  })
}

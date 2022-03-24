import { useQuery } from "react-query";
import { Network, LedgerInfo } from "many-js";

export function useLedgerInfo(network?: Network) {
  return useQuery<LedgerInfo | undefined>({
    queryKey: ["ledger.info", network?.url],
    queryFn: async () => (await network?.fetchLedgerInfo()) as LedgerInfo,
    enabled: !!network?.url,
  });
}

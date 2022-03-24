import { useQuery } from "react-query";
import { useNetworkContext } from "features/network";

export function useBalances(symbols?: string[]) {
  const network = useNetworkContext();
  return useQuery({
    queryKey: ["balances", network?.url],
    queryFn: async () => {
      const res = await network?.balance(symbols!);
      console.log({ res });
      return res;
    },
    enabled: !!symbols && !!symbols[0] && !!network?.url,
    retry: false,
  });
}

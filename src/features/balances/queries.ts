import { useQuery } from "react-query";
import { Balances, Network } from "many-js"
import { Account } from "features/accounts"
import { useLedgerInfo } from "features/network"

type UseBalancesOpts = {
  network?: Network
  account?: Account
}

export function useBalances({ network, account }: UseBalancesOpts) {
  const ledgerInfoQuery = useLedgerInfo({ account, network })
  const ledgerInfoSymbols = ledgerInfoQuery?.data?.symbols ?? new Map()

  const balancesQuery = useQuery<Balances | undefined>({
    queryKey: ["balances", network?.url, account],
    queryFn: async () => {
      return await network?.ledger.balance()
    },
    enabled: !!network?.url && !!account?.keys,
    retry: false,
  })

  const symbolsWithBalance: { name: string; value: bigint }[] = Array.from(
    balancesQuery?.data?.balances ?? new Map(),
    balanceForSymbol => ({
      name: ledgerInfoSymbols.get(balanceForSymbol[0]),
      value: balanceForSymbol?.[1],
    }),
  )

  return {
    errors: [ledgerInfoQuery.error, balancesQuery.error].filter(Boolean),
    isError: balancesQuery.isError || ledgerInfoQuery.isError,
    isFetching: balancesQuery.isFetching || ledgerInfoQuery.isFetching,
    data: symbolsWithBalance,
  }
}

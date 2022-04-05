import { useQuery } from "react-query";
import { Balances, Network } from "many-js"
import { Account } from "features/accounts"
import { useLedgerInfo } from "features/network"

type UseBalancesOpts = {
  network?: Network
  account?: Account
}

export interface Asset {
  identity: string
  symbol: string
  balance: bigint
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

  const ownedAssetBalances = balancesQuery?.data?.balances ?? new Map()

  const allAssetsWithBalance: Asset[] = Array.from(
    ledgerInfoSymbols,
    (symbol: [string, string]) => {
      return {
        identity: symbol[0],
        symbol: symbol[1],
        balance: ownedAssetBalances.get(symbol[0]) ?? BigInt(0),
      }
    },
  ).sort(sortAssets)

  const ownedAssetsWithBalance: Asset[] = allAssetsWithBalance.filter(
    ({ identity }) => ownedAssetBalances.get(identity),
  )

  return {
    errors: [ledgerInfoQuery.error, balancesQuery.error].filter(Boolean),
    isError: balancesQuery.isError || ledgerInfoQuery.isError,
    isFetching: balancesQuery.isFetching || ledgerInfoQuery.isFetching,
    data: {
      allAssetsWithBalance,
      ownedAssetsWithBalance,
    },
  }
}

function sortAssets(a: Asset, b: Asset) {
  const symbolA = a.symbol.toLowerCase()
  const symbolB = b.symbol.toLowerCase()
  if (symbolA < symbolB) return -1
  if (symbolA > symbolB) return 1
  return 0
}
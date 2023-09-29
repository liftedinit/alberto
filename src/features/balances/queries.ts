import { useQuery } from "react-query"
import { Balances } from "@liftedinit/many-js"
import { useLedgerInfo, useNetworkContext } from "features/network"
import { Asset } from "./types"

type UseBalancesOpts = {
  address: string
}

export function useBalances({ address }: UseBalancesOpts) {
  const { query: network } = useNetworkContext()

  const ledgerInfoQuery = useLedgerInfo({ address })
  const ledgerInfoSymbols = ledgerInfoQuery?.data?.symbols ?? new Map()

  const balancesQuery = useQuery<Balances | undefined>({
    queryKey: ["balances", address, network?.url],
    queryFn: async () => await network?.ledger.balance(address),
    enabled: !!network?.url && !!address,
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
    isLoading:
      balancesQuery.isFetching ||
      ledgerInfoQuery.isFetching ||
      balancesQuery.isLoading ||
      ledgerInfoQuery.isLoading,
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

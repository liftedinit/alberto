import { useQueries, useQuery } from "react-query"
import { useNetworkContext } from "features/network"
import {
  AccountFeatureTypes,
  AccountRole,
  GetAccountInfoResponse,
  Network,
} from "@liftedinit/many-js"
import { useAccountsStore } from "../stores"

export async function fetchAccountInfo(
  n: Network | undefined,
  accountAddress: string | undefined,
  address: string | undefined,
) {
  const res = await n?.account.info(accountAddress)
  const isOwner = Boolean(
    res?.accountInfo?.roles
      ?.get?.(address)
      ?.includes(AccountRole[AccountRole.owner]),
  )
  const features = res?.accountInfo?.features
  const hasLedgerFeature = Boolean(
    features?.get(AccountFeatureTypes[AccountFeatureTypes.accountLedger]),
  )
  const hasMultisigFeature = Boolean(
    features?.get(AccountFeatureTypes[AccountFeatureTypes.accountMultisig]),
  )
  return { ...res, isOwner, hasMultisigFeature, hasLedgerFeature }
}

export function useGetAccountInfo(accountAddress?: string) {
  const { query: n } = useNetworkContext()
  const activeIdentity = useAccountsStore(s => s.byId.get(s.activeId))
  const address = activeIdentity?.address

  return useQuery<
    GetAccountInfoResponse & {
      isOwner: boolean
      hasMultisigFeature: boolean
      hasLedgerFeature: boolean
    },
    Error
  >({
    queryKey: ["accountinfo", accountAddress],
    queryFn: () => fetchAccountInfo(n, accountAddress, address),
    enabled: Boolean(accountAddress),
  })
}

export function useGetAccountsInfo(accountAddresses: string[]) {
  const { query: n } = useNetworkContext()
  const activeIdentity = useAccountsStore(s => s.byId.get(s.activeId))
  const address = activeIdentity?.address

  return useQueries({
    queries: accountAddresses.map(accountAddress => ({
      queryKey: ["accountinfo", accountAddress],
      queryFn: () => fetchAccountInfo(n, accountAddress, address),
      enabled: Boolean(accountAddress),
    })),
  })
}

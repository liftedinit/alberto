import { useQuery } from "react-query"
import { useNetworkContext } from "features/network"
import {
  AccountFeatureTypes,
  AccountRole,
  GetAccountInfoResponse,
} from "many-js"
import { useAccountsStore } from "../stores"

export function useGetAccountInfo(accountAddress?: string) {
  const [n] = useNetworkContext()
  const activeIdentity = useAccountsStore(s => s.byId.get(s.activeId))
  const address = activeIdentity?.address

  return useQuery<
    GetAccountInfoResponse & { isOwner: boolean; hasMultisigFeature: boolean }
  >({
    queryKey: ["accountinfo", accountAddress],
    queryFn: async () => {
      const res = await n?.account.info(accountAddress)
      const isOwner = Boolean(
        res?.accountInfo?.roles
          ?.get?.(address)
          ?.includes(AccountRole[AccountRole.owner]),
      )
      const hasMultisigFeature = Boolean(
        res?.accountInfo?.features?.get(
          AccountFeatureTypes[AccountFeatureTypes.accountMultisig],
        ),
      )
      return { ...res, isOwner, hasMultisigFeature }
    },
    enabled: Boolean(accountAddress),
  })
}

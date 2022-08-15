import { useAccountsStore, useAccountStore } from "features/accounts"
import { useContactsStore } from "./store"

export function useGetContactName() {
  const contacts = useContactsStore(s => s.byId)
  const identities = useAccountsStore(s => Array.from(s.byId).map(a => a[1]))
  const accounts = useAccountStore(s => s.byId)
  return function (address?: string) {
    return address
      ? contacts.get(address)?.name ??
          (accounts.get(address)?.name as string) ??
          identities.find(acc => acc.address === address)?.name
      : ""
  }
}

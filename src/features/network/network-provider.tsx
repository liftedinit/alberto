import React from "react";
import { Network, Ledger, AnonymousIdentity } from "many-js"
import { useNetworkStore } from "./store"
import { useAccountsStore } from "features/accounts"

const NetworkContext = React.createContext<Network | undefined>(undefined)

export function NetworkProvider({ children }: React.PropsWithChildren<{}>) {
  const activeNetwork = useNetworkStore(state => state.byId.get(state.activeId))
  const activeAccount = useAccountsStore(state =>
    state.byId.get(state.activeId),
  )!

  const network = React.useMemo(() => {
    const instance = new Network(
      activeNetwork?.url || "",
      activeAccount.identity ?? new AnonymousIdentity(),
    )
    instance.apply([Ledger])
    return instance
  }, [activeNetwork, activeAccount])

  return (
    <NetworkContext.Provider value={network}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetworkContext() {
  return React.useContext(NetworkContext);
}

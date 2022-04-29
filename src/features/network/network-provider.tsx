import React from "react";
import { Network, Ledger, AnonymousIdentity } from "many-js"
import { useNetworkStore } from "./store"
import { useAccountsStore } from "features/accounts"

const NetworkContext = React.createContext<[Network?, Network?]>([
  undefined,
  undefined,
])

export function NetworkProvider({ children }: React.PropsWithChildren<{}>) {
  const activeNetwork = useNetworkStore(state => state.byId.get(state.activeId))
  const activeAccount = useAccountsStore(state =>
    state.byId.get(state.activeId),
  )!

  const network = React.useMemo(() => {
    const url = activeNetwork?.url || ""
    const queryNetwork = new Network(url, new AnonymousIdentity())
    queryNetwork.apply([Ledger])
    const cmdNetwork = new Network(url, activeAccount.identity)
    cmdNetwork.apply([Ledger])
    return [queryNetwork, cmdNetwork] as [Network, Network]
  }, [activeNetwork, activeAccount])

  return (
    <NetworkContext.Provider value={network}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetworkContext() {
  return React.useContext(NetworkContext)
}
